"use client";
import { useState, useMemo, useCallback } from "react";
import { PATTERNS, Problem } from "@/data/problems";
import Link from "next/link";

interface Props {
  onClose: () => void;
}

const COLOR_MAP: Record<string, string> = {
  blue: "#4F8CFF", green: "#2FBF71", purple: "#4F8CFF", orange: "#F5A524",
  cyan: "#4F8CFF", yellow: "#F5A524", emerald: "#10b981", red: "#ef4444",
  violet: "#8b5cf6", teal: "#14b8a6", indigo: "#6366f1", amber: "#F5A524",
  lime: "#84cc16", rose: "#f43f5e", slate: "#94a3b8", pink: "#ec4899",
};

// Get a random problem and its 4 pattern choices (1 correct + 3 decoys)
function getQuiz(exclude: string[] = []): {
  problem: Problem;
  patternId: string;
  patternTitle: string;
  choices: Array<{ id: string; title: string }>;
} | null {
  const allProblems = PATTERNS.flatMap((p) =>
    p.problems.map((prob) => ({ problem: prob, patternId: p.id, patternTitle: p.title, patternColor: p.color }))
  ).filter((x) => !exclude.includes(x.problem.id));

  if (allProblems.length === 0) return null;

  const idx = Math.floor(Math.random() * allProblems.length);
  const { problem, patternId, patternTitle } = allProblems[idx];

  // Pick 3 random decoy patterns
  const otherPatterns = PATTERNS.filter((p) => p.id !== patternId);
  const shuffled = [...otherPatterns].sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [
    { id: patternId, title: patternTitle },
    ...shuffled.map((p) => ({ id: p.id, title: p.title })),
  ].sort(() => Math.random() - 0.5);

  return { problem, patternId, patternTitle, choices };
}

export default function PatternRecognitionModal({ onClose }: Props) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null); // selected choice id
  const [seen, setSeen] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const TOTAL_ROUNDS = 5;

  const quiz = useMemo(() => {
    if (finished) return null;
    return getQuiz(seen);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, finished]);

  const handleAnswer = useCallback((choiceId: string) => {
    if (answered !== null || !quiz) return;
    setAnswered(choiceId);
    if (choiceId === quiz.patternId) {
      setScore((s) => s + 1);
    }
  }, [answered, quiz]);

  const handleNext = useCallback(() => {
    if (!quiz) return;
    setSeen((s) => [...s, quiz.problem.id]);
    setAnswered(null);
    if (round + 1 >= TOTAL_ROUNDS) {
      setFinished(true);
    } else {
      setRound((r) => r + 1);
    }
  }, [quiz, round]);

  const handleRestart = useCallback(() => {
    setScore(0);
    setRound(0);
    setAnswered(null);
    setSeen([]);
    setFinished(false);
  }, []);

  const correctPattern = quiz ? PATTERNS.find((p) => p.id === quiz.patternId) : null;
  const correctColor = correctPattern ? COLOR_MAP[correctPattern.color] ?? "#4F8CFF" : "#4F8CFF";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">🧠</span>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Pattern Recognition</h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Guess the pattern before solving</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }} className="text-xl leading-none">×</button>
        </div>

        {finished ? (
          // Results screen
          <div className="p-6 text-center">
            <div className="text-5xl mb-4">
              {score === TOTAL_ROUNDS ? "🏆" : score >= 3 ? "🎯" : score >= 2 ? "💪" : "📚"}
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              {score}/{TOTAL_ROUNDS} Correct
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              {score === TOTAL_ROUNDS ? "Perfect! You can identify patterns instantly." :
               score >= 3 ? "Great pattern recognition! Keep practicing." :
               "Keep going — recognizing patterns takes repetition."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "rgba(79,140,255,0.15)", color: "#4F8CFF", border: "1px solid rgba(79,140,255,0.3)" }}
              >
                Play Again
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                Done
              </button>
            </div>
          </div>
        ) : quiz ? (
          // Question screen
          <div className="p-6">
            {/* Progress */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-1">
                {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-8 rounded-full transition-all"
                    style={{ background: i < round ? "#4F8CFF" : i === round ? "rgba(79,140,255,0.4)" : "var(--border)" }}
                  />
                ))}
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {round + 1}/{TOTAL_ROUNDS} · Score: {score}
              </span>
            </div>

            {/* Question */}
            <div className="rounded-xl p-4 mb-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                What pattern does this problem use?
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {quiz.problem.title}
              </h3>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: quiz.problem.difficulty === "Easy" ? "rgba(47,191,113,0.1)" : quiz.problem.difficulty === "Medium" ? "rgba(245,165,36,0.1)" : "rgba(239,68,68,0.1)",
                  color: quiz.problem.difficulty === "Easy" ? "#2FBF71" : quiz.problem.difficulty === "Medium" ? "#F5A524" : "#ef4444",
                }}>
                  {quiz.problem.difficulty}
                </span>
                {quiz.problem.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Choices */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {quiz.choices.map((choice) => {
                const isCorrect = choice.id === quiz.patternId;
                const isSelected = answered === choice.id;
                const showResult = answered !== null;

                let bg = "var(--bg-card)";
                let borderColor = "var(--border)";
                let textColor = "var(--text-secondary)";

                if (showResult) {
                  if (isCorrect) { bg = "rgba(47,191,113,0.1)"; borderColor = "rgba(47,191,113,0.35)"; textColor = "#2FBF71"; }
                  else if (isSelected) { bg = "rgba(239,68,68,0.1)"; borderColor = "rgba(239,68,68,0.35)"; textColor = "#ef4444"; }
                  else { textColor = "var(--text-muted)"; }
                }

                const patternObj = PATTERNS.find((p) => p.id === choice.id);
                const choiceColor = patternObj ? COLOR_MAP[patternObj.color] ?? "#4F8CFF" : "#4F8CFF";

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleAnswer(choice.id)}
                    disabled={answered !== null}
                    className="p-3 rounded-xl text-left transition-all text-xs font-medium"
                    style={{
                      background: bg,
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      cursor: answered !== null ? "default" : "pointer",
                    }}
                  >
                    {showResult && isCorrect && "✓ "}
                    {showResult && isSelected && !isCorrect && "✗ "}
                    {choice.title}
                  </button>
                );
              })}
            </div>

            {/* Feedback + Next */}
            {answered !== null && (
              <div className="space-y-3">
                <div className="rounded-lg p-3" style={{
                  background: answered === quiz.patternId ? "rgba(47,191,113,0.08)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${answered === quiz.patternId ? "rgba(47,191,113,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {answered === quiz.patternId
                      ? `✓ Correct! This is a ${quiz.patternTitle} problem.`
                      : `✗ This is a ${quiz.patternTitle} problem. ${correctPattern?.coreIntuition?.slice(0, 80)}...`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/patterns/${quiz.patternId}`}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: `${correctColor}15`, color: correctColor, border: `1px solid ${correctColor}30` }}
                  >
                    Learn {quiz.patternTitle} →
                  </Link>
                  <button
                    onClick={handleNext}
                    className="ml-auto text-xs px-4 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: "rgba(79,140,255,0.15)", color: "#4F8CFF", border: "1px solid rgba(79,140,255,0.3)" }}
                  >
                    {round + 1 >= TOTAL_ROUNDS ? "See Results →" : "Next →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            No more problems available. Great job!
          </div>
        )}
      </div>
    </div>
  );
}
