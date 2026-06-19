"use client";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, Check, ExternalLink } from "lucide-react";
import HintPanel from "@/components/HintPanel";
import SubmissionRunner from "@/components/SubmissionRunner";
import { getProblemById, getPatternById } from "@/data/problems";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { useProgressStore } from "@/lib/store";
import { useNotesStore } from "@/lib/notesStore";
import { usePrepStore, type ReadinessState } from "@/lib/prepStore";
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
  const { isSolved, isBookmarked, toggleSolved, toggleBookmark, solveTimes } = useProgressStore();
  const { problemStates, reviewDue, scheduleReview, setProblemState } = usePrepStore();
  const { getNote, setNote, hasNote } = useNotesStore();
  const solved = isSolved(id);
  const bookmarked = isBookmarked(id);
  const readiness = problemStates[id] ?? (solved ? "solved" : "unseen");
  const dueDate = reviewDue[id];
  const savedTime = solveTimes?.[id];
  const startRef = useRef(Date.now());
  const [lang, setLang] = useState<"python" | "cpp">("python");
  const [noteText, setNoteText] = useState(() => getNote(id));
  const [noteSaved, setNoteSaved] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("codeLang") as "python" | "cpp" | null;
    if (saved) setLang(saved);
  }, []);

  const switchLang = (next: "python" | "cpp") => {
    setLang(next);
    localStorage.setItem("codeLang", next);
  };

  const handleSolve = () => {
    const wasSolved = isSolved(id);
    const elapsed = Math.round((Date.now() - startRef.current) / 1000);
    toggleSolved(id, undefined, wasSolved ? undefined : elapsed);
    if (!wasSolved) scheduleReview(id, elapsed < 20 * 60 ? "reviewed-fast" : "solved");
    else setProblemState(id, "attempted");
  };

  const saveNote = () => {
    setNote(id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1200);
  };

  const diffColor = problem.difficulty === "Easy" ? "var(--accent-green)" : problem.difficulty === "Medium" ? "var(--accent-orange)" : "var(--accent-red)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-8">
        <div className="mb-5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          {pattern && <Link href={`/patterns/${pattern.id}`} className="hover:underline">{pattern.title}</Link>}
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>{problem.title}</span>
        </div>

        <div className="problem-shell">
          <section className="problem-main quiet-panel">
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
                    {savedTime != null && <><span>·</span><span>{formatTime(savedTime)}</span></>}
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
                  <button onClick={handleSolve} className="btn-primary px-3 py-2 text-sm inline-flex items-center gap-2">
                    <Check size={15} /> {solved ? "Solved" : "Mark solved"}
                  </button>
                  <button onClick={() => toggleBookmark(id)} className="btn-ghost px-3 py-2 text-sm inline-flex items-center gap-2">
                    <Bookmark size={15} /> {bookmarked ? "Saved" : "Save"}
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
                        onClick={() => switchLang(item)}
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
              <div className="p-8 text-sm" style={{ color: "var(--text-muted)" }}>No local explanation yet. Use the LeetCode link or visualization.</div>
            )}
          </section>

          <aside className="problem-rail space-y-4">
            <div className="quiet-panel p-4">
              <div className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Solve</div>
              <SubmissionRunner
                problemId={id}
                defaultLang="python"
                starterPython={`# ${problem.title}\n\n`}
                starterCpp={`// ${problem.title}\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    return 0;\n}`}
              />
            </div>

            <ReadinessPanel
              state={readiness}
              dueDate={dueDate}
              onState={(state) => setProblemState(id, state)}
              onReview={(outcome) => scheduleReview(id, outcome)}
            />

            <InterviewModePanel
              checks={checks}
              onToggle={(key) => setChecks((prev) => ({ ...prev, [key]: !prev[key] }))}
            />

            <div className="quiet-panel p-4">
              <div className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Hints</div>
              <HintPanel problemId={id} />
            </div>
          </aside>
        </div>
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

function ReadinessPanel({
  state,
  dueDate,
  onState,
  onReview,
}: {
  state: ReadinessState;
  dueDate?: string;
  onState: (state: ReadinessState) => void;
  onReview: (outcome: "solved" | "failed" | "reviewed-fast" | "mastered") => void;
}) {
  const states: ReadinessState[] = ["unseen", "attempted", "solved", "reviewing", "mastered"];
  return (
    <section className="quiet-panel p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Review</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{dueDate ? `Due ${dueDate}` : "No date set"}</div>
        </div>
        <span className="text-xs px-2 py-1 rounded" style={{ background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{state}</span>
      </div>
      <div className="grid grid-cols-2 gap-1 mb-3">
        {states.map((item) => (
          <button key={item} onClick={() => onState(item)} className="px-2 py-1.5 rounded text-xs"
            style={{ background: state === item ? "var(--accent-soft)" : "var(--bg-hover)", color: state === item ? "var(--accent)" : "var(--text-muted)", border: "1px solid var(--border)" }}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        <button onClick={() => onReview("failed")} className="btn-ghost px-2 py-1.5 text-xs">retry</button>
        <button onClick={() => onReview("solved")} className="btn-ghost px-2 py-1.5 text-xs">schedule</button>
        <button onClick={() => onReview("reviewed-fast")} className="btn-ghost px-2 py-1.5 text-xs">fast</button>
        <button onClick={() => onReview("mastered")} className="btn-ghost px-2 py-1.5 text-xs">mastered</button>
      </div>
    </section>
  );
}

function InterviewModePanel({ checks, onToggle }: { checks: Record<string, boolean>; onToggle: (key: string) => void }) {
  const steps = ["Restate", "Clarify", "Brute force", "Optimize", "Code", "Test", "Complexity", "Reflect"];
  return (
    <section className="quiet-panel p-4">
      <div className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Interview checklist</div>
      <div className="grid grid-cols-2 gap-2">
        {steps.map((step) => (
          <label key={step} className="flex items-center gap-2 text-xs rounded px-2 py-1.5"
            style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            <input type="checkbox" checked={!!checks[step]} onChange={() => onToggle(step)} />
            {step}
          </label>
        ))}
      </div>
    </section>
  );
}

function formatTime(secs: number) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}
