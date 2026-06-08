"use client";
import { useState } from "react";
import { PROBLEM_CONTENT } from "@/data/problemContent";

interface Props {
  problemId: string;
}

export default function HintPanel({ problemId }: Props) {
  const [revealedHints, setRevealedHints] = useState(0);
  const [open, setOpen] = useState(false);
  const content = PROBLEM_CONTENT[problemId];

  if (!content) return null;

  // Derive 3 progressive hints from the approach steps
  const steps = content.approach ?? [];
  const hints = [
    steps[0] ?? "Think about the brute-force approach first.",
    steps[1] ?? "Consider using a data structure to optimize lookups.",
    steps[2] ?? "Focus on the edge cases and boundary conditions.",
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      {/* Toggle header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 transition-all"
        style={{ background: "var(--bg-card)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">💡</span>
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Hints</span>
          {revealedHints > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(234,179,8,0.15)", color: "#eab308", border: "1px solid rgba(234,179,8,0.3)" }}>
              {revealedHints}/3 revealed
            </span>
          )}
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="transition-transform duration-200"
          style={{ color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 space-y-3" style={{ borderTop: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.1)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Reveal hints one at a time. Try to solve after each hint before moving to the next.
          </p>

          {hints.map((hint, i) => {
            const revealed = i < revealedHints;
            const isNext = i === revealedHints;

            return (
              <div
                key={i}
                className="rounded-lg overflow-hidden"
                style={{
                  border: revealed
                    ? `1px solid rgba(234,179,8,0.25)`
                    : "1px solid var(--border)",
                }}
              >
                {revealed ? (
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(234,179,8,0.15)", color: "#eab308" }}>
                        Hint {i + 1}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {hint}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => isNext && setRevealedHints(i + 1)}
                    disabled={!isNext}
                    className="w-full flex items-center justify-between p-3 transition-all"
                    style={{
                      background: isNext ? "var(--bg-hover)" : "transparent",
                      cursor: isNext ? "pointer" : "not-allowed",
                      opacity: isNext ? 1 : 0.4,
                    }}
                  >
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {isNext ? `🔒 Reveal Hint ${i + 1}` : `🔒 Hint ${i + 1} (reveal hint ${i} first)`}
                    </span>
                    {isNext && (
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(234,179,8,0.15)", color: "#eab308" }}>
                        Reveal
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}

          {revealedHints > 0 && (
            <button
              onClick={() => setRevealedHints(0)}
              className="text-xs transition-all"
              style={{ color: "var(--text-muted)" }}
            >
              ↺ Reset hints
            </button>
          )}
        </div>
      )}
    </div>
  );
}
