"use client";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PATTERNS, getTotalProblems } from "@/data/problems";
import { getTotalSDConcepts, getTotalCaseStudies } from "@/data/systemDesign";
import { getTotalSEChapters } from "@/data/seBasics";
import { useProgressStore } from "@/lib/store";
import { useSDStore } from "@/lib/sdStore";
import { useSEStore } from "@/lib/seStore";
import { useInterviewStore } from "@/lib/interviewStore";
import { usePrepStore } from "@/lib/prepStore";

function pct(done: number, total: number) {
  return total ? Math.round((done / total) * 100) : 0;
}

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const { solved, solvedDates } = useProgressStore();
  const { mastered } = useSDStore();
  const { completed } = useSEStore();
  const { targetDate, targetCompany, daysUntil } = useInterviewStore();
  const { reviewDue, mockSessions } = usePrepStore();
  const days = daysUntil();

  const totalProblems = getTotalProblems();
  const sdTotal = getTotalSDConcepts() + getTotalCaseStudies();
  const seTotal = getTotalSEChapters();
  const allProblems = useMemo(() => PATTERNS.flatMap((p) => p.problems), []);

  const continueTarget = useMemo(() => {
    for (const pattern of PATTERNS) {
      for (const problem of pattern.problems) {
        if (!solved.has(problem.id)) {
          return {
            href: problem.hasVisualization ? `/visualizations/${problem.id}` : `/problems/${problem.id}`,
            title: problem.title,
            pattern: pattern.title,
            difficulty: problem.difficulty,
          };
        }
      }
    }
    return { href: "/dsa", title: "All problems complete", pattern: "DSA", difficulty: "—" };
  }, [solved]);

  const dueReviews = Object.entries(reviewDue)
    .filter(([, due]) => due <= todayIso())
    .map(([id]) => allProblems.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 6);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const solvedThisWeek = Object.values(solvedDates ?? {}).filter(
    (date) => new Date(date) >= weekAgo
  ).length;

  const patternStats = PATTERNS.map((pattern) => {
    const done = pattern.problems.filter((p) => solved.has(p.id)).length;
    return {
      id: pattern.id,
      title: pattern.title,
      done,
      total: pattern.problems.length,
      pct: pct(done, pattern.problems.length),
    };
  }).sort((a, b) => a.pct - b.pct);

  const metrics = [
    {
      type: "dsa",
      label: "DSA",
      value: `${solved.size}`,
      sub: `/ ${totalProblems}`,
      pct: pct(solved.size, totalProblems),
      href: "/dsa",
    },
    {
      type: "sd",
      label: "System Design",
      value: `${mastered.size}`,
      sub: `/ ${sdTotal}`,
      pct: pct(mastered.size, sdTotal),
      href: "/system-design",
    },
    {
      type: "se",
      label: "SE Basics",
      value: `${completed.size}`,
      sub: `/ ${seTotal}`,
      pct: pct(completed.size, seTotal),
      href: "/se-basics",
    },
    {
      type: "week",
      label: "This Week",
      value: `${solvedThisWeek}`,
      sub: "problems",
      pct: Math.min(100, (solvedThisWeek / 7) * 100),
      href: "/analytics",
    },
  ];

  const diffColor = (d: string) =>
    d === "Easy" ? "var(--accent-green)" : d === "Medium" ? "var(--accent-orange)" : "var(--accent-red)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="px-6 sm:px-8 py-7 pb-8 max-w-5xl">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="eyebrow mb-1">Today</div>
            <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Dashboard
            </h1>
          </div>
          {targetDate && days !== null && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{
                background: "var(--accent-soft)",
                border: "1px solid rgba(79,140,255,0.25)",
                color: "var(--accent)",
              }}
            >
              <span className="font-medium">{targetCompany ?? "Interview"}</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
              <span>{Math.max(0, days)}d left</span>
            </div>
          )}
        </div>

        {/* Metric cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {metrics.map((m) => (
            <Link
              key={m.type}
              href={m.href}
              data-card-type={m.type}
              className="metric-card block"
            >
              <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                {m.label}
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span
                  className="metric-number font-mono font-bold leading-none"
                  style={{ fontSize: "2.1rem", color: "var(--text-primary)" }}
                >
                  {m.value}
                </span>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {m.sub}
                </span>
              </div>
              <div className="meter-track">
                <div className="meter-fill blue-only" style={{ width: `${m.pct}%` }} />
              </div>
              <div className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                {m.pct}%
              </div>
            </Link>
          ))}
        </section>

        {/* Continue studying */}
        <Link
          href={continueTarget.href}
          className="block mb-5 px-5 py-4 rounded-xl transition-colors"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--accent)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                Continue studying
              </div>
              <div
                className="font-semibold text-sm truncate mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                {continueTarget.title}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="px-2 py-0.5 rounded"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid rgba(79,140,255,0.2)",
                  }}
                >
                  {continueTarget.pattern}
                </span>
                <span style={{ color: diffColor(continueTarget.difficulty) }}>
                  {continueTarget.difficulty}
                </span>
              </div>
            </div>
            <ArrowRight size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
          </div>
        </Link>

        {/* Bottom 2-col */}
        <section className="grid gap-4 lg:grid-cols-2">
          {/* Due reviews */}
          <div className="quiet-panel overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Due reviews
              </h2>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                {dueReviews.length}
              </span>
            </div>
            {dueReviews.length ? (
              dueReviews.map(
                (problem) =>
                  problem && (
                    <Link
                      key={problem.id}
                      href={`/problems/${problem.id}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                      <span className="truncate" style={{ color: "var(--text-secondary)" }}>
                        {problem.title}
                      </span>
                      <span
                        className="text-xs ml-2 shrink-0"
                        style={{ color: diffColor(problem.difficulty) }}
                      >
                        {problem.difficulty}
                      </span>
                    </Link>
                  )
              )
            ) : (
              <div className="px-4 py-6 text-sm" style={{ color: "var(--text-muted)" }}>
                No reviews due.
              </div>
            )}
          </div>

          {/* Weakest patterns */}
          <div className="quiet-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Weakest patterns
              </h2>
              <Link href="/analytics" className="text-xs" style={{ color: "var(--text-muted)" }}>
                Analytics →
              </Link>
            </div>
            <div className="space-y-3">
              {patternStats.slice(0, 5).map((pattern) => (
                <Link key={pattern.id} href={`/patterns/${pattern.id}`} className="block">
                  <div className="flex justify-between gap-3 text-xs mb-1.5">
                    <span className="truncate" style={{ color: "var(--text-secondary)" }}>
                      {pattern.title}
                    </span>
                    <span className="font-mono shrink-0" style={{ color: "var(--text-muted)" }}>
                      {pattern.pct}%
                    </span>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill blue-only" style={{ width: `${pattern.pct}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
