"use client";
import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLLDSubject, LLD_SUBJECT_META, LLD_SUBJECTS, type Block } from "@/data/lld";
import { useLLDStore } from "@/lib/lldStore";

interface Props { params: Promise<{ subject: string }>; }

function LLDBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "para":
      return <p className="text-[15px] leading-8 mb-4" style={{ color: "var(--text-secondary)" }}>{block.text}</p>;
    case "heading":
      return <h4 className="text-base font-semibold mt-6 mb-3" style={{ color: "var(--text-primary)" }}>{block.text}</h4>;
    case "analogy":
      return (
        <div className="rounded-xl px-5 py-4 mb-4" style={{ background: "rgba(79,142,247,0.06)", border: "1px solid rgba(79,142,247,0.18)" }}>
          <div className="text-xs font-semibold mb-1.5" style={{ color: "var(--accent)" }}>Analogy</div>
          <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{block.text}</p>
        </div>
      );
    case "memory-trick":
      return (
        <div className="rounded-xl px-5 py-4 mb-4" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.18)" }}>
          <div className="text-xs font-semibold mb-1.5" style={{ color: "var(--accent-purple)" }}>Memory Trick</div>
          <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{block.text}</p>
        </div>
      );
    case "common-mistake":
      return (
        <div className="rounded-xl px-5 py-4 mb-4" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
          <div className="text-xs font-semibold mb-1.5" style={{ color: "#ef4444" }}>Common Mistake</div>
          <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{block.text}</p>
        </div>
      );
    case "placement":
      return (
        <div className="rounded-xl px-5 py-4 mb-4" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.18)" }}>
          <div className="text-xs font-semibold mb-1.5" style={{ color: "#f97316" }}>{block.topic}</div>
          <p className="text-sm leading-7 whitespace-pre-wrap" style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>{block.content}</p>
        </div>
      );
    case "pre":
      return (
        <pre className="rounded-xl px-5 py-4 mb-4 overflow-x-auto text-xs leading-6" style={{ background: "var(--bg-code)", border: "1px solid var(--border)", color: "var(--text-code)", fontFamily: "var(--font-mono)" }}>
          <code>{block.text}</code>
        </pre>
      );
    case "interview":
      return (
        <div className="mb-4 space-y-3">
          {(block.qas ?? []).map((qa, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "#22c55e" }}>Interview Q</div>
              <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>{qa.q}</p>
              <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{qa.a}</p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function LLDSubjectPage({ params }: Props) {
  const { subject: subjectId } = use(params);
  const subject = getLLDSubject(subjectId);
  if (!subject) notFound();

  const meta = LLD_SUBJECT_META[subjectId];
  const { toggleChapter, isComplete } = useLLDStore();
  const [activeId, setActiveId] = useState<string>(subject.chapters[0]?.id ?? "");
  const [leftOpen, setLeftOpen] = useState(() =>
    typeof window === "undefined" ? true : localStorage.getItem("lld-left-open") !== "0"
  );
  const [rightOpen, setRightOpen] = useState(() =>
    typeof window === "undefined" ? true : localStorage.getItem("lld-right-open") !== "0"
  );

  useEffect(() => { localStorage.setItem("lld-left-open", leftOpen ? "1" : "0"); }, [leftOpen]);
  useEffect(() => { localStorage.setItem("lld-right-open", rightOpen ? "1" : "0"); }, [rightOpen]);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && subject.chapters.some((c) => c.id === hash)) setActiveId(hash);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [subject]);

  const gridClass =
    leftOpen && rightOpen ? "lg:grid-cols-[248px_minmax(0,1fr)_260px]"
    : leftOpen && !rightOpen ? "lg:grid-cols-[248px_minmax(0,1fr)]"
    : !leftOpen && rightOpen ? "lg:grid-cols-[minmax(0,1fr)_260px]"
    : "lg:grid-cols-[minmax(0,1fr)]";

  const doneCount = subject.chapters.filter((c) => isComplete(`${subjectId}/${c.id}`)).length;
  const activeChapter = useMemo(
    () => subject.chapters.find((c) => c.id === activeId) ?? subject.chapters[0],
    [subject, activeId]
  );
  const key = activeChapter ? `${subjectId}/${activeChapter.id}` : "";
  const done = isComplete(key);

  const memoryTricks = useMemo(
    () => (activeChapter?.blocks ?? []).filter((b) => b.type === "memory-trick" && b.text).slice(0, 3),
    [activeChapter]
  );
  const interviewCount = useMemo(
    () => (activeChapter?.blocks ?? []).filter((b) => b.type === "interview").reduce((n, b) => n + (b.qas?.length ?? 0), 0),
    [activeChapter]
  );

  const currentIdx = subject.chapters.findIndex((c) => c.id === activeId);
  const nextChapter = subject.chapters[currentIdx + 1];

  return (
    <div suppressHydrationWarning style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="mx-auto max-w-[1380px] px-6 pb-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 pb-8 pt-8 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/lld" className="hover:underline">LLD</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{subject.title}</span>
          <div className="ml-auto flex flex-wrap gap-4">
            {LLD_SUBJECTS.map((s) => (
              <Link
                key={s.id}
                href={`/lld/${s.id}`}
                className="transition-colors"
                style={{
                  color: s.id === subjectId ? "var(--accent)" : "var(--text-muted)",
                  fontWeight: s.id === subjectId ? 600 : 400,
                }}
              >
                {s.title.split(" ")[0]}
              </Link>
            ))}
          </div>
          <div className="ml-4 hidden items-center gap-2 lg:flex">
            <button
              onClick={() => setLeftOpen((v) => !v)}
              className="rounded-md px-2 py-1 transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: leftOpen ? "var(--accent)" : "var(--text-muted)",
                background: leftOpen ? "var(--accent-soft)" : "transparent",
              }}
            >
              {leftOpen ? "❮ Chapters" : "Chapters ❯"}
            </button>
            <button
              onClick={() => setRightOpen((v) => !v)}
              className="rounded-md px-2 py-1 transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: rightOpen ? "var(--accent)" : "var(--text-muted)",
                background: rightOpen ? "var(--accent-soft)" : "transparent",
              }}
            >
              {rightOpen ? "Notes ❯" : "❮ Notes"}
            </button>
          </div>
        </div>

        <div className={`grid justify-center gap-14 ${gridClass}`}>
          {/* Left: chapter list */}
          {leftOpen && (
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                    {subject.title}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {doneCount}/{subject.chapters.length}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {subject.chapters.map((ch) => {
                    const chKey = `${subjectId}/${ch.id}`;
                    const chDone = isComplete(chKey);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => { setActiveId(ch.id); window.history.replaceState(null, "", `#${ch.id}`); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-all"
                        style={{
                          background: ch.id === activeId ? "var(--accent-soft)" : "transparent",
                          color: ch.id === activeId ? "var(--accent)" : chDone ? "var(--text-secondary)" : "var(--text-muted)",
                        }}
                      >
                        <span
                          className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{
                            background: chDone ? "rgba(34,197,94,0.15)" : "transparent",
                            border: `1.5px solid ${chDone ? "#22c55e" : "var(--border)"}`,
                            fontSize: 8,
                            color: "#22c55e",
                          }}
                        >
                          {chDone ? "✓" : ""}
                        </span>
                        <span className="leading-5">{ch.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}

          {/* Center: chapter content — widen when Notes is closed so the
              reclaimed space is actually used instead of left blank */}
          <article className={`min-w-0 mx-auto ${rightOpen ? "max-w-[760px]" : "max-w-[960px]"}`}>
            {activeChapter && (
              <>
                <div className="mb-8">
                  <div className="mb-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    Chapter {activeChapter.num}
                  </div>
                  <h1 className="text-4xl font-semibold leading-tight tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
                    {activeChapter.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleChapter(key)}
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                      style={{
                        background: done ? "rgba(34,197,94,0.1)" : "var(--bg-card)",
                        border: `1px solid ${done ? "#22c55e" : "var(--border)"}`,
                        color: done ? "#22c55e" : "var(--text-muted)",
                      }}
                    >
                      <span>{done ? "✓" : "○"}</span>
                      {done ? "Done" : "Mark done"}
                    </button>
                    {interviewCount > 0 && (
                      <span className="text-xs px-2 py-1 rounded" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e" }}>
                        {interviewCount} interview Q{interviewCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {activeChapter.blocks.map((block, i) => (
                    <LLDBlock key={i} block={block} />
                  ))}
                </div>

                {nextChapter && (
                  <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                    <button
                      onClick={() => { setActiveId(nextChapter.id); window.history.replaceState(null, "", `#${nextChapter.id}`); window.scrollTo(0, 0); }}
                      className="flex items-center gap-2 text-sm font-medium transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      Next: {nextChapter.title} →
                    </button>
                  </div>
                )}
              </>
            )}
          </article>

          {/* Right: notes panel */}
          {rightOpen && (
            <aside className="hidden lg:block">
              <div className="sticky top-8 space-y-4">
                {memoryTricks.length > 0 && (
                  <div className="rounded-xl p-4" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}>
                    <div className="text-xs font-semibold mb-3" style={{ color: "var(--accent-purple)" }}>
                      Memory Tricks
                    </div>
                    {memoryTricks.map((b, i) => (
                      <p key={i} className="text-xs leading-6 mb-2 last:mb-0" style={{ color: "var(--text-secondary)" }}>
                        {b.text}
                      </p>
                    ))}
                  </div>
                )}

                <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                    Progress
                  </div>
                  <div className="space-y-2">
                    {subject.chapters.map((ch) => {
                      const chDone = isComplete(`${subjectId}/${ch.id}`);
                      return (
                        <div key={ch.id} className="flex items-center gap-2 text-xs">
                          <span style={{ color: chDone ? "#22c55e" : "var(--text-muted)" }}>
                            {chDone ? "✓" : "○"}
                          </span>
                          <span style={{ color: chDone ? "var(--text-secondary)" : "var(--text-muted)" }}>
                            {ch.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
