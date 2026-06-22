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

  const steps = content.approach ?? [];
  const hints = [
    steps[0] ?? "Think about the brute-force approach first.",
    steps[1] ?? "Consider using a data structure to optimize lookups.",
    steps[2] ?? "Focus on the edge cases and boundary conditions.",
  ];

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-sm font-medium transition-colors"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: open ? "var(--text-primary)" : "var(--text-muted)" }}>Hints</span>
          {revealedHints > 0 && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {revealedHints}/3
            </span>
          )}
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200"
          style={{
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="space-y-4 pb-2 pt-2">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Reveal hints one at a time. Try to solve after each.
          </p>
          {hints.map((hint, i) => {
            const revealed = i < revealedHints;
            const isNext = i === revealedHints;
            return (
              <div
                key={i}
                className="pl-4"
                style={{
                  borderLeft: `2px solid ${revealed ? "var(--accent-orange)" : "var(--border)"}`,
                }}
              >
                {revealed ? (
                  <div>
                    <div className="mb-1 text-xs font-medium" style={{ color: "var(--accent-orange)" }}>
                      Hint {i + 1}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {hint}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => isNext && setRevealedHints(i + 1)}
                    disabled={!isNext}
                    className="text-xs transition-colors"
                    style={{
                      color: isNext ? "var(--text-muted)" : "var(--border)",
                      cursor: isNext ? "pointer" : "not-allowed",
                    }}
                  >
                    {isNext ? `Reveal Hint ${i + 1}` : `Hint ${i + 1} (locked)`}
                  </button>
                )}
              </div>
            );
          })}
          {revealedHints > 0 && (
            <button
              onClick={() => setRevealedHints(0)}
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Reset hints
            </button>
          )}
        </div>
      )}
    </div>
  );
}
