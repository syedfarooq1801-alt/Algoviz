"use client";

import { Problem, Pattern } from "@/data/problems";
import PatternVizDispatcher from "@/components/visualizations/PatternVizDispatcher";

interface Props {
  problem: Problem;
  pattern: Pattern | null;
}

export default function ProblemVizFallback({ problem, pattern }: Props) {
  const patternTitle = pattern?.title ?? "Pattern";
  const patternSignals = pattern?.recognitionSignals?.slice(0, 3) ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Problem-specific visualization
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {problem.title} ⟶ {patternTitle}
          </span>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          This page uses the pattern animation below to illustrate the core technique behind <strong>{problem.title}</strong>. It is tailored to the problem by showing pattern context, frequency, and the most important recognition signals.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-secondary)" }}>
              Problem
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{problem.title}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{problem.tags.join(" · ")}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-secondary)" }}>
              Pattern focus
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{patternTitle}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{pattern?.coreIntuition.split(". ")[0]}.</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>
            Problem signals
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {patternSignals.map((signal) => (
              <span
                key={signal}
                className="text-xs px-3 py-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>

      <PatternVizDispatcher patternId={problem.pattern} />

      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          How this applies to {problem.title}
        </h2>
        <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <li>• Use the {patternTitle} pattern to simplify the problem's main structure.</li>
          <li>• Focus on the pattern's invariant rather than brute-force enumeration.</li>
          <li>• The animation above shows the technique in action for this problem's family.</li>
        </ul>
      </div>
    </div>
  );
}
