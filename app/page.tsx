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
import { useAuth } from "@/lib/authContext";

function pct(done: number, total: number) {
  return total ? Math.round((done / total) * 100) : 0;
}

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

const FEATURES = [
  {
    icon: "⚡",
    title: "Spaced Repetition",
    desc: "Schedule problem reviews on a 1→3→7→21 day cycle. Never re-forget what you once understood.",
  },
  {
    icon: "🏢",
    title: "Company Filters",
    desc: "Filter any problem set by Google, Amazon, Meta, Apple, Microsoft, LinkedIn, or Netflix.",
  },
  {
    icon: "📐",
    title: "Pattern-First Learning",
    desc: "Every problem is tagged to a pattern with full theory. Learn the pattern once, solve 10 problems from memory.",
  },
  {
    icon: "📅",
    title: "Adaptive Study Plan",
    desc: "30/60/90-day plan generator. Set your interview date and get a daily schedule that adapts to your progress.",
  },
  {
    icon: "🃏",
    title: "SRS Flashcards",
    desc: "Concept cards with spaced repetition. Due cards surface automatically — no manual scheduling.",
  },
  {
    icon: "🎯",
    title: "No Coding Here",
    desc: "This is your study layer. Understand the problem deeply here, then code it on LeetCode. Clean separation of concerns.",
  },
];

const VS_NEETCODE = [
  { feature: "Spaced repetition for problems", us: true, them: false },
  { feature: "Company-filtered problem sets", us: true, them: false },
  { feature: "Pattern theory + problems on one page", us: true, them: false },
  { feature: "Adaptive study plan with interview date", us: true, them: false },
  { feature: "SRS flashcards with due tracking", us: true, them: false },
  { feature: "Focused study (no editor distraction)", us: true, them: false },
];

function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const { signIn, user } = useAuth();
  const total = getTotalProblems();
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Hero */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 14px", borderRadius: 20, marginBottom: 24,
          background: "rgba(79,140,255,0.1)", border: "1px solid rgba(79,140,255,0.25)",
          fontSize: 12, color: "var(--accent)", fontWeight: 600,
        }}>
          {total}+ problems · SRS scheduling · Pattern theory
        </div>

        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800,
          color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.03em",
          marginBottom: 20,
        }}>
          Study smart.<br />
          <span style={{ color: "var(--accent)" }}>Code on LeetCode.</span><br />
          Beat the FAANG interview.
        </h1>

        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px", fontWeight: 400 }}>
          Code Algo is your structured study layer — pattern theory, spaced repetition, company filters, and a personalized study plan. No editor, no distraction. Understand deeply here, then code on LeetCode.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={signIn}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(255,255,255,0.9)"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,255,255,0.9)"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="rgba(255,255,255,0.9)"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(255,255,255,0.9)"/>
            </svg>
            Sign in with Google
          </button>
          <Link href="/dsa" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600,
            color: "var(--text-secondary)", border: "1px solid var(--border)",
            textDecoration: "none", transition: "border-color 0.15s",
          }}>
            Browse problems
          </Link>
        </div>
        <p style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>
          Free. Progress syncs across all your devices.
        </p>
      </section>

      {/* Feature grid */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16,
        }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              padding: "20px 22px", borderRadius: 12,
              background: "var(--bg-card)", border: "1px solid var(--border)",
            }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* vs NeetCode comparison */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: 24, letterSpacing: "-0.02em" }}>
          Why not just use NeetCode?
        </h2>
        <div style={{ borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 100px 100px",
            padding: "10px 20px", background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)",
            color: "var(--text-muted)", letterSpacing: "0.06em",
          }}>
            <span>FEATURE</span>
            <span style={{ textAlign: "center", color: "var(--accent)" }}>CODE ALGO</span>
            <span style={{ textAlign: "center" }}>NEETCODE</span>
          </div>
          {VS_NEETCODE.map((row, i) => (
            <div key={row.feature} style={{
              display: "grid", gridTemplateColumns: "1fr 100px 100px",
              padding: "11px 20px", alignItems: "center",
              borderBottom: i < VS_NEETCODE.length - 1 ? "1px solid var(--border-subtle)" : "none",
              background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
            }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{row.feature}</span>
              <span style={{ textAlign: "center", fontSize: 14 }}>{row.us ? "✓" : "✗"}</span>
              <span style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)" }}>{row.them ? "✓" : "✗"}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 12 }}>
          NeetCode has great video explanations. Code Algo has the structured study workflow around them.
        </p>
      </section>
    </div>
  );
}

export default function Home() {
  const { solved, solvedDates, streak } = useProgressStore();
  const { mastered } = useSDStore();
  const { completed } = useSEStore();
  const isNewUser = solved.size === 0 && mastered.size === 0 && completed.size === 0;
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
            href: `/problems/${problem.id}`,
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

  if (isNewUser) {
    return <LandingPage onGetStarted={() => {}} />;
  }

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
          <div className="flex items-center gap-2 flex-wrap">
            {streak > 0 && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(245,165,36,0.12)",
                  border: "1px solid rgba(245,165,36,0.3)",
                  color: "#F5A524",
                }}
              >
                🔥 {streak} day{streak !== 1 ? "s" : ""}
              </div>
            )}
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
