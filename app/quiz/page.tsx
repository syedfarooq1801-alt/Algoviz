"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { PATTERNS, Problem } from "@/data/problems";

const COLOR_MAP: Record<string, string> = {
  blue: "#4F8CFF", green: "#2FBF71", purple: "#8b5cf6", orange: "#F5A524",
  cyan: "#4F8CFF", yellow: "#F5A524", emerald: "#10b981", red: "#ef4444",
  violet: "#8b5cf6", teal: "#14b8a6", indigo: "#6366f1", amber: "#F5A524",
  lime: "#84cc16", rose: "#f43f5e", slate: "#94a3b8", pink: "#ec4899",
};

function getQuiz(
  exclude: string[],
  diffFilter: string
): { problem: Problem; patternId: string; patternTitle: string; choices: Array<{ id: string; title: string }> } | null {
  let pool = PATTERNS.flatMap((p) =>
    p.problems.map((prob) => ({ problem: prob, patternId: p.id, patternTitle: p.title }))
  ).filter((x) => !exclude.includes(x.problem.id));

  if (diffFilter !== "Any") pool = pool.filter((x) => x.problem.difficulty === diffFilter);
  if (pool.length === 0) return null;

  const { problem, patternId, patternTitle } = pool[Math.floor(Math.random() * pool.length)];
  const decoys = [...PATTERNS.filter((p) => p.id !== patternId)]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const choices = [
    { id: patternId, title: patternTitle },
    ...decoys.map((p) => ({ id: p.id, title: p.title })),
  ].sort(() => Math.random() - 0.5);

  return { problem, patternId, patternTitle, choices };
}

const ROUND_OPTIONS = [5, 10, 15, 20] as const;
const DIFF_OPTIONS = ["Any", "Easy", "Medium", "Hard"] as const;

export default function QuizPage() {
  const [phase, setPhase] = useState<"setup" | "playing" | "done">("setup");
  const [totalRounds, setTotalRounds] = useState<5 | 10 | 15 | 20>(10);
  const [diffFilter, setDiffFilter] = useState<string>("Any");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<{ title: string; correct: boolean; pattern: string }>>([]);

  const quiz = useMemo(() => {
    if (phase !== "playing") return null;
    return getQuiz(seen, diffFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, phase]);

  const handleAnswer = useCallback((choiceId: string) => {
    if (answered !== null || !quiz) return;
    const correct = choiceId === quiz.patternId;
    setAnswered(choiceId);
    if (correct) setScore((s) => s + 1);
    setHistory((h) => [...h, { title: quiz.problem.title, correct, pattern: quiz.patternTitle }]);
  }, [answered, quiz]);

  const handleNext = useCallback(() => {
    if (!quiz) return;
    setSeen((s) => [...s, quiz.problem.id]);
    setAnswered(null);
    if (round + 1 >= totalRounds) {
      setPhase("done");
    } else {
      setRound((r) => r + 1);
    }
  }, [quiz, round, totalRounds]);

  const startQuiz = () => {
    setRound(0);
    setScore(0);
    setAnswered(null);
    setSeen([]);
    setHistory([]);
    setPhase("playing");
  };

  const correctPattern = quiz ? PATTERNS.find((p) => p.id === quiz.patternId) : null;
  const correctColor = correctPattern ? COLOR_MAP[correctPattern.color] ?? "#4F8CFF" : "#4F8CFF";
  const pct = totalRounds > 0 ? Math.round((score / totalRounds) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="max-w-2xl mx-auto px-4 pb-8">
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>Pattern Quiz</span>
        </div>

        {phase === "setup" && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Pattern Recognition Quiz</h1>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              See a problem name → guess which pattern it uses. The fastest way to build interview-ready recognition.
            </p>

            <div className="rounded-xl p-5 mb-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>ROUNDS</div>
              <div className="flex gap-2 flex-wrap">
                {ROUND_OPTIONS.map((r) => (
                  <button key={r} onClick={() => setTotalRounds(r)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: totalRounds === r ? "var(--accent-soft)" : "var(--bg-hover)",
                      color: totalRounds === r ? "var(--accent)" : "var(--text-secondary)",
                      border: `1px solid ${totalRounds === r ? "rgba(79,140,255,0.35)" : "var(--border)"}`,
                    }}>
                    {r} problems
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-5 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>DIFFICULTY</div>
              <div className="flex gap-2 flex-wrap">
                {DIFF_OPTIONS.map((d) => (
                  <button key={d} onClick={() => setDiffFilter(d)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: diffFilter === d ? "var(--accent-soft)" : "var(--bg-hover)",
                      color: diffFilter === d ? "var(--accent)" : "var(--text-secondary)",
                      border: `1px solid ${diffFilter === d ? "rgba(79,140,255,0.35)" : "var(--border)"}`,
                    }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startQuiz}
              className="w-full py-3.5 rounded-xl text-sm font-semibold"
              style={{ background: "var(--accent)", color: "#fff" }}>
              Start Quiz →
            </button>

            {/* Info */}
            <div className="mt-6 rounded-xl p-4" style={{ background: "rgba(79,140,255,0.06)", border: "1px solid rgba(79,140,255,0.15)" }}>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                <strong style={{ color: "#4F8CFF" }}>How it works:</strong> You see a problem name and 4 pattern options.
                Choose the right one. After answering, you get an explanation + link to learn the pattern.
                Aim for ≥80% — that&apos;s when patterns become reflexes.
              </p>
            </div>
          </div>
        )}

        {phase === "playing" && (
          <div className="mt-6">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1">
                  {Array.from({ length: totalRounds }).map((_, i) => (
                    <div key={i} className="h-1.5 rounded-full transition-all"
                      style={{
                        width: Math.max(4, Math.floor(280 / totalRounds) - 2),
                        background: i < round ? "#4F8CFF" : i === round ? "rgba(79,140,255,0.4)" : "var(--border)",
                      }} />
                  ))}
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {round + 1}/{totalRounds} · Score: {score}
                </span>
              </div>
            </div>

            {quiz ? (
              <>
                {/* Question card */}
                <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                    Which pattern solves this problem?
                  </div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    {quiz.problem.title}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: quiz.problem.difficulty === "Easy" ? "rgba(47,191,113,0.1)" : quiz.problem.difficulty === "Medium" ? "rgba(245,165,36,0.1)" : "rgba(239,68,68,0.1)",
                      color: quiz.problem.difficulty === "Easy" ? "#2FBF71" : quiz.problem.difficulty === "Medium" ? "#F5A524" : "#ef4444",
                    }}>
                      {quiz.problem.difficulty}
                    </span>
                    {quiz.problem.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Choices */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {quiz.choices.map((choice) => {
                    const isCorrect = choice.id === quiz.patternId;
                    const isSelected = answered === choice.id;
                    const shown = answered !== null;
                    let bg = "var(--bg-card)", border = "var(--border)", color = "var(--text-secondary)";
                    if (shown) {
                      if (isCorrect)       { bg = "rgba(47,191,113,0.1)";  border = "rgba(47,191,113,0.35)";  color = "#2FBF71"; }
                      else if (isSelected) { bg = "rgba(239,68,68,0.1)";   border = "rgba(239,68,68,0.35)";   color = "#ef4444"; }
                      else                 { color = "var(--text-muted)"; }
                    }
                    return (
                      <button key={choice.id} onClick={() => handleAnswer(choice.id)}
                        disabled={answered !== null}
                        className="p-4 rounded-xl text-left text-sm font-medium transition-all"
                        style={{ background: bg, border: `1px solid ${border}`, color }}>
                        {shown && isCorrect && "✓ "}{shown && isSelected && !isCorrect && "✗ "}
                        {choice.title}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {answered !== null && (
                  <div className="space-y-3">
                    <div className="rounded-xl p-4" style={{
                      background: answered === quiz.patternId ? "rgba(47,191,113,0.08)" : "rgba(239,68,68,0.08)",
                      border: `1px solid ${answered === quiz.patternId ? "rgba(47,191,113,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {answered === quiz.patternId
                          ? `✓ Correct! ${quiz.problem.title} uses the ${quiz.patternTitle} pattern.`
                          : `✗ This is a ${quiz.patternTitle} problem. ${correctPattern?.coreIntuition?.slice(0, 100)}...`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/patterns/${quiz.patternId}`}
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ background: `${correctColor}15`, color: correctColor, border: `1px solid ${correctColor}30` }}>
                        Study {quiz.patternTitle} →
                      </Link>
                      <Link href={quiz.problem.hasVisualization ? `/visualizations/${quiz.problem.id}` : `/problems/${quiz.problem.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                        View problem →
                      </Link>
                      <button onClick={handleNext}
                        className="ml-auto text-xs px-4 py-1.5 rounded-lg font-semibold"
                        style={{ background: "rgba(79,140,255,0.15)", color: "#4F8CFF", border: "1px solid rgba(79,140,255,0.3)" }}>
                        {round + 1 >= totalRounds ? "Results →" : "Next →"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10" style={{ color: "var(--text-muted)" }}>
                No problems available for this filter. Try a different difficulty.
              </div>
            )}
          </div>
        )}

        {phase === "done" && (
          <div className="mt-8">
            <div className="rounded-2xl p-8 text-center mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-5xl mb-4">
                {pct === 100 ? "🏆" : pct >= 80 ? "🎯" : pct >= 60 ? "💪" : "📚"}
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                {score}/{totalRounds} correct
              </h2>
              <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>{pct}% accuracy</p>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                {pct >= 80 ? "Pattern recognition is strong. Keep it up." :
                 pct >= 60 ? "Getting there. Review the wrong patterns below." :
                 "Keep practicing — pattern recognition takes repetition."}
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={startQuiz}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(79,140,255,0.15)", color: "#4F8CFF", border: "1px solid rgba(79,140,255,0.3)" }}>
                  Play Again
                </button>
                <button onClick={() => setPhase("setup")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                  Change Settings
                </button>
              </div>
            </div>

            {/* Round-by-round review */}
            <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Round Review</h3>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs py-1.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: h.correct ? "#2FBF71" : "#ef4444", width: 14 }}>{h.correct ? "✓" : "✗"}</span>
                    <span className="flex-1" style={{ color: "var(--text-secondary)" }}>{h.title}</span>
                    <span style={{ color: "var(--text-muted)" }}>{h.pattern}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
