"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { PATTERNS, Problem } from "@/data/problems";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { useProgressStore } from "@/lib/store";
import { usePrepStore } from "@/lib/prepStore";

function pickProblem(solved: Set<string>, seenIds: Set<string>): Problem {
  const pool = PATTERNS.flatMap((p) => p.problems).filter((p) => !seenIds.has(p.id));
  const unsolved = pool.filter((p) => !solved.has(p.id));
  const source = unsolved.length ? unsolved : pool.length ? pool : PATTERNS.flatMap((p) => p.problems);
  return source[Math.floor(Math.random() * source.length)];
}

function getPatternTitle(id: string) {
  return PATTERNS.find((p) => p.id === id)?.title ?? id;
}

export default function DiagnosisPage() {
  const { solved } = useProgressStore();
  const { diagnosisAttempts, addDiagnosisAttempt } = usePrepStore();
  const seenIds = useMemo(() => new Set(diagnosisAttempts.map((a) => a.problemId)), [diagnosisAttempts]);
  const [problem, setProblem] = useState<Problem>(() => pickProblem(solved, seenIds));
  const [choice, setChoice] = useState("");
  const [answered, setAnswered] = useState(false);
  const content = PROBLEM_CONTENT[problem.id];
  const recent = diagnosisAttempts.slice(0, 25);
  const correct = recent.filter((a) => a.correct).length;
  const accuracy = recent.length ? Math.round((correct / recent.length) * 100) : 0;

  const submit = () => {
    if (!choice) return;
    addDiagnosisAttempt({
      problemId: problem.id,
      title: problem.title,
      actualPattern: problem.pattern,
      chosenPattern: choice,
      correct: choice === problem.pattern,
    });
    setAnswered(true);
  };

  const next = () => {
    const nextSeen = new Set([...seenIds, problem.id]);
    setProblem(pickProblem(solved, nextSeen));
    setChoice("");
    setAnswered(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="max-w-5xl mx-auto px-4 pb-8">
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>Pattern Diagnosis</span>
        </div>

        <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Pattern Diagnosis</h1>
            <p className="text-sm max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              Train the moment before coding: recognize the pattern from problem signals, then commit to an approach.
            </p>
          </div>
          <div className="card px-4 py-3 text-right">
            <div className="text-xl font-bold" style={{ color: accuracy >= 75 ? "#2FBF71" : accuracy >= 50 ? "#F5A524" : "#EF4444" }}>{accuracy}%</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>last {recent.length || 0} attempts</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <section className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{problem.title}</h2>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {problem.difficulty} · {problem.frequency} frequency · {problem.tags.slice(0, 4).join(", ")}
                </p>
              </div>
              <Link href={`/problems/${problem.id}`} className="btn-ghost px-3 py-1.5 text-xs">Open</Link>
            </div>

            <div className="rounded-xl p-4 mb-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--accent)" }}>Signals</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {content?.intuition
                  ? content.intuition.split(".").slice(0, 2).join(".") + "."
                  : "Use the title, tags, constraints implied by the problem type, and the operation being optimized to identify the pattern."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 mb-5">
              {PATTERNS.map((p) => (
                <button
                  key={p.id}
                  disabled={answered}
                  onClick={() => setChoice(p.id)}
                  className="text-left px-3 py-2 rounded-lg text-sm transition-all"
                  style={{
                    background: choice === p.id ? "var(--accent-soft)" : "var(--bg-hover)",
                    color: choice === p.id ? "var(--accent)" : "var(--text-secondary)",
                    border: `1px solid ${choice === p.id ? "rgba(91,140,255,0.35)" : "var(--border)"}`,
                    opacity: answered && p.id !== choice && p.id !== problem.pattern ? 0.6 : 1,
                  }}
                >
                  {p.title}
                </button>
              ))}
            </div>

            {!answered ? (
              <button onClick={submit} disabled={!choice} className="btn-primary px-5 py-2.5 text-sm" style={{ opacity: choice ? 1 : 0.5 }}>
                Check Pattern
              </button>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl p-4" style={{
                  background: choice === problem.pattern ? "rgba(47,191,113,0.08)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${choice === problem.pattern ? "rgba(47,191,113,0.25)" : "rgba(239,68,68,0.25)"}`,
                }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: choice === problem.pattern ? "#2FBF71" : "#EF4444" }}>
                    {choice === problem.pattern ? "Correct pattern" : "Pattern miss"}
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    You chose {getPatternTitle(choice)}. Best fit: {getPatternTitle(problem.pattern)}.
                  </p>
                  {content?.patternConnection && (
                    <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>{content.patternConnection}</p>
                  )}
                </div>
                <button onClick={next} className="btn-primary px-5 py-2.5 text-sm">Next Diagnosis</button>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="card p-4">
              <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Recent Attempts</h2>
              <div className="space-y-2">
                {recent.slice(0, 8).map((a) => (
                  <div key={a.id} className="text-xs rounded-lg px-3 py-2" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
                    <div className="flex justify-between gap-2">
                      <span className="truncate" style={{ color: "var(--text-secondary)" }}>{a.title}</span>
                      <span style={{ color: a.correct ? "#2FBF71" : "#EF4444" }}>{a.correct ? "✓" : "×"}</span>
                    </div>
                    <div style={{ color: "var(--text-muted)" }}>{getPatternTitle(a.actualPattern)}</div>
                  </div>
                ))}
                {recent.length === 0 && <p className="text-xs" style={{ color: "var(--text-muted)" }}>No attempts yet.</p>}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
