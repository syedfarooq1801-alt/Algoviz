import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/verifyIdToken";
import { rateLimited } from "@/lib/rateLimit";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ChatMessage { role: "user" | "assistant"; content: string }
interface Body {
  messages: ChatMessage[];
  context?: { kind: string; title: string; body: string };
}

const SYSTEM = (ctx: Body["context"]) => `You are Axon, a precise interview-prep tutor for DSA, system design, and CS fundamentals.

${ctx?.body ? `The user is studying: "${ctx.title}".
Reference material (treat as ground truth):
"""
${ctx.body}
"""` : `The user is on a general page.`}

Scope:
- IN SCOPE: data structures, algorithms, coding problems, system design, CS fundamentals (OS, DBMS, networks, OOP), complexity analysis, interview strategy, AND anything about this study platform itself — the current page, the user's study plan/schedule/progress, how features work, and what they should study next.
- OUT OF SCOPE: genuinely unrelated topics like movies, music, sports, jokes, world news, personal/life advice, or random trivia. For those ONLY, refuse in one sentence and steer back: "I'm just your interview-prep tutor — ask me about DSA, system design, or CS fundamentals." Do not answer the unrelated question.
- When unsure whether something is in scope, assume it IS (lean toward helping). Questions about "this page", "this study plan", "what should I do" are always in scope.

Rules:
- Answer the user's doubt directly and correctly. Accuracy over length.
- Ground answers in the reference material when present; if it is silent on something, use standard, well-established knowledge and say so briefly.
- If asked for a hint, give ONE next step — never dump the full solution unless explicitly asked.
- Use short paragraphs and fenced code blocks for code. No filler, no praise padding.
- If you are unsure, say so rather than inventing facts.`;

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Axon needs GROQ_API_KEY set in the server env." }, { status: 500 });
  }

  const uid = await verifyIdToken(request);
  if (!uid) {
    return NextResponse.json({ error: "Sign in to use Axon." }, { status: 401 });
  }
  if (rateLimited(`chat:${uid}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests — slow down and try again shortly." }, { status: 429 });
  }

  const body = (await request.json()) as Body;
  const msgs = (body.messages ?? []).filter((m) => m.content?.trim());
  if (!msgs.length) {
    return NextResponse.json({ error: "Empty message." }, { status: 400 });
  }

  const messages = [
    { role: "system" as const, content: SYSTEM(body.context) },
    ...msgs.slice(-12), // keep recent turns within token budget
  ];

  async function makeStream(model: string) {
    return client.chat.completions.create({ model, messages, max_tokens: 700, temperature: 0.3, stream: true });
  }

  let groqStream;
  try {
    groqStream = await makeStream("llama-3.3-70b-versatile");
  } catch {
    groqStream = await makeStream("llama-3.1-8b-instant"); // fallback on rate/model error
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const part of groqStream) {
          const t = part.choices[0]?.delta?.content ?? "";
          if (t) controller.enqueue(encoder.encode(t));
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n[Axon hit an error mid-answer. Try again.]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
