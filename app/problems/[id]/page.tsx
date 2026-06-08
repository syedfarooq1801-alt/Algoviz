"use client";
import { use } from "react";
import { getProblemById, getPatternById } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import Header from "@/components/Header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROBLEM_CONTENT } from "@/data/problemContent";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProblemPage({ params }: Props) {
  const { id } = use(params);
  const problem = getProblemById(id);
  if (!problem) notFound();

  const pattern = getPatternById(problem.pattern);
  const { isSolved, isBookmarked, toggleSolved, toggleBookmark } = useProgressStore();
  const solved = isSolved(id);
  const bookmarked = isBookmarked(id);
  const content = PROBLEM_CONTENT[id];

  const diffColor = problem.difficulty === "Easy" ? "var(--accent-green)" : problem.difficulty === "Medium" ? "var(--accent-orange)" : "var(--accent-red)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />

      <main className="max-w-4xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          {pattern && (
            <>
              <Link href={`/patterns/${pattern.id}`} className="hover:text-white transition-colors">{pattern.title}</Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span style={{ color: "var(--text-secondary)" }}>{problem.title}</span>
        </div>

        {/* Problem header */}
        <div className="mt-4 mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {problem.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  color: diffColor,
                  background: `${diffColor}15`,
                  border: `1px solid ${diffColor}30`,
                }}
              >
                {problem.difficulty}
              </span>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
              >
                Score: {problem.difficultyScore}/10
              </span>
              {pattern && (
                <Link
                  href={`/patterns/${pattern.id}`}
                  className="text-xs px-2 py-1 rounded transition-colors hover:text-white"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {pattern.title}
                </Link>
              )}
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: problem.frequency === "High" ? "var(--accent-green)" : "var(--text-secondary)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {problem.frequency} frequency
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleSolved(id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: solved ? "rgba(255,255,255,0.08)" : "var(--bg-card)",
                color: solved ? "var(--text-primary)" : "var(--text-secondary)",
                border: solved ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--border)",
              }}
            >
              {solved ? "✓ Solved" : "Mark Solved"}
            </button>

            <button
              onClick={() => toggleBookmark(id)}
              className="p-2 rounded-lg transition-all"
              style={{
                background: bookmarked ? "rgba(255,255,255,0.08)" : "var(--bg-card)",
                border: bookmarked ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--border)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={bookmarked ? "var(--accent-blue)" : "none"}
                stroke={bookmarked ? "var(--accent-blue)" : "var(--text-muted)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>

            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "var(--accent-orange)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              LeetCode ↗
            </a>

            <Link
              href={`/visualizations/${id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "var(--accent-purple)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              ▶ Visualize
            </Link>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-primary)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {tag}
            </span>
          ))}
          {problem.companies.map((c) => (
            <span
              key={c}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-primary)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Content */}
        {content ? (
          <div className="space-y-4">
            {/* Intuition */}
            <Section title="💡 Intuition" color="var(--accent-orange)">
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.intuition}</p>
            </Section>

            {/* Why It Works — deep explanation */}
            {content.whyItWorks && (
              <Section title="🔬 Why This Works (Deep Dive)" color="#06b6d4">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.whyItWorks}</p>
              </Section>
            )}

            {/* Pattern Connection */}
            {content.patternConnection && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)" }}
              >
                <h3 className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#a855f7" }}>🧩 Pattern Connection</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{content.patternConnection}</p>
              </div>
            )}

            {/* Walkthrough Example */}
            {content.walkthroughExample && (
              <Section title="🚶 Step-by-Step Walkthrough" color="#22c55e">
                <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono" style={{ color: "var(--text-secondary)" }}>{content.walkthroughExample}</pre>
              </Section>
            )}

            {/* Approach */}
            <Section title="🧠 Approach" color="var(--accent-blue)">
              <ol className="space-y-2">
                {content.approach.map((step, i) => (
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
            </Section>

            {/* C++ Solution */}
            <Section title="⌨️ C++ Solution" color="var(--accent-purple)">
              <pre
                className="text-xs overflow-x-auto rounded-lg p-3"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <code>{content.cppSolution}</code>
              </pre>
            </Section>

            {/* Alternative Approaches */}
            {content.alternativeApproaches && content.alternativeApproaches.length > 0 && (
              <Section title="🔀 Alternative Approaches" color="#f59e0b">
                <ul className="space-y-2">
                  {content.alternativeApproaches.map((alt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "#f59e0b", marginTop: "2px" }}>◆</span>
                      {alt}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Complexity */}
            <div className="grid grid-cols-2 gap-4">
              <Section title="⏱ Time Complexity" color="var(--accent-orange)">
                <p className="text-lg font-mono font-bold mb-1" style={{ color: "var(--accent-orange)" }}>{content.timeComplexity}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{content.timeExplanation}</p>
              </Section>
              <Section title="💾 Space Complexity" color="var(--accent-blue)">
                <p className="text-lg font-mono font-bold mb-1" style={{ color: "var(--accent-blue)" }}>{content.spaceComplexity}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{content.spaceExplanation}</p>
              </Section>
            </div>

            {/* Common Mistakes */}
            {content.commonMistakes && content.commonMistakes.length > 0 && (
              <Section title="❌ Common Mistakes" color="var(--accent-red)">
                <ul className="space-y-2">
                  {content.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-red)", marginTop: "2px" }}>✗</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Edge Cases */}
            <Section title="⚠️ Edge Cases & Gotchas" color="#f59e0b">
              <ul className="space-y-1.5">
                {content.edgeCases.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "#f59e0b" }}>⚡</span>
                    {e}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Pro Tips */}
            {content.proTips && content.proTips.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#22c55e" }}>✅ Pro Tips</h3>
                <ul className="space-y-1.5">
                  {content.proTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "#22c55e" }}>→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Memory Trick */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(168,85,247,0.06)",
                border: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              <h3 className="text-sm font-semibold mb-2" style={{ color: "#a855f7" }}>🧠 Memory Trick</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.memoryTrick}</p>
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="text-3xl mb-3">🚧</div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
              Detailed explanation coming soon
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Check LeetCode or the visualization for this problem.
            </p>
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-xs px-4 py-2 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "var(--accent-orange)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Open on LeetCode →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <h2 className="text-sm font-semibold mb-3" style={{ color }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
