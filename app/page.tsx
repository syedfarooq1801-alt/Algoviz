"use client";
import { PATTERNS, getTotalProblems } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import Header from "@/components/Header";
import PatternSection from "@/components/PatternSection";
import ReviewQueue from "@/components/ReviewQueue";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import Link from "next/link";

const PatternRecognitionModal = dynamic(
  () => import("@/components/PatternRecognitionModal"),
  { ssr: false }
);

const FILTER_OPTIONS = ["All", "Easy", "Medium", "Hard", "Not Solved", "Bookmarked", "Has Viz"] as const;
type FilterType = typeof FILTER_OPTIONS[number];

function HomePageContent() {
  const { solved, bookmarked } = useProgressStore();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [expandAll, setExpandAll] = useState(false);
  const [showRecognition, setShowRecognition] = useState(false);

  const totalProblems = getTotalProblems();
  const solvedCount = solved.size;

  // Compute per-pattern mastery percentages (for mastery gates)
  const patternPcts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of PATTERNS) {
      const total = p.problems.length;
      if (total === 0) { map[p.id] = 0; continue; }
      const solvedN = p.problems.filter((pr) => solved.has(pr.id)).length;
      map[p.id] = Math.round((solvedN / total) * 100);
    }
    return map;
  }, [solved]);

  const filteredPatterns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PATTERNS.map((p) => ({
      ...p,
      problems: p.problems.filter((prob) => {
        const matchesQuery =
          !query ||
          prob.title.toLowerCase().includes(query) ||
          prob.id.toLowerCase().includes(query);

        if (!matchesQuery) return false;
        if (activeFilter === "Easy") return prob.difficulty === "Easy";
        if (activeFilter === "Medium") return prob.difficulty === "Medium";
        if (activeFilter === "Hard") return prob.difficulty === "Hard";
        if (activeFilter === "Not Solved") return !solved.has(prob.id);
        if (activeFilter === "Bookmarked") return bookmarked.has(prob.id);
        if (activeFilter === "Has Viz") return prob.hasVisualization;
        return true;
      }),
    })).filter((p) => p.problems.length > 0);
  }, [activeFilter, solved, bookmarked, searchQuery]);

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return PATTERNS.flatMap((pattern) =>
      pattern.problems.map((problem) => ({
        id: problem.id,
        title: problem.title,
        pattern: pattern.title,
      }))
    )
      .filter((problem) =>
        problem.title.toLowerCase().includes(query) ||
        problem.id.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [searchQuery]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          suggestions={suggestions}
        />
      </div>
      <main className="max-w-5xl mx-auto px-4 pb-20">
        {/* Hero section */}
        <div className="pt-10 pb-8 text-center">
          <div
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-secondary)",
            }}
          >
            <span>✦</span>
            <span>Master DSA with visual intuition · {totalProblems} problems · 17 patterns</span>
          </div>
          <h1
            className="text-3xl font-bold mb-2 tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            DSA Mastery Roadmap
          </h1>
          <p
            className="text-sm max-w-md mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Pattern-based learning with animated visualizations. Build deep intuition, not just memorized solutions.
          </p>

          {/* Overall progress */}
          <div className="mt-6 max-w-sm mx-auto">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              <span>Overall Progress</span>
              <span style={{ color: "var(--text-secondary)" }}>
                {solvedCount} / {totalProblems} ({Math.round((solvedCount / totalProblems) * 100)}%)
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full progress-bar rounded-full"
                style={{ width: `${totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 flex items-center justify-center gap-8 text-sm">
            {[
              { label: "Patterns", value: PATTERNS.length, color: "var(--accent-blue)" },
              { label: "Problems", value: totalProblems, color: "var(--accent-purple)" },
              { label: "Solved", value: solvedCount, color: "var(--accent-green)" },
              { label: "With Viz", value: PATTERNS.flatMap(p => p.problems).filter(p => p.hasVisualization).length, color: "var(--accent-orange)" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-bold text-xl" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Quick action buttons */}
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/study-plan"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: "rgba(79,142,247,0.1)",
                color: "#4f8ef7",
                border: "1px solid rgba(79,142,247,0.25)",
              }}
            >
              <span>📅</span> Study Plan
            </Link>
            <button
              onClick={() => setShowRecognition(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: "rgba(168,85,247,0.1)",
                color: "#a855f7",
                border: "1px solid rgba(168,85,247,0.25)",
              }}
            >
              <span>🧠</span> Pattern Quiz
            </button>
          </div>
        </div>

        {/* Spaced repetition review queue */}
        <ReviewQueue />

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: activeFilter === f ? "rgba(255,255,255,0.08)" : "var(--bg-card)",
                  color: activeFilter === f ? "var(--text-primary)" : "var(--text-secondary)",
                  border: activeFilter === f ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--border)",
                  fontWeight: activeFilter === f ? 600 : 400,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setExpandAll(!expandAll)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {expandAll ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {/* Pattern sections */}
        <div className="flex flex-col gap-2">
          {filteredPatterns.map((pattern, i) => {
            // Find original index in PATTERNS to get prev pattern
            const origIdx = PATTERNS.findIndex((p) => p.id === pattern.id);
            const prevPattern = origIdx > 0 ? PATTERNS[origIdx - 1] : null;
            const prevPct = prevPattern ? (patternPcts[prevPattern.id] ?? 0) : 100;

            return (
              <PatternSection
                key={pattern.id}
                pattern={pattern}
                index={i}
                defaultOpen={expandAll || i === 0}
                prevPatternPct={prevPct}
                prevPatternTitle={prevPattern?.title}
              />
            );
          })}
        </div>

        {filteredPatterns.length === 0 && (
          <div
            className="text-center py-16"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="text-4xl mb-4">🔍</div>
            <p>No problems match this filter.</p>
          </div>
        )}
      </main>

      {/* Pattern Recognition Modal */}
      {showRecognition && (
        <PatternRecognitionModal onClose={() => setShowRecognition(false)} />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
