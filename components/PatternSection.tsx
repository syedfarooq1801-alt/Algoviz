"use client";
import { Pattern } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import { useState } from "react";
import ProblemRow from "./ProblemRow";
import Link from "next/link";

interface Props {
  pattern: Pattern;
  index: number;
  defaultOpen?: boolean;
  prevPatternPct?: number;
  prevPatternTitle?: string;
}

const MASTERY_GATE = 70;

export default function PatternSection({
  pattern,
  index,
  defaultOpen = false,
  prevPatternPct,
  prevPatternTitle,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const { solved } = useProgressStore();
  const problemIds = pattern.problems.map((p) => p.id);
  const solvedCount = problemIds.filter((id) => solved.has(id)).length;
  const total = pattern.problems.length;
  const pct = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

  const gateActive = prevPatternPct !== undefined && prevPatternPct < MASTERY_GATE;

  return (
    <div
      className="overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid ${open ? "rgba(79,140,255,0.2)" : "var(--border-subtle)"}`,
        background: open ? "rgba(79,140,255,0.03)" : "var(--bg-card)",
        borderRadius: "var(--radius-sm)",
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
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

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {pattern.title}
            </span>
            {gateActive && pct === 0 && (
              <span className="text-xs" style={{ color: "var(--accent-orange)" }}>
                Finish {prevPatternTitle ?? "prev"} first
              </span>
            )}
          </div>
          <p className="mt-0.5 hidden truncate text-xs sm:block" style={{ color: "var(--text-muted)" }}>
            {pattern.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden w-32 sm:block">
            <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: open ? "var(--accent)" : "rgba(79,140,255,0.45)",
                }}
              />
            </div>
          </div>
          <span
            className="min-w-[42px] text-right text-sm font-semibold"
            style={{ color: "var(--text-secondary)" }}
          >
            <span style={{ color: solvedCount > 0 ? "var(--accent)" : "var(--text-muted)" }}>
              {solvedCount}
            </span>
            <span style={{ color: "var(--text-muted)" }}>/{total}</span>
          </span>
          <Link
            href={`/patterns/${pattern.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hidden rounded-md px-2 py-1 text-xs transition-colors md:block"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
            }}
          >
            Learn →
          </Link>
        </div>
      </button>

      {/* Mastery gate tip */}
      {open && gateActive && pct === 0 && (
        <div
          className="mx-4 mb-3 px-4 py-2 text-xs"
          style={{
            background: "rgba(245,165,36,0.06)",
            borderLeft: "2px solid var(--accent-orange)",
            color: "var(--accent-orange)",
          }}
        >
          Recommended: reach {MASTERY_GATE}% mastery in{" "}
          <strong>{prevPatternTitle}</strong> before starting ({prevPatternPct}% done). You can
          still access it now.
        </div>
      )}

      {/* Problem table */}
      {open && (
        <div className="animate-slide-down">
          <div
            className="flex items-center gap-3 border-b border-t px-4 py-2 text-xs font-medium"
            style={{
              color: "var(--text-muted)",
              borderColor: "var(--border-subtle)",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            <div className="w-4 shrink-0" />
            <div className="w-5 shrink-0">#</div>
            <div className="flex-1">Problem</div>
            <div className="w-20 shrink-0">Difficulty</div>
            <div className="hidden w-24 shrink-0 sm:block">Score</div>
            <div className="hidden w-8 shrink-0 md:block">Freq</div>
            <div className="w-6 shrink-0">Viz</div>
            <div className="w-5 shrink-0">LC</div>
            <div className="w-5 shrink-0">★</div>
          </div>
          {pattern.problems.map((problem, i) => (
            <ProblemRow key={problem.id} problem={problem} index={i} />
          ))}
          <div
            className="flex items-center justify-between px-4 py-2 text-xs"
            style={{
              background: "rgba(0,0,0,0.15)",
              color: "var(--text-muted)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <span>
              {solvedCount}/{total} solved · {pct}% mastery
            </span>
            <Link href={`/patterns/${pattern.id}`} className="hover:underline">
              Deep dive →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
