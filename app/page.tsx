"use client";
import { useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ProgressRing from "@/components/ProgressRing";
import { PATTERNS, getTotalProblems } from "@/data/problems";
import { getTotalSDConcepts, getTotalCaseStudies } from "@/data/systemDesign";
import { getTotalSEChapters } from "@/data/seBasics";
import { useProgressStore } from "@/lib/store";
import { useSDStore } from "@/lib/sdStore";
import { useSEStore } from "@/lib/seStore";

export default function Home() {
  const { solved } = useProgressStore();
  const { mastered } = useSDStore();
  const { completed } = useSEStore();

  const totalProblems = getTotalProblems();
  const sdTotal = getTotalSDConcepts() + getTotalCaseStudies();
  const seTotal = getTotalSEChapters();

  const dsaPct = Math.round((solved.size / totalProblems) * 100);
  const sdPct = Math.round((mastered.size / sdTotal) * 100);
  const sePct = Math.round((completed.size / seTotal) * 100);
  const overall = Math.round((dsaPct + sdPct + sePct) / 3);

  // Continue Learning → first unsolved problem in curriculum order
  const continueTarget = useMemo(() => {
    for (const p of PATTERNS) {
      for (const prob of p.problems) {
        if (!solved.has(prob.id)) return { href: prob.hasVisualization ? `/visualizations/${prob.id}` : `/problems/${prob.id}`, label: prob.title };
      }
    }
    return { href: "/dsa", label: "Browse patterns" };
  }, [solved]);

  const journey = [
    { key: "dsa", title: "Data Structures & Algorithms", blurb: "17 patterns, 186 problems. Build the core problem-solving muscle.", href: "/dsa", pct: dsaPct, color: "var(--accent)", done: solved.size, total: totalProblems, unit: "problems" },
    { key: "sd", title: "System Design", blurb: "Foundations to distributed systems. Think in tradeoffs.", href: "/system-design", pct: sdPct, color: "var(--accent-purple)", done: mastered.size, total: sdTotal, unit: "concepts" },
    { key: "se", title: "SE Basics", blurb: "OS, DBMS, Networks, OOP, Linux — the fundamentals interviews assume.", href: "/se-basics", pct: sePct, color: "var(--accent-green)", done: completed.size, total: seTotal, unit: "chapters" },
    { key: "mock", title: "Mock Interviews", blurb: "Timed sessions under pressure. Turn knowledge into reflexes.", href: "/mock", pct: 0, color: "var(--accent-orange)", done: 0, total: 0, unit: "" },
    { key: "ready", title: "Placement Ready", blurb: "Patterns mastered, systems understood, interviews rehearsed.", href: "/profile", pct: overall, color: "var(--accent-red)", done: 0, total: 0, unit: "", terminal: true },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl">
          <p className="eyebrow reveal reveal-1 mb-5">Your personal engineering academy</p>
          <h1 className="display reveal reveal-2" style={{ color: "var(--text-primary)" }}>
            Become<br />Placement Ready
          </h1>
          <p className="lede reveal reveal-3 mt-6 max-w-xl">
            Master DSA, System Design, and CS Fundamentals through interactive visual learning —
            not memorization.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-9 reveal reveal-4">
            <Link href={continueTarget.href} className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2">
              Continue Learning <span style={{ opacity: 0.7 }}>→</span>
            </Link>
            <Link href="/study-plan" className="btn-ghost px-6 py-3 text-sm">Start Roadmap</Link>
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className="ml-1 text-sm inline-flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <kbd>⌘</kbd><kbd>K</kbd> to search
            </button>
          </div>
          {solved.size + mastered.size + completed.size > 0 && (
            <p className="text-sm mt-6 reveal reveal-5" style={{ color: "var(--text-muted)" }}>
              Resuming: <span style={{ color: "var(--text-secondary)" }}>{continueTarget.label}</span>
            </p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6"><hr className="hairline" /></div>

      {/* Learning Journey */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="eyebrow mb-2">The path</p>
        <h2 className="title-1 mb-2" style={{ color: "var(--text-primary)" }}>Your learning journey</h2>
        <p className="lede mb-12">Five stages from first principles to interview-ready. Each builds on the last.</p>

        <div className="relative">
          {/* connecting rail */}
          <div className="absolute left-[27px] top-4 bottom-4 w-px" style={{ background: "var(--border)" }} />
          <div className="space-y-3">
            {journey.map((s, i) => (
              <Link key={s.key} href={s.href}
                className={`relative flex items-center gap-5 rounded-xl px-4 py-4 lift reveal reveal-${Math.min(5, i + 1)}`}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="relative shrink-0" style={{ zIndex: 1 }}>
                  <ProgressRing pct={s.pct} size={56} color={s.color} label={s.terminal ? "🏁" : `${s.pct}%`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="title-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.blurb}</p>
                  {s.total > 0 && (
                    <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>{s.done} / {s.total} {s.unit}</p>
                  )}
                </div>
                <span className="shrink-0 text-lg" style={{ color: "var(--text-muted)" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Overall mastery trail */}
      <section className="max-w-3xl mx-auto px-6 pb-28">
        <div className="rounded-2xl px-7 py-7 flex items-center gap-7" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <ProgressRing pct={overall} size={88} stroke={7} color="var(--accent)" label={`${overall}%`} />
          <div>
            <p className="eyebrow mb-1">Overall mastery</p>
            <h3 className="title-2" style={{ color: "var(--text-primary)" }}>
              {overall === 0 ? "Just getting started" : overall < 40 ? "Building momentum" : overall < 80 ? "Strong progress" : "Almost there"}
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {solved.size} problems · {mastered.size} SD concepts · {completed.size} chapters complete
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
