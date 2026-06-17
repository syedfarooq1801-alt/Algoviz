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

const COMPANY_FILTERS = [
  { id: "Amazon",    color: "#F5A524" },
  { id: "Google",    color: "#4F8CFF" },
  { id: "Meta",      color: "#2FBF71" },
  { id: "Apple",     color: "#4F8CFF" },
  { id: "Netflix",   color: "#EF4444" },
  { id: "Microsoft", color: "#4F8CFF" },
] as const;
type CompanyFilter = typeof COMPANY_FILTERS[number]["id"] | null;

function HomePageContent() {
  const { solved, bookmarked } = useProgressStore();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [expandAll, setExpandAll] = useState(false);
  const [showRecognition, setShowRecognition] = useState(false);
  const [showHotList, setShowHotList] = useState(false);

  const totalProblems = getTotalProblems();
  const solvedCount = solved.size;

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

  const allProblems = useMemo(() => PATTERNS.flatMap((p) => p.problems), []);

  const maangHotList = useMemo(() => {
    const MAANG = ["Amazon", "Google", "Meta", "Apple", "Netflix", "Microsoft", "Facebook"];
    return allProblems
      .filter((p) => p.frequency === "High" && p.companies.some((c) => MAANG.includes(c)))
      .slice(0, 50);
  }, [allProblems]);

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
        if (companyFilter) {
          const aliases: Record<string, string[]> = { Meta: ["Meta", "Facebook"] };
          const names = aliases[companyFilter] ?? [companyFilter];
          if (!prob.companies.some((c) => names.includes(c))) return false;
        }
        if (activeFilter === "Easy") return prob.difficulty === "Easy";
        if (activeFilter === "Medium") return prob.difficulty === "Medium";
        if (activeFilter === "Hard") return prob.difficulty === "Hard";
        if (activeFilter === "Not Solved") return !solved.has(prob.id);
        if (activeFilter === "Bookmarked") return bookmarked.has(prob.id);
        if (activeFilter === "Has Viz") return prob.hasVisualization;
        return true;
      }),
    })).filter((p) => p.problems.length > 0);
  }, [activeFilter, companyFilter, solved, bookmarked, searchQuery]);

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
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        suggestions={suggestions}
      />
      <main className="mx-auto max-w-5xl px-4 pb-20">
        {/* Hero — editorial */}
        <section className="max-w-[760px] pb-10 pt-14 reveal reveal-1">
          <p className="eyebrow mb-3">Track 01 · Algorithms &amp; Data Structures</p>
          <h1 className="title-1 mb-4" style={{ color: "var(--text-primary)" }}>
            DSA Patterns
          </h1>
          <p className="lede max-w-2xl">
            {totalProblems} problems across {PATTERNS.length} core patterns. Build deep intuition — not just memorized solutions.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <span>{solvedCount} / {totalProblems} solved</span>
              <div className="h-[2px] w-28 overflow-hidden rounded-full" style={{ background: "var(--border-subtle)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${totalProblems ? (solvedCount / totalProblems) * 100 : 0}%`,
                    background: "var(--accent)",
                  }}
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <Link href="/study-plan" className="hover:underline">Study Plan</Link>
              <span>·</span>
              <Link href="/mock" className="hover:underline">Mock Interview</Link>
              <span>·</span>
              <button onClick={() => setShowRecognition(true)} className="hover:underline">
                Pattern Quiz
              </button>
            </div>
          </div>
        </section>

        {/* MAANG Hot 50 */}
        <div className="mb-6">
          <button
            onClick={() => setShowHotList((v) => !v)}
            className="mb-4 flex items-center gap-2 text-sm transition-colors"
            style={{ color: showHotList ? "var(--text-primary)" : "var(--text-muted)" }}
          >
            <span>MAANG Hot 50</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {maangHotList.filter((p) => solved.has(p.id)).length}/{maangHotList.length} solved
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200"
              style={{ transform: showHotList ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {showHotList && (
            <div
              className="overflow-hidden rounded-lg"
              style={{ border: "1px solid var(--border-subtle)" }}
            >
              <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                {maangHotList.map((prob, i) => {
                  const isSolved = solved.has(prob.id);
                  const diffColor =
                    prob.difficulty === "Easy"
                      ? "var(--accent-green)"
                      : prob.difficulty === "Medium"
                      ? "var(--accent-orange)"
                      : "var(--accent-red)";
                  return (
                    <div
                      key={prob.id}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs"
                      style={{ background: isSolved ? "rgba(47,191,113,0.03)" : "transparent" }}
                    >
                      <span
                        className="w-5 shrink-0 text-center font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {i + 1}
                      </span>
                      <Link
                        href={`/problems/${prob.id}`}
                        className="flex-1 truncate font-medium transition-colors hover:text-white"
                        style={{
                          color: isSolved ? "var(--text-muted)" : "var(--text-primary)",
                          textDecoration: isSolved ? "line-through" : "none",
                        }}
                      >
                        {prob.title}
                      </Link>
                      <span className="shrink-0" style={{ color: diffColor }}>
                        {prob.difficulty}
                      </span>
                      {isSolved && (
                        <span style={{ color: "var(--accent-green)" }}>✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Spaced repetition review queue */}
        <ReviewQueue />

        {/* Filter bar */}
        <div className="mb-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="rounded-lg px-3 py-1.5 text-xs transition-all"
                  style={{
                    background: activeFilter === f ? "rgba(79,140,255,0.12)" : "var(--bg-card)",
                    color: activeFilter === f ? "var(--accent)" : "var(--text-secondary)",
                    border: activeFilter === f
                      ? "1px solid rgba(79,140,255,0.25)"
                      : "1px solid var(--border)",
                    fontWeight: activeFilter === f ? 600 : 400,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={() => setExpandAll(!expandAll)}
              className="rounded-lg px-3 py-1.5 text-xs transition-all"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {expandAll ? "Collapse All" : "Expand All"}
            </button>
          </div>
          {/* Company filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Company:</span>
            <button
              onClick={() => setCompanyFilter(null)}
              className="rounded-lg px-2.5 py-1 text-xs transition-all"
              style={{
                background: companyFilter === null ? "rgba(79,140,255,0.12)" : "var(--bg-card)",
                color: companyFilter === null ? "var(--accent)" : "var(--text-muted)",
                border: `1px solid ${companyFilter === null ? "rgba(79,140,255,0.25)" : "var(--border)"}`,
              }}
            >
              All
            </button>
            {COMPANY_FILTERS.map((cf) => (
              <button
                key={cf.id}
                onClick={() => setCompanyFilter(companyFilter === cf.id ? null : cf.id)}
                className="rounded-lg px-2.5 py-1 text-xs transition-all"
                style={{
                  background: companyFilter === cf.id ? `${cf.color}18` : "var(--bg-card)",
                  color: companyFilter === cf.id ? cf.color : "var(--text-muted)",
                  border: `1px solid ${companyFilter === cf.id ? cf.color + "50" : "var(--border)"}`,
                }}
              >
                {cf.id}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern sections */}
        <div className="flex flex-col gap-2">
          {filteredPatterns.map((pattern, i) => {
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
          <div className="py-16 text-center" style={{ color: "var(--text-muted)" }}>
            <p>No problems match this filter.</p>
          </div>
        )}
      </main>

      {showRecognition && (
        <PatternRecognitionModal onClose={() => setShowRecognition(false)} />
      )}
    </div>
  );
}

export default function DSAHubPage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
