"use client";
import { useMemo } from "react";
import Link from "next/link";
import { PATTERNS, getTotalProblems } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import { useSDStore } from "@/lib/sdStore";
import { useSEStore } from "@/lib/seStore";
import { getTotalSDConcepts } from "@/data/systemDesign";
import { getTotalSEChapters } from "@/data/seBasics";
import { PREP_TRACKS, usePrepStore } from "@/lib/prepStore";
import { useInterviewStore } from "@/lib/interviewStore";

function fmt(secs: number): string {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function Bar({ pct, color, label, sub }: { pct: number; color: string; label: string; sub?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ color: "var(--text-muted)" }}>{sub ?? `${pct}%`}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, pct)}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { solved, solveTimes } = useProgressStore();
  const { mastered } = useSDStore();
  const { completed } = useSEStore();
  const { mockSessions, diagnosisAttempts, reviewDue, selectedTrack } = usePrepStore();
  const { daysUntil } = useInterviewStore();

  const totalDSA = getTotalProblems();
  const totalSD = getTotalSDConcepts();
  const totalSE = getTotalSEChapters();

  // Difficulty breakdown
  const allProblems = useMemo(() => PATTERNS.flatMap((p) => p.problems), []);
  const easy   = allProblems.filter((p) => p.difficulty === "Easy");
  const medium = allProblems.filter((p) => p.difficulty === "Medium");
  const hard   = allProblems.filter((p) => p.difficulty === "Hard");

  const easySolved   = easy.filter((p) => solved.has(p.id)).length;
  const medSolved    = medium.filter((p) => solved.has(p.id)).length;
  const hardSolved   = hard.filter((p) => solved.has(p.id)).length;

  const easyPct  = easy.length   ? Math.round((easySolved  / easy.length)   * 100) : 0;
  const medPct   = medium.length ? Math.round((medSolved   / medium.length)  * 100) : 0;
  const hardPct  = hard.length   ? Math.round((hardSolved  / hard.length)   * 100) : 0;

  // Pattern breakdown
  const patternStats = useMemo(() =>
    PATTERNS.map((p) => {
      const total = p.problems.length;
      const done  = p.problems.filter((pr) => solved.has(pr.id)).length;
      return { id: p.id, title: p.title, color: p.color, total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    }).sort((a, b) => a.pct - b.pct),
  [solved]);

  // Weakest patterns (< 50% done)
  const weakPatterns = patternStats.filter((p) => p.pct < 50 && p.total > 0);

  // Frequency stats
  const highFreq   = allProblems.filter((p) => p.frequency === "High");
  const highSolved = highFreq.filter((p) => solved.has(p.id)).length;

  // Time stats
  const times = Object.entries(solveTimes ?? {});
  const avgTime = times.length ? Math.round(times.reduce((sum, [, t]) => sum + t, 0) / times.length) : 0;
  const fastest = times.length ? times.reduce((min, [, t]) => Math.min(min, t), Infinity) : 0;
  const slowest = times.length ? times.reduce((max, [, t]) => Math.max(max, t), 0) : 0;

  // Time distribution by difficulty
  const timeByDiff = useMemo(() => {
    const buckets: Record<string, number[]> = { Easy: [], Medium: [], Hard: [] };
    for (const [id, t] of Object.entries(solveTimes ?? {})) {
      const prob = allProblems.find((p) => p.id === id);
      if (prob) buckets[prob.difficulty]?.push(t);
    }
    return Object.entries(buckets).map(([diff, ts]) => ({
      diff,
      avg: ts.length ? Math.round(ts.reduce((s, t) => s + t, 0) / ts.length) : 0,
      count: ts.length,
    }));
  }, [solveTimes, allProblems]);

  const overallPct = Math.round(((solved.size / totalDSA) + (mastered.size / totalSD) + (completed.size / totalSE)) / 3 * 100);
  const today = new Date().toISOString().split("T")[0];

  // Last 5 solved problems (most recent first)
  const { solvedDates } = useProgressStore();
  const recentlySolved = useMemo(() => {
    return Object.entries(solvedDates ?? {})
      .sort((a, b) => b[1].localeCompare(a[1]))
      .slice(0, 5)
      .map(([id, date]) => {
        const prob = allProblems.find((p) => p.id === id);
        return prob ? { id, title: prob.title, difficulty: prob.difficulty, date } : null;
      })
      .filter(Boolean) as { id: string; title: string; difficulty: string; date: string }[];
  }, [solvedDates, allProblems]);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const solvedThisWeek = Object.values(useProgressStore.getState().solvedDates ?? {}).filter((d) => new Date(d) >= weekAgo).length;
  const dueReviews = Object.entries(reviewDue).filter(([, due]) => due <= today).length;
  const avgMockScore = mockSessions.length ? Math.round(mockSessions.reduce((s, m) => s + m.score, 0) / mockSessions.length) : 0;
  const diagnosisAccuracy = diagnosisAttempts.length
    ? Math.round((diagnosisAttempts.filter((a) => a.correct).length / diagnosisAttempts.length) * 100)
    : 0;
  const days = daysUntil();
  const neededDaily = days && days > 0 ? Math.ceil((totalDSA - solved.size) / days) : null;

  const COLOR_MAP: Record<string, string> = {
    blue: "#4F8CFF", green: "#2FBF71", purple: "#8b5cf6", orange: "#F5A524",
    cyan: "#4F8CFF", yellow: "#F5A524", emerald: "#10b981", red: "#ef4444",
    violet: "#8b5cf6", teal: "#14b8a6", indigo: "#6366f1", amber: "#F5A524",
    lime: "#84cc16", rose: "#f43f5e", slate: "#94a3b8", pink: "#ec4899",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="max-w-4xl mx-auto px-4 pb-8">
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>Analytics</span>
        </div>

        <div className="mt-4 mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Analytics Dashboard</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Identify your weakest patterns, track difficulty balance, and optimize study time.
          </p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "DSA Solved",    value: `${solved.size}/${totalDSA}`,   sub: `${Math.round(solved.size/totalDSA*100)}%`,  color: "#4F8CFF" },
            { label: "SD Mastered",   value: `${mastered.size}/${totalSD}`,  sub: `${Math.round(mastered.size/totalSD*100)}%`, color: "#2FBF71" },
            { label: "SE Complete",   value: `${completed.size}/${totalSE}`, sub: `${Math.round(completed.size/totalSE*100)}%`,color: "#F5A524" },
            { label: "Overall",       value: `${overallPct}%`,               sub: "mastery",                                   color: "#8b5cf6" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Solved this week", value: solvedThisWeek, color: "#4F8CFF" },
            { label: "Due reviews", value: dueReviews, color: dueReviews > 0 ? "#F5A524" : "#2FBF71" },
            { label: "Mock avg", value: mockSessions.length ? `${avgMockScore}%` : "none", color: avgMockScore >= 75 ? "#2FBF71" : "#F5A524" },
            { label: "Diagnosis", value: diagnosisAttempts.length ? `${diagnosisAccuracy}%` : "none", color: diagnosisAccuracy >= 70 ? "#2FBF71" : "#EF4444" },
            { label: "Daily need", value: neededDaily ? `${neededDaily}/day` : "set date", color: neededDaily && neededDaily > 4 ? "#EF4444" : "#2FBF71" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        {recentlySolved.length > 0 && (
          <div className="rounded-xl p-5 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Recent Activity</h2>
            <div className="space-y-2">
              {recentlySolved.map((p, i) => (
                <Link key={p.id} href={`/problems/${p.id}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px", borderRadius: 8, textDecoration: "none",
                  background: i === 0 ? "rgba(47,191,113,0.05)" : "var(--bg-secondary)",
                  border: `1px solid ${i === 0 ? "rgba(47,191,113,0.2)" : "var(--border-subtle)"}`,
                  transition: "opacity 0.1s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 10, color: "#2FBF71", fontFamily: "var(--font-mono)" }}>✓</span>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{p.title}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: 3,
                      color: p.difficulty === "Easy" ? "#2FBF71" : p.difficulty === "Medium" ? "#F5A524" : "#EF4444",
                      background: p.difficulty === "Easy" ? "rgba(47,191,113,0.1)" : p.difficulty === "Medium" ? "rgba(245,165,36,0.1)" : "rgba(239,68,68,0.1)",
                    }}>{p.difficulty}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{p.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl p-5 mb-8" style={{ background: "rgba(79,140,255,0.06)", border: "1px solid rgba(79,140,255,0.2)" }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: "#4F8CFF" }}>Prep Coach</h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            <p>Track: {(PREP_TRACKS[selectedTrack] ?? PREP_TRACKS["product-sde1"]).title}. {(PREP_TRACKS[selectedTrack] ?? PREP_TRACKS["product-sde1"]).focus}</p>
            <p>{weakPatterns[0] ? `Weakest pattern: ${weakPatterns[0].title} at ${weakPatterns[0].pct}%.` : "No weak pattern under 50% yet."}</p>
            <p>{hardPct < easyPct - 30 ? "You are avoiding hard difficulty relative to easy problems." : "Difficulty balance is not badly skewed."}</p>
            <p>{mockSessions[0]?.insights[0] ?? "Run a mock interview to unlock pressure-tested feedback."}</p>
            <p>{dueReviews > 0 ? `${dueReviews} spaced reviews are due today.` : "No spaced reviews due today."}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty Breakdown */}
          <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Difficulty Breakdown</h2>
            <div className="space-y-4">
              <Bar pct={easyPct}  color="#2FBF71" label={`Easy (${easySolved}/${easy.length})`}   sub={`${easyPct}%`} />
              <Bar pct={medPct}   color="#F5A524" label={`Medium (${medSolved}/${medium.length})`} sub={`${medPct}%`} />
              <Bar pct={hardPct}  color="#EF4444" label={`Hard (${hardSolved}/${hard.length})`}    sub={`${hardPct}%`} />
            </div>

            {/* Gap indicator */}
            {hardPct < easyPct - 30 && (
              <div className="mt-4 rounded-lg p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-xs" style={{ color: "#EF4444" }}>
                  ⚠️ {easyPct - hardPct}% gap between Easy and Hard solve rates. Focus on Hard problems to close the gap.
                </p>
              </div>
            )}
            {hardPct >= 60 && (
              <div className="mt-4 rounded-lg p-3" style={{ background: "rgba(47,191,113,0.08)", border: "1px solid rgba(47,191,113,0.2)" }}>
                <p className="text-xs" style={{ color: "#2FBF71" }}>
                  ✓ Strong on Hard problems ({hardPct}%). MAANG-ready difficulty range.
                </p>
              </div>
            )}
          </div>

          {/* High Frequency */}
          <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Interview Frequency Coverage</h2>
            <div className="space-y-4">
              <Bar pct={highFreq.length ? Math.round(highSolved / highFreq.length * 100) : 0}
                   color="#4F8CFF"
                   label={`High Frequency (${highSolved}/${highFreq.length})`} />
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Top unsolved high-freq problems:</div>
              <div className="space-y-1">
                {highFreq.filter((p) => !solved.has(p.id)).slice(0, 5).map((p) => (
                  <Link key={p.id} href={`/problems/${p.id}`}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                    style={{ border: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{p.title}</span>
                    <span style={{ color: p.difficulty === "Hard" ? "#EF4444" : p.difficulty === "Medium" ? "#F5A524" : "#2FBF71" }}>{p.difficulty}</span>
                  </Link>
                ))}
                {highFreq.filter((p) => !solved.has(p.id)).length === 0 && (
                  <p className="text-xs" style={{ color: "#2FBF71" }}>✓ All high-frequency problems solved!</p>
                )}
              </div>
            </div>
          </div>

          {/* Pattern breakdown — full width */}
          <div className="md:col-span-2 rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Pattern Completion</h2>
              {weakPatterns.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {weakPatterns.length} weak areas
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {patternStats.map((p) => (
                <Bar
                  key={p.id}
                  pct={p.pct}
                  color={p.pct < 30 ? "#EF4444" : p.pct < 70 ? "#F5A524" : "#2FBF71"}
                  label={`${p.title} (${p.done}/${p.total})`}
                />
              ))}
            </div>

            {weakPatterns.length > 0 && (
              <div className="mt-5 rounded-lg p-4" style={{ background: "rgba(79,140,255,0.06)", border: "1px solid rgba(79,140,255,0.2)" }}>
                <div className="text-xs font-semibold mb-2" style={{ color: "#4F8CFF" }}>📌 Focus Areas (under 50%)</div>
                <div className="flex flex-wrap gap-2">
                  {weakPatterns.slice(0, 6).map((p) => (
                    <Link key={p.id} href={`/patterns/${p.id}`}
                      className="text-xs px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                      style={{ background: "rgba(79,140,255,0.1)", color: "#4F8CFF", border: "1px solid rgba(79,140,255,0.25)" }}>
                      {p.title} — {p.pct}%
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Time tracker stats */}
          {times.length > 0 && (
            <div className="md:col-span-2 rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Solve Time Stats</h2>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: "Avg time",   value: fmt(avgTime),  color: "#4F8CFF" },
                  { label: "Fastest",    value: fmt(fastest),  color: "#2FBF71" },
                  { label: "Slowest",    value: fmt(slowest),  color: "#F5A524" },
                ].map((s) => (
                  <div key={s.label} className="text-center rounded-xl p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
                    <div className="text-xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {timeByDiff.filter((d) => d.count > 0).map((d) => (
                  <div key={d.diff} className="flex items-center gap-3">
                    <span className="text-xs w-14 shrink-0" style={{ color: d.diff === "Easy" ? "#2FBF71" : d.diff === "Medium" ? "#F5A524" : "#EF4444" }}>{d.diff}</span>
                    <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{fmt(d.avg)} avg</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>({d.count} timed)</span>
                    {d.avg > 2400 && d.diff !== "Easy" && (
                      <span className="text-xs ml-auto" style={{ color: "#F5A524" }}>⚠️ Above 40 min — practice speed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insight callout */}
          <div className="md:col-span-2 rounded-xl p-5" style={{ background: "rgba(79,140,255,0.06)", border: "1px solid rgba(79,140,255,0.2)" }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "#4F8CFF" }}>📊 What to focus on next</h2>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {hardPct < 40 && (
                <li className="flex items-start gap-2"><span style={{ color: "#EF4444" }}>→</span>
                  Hard problem solve rate is {hardPct}%. Spend 30% of DSA time on Hard problems — they&apos;re what MAANG uses to filter.
                </li>
              )}
              {weakPatterns.length > 3 && (
                <li className="flex items-start gap-2"><span style={{ color: "#F5A524" }}>→</span>
                  {weakPatterns.length} patterns under 50% complete. Prioritize: {weakPatterns.slice(0, 3).map((p) => p.title).join(", ")}.
                </li>
              )}
              {highFreq.filter((p) => !solved.has(p.id)).length > 10 && (
                <li className="flex items-start gap-2"><span style={{ color: "#4F8CFF" }}>→</span>
                  {highFreq.filter((p) => !solved.has(p.id)).length} high-frequency problems unsolved. Do these before expanding to lower-frequency problems.
                </li>
              )}
              {mastered.size / totalSD < 0.3 && (
                <li className="flex items-start gap-2"><span style={{ color: "#2FBF71" }}>→</span>
                  System Design is at {Math.round(mastered.size/totalSD*100)}%. Interviewers at senior roles expect strong SD — schedule dedicated SD days.
                </li>
              )}
              {solved.size === 0 && <li style={{ color: "var(--text-muted)" }}>Start solving problems to see personalized insights here.</li>}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
