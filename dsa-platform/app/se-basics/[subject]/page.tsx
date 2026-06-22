"use client";
import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SEBlock from "@/components/se/SEBlock";
import { getSEVisual } from "@/components/se/visuals/registry";
import { getSubject, SUBJECT_META, SE_SUBJECTS } from "@/data/seBasics";
import { useSEStore } from "@/lib/seStore";

interface Props { params: Promise<{ subject: string }>; }

export default function SubjectPage({ params }: Props) {
  const { subject: subjectId } = use(params);
  const subject = getSubject(subjectId);
  if (!subject) notFound();

  const meta = SUBJECT_META[subjectId];
  const { toggleChapter, isComplete } = useSEStore();
  const [activeId, setActiveId] = useState<string>(subject.chapters[0]?.id ?? "");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && subject.chapters.some((c) => c.id === hash)) setActiveId(hash);
  }, [subject]);

  const doneCount = subject.chapters.filter((c) => isComplete(`${subjectId}/${c.id}`)).length;
  const activeChapter = useMemo(
    () => subject.chapters.find((c) => c.id === activeId) ?? subject.chapters[0],
    [subject, activeId]
  );
  const Visual = activeChapter ? getSEVisual(subjectId, activeChapter.id) : null;
  const key = activeChapter ? `${subjectId}/${activeChapter.id}` : "";
  const done = isComplete(key);

  const takeaways = useMemo(
    () => (activeChapter?.blocks ?? [])
      .filter((b) => b.type === "memory-trick" && b.text)
      .map((b) => (b.text as string).length > 150 ? (b.text as string).slice(0, 147) + "..." : (b.text as string))
      .slice(0, 4),
    [activeChapter]
  );
  const interviewCount = useMemo(
    () => (activeChapter?.blocks ?? []).filter((b) => b.type === "interview").reduce((n, b) => n + (b.qas?.length ?? 0), 0),
    [activeChapter]
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="mx-auto max-w-[1380px] px-6 pb-8">
        <div className="flex flex-wrap items-center gap-2 pb-8 pt-8 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/se-basics" className="hover:underline">SE Basics</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{subject.title}</span>
          <div className="ml-auto flex flex-wrap gap-4">
            {SE_SUBJECTS.map((s) => (
              <Link
                key={s.id}
                href={`/se-basics/${s.id}`}
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
        </div>

        <div className="grid justify-center gap-14 lg:grid-cols-[248px_minmax(0,700px)_280px]">
          <aside className="hidden self-start lg:sticky lg:top-20 lg:block" style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 10, padding: "0 4px" }}>
              {subject.title.toUpperCase()}
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {subject.chapters.map((c) => {
                const cDone = isComplete(`${subjectId}/${c.id}`);
                const active = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    onClick={() => { setActiveId(c.id); window.history.replaceState(null, "", `#${c.id}`); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, width: "100%",
                      padding: "6px 8px", fontSize: 12, textAlign: "left", cursor: "pointer",
                      background: active ? "var(--accent-soft)" : "transparent",
                      color: active ? "var(--accent)" : cDone ? "var(--text-secondary)" : "var(--text-muted)",
                      borderRadius: 5, fontWeight: active ? 600 : 400,
                      outline: active ? "1px solid rgba(79,140,255,0.18)" : "1px solid transparent",
                      transition: "all 0.1s",
                    }}
                  >
                    <span style={{ width: 18, textAlign: "right", flexShrink: 0, fontSize: 10,
                      fontFamily: "var(--font-mono)", color: cDone ? "#2FBF71" : active ? "var(--accent)" : "var(--text-muted)" }}>
                      {cDone ? "✓" : c.num}
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <article className="min-w-0 max-w-[700px] prose-se" key={activeId}>
            {activeChapter && (
              <>
                <div className="reveal reveal-1">
                  <div className="mb-3 text-xs font-medium" style={{ color: meta.accent }}>Chapter {activeChapter.num}</div>
                  <h1 className="mb-10 text-4xl font-semibold leading-tight tracking-tight" style={{ color: "var(--text-primary)" }}>{activeChapter.title}</h1>
                </div>

                {Visual && (
                  <div className="mb-12 reveal reveal-2">
                    <div className="mb-4 text-xs font-medium" style={{ color: meta.accent }}>Interactive</div>
                    <Visual />
                  </div>
                )}

                <div className="reveal reveal-3">
                  {activeChapter.blocks.map((b, i) => <SEBlock key={i} block={b} />)}
                </div>

                <div className="mt-16 flex items-center justify-between gap-6 pt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <ChapterNav subject={subject} activeId={activeId} dir={-1} onGo={setActiveId} />
                  <ChapterNav subject={subject} activeId={activeId} dir={1} onGo={setActiveId} />
                </div>
              </>
            )}
          </article>

          <aside className="hidden self-start lg:sticky lg:top-20 lg:block">
            {activeChapter && (
              <div className="space-y-10">
                <div>
                  <div className="mb-3 text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>Progress</div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-px flex-1 overflow-hidden" style={{ background: "var(--border-subtle)" }}>
                      <div className="h-full transition-all" style={{ width: `${(doneCount / subject.chapters.length) * 100}%`, background: meta.accent }} />
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{doneCount}/{subject.chapters.length}</span>
                  </div>
                  <button onClick={() => toggleChapter(key)} className="text-xs font-medium transition-colors" style={{ color: done ? "var(--accent-green)" : meta.accent }}>
                    {done ? "✓ Completed" : "Mark complete"}
                  </button>
                </div>

                {takeaways.length > 0 && (
                  <div>
                    <div className="mb-3 text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>Key takeaways</div>
                    <ul className="space-y-3">
                      {takeaways.map((t, i) => (
                        <li key={i} className="flex gap-2 text-xs leading-6" style={{ color: "var(--text-secondary)" }}>
                          <span style={{ color: meta.accent }}>-</span><span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {interviewCount > 0 && (
                  <div>
                    <div className="mb-3 text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>Interview prep</div>
                    <p className="text-xs leading-6" style={{ color: "var(--text-secondary)" }}>{interviewCount} interview question{interviewCount > 1 ? "s" : ""} in this chapter.</p>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function ChapterNav({ subject, activeId, dir, onGo }: {
  subject: ReturnType<typeof getSubject>; activeId: string; dir: -1 | 1; onGo: (id: string) => void;
}) {
  if (!subject) return <span />;
  const idx = subject.chapters.findIndex((c) => c.id === activeId);
  const target = subject.chapters[idx + dir];
  if (!target) return <span />;
  return (
    <button
      onClick={() => { onGo(target.id); window.scrollTo({ top: 0, behavior: "smooth" }); window.history.replaceState(null, "", `#${target.id}`); }}
      className="max-w-[45%] text-left text-xs"
      style={{ color: "var(--text-muted)" }}
    >
      <span>{dir === -1 ? "Previous" : "Next"}</span>
      <div className="truncate pt-1 text-sm" style={{ color: "var(--text-primary)" }}>{target.title}</div>
    </button>
  );
}
