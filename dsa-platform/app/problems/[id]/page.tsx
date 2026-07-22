"use client";
import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, Check, ExternalLink } from "lucide-react";
import { getProblemById, getPatternById, getAllProblems } from "@/data/problems";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { PROBLEM_TECHNIQUES, getTechniqueColor } from "@/data/problemTechniques";
import NextNav from "@/components/NextNav";
import ExampleVisual from "@/components/ExampleVisual";
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
  // Subscribe reactively to the underlying sets/maps (selectors) so this page
  // re-renders on toggle. Reading via isSolved()/isBookmarked() helpers is a
  // non-reactive get() and leaves the buttons visually stale.
  const solvedSet = useProgressStore((s) => s.solved);
  const bookmarkedSet = useProgressStore((s) => s.bookmarked);
  const toggleSolved = useProgressStore((s) => s.toggleSolved);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);
  const { getNote, setNote, hasNote } = useNotesStore();
  const reviewDue = usePrepStore((s) => s.reviewDue);
  const scheduleReview = usePrepStore((s) => s.scheduleReview);
  const clearReview = usePrepStore((s) => s.clearReview);
  const solved = solvedSet.has(id);
  const bookmarked = bookmarkedSet.has(id);
  const dueDate = reviewDue[id];

  const handleScheduleReview = () => {
    // Toggle: if already scheduled, remove it; otherwise schedule.
    if (dueDate) clearReview(id);
    else scheduleReview(id, "solved");
  };
  const [codeCopied, setCodeCopied] = useState(false);
  const [noteText, setNoteText] = useState(() => getNote(id));
  const [noteSaved, setNoteSaved] = useState(false);
  // Gate: hide pattern/approach/solution behind an explicit reveal so the
  // default is "attempt it yourself first", not "read the walkthrough".
  // Resets on navigation on purpose — re-cover every time you open a problem.
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const saveNote = () => {
    setNote(id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1200);
  };

  const diffColor = problem.difficulty === "Easy" ? "var(--accent-green)" : problem.difficulty === "Medium" ? "var(--accent-orange)" : "var(--accent-red)";
  const technique = PROBLEM_TECHNIQUES[id];
  const techniqueColor = technique ? getTechniqueColor(technique) : null;

  // Default Next: the next problem in the DSA sheet order.
  const allProblems = getAllProblems();
  const myIdx = allProblems.findIndex((p) => p.id === id);
  const nextProblem = myIdx >= 0 && myIdx + 1 < allProblems.length ? allProblems[myIdx + 1] : null;
  const fallbackNext = nextProblem ? { href: `/problems/${nextProblem.id}`, label: nextProblem.title } : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="read-prose max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-8">
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
                  {technique && techniqueColor && (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ background: `${techniqueColor}22`, color: techniqueColor, border: `1px solid ${techniqueColor}44` }}>
                        {technique}
                      </span>
                    </>
                  )}
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
                  title={dueDate ? `Review due ${dueDate} — click to remove` : "Schedule review"}
                >
                  {dueDate ? `Due ${dueDate} ✕` : "Review later"}
                </button>
                <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-2 text-sm inline-flex items-center gap-2">
                  <ExternalLink size={15} /> LeetCode
                </a>
              </div>
            </div>
          </div>

          {content ? (
            <div className="p-5 space-y-7">
              {content.statement && (
                <WorkspaceSection title="Problem">
                  <p className="text-sm leading-6 whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{content.statement}</p>

                  {content.examples && content.examples.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {content.examples.map((ex, i) => (
                        <div key={i} className="quiet-panel p-3 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                          <div className="mb-1" style={{ color: "var(--text-muted)" }}>Example {i + 1}:</div>
                          <ExampleVisual input={ex.input} />
                          <div><span style={{ color: "var(--text-muted)" }}>Input: </span><span style={{ color: "var(--text-primary)" }}>{ex.input}</span></div>
                          <div><span style={{ color: "var(--text-muted)" }}>Output: </span><span style={{ color: "var(--text-primary)" }}>{ex.output}</span></div>
                          {ex.explanation && (
                            <div className="mt-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
                              <span style={{ color: "var(--text-muted)" }}>Explanation: </span>{ex.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {content.constraints && content.constraints.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Constraints:</div>
                      <ul className="space-y-1">
                        {content.constraints.map((c, i) => (
                          <li key={i} className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </WorkspaceSection>
              )}

              {!showSolution && (
                <div className="quiet-panel p-5 text-center space-y-3" style={{ border: "1px dashed var(--border)" }}>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Try it yourself first.</p>
                  <p className="text-xs leading-5 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
                    Read the problem above, sketch an approach, attempt it — before seeing the pattern or the solution. That's what actually sticks, not reading a walkthrough.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {!showHint && (
                      <button onClick={() => setShowHint(true)} className="btn-ghost px-3 py-1.5 text-xs">Stuck — show pattern hint</button>
                    )}
                    <button onClick={() => setShowSolution(true)} className="btn-ghost px-3 py-1.5 text-xs">Reveal full solution</button>
                  </div>
                  {showHint && content.recognize && content.recognize.length > 0 && (
                    <ul className="text-left max-w-md mx-auto space-y-2 pt-2">
                      {content.recognize.map((clue, i) => (
                        <li key={i} className="text-sm leading-5" style={{ color: "var(--text-secondary)" }}>{clue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {showSolution && (
                <>
              {content.keyInsight && (
                <div
                  className="quiet-panel p-4 text-sm leading-6"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Problem: </span>
                    <span style={{ color: "var(--text-primary)" }}>{problem.title}</span>
                  </div>
                  {pattern && (
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Pattern: </span>
                      <span style={{ color: "var(--text-primary)" }}>{pattern.title}</span>
                    </div>
                  )}
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Key insight: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{content.keyInsight}</span>
                  </div>
                </div>
              )}

              {VizComponent && (
                <WorkspaceSection title="Visualization">
                  <div className="quiet-panel p-4">
                    <VizComponent />
                  </div>
                </WorkspaceSection>
              )}

              {content.recognize && content.recognize.length > 0 && (
                <WorkspaceSection title="Recognize this pattern">
                  <ul className="space-y-2">
                    {content.recognize.map((clue, i) => (
                      <li key={i} className="text-sm leading-5" style={{ color: "var(--text-secondary)" }}>{clue}</li>
                    ))}
                  </ul>
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
                <div className="flex items-center justify-end mb-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(content.cppSolution ?? "").then(() => {
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      });
                    }}
                    className="px-3 py-1 rounded text-xs font-medium"
                    style={{
                      background: codeCopied ? "rgba(47,191,113,0.12)" : "var(--bg-hover)",
                      color: codeCopied ? "#2FBF71" : "var(--text-muted)",
                      border: `1px solid ${codeCopied ? "rgba(47,191,113,0.3)" : "var(--border)"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    {codeCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="text-xs"><code>{content.cppSolution}</code></pre>
              </WorkspaceSection>

              {content.lineByLine && content.lineByLine.length > 0 && (
                <WorkspaceSection title="Code, line by line">
                  <ul className="space-y-2.5">
                    {content.lineByLine.map((entry, i) => {
                      const sepIdx = entry.indexOf(" — ");
                      const code = sepIdx >= 0 ? entry.slice(0, sepIdx).replace(/`/g, "") : null;
                      const explain = sepIdx >= 0 ? entry.slice(sepIdx + 3) : entry;
                      return (
                        <li key={i} className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                          {code && (
                            <code
                              className="block mb-0.5 text-xs px-1.5 py-0.5 rounded"
                              style={{ background: "var(--bg-hover)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
                            >
                              {code}
                            </code>
                          )}
                          <span>{explain}</span>
                        </li>
                      );
                    })}
                  </ul>
                </WorkspaceSection>
              )}
                </>
              )}

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
        <NextNav currentHref={`/problems/${id}`} fallback={fallbackNext} />
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
