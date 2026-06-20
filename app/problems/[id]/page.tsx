"use client";
import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, Check, ExternalLink } from "lucide-react";
import { getProblemById, getPatternById } from "@/data/problems";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { useProgressStore } from "@/lib/store";
import { useNotesStore } from "@/lib/notesStore";
import { usePrepStore } from "@/lib/prepStore";
import { getProblemViz } from "@/components/visualizations/problemVizMap";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProblemPage({ params }: Props) {
  const { id } = use(params);
  const problem = getProblemById(id);
  if (!problem) notFound();

  const pattern = getPatternById(problem.pattern);
  const content = PROBLEM_CONTENT[id];
  const VizComponent = getProblemViz(id);
  const { isSolved, isBookmarked, toggleSolved, toggleBookmark } = useProgressStore();
  const { getNote, setNote, hasNote } = useNotesStore();
  const { scheduleReview, reviewDue } = usePrepStore();
  const solved = isSolved(id);
  const bookmarked = isBookmarked(id);
  const dueDate = reviewDue[id];
  const [reviewScheduled, setReviewScheduled] = useState(false);

  const handleScheduleReview = () => {
    scheduleReview(id, "solved");
    setReviewScheduled(true);
    setTimeout(() => setReviewScheduled(false), 2000);
  };
  const [lang, setLang] = useState<"python" | "cpp">("python");
  const [noteText, setNoteText] = useState(() => getNote(id));
  const [noteSaved, setNoteSaved] = useState(false);

  const saveNote = () => {
    setNote(id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1200);
  };

  const diffColor = problem.difficulty === "Easy" ? "var(--accent-green)" : problem.difficulty === "Medium" ? "var(--accent-orange)" : "var(--accent-red)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-8">
        <div className="mb-5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          {pattern && <Link href={`/patterns/${pattern.id}`} className="hover:underline">{pattern.title}</Link>}
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>{problem.title}</span>
        </div>

        <section className="quiet-panel">
          <div className="p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{problem.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                  <span style={{ color: diffColor }}>{problem.difficulty}</span>
                  <span>·</span>
                  {pattern && <Link href={`/patterns/${pattern.id}`} className="hover:underline">{pattern.title}</Link>}
                  <span>·</span>
                  <span>{problem.frequency} frequency</span>
                </div>
                {problem.companies.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {problem.companies.map((c) => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleSolved(id)} className="btn-primary px-3 py-2 text-sm inline-flex items-center gap-2">
                  <Check size={15} /> {solved ? "Solved" : "Mark solved"}
                </button>
                <button onClick={() => toggleBookmark(id)} className="btn-ghost px-3 py-2 text-sm inline-flex items-center gap-2">
                  <Bookmark size={15} /> {bookmarked ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleScheduleReview}
                  className="btn-ghost px-3 py-2 text-sm inline-flex items-center gap-2"
                  style={dueDate ? { color: "#F5A524" } : undefined}
                  title={dueDate ? `Review due ${dueDate}` : "Schedule review"}
                >
                  {reviewScheduled ? "Scheduled ✓" : dueDate ? `Due ${dueDate}` : "Review later"}
                </button>
                <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-2 text-sm inline-flex items-center gap-2">
                  <ExternalLink size={15} /> LeetCode
                </a>
              </div>
            </div>
          </div>

          {content ? (
            <div className="p-5 space-y-7">
              <WorkspaceSection title="Summary">
                <p className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{content.intuition}</p>
              </WorkspaceSection>

              {VizComponent && (
                <WorkspaceSection title="Visualization">
                  <div className="quiet-panel p-4">
                    <VizComponent />
                  </div>
                </WorkspaceSection>
              )}

              <WorkspaceSection title="Approach">
                <ol className="space-y-2">
                  {content.approach.map((step, i) => (
                    <li key={i} className="grid grid-cols-[24px_1fr] gap-3 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                      <span className="font-mono text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </WorkspaceSection>

              {content.walkthroughExample && (
                <WorkspaceSection title="Dry run">
                  <pre className="text-xs whitespace-pre-wrap"><code>{content.walkthroughExample}</code></pre>
                </WorkspaceSection>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <WorkspaceSection title="Complexity">
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-mono" style={{ color: "var(--text-primary)" }}>{content.timeComplexity}</div>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{content.timeExplanation}</p>
                    </div>
                    <div>
                      <div className="font-mono" style={{ color: "var(--text-primary)" }}>{content.spaceComplexity}</div>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{content.spaceExplanation}</p>
                    </div>
                  </div>
                </WorkspaceSection>

                <WorkspaceSection title="Edge cases">
                  <ul className="space-y-2">
                    {content.edgeCases.map((edge, i) => (
                      <li key={i} className="text-sm leading-5" style={{ color: "var(--text-secondary)" }}>{edge}</li>
                    ))}
                  </ul>
                </WorkspaceSection>
              </div>

              {content.commonMistakes && content.commonMistakes.length > 0 && (
                <WorkspaceSection title="Common mistakes">
                  <ul className="space-y-2">
                    {content.commonMistakes.map((mistake, i) => (
                      <li key={i} className="text-sm leading-5" style={{ color: "var(--text-secondary)" }}>{mistake}</li>
                    ))}
                  </ul>
                </WorkspaceSection>
              )}

              <WorkspaceSection title="Solution">
                <div className="flex items-center gap-1 mb-3">
                  {(["python", "cpp"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setLang(item)}
                      className="px-3 py-1 rounded text-xs font-medium"
                      style={{
                        background: lang === item ? "var(--accent-soft)" : "var(--bg-hover)",
                        color: lang === item ? "var(--accent)" : "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {item === "python" ? "Python" : "C++"}
                    </button>
                  ))}
                </div>
                <pre className="text-xs"><code>{lang === "python" ? (content.pythonSolution ?? "# Python solution coming soon") : content.cppSolution}</code></pre>
              </WorkspaceSection>

              <WorkspaceSection title="Notes">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Mistakes, alternate approach, review notes..."
                  rows={4}
                  className="w-full rounded-lg text-sm p-3 resize-none outline-none"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                />
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={saveNote} className="btn-ghost px-3 py-1.5 text-xs">{noteSaved ? "Saved" : "Save note"}</button>
                  {hasNote(id) && <span className="text-xs" style={{ color: "var(--text-muted)" }}>saved</span>}
                </div>
              </WorkspaceSection>
            </div>
          ) : (
            <div className="p-8 text-sm" style={{ color: "var(--text-muted)" }}>No local explanation yet. Use the LeetCode link above.</div>
          )}
        </section>
      </main>
    </div>
  );
}

function WorkspaceSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {children}
    </section>
  );
}
