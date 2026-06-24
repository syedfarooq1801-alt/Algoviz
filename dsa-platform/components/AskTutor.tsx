"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send } from "lucide-react";
import { useMobile } from "@/lib/useMobile";
import { useTutorStore } from "@/lib/tutorStore";
import { getPageContext } from "@/lib/chatContext";
import { logError } from "@/lib/logger";

interface Msg { role: "user" | "assistant"; content: string }

const QUICK = ["Explain the intuition", "Give me a hint", "Why this approach?", "Time & space complexity?"];

export default function AskTutor() {
  const pathname = usePathname();
  const isMobile = useMobile();
  const { isOpen, open, close, consumePending } = useTutorStore();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ctx = getPageContext(pathname ?? "", typeof window !== "undefined" ? window.location.hash : "");

  const scrollToEnd = () => requestAnimationFrame(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  });

  const send = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q || streaming) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }, { role: "assistant", content: "" }];
    setMessages(next);
    setStreaming(true);
    scrollToEnd();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m.content).map((m) => ({ role: m.role, content: m.content })),
          context: { kind: ctx.kind, title: ctx.title, body: ctx.body },
        }),
      });
      if (!res.ok || !res.body) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `Request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
        scrollToEnd();
      }
    } catch (err) {
      logError(err, { source: "axon-chat" });
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: `⚠️ ${(err as Error).message}` };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }, [messages, streaming, ctx.kind, ctx.title, ctx.body]);

  // Pick up a question queued from a text selection.
  useEffect(() => {
    if (!isOpen) return;
    const p = consumePending();
    if (p) send(`Explain this: "${p}"`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      {/* Floating launcher — top right of every page */}
      {!isOpen && (
        <button
          onClick={open}
          aria-label="Ask Axon"
          style={{
            position: "fixed", bottom: isMobile ? 80 : 24, right: 20, zIndex: 60,
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
          }}
        >
          <MessageCircle size={15} /> Ask Axon
        </button>
      )}

      {isOpen && (
        <>
          <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(0,0,0,0.4)" }} />
          <aside
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 80,
              width: "min(420px, 100vw)", display: "flex", flexDirection: "column",
              background: "var(--bg-card)", borderLeft: "1px solid var(--border)",
            }}
          >
            {/* Header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageCircle size={15} color="var(--accent)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Axon</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {ctx.kind === "general" ? "Interview-prep tutor" : `On: ${ctx.title}`}
                </div>
              </div>
              {messages.length > 0 && (
                <button onClick={() => setMessages([])} style={{ fontSize: 11, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>Clear</button>
              )}
              <button onClick={close} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={18} /></button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.length === 0 && (
                <div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
                    Stuck on {ctx.kind === "general" ? "something" : `"${ctx.title}"`}? Ask me anything — I can see what you&apos;re reading.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {QUICK.map((q) => (
                      <button key={q} onClick={() => send(q)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 999, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)", cursor: "pointer" }}>{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "92%" }}>
                  <div style={{
                    fontSize: 13, lineHeight: 1.65, padding: "9px 12px", borderRadius: 12,
                    background: m.role === "user" ? "var(--accent)" : "var(--bg-secondary)",
                    color: m.role === "user" ? "#fff" : "var(--text-primary)",
                    border: m.role === "user" ? "none" : "1px solid var(--border-subtle)",
                  }}>
                    {m.content ? <Rendered text={m.content} /> : <span style={{ opacity: 0.6 }}>…</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask a doubt…"
                rows={1}
                style={{ flex: 1, resize: "none", maxHeight: 120, padding: "9px 12px", borderRadius: 10, fontSize: 13, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", fontFamily: "inherit" }}
              />
              <button
                onClick={() => send(input)}
                disabled={streaming || !input.trim()}
                aria-label="Send"
                style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, background: "var(--accent)", color: "#fff", border: "none", cursor: streaming || !input.trim() ? "default" : "pointer", opacity: streaming || !input.trim() ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Send size={16} />
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

// Markdown renderer: headings, bullets, numbered lists, bold, italic, inline code, fenced code blocks.
function Rendered({ text }: { text: string }) {
  const segments = text.split(/(```[\s\S]*?```)/);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith("```")) {
          const content = seg.slice(3, -3).replace(/^[a-zA-Z0-9+\-_.]*\n/, "");
          return (
            <pre key={i} style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "10px 12px", overflowX: "auto", fontSize: 12, margin: "8px 0", whiteSpace: "pre" }}>
              <code>{content}</code>
            </pre>
          );
        }
        return <ProseBlock key={i} text={seg} />;
      })}
    </>
  );
}

function ProseBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // h3
    const h3 = line.match(/^### (.+)/);
    if (h3) { nodes.push(<div key={i} style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", marginTop: 10, marginBottom: 2 }}><Inline text={h3[1]} /></div>); i++; continue; }
    // h2
    const h2 = line.match(/^## (.+)/);
    if (h2) { nodes.push(<div key={i} style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginTop: 12, marginBottom: 4 }}><Inline text={h2[1]} /></div>); i++; continue; }
    // h1
    const h1 = line.match(/^# (.+)/);
    if (h1) { nodes.push(<div key={i} style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginTop: 12, marginBottom: 4 }}><Inline text={h1[1]} /></div>); i++; continue; }
    // bullet list — collect consecutive items
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) { items.push(lines[i].replace(/^[-*] /, "")); i++; }
      nodes.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: 16, margin: "4px 0", display: "flex", flexDirection: "column", gap: 2 }}>
          {items.map((item, j) => <li key={j} style={{ listStyle: "disc", fontSize: 13, color: "var(--text-primary)" }}><Inline text={item} /></li>)}
        </ul>
      );
      continue;
    }
    // numbered list — collect consecutive items
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, "")); i++; }
      nodes.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: 18, margin: "4px 0", display: "flex", flexDirection: "column", gap: 2 }}>
          {items.map((item, j) => <li key={j} style={{ listStyle: "decimal", fontSize: 13, color: "var(--text-primary)" }}><Inline text={item} /></li>)}
        </ol>
      );
      continue;
    }
    // horizontal rule
    if (/^---+$/.test(line.trim())) { nodes.push(<hr key={i} style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "8px 0" }} />); i++; continue; }
    // empty line
    if (line.trim() === "") { nodes.push(<div key={i} style={{ height: 5 }} />); i++; continue; }
    // paragraph line
    nodes.push(<div key={i} style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-primary)" }}><Inline text={line} /></div>);
    i++;
  }
  return <>{nodes}</>;
}

function Inline({ text }: { text: string }): React.ReactElement {
  const pattern = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const m = match[0];
    if (m.startsWith("***")) parts.push(<strong key={match.index}><em>{m.slice(3, -3)}</em></strong>);
    else if (m.startsWith("**")) parts.push(<strong key={match.index} style={{ fontWeight: 700, color: "var(--text-primary)" }}>{m.slice(2, -2)}</strong>);
    else if (m.startsWith("*")) parts.push(<em key={match.index}>{m.slice(1, -1)}</em>);
    else if (m.startsWith("`")) parts.push(<code key={match.index} style={{ background: "var(--bg-primary)", borderRadius: 4, padding: "1px 5px", fontSize: 12, fontFamily: "var(--font-mono)" }}>{m.slice(1, -1)}</code>);
    last = match.index + m.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</> as React.ReactElement;
}
