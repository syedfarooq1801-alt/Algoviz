import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Add GROQ_API_KEY to .env.local to enable AI feedback." },
      { status: 500 }
    );
  }

  const body = await request.json() as {
    question: string;
    situation: string;
    task: string;
    action: string;
    result: string;
    rubric: Record<string, number>;
  };

  const { question, situation, task, action, result, rubric } = body;

  if (!situation && !action && !result) {
    return NextResponse.json(
      { error: "Fill in at least Situation, Action, and Result before requesting feedback." },
      { status: 400 }
    );
  }

  const rubricSummary = Object.entries(rubric)
    .map(([k, v]) => `${k}: ${v}/5`)
    .join(", ");

  const prompt = `You are a senior technical interviewer at a top tech company. Evaluate this behavioral interview answer and give specific, actionable feedback.

Question: ${question || "(unspecified)"}

STAR Answer:
- Situation: ${situation || "(empty)"}
- Task: ${task || "(empty)"}
- Action: ${action || "(empty)"}
- Result: ${result || "(empty)"}

Self-scored rubric: ${rubricSummary}

Give feedback in this exact format (no headers, no bullet symbols other than →):
→ [strongest part of the answer in one sentence]
→ [most critical weakness and how to fix it]
→ [one specific rewrite suggestion for the weakest sentence]
→ [one metric or number they should add if missing]

Be direct. Max 4 lines. No praise padding.`;

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const text = completion.choices[0]?.message?.content ?? "";
  return NextResponse.json({ feedback: text });
}
