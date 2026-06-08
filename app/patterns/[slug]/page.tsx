"use client";
import { use, useState } from "react";
import { getPatternById, PATTERNS } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import Header from "@/components/Header";
import ProblemRow from "@/components/ProblemRow";
import Link from "next/link";
import { notFound } from "next/navigation";
import PatternVizDispatcher from "@/components/visualizations/PatternVizDispatcher";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import dynamic from "next/dynamic";

const ApproachSteps = dynamic(
  () => import("@/components/visualizations/ApproachSteps"),
  { ssr: false }
);

interface Props {
  params: Promise<{ slug: string }>;
}

export default function PatternPage({ params }: Props) {
  const { slug } = use(params);
  const pattern = getPatternById(slug);
  if (!pattern) notFound();

  const { solved } = useProgressStore();
  const problemIds = pattern.problems.map((p) => p.id);
  const solvedCount = problemIds.filter((id) => solved.has(id)).length;
  const total = pattern.problems.length;
  const pct = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

  const currentIndex = PATTERNS.findIndex((p) => p.id === slug);
  const prevPattern = currentIndex > 0 ? PATTERNS[currentIndex - 1] : null;
  const nextPattern = currentIndex < PATTERNS.length - 1 ? PATTERNS[currentIndex + 1] : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />

      <main className="max-w-4xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>{pattern.title}</span>
        </div>

        {/* Pattern header */}
        <div className="mt-4 mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            {pattern.title}
          </h1>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            {pattern.description}
          </p>

          {/* Progress */}
          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: "var(--text-muted)" }}>Progress:</span>
            <div className="flex-1 max-w-48 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full progress-bar"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span style={{ color: "var(--text-secondary)" }}>{solvedCount}/{total} ({pct}%)</span>
          </div>
        </div>

        {/* Live animated pattern demo */}
        <div className="mb-4">
          <PatternVizDispatcher patternId={slug} />
        </div>

        {/* Core Intuition card */}
        <div
          className="rounded-xl p-5 mb-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--accent-blue)" }}>
            ⚡ Core Intuition
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {pattern.coreIntuition}
          </p>
        </div>

        {/* Two column: Recognition + Complexity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div
            className="rounded-xl p-5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--accent-green)" }}>
              🎯 Recognition Signals
            </h2>
            <ul className="space-y-2">
              {pattern.recognitionSignals.map((signal, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--text-secondary)", marginTop: "1px" }}>→</span>
                  {signal}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--accent-orange)" }}>
              📊 Complexity
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Time</div>
                <div
                  className="inline-block px-3 py-1 rounded-lg text-sm font-mono font-semibold"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {pattern.timeComplexity}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Space</div>
                <div
                  className="inline-block px-3 py-1 rounded-lg text-sm font-mono font-semibold"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {pattern.spaceComplexity}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Real-world analogy</div>
                <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;{pattern.realWorldAnalogy}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        {pattern.keyInsights && pattern.keyInsights.length > 0 && (
          <div
            className="rounded-xl p-5 mb-4"
            style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)" }}
          >
            <h2 className="text-sm font-semibold mb-3" style={{ color: "#06b6d4" }}>
              🔬 Key Insights (Deep Dive)
            </h2>
            <ul className="space-y-2">
              {pattern.keyInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span style={{ color: "#06b6d4", marginTop: "2px", fontWeight: "bold" }}>{i + 1}.</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Thinking Process */}
        {pattern.thinkingProcess && pattern.thinkingProcess.length > 0 && (
          <div
            className="rounded-xl p-5 mb-4"
            style={{ background: "rgba(79,142,247,0.05)", border: "1px solid rgba(79,142,247,0.2)" }}
          >
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--accent-blue)" }}>
              🧠 How to Think Through It (Step-by-Step)
            </h2>
            <ol className="space-y-2">
              {pattern.thinkingProcess.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: "rgba(79,142,247,0.12)", color: "var(--accent-blue)" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Decision Framework */}
        {pattern.decisionFramework && (
          <div
            className="rounded-xl p-5 mb-4"
            style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)" }}
          >
            <h2 className="text-sm font-semibold mb-2" style={{ color: "#a855f7" }}>
              🎯 Decision Framework — When to Use This Pattern
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {pattern.decisionFramework}
            </p>
          </div>
        )}

        {/* Common Mistakes & When NOT to Use — side by side */}
        {(pattern.commonMistakes?.length || pattern.whenNotToUse) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {pattern.commonMistakes && pattern.commonMistakes.length > 0 && (
              <div
                className="rounded-xl p-5"
                style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--accent-red)" }}>
                  ❌ Common Mistakes
                </h2>
                <ul className="space-y-2">
                  {pattern.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-red)", marginTop: "2px" }}>✗</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pattern.whenNotToUse && (
              <div
                className="rounded-xl p-5"
                style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <h2 className="text-sm font-semibold mb-2" style={{ color: "#f59e0b" }}>
                  ⚠️ When NOT to Use
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {pattern.whenNotToUse}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Template */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--accent-purple)" }}>
            📋 C++ Template
          </h2>
          <pre className="text-xs overflow-x-auto rounded-lg p-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <code>{pattern.template}</code>
          </pre>
        </div>

        {/* Problems table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Problems — {total} total
            </h2>
          </div>

          {/* Table header */}
          <div
            className="flex items-center gap-3 px-4 py-2 text-xs font-medium"
            style={{
              color: "var(--text-muted)",
              background: "rgba(0,0,0,0.2)",
              borderBottom: "1px solid var(--border-subtle)",
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

          {pattern.problems.map((problem, i) => (
            <ProblemRow key={problem.id} problem={problem} index={i} />
          ))}
        </div>

        {/* Per-problem Step-by-Step Approaches */}
        <div className="mt-6 mb-4">
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            🗺️ Step-by-Step Approaches
          </h2>
          <div className="space-y-2">
            {pattern.problems.map((problem) => (
              <ProblemApproach key={problem.id} problem={problem} ApproachSteps={ApproachSteps} />
            ))}
          </div>
        </div>

        {/* Pattern navigation */}
        <div className="flex items-center justify-between mt-8 text-sm">
          {prevPattern ? (
            <Link
              href={`/patterns/${prevPattern.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              ← {prevPattern.title}
            </Link>
          ) : <div />}

          <Link
            href="/"
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            All Patterns
          </Link>

          {nextPattern ? (
            <Link
              href={`/patterns/${nextPattern.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              {nextPattern.title} →
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}

// Collapsible per-problem approach accordion for pattern page
function ProblemApproach({
  problem,
  ApproachSteps,
}: {
  problem: import("@/data/problems").Problem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApproachSteps: React.ComponentType<any>;
}) {
  const [open, setOpen] = useState(false);
  const content = PROBLEM_CONTENT[problem.id];
  if (!content || !content.approach?.length) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
        style={{ background: "var(--bg-card)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="transition-transform duration-200"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--text-muted)" }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {problem.title}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{
            background: problem.difficulty === "Easy" ? "rgba(34,197,94,0.1)" : problem.difficulty === "Medium" ? "rgba(249,115,22,0.1)" : "rgba(239,68,68,0.1)",
            color: problem.difficulty === "Easy" ? "#22c55e" : problem.difficulty === "Medium" ? "#f97316" : "#ef4444",
          }}>
            {problem.difficulty}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {content.approach.length} steps
        </span>
      </button>
      {open && (
        <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <ApproachSteps problemId={problem.id} compact />
        </div>
      )}
    </div>
  );
}
