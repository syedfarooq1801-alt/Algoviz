"use client";
import { Pattern } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import { useState } from "react";
import ProblemRow from "./ProblemRow";
import Link from "next/link";

const patternColors: Record<string, { ring: string; glow: string; text: string }> = {
  blue:    { ring: "#4f8ef7", glow: "rgba(79,142,247,0.08)",  text: "#4f8ef7" },
  green:   { ring: "#22c55e", glow: "rgba(34,197,94,0.08)",   text: "#22c55e" },
  purple:  { ring: "#a855f7", glow: "rgba(168,85,247,0.08)",  text: "#a855f7" },
  orange:  { ring: "#f97316", glow: "rgba(249,115,22,0.08)",  text: "#f97316" },
  cyan:    { ring: "#06b6d4", glow: "rgba(6,182,212,0.08)",   text: "#06b6d4" },
  yellow:  { ring: "#eab308", glow: "rgba(234,179,8,0.08)",   text: "#eab308" },
  emerald: { ring: "#10b981", glow: "rgba(16,185,129,0.08)",  text: "#10b981" },
  red:     { ring: "#ef4444", glow: "rgba(239,68,68,0.08)",   text: "#ef4444" },
  violet:  { ring: "#8b5cf6", glow: "rgba(139,92,246,0.08)",  text: "#8b5cf6" },
  teal:    { ring: "#14b8a6", glow: "rgba(20,184,166,0.08)",  text: "#14b8a6" },
  indigo:  { ring: "#6366f1", glow: "rgba(99,102,241,0.08)",  text: "#6366f1" },
  amber:   { ring: "#f59e0b", glow: "rgba(245,158,11,0.08)",  text: "#f59e0b" },
  lime:    { ring: "#84cc16", glow: "rgba(132,204,22,0.08)",  text: "#84cc16" },
  rose:    { ring: "#f43f5e", glow: "rgba(244,63,94,0.08)",   text: "#f43f5e" },
  slate:   { ring: "#94a3b8", glow: "rgba(148,163,184,0.08)", text: "#94a3b8" },
  pink:    { ring: "#ec4899", glow: "rgba(236,72,153,0.08)",  text: "#ec4899" },
};

interface Props {
  pattern: Pattern;
  index: number;
  defaultOpen?: boolean;
  /** Mastery % of the previous pattern (0-100). Undefined = no gate. */
  prevPatternPct?: number;
  prevPatternTitle?: string;
}

const MASTERY_GATE = 70; // % threshold to show "recommended" warning

export default function PatternSection({ pattern, index, defaultOpen = false, prevPatternPct, prevPatternTitle }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const { solved } = useProgressStore();
  const problemIds = pattern.problems.map((p) => p.id);
  const solvedCount = problemIds.filter((id) => solved.has(id)).length;
  const total = pattern.problems.length;
  const pct = total > 0 ? Math.round((solvedCount / total) * 100) : 0;
  const colors = patternColors[pattern.color] ?? patternColors.blue;

  // Mastery gate: prev pattern below 70% threshold
  const gateActive =
    prevPatternPct !== undefined &&
    prevPatternPct < MASTERY_GATE;

  const masteryLabel =
    pct === 0 ? "Not started" :
    pct < 30 ? "Beginner" :
    pct < 60 ? "Developing" :
    pct < 90 ? "Proficient" :
    "Mastered";

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: open ? `1px solid ${colors.ring}40` : "1px solid var(--border-subtle)",
        background: open ? colors.glow : "var(--bg-card)",
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`,
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
        style={{ cursor: "pointer" }}
      >
        {/* Chevron */}
        <div
          className="shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--text-muted)" }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>

        {/* Pattern title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="font-semibold text-sm"
              style={{ color: open ? colors.text : "var(--text-primary)" }}
            >
              {pattern.title}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: `${colors.ring}15`,
                color: colors.ring,
                border: `1px solid ${colors.ring}30`,
              }}
            >
              {masteryLabel}
            </span>
            {/* Mastery gate badge — soft lock, still accessible */}
            {gateActive && pct === 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                title={`Recommended: complete ${MASTERY_GATE}% of ${prevPatternTitle ?? "previous pattern"} first`}
                style={{
                  background: "rgba(234,179,8,0.1)",
                  color: "#eab308",
                  border: "1px solid rgba(234,179,8,0.25)",
                }}
              >
                🔒 Finish {prevPatternTitle ?? "prev"} first ({prevPatternPct}%)
              </span>
            )}
          </div>
          <p
            className="text-xs mt-0.5 hidden sm:block truncate"
            style={{ color: "var(--text-muted)" }}
          >
            {pattern.description}
          </p>
        </div>

        {/* Progress section */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Progress bar */}
          <div className="hidden sm:block">
            <div
              className="w-32 h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--border)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${colors.ring}, ${colors.ring}aa)`,
                }}
              />
            </div>
          </div>

          {/* Count */}
          <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)", minWidth: "42px", textAlign: "right" }}>
            <span style={{ color: solvedCount > 0 ? colors.ring : "var(--text-muted)" }}>
              {solvedCount}
            </span>
            <span style={{ color: "var(--text-muted)" }}>/{total}</span>
          </span>

          {/* Learn pattern link */}
          <Link
            href={`/patterns/${pattern.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs px-2 py-1 rounded-md transition-all hidden md:block"
            style={{
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = colors.text;
              (e.currentTarget as HTMLElement).style.borderColor = `${colors.ring}50`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            }}
          >
            Learn Pattern →
          </Link>
        </div>
      </button>

      {/* Mastery gate expanded tip */}
      {open && gateActive && pct === 0 && (
        <div
          className="mx-4 mb-3 px-4 py-2 rounded-lg text-xs"
          style={{
            background: "rgba(234,179,8,0.08)",
            border: "1px solid rgba(234,179,8,0.2)",
            color: "#eab308",
          }}
        >
          💡 Recommended: reach {MASTERY_GATE}% mastery in <strong>{prevPatternTitle}</strong> before starting this pattern ({prevPatternPct}% done). You can still access it now.
        </div>
      )}

      {/* Problem table */}
      {open && (
        <div className="animate-slide-down">
          {/* Table header */}
          <div
            className="flex items-center gap-3 px-4 py-2 text-xs font-medium border-t border-b"
            style={{
              color: "var(--text-muted)",
              borderColor: "var(--border-subtle)",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            <div className="w-4 shrink-0" />
            <div className="w-5 shrink-0">#</div>
            <div className="flex-1">Problem</div>
            <div className="shrink-0 w-20">Difficulty</div>
            <div className="shrink-0 w-24 hidden sm:block">Score</div>
            <div className="shrink-0 w-8 hidden md:block">Freq</div>
            <div className="shrink-0 w-6">Viz</div>
            <div className="shrink-0 w-5">LC</div>
            <div className="shrink-0 w-5">★</div>
          </div>

          {/* Problem rows */}
          {pattern.problems.map((problem, i) => (
            <ProblemRow key={problem.id} problem={problem} index={i} />
          ))}

          {/* Footer */}
          <div
            className="px-4 py-2 flex items-center justify-between text-xs"
            style={{
              background: "rgba(0,0,0,0.15)",
              color: "var(--text-muted)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <span>
              {solvedCount}/{total} solved · {pct}% mastery
            </span>
            <Link
              href={`/patterns/${pattern.id}`}
              className="hover:text-blue-400 transition-colors"
            >
              Deep dive into pattern →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
