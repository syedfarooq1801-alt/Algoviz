"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { PATTERNS, Problem } from "@/data/problems";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { useProgressStore } from "@/lib/store";
import { usePrepStore, type MockProblemReview, type MockSessionReview } from "@/lib/prepStore";

type Phase = "setup" | "running" | "review" | "done";
type DiffFilter = "Any" | "Easy" | "Medium" | "Hard";

const DURATIONS = [
  { label: "30 min", mins: 30, count: 1 },
  { label: "45 min", mins: 45, count: 2 },
  { label: "60 min", mins: 60, count: 2 },
  { label: "90 min", mins: 90, count: 3 },
] as const;
const DIFFS: DiffFilter[] = ["Any", "Easy", "Medium", "Hard"];
const MOCK_COMPANIES = ["Any", "Amazon", "Google", "Meta", "Apple", "Microsoft", "Netflix"] as const;
type CompanyFilter = typeof MOCK_COMPANIES[number];

function pickProblems(count: number, diff: DiffFilter, company: CompanyFilter): Problem[] {
  let pool = PATTERNS.flatMap((p) => p.problems);
  if (diff !== "Any") pool = pool.filter((p) => p.difficulty === diff);
  if (company !== "Any") pool = pool.filter((p) => p.companies.includes(company));
  if (pool.length < count) pool = PATTERNS.flatMap((p) => p.problems).filter((p) => diff === "Any" || p.difficulty === diff);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

function fmt(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function patternTitle(id: string): string {
  return PATTERNS.find((p) => p.id === id)?.title ?? id;
}

function emptyReview(p: Problem): MockProblemReview {
  return {
    problemId: p.id,
    title: p.title,
    pattern: patternTitle(p.pattern),
    difficulty: p.difficulty,
    solved: false,
    timeSpentSecs: 0,
    complexityStated: false,
    edgeCasesConsidered: false,
    solutionRevealed: false,
    selfExplainScore: 3,
    notes: "",
  };
}

function perProblemScore(p: MockProblemReview): number {
  return (p.solved ? 45 : 0) + (p.complexityStated ? 15 : 0) + (p.edgeCasesConsidered ? 15 : 0) + (!p.solutionRevealed ? 10 : 0) + Math.min(15, p.selfExplainScore * 3);
}

export default function MockPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [config, setConfig] = useState({ mins: 45, count: 2 });
  const [diff, setDiff] = useState<DiffFilter>("Medium");
  const [company, setCompany] = useState<CompanyFilter>("Any");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [active, setActive] = useState(0);
  const [secsLeft, setSecsLeft] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [activeStartedAt, setActiveStartedAt] = useState(0);
  const [problemSecs, setProblemSecs] = useState<Record<string, number>>({});
  const [reviews, setReviews] = useState<Record<string, MockProblemReview>>({});
  const [savedSession, setSavedSession] = useState<MockSessionReview | null>(null);
  const { toggleSolved, isSolved } = useProgressStore();
  const addMockSession = usePrepStore((s) => s.addMockSession);

  const stampActiveTime = useCallback(() => {
    const p = problems[active];
    if (!p || !activeStartedAt) return;
    const delta = Math.max(0, Math.round((Date.now() - activeStartedAt) / 1000));
    setProblemSecs((prev) => ({ ...prev, [p.id]: (prev[p.id] ?? 0) + delta }));
    setActiveStartedAt(Date.now());
  }, [active, activeStartedAt, problems]);

  const start = useCallback((mins: number, count: number) => {
    const picked = pickProblems(count, diff, company);
    const now = Date.now();
    setProblems(picked);
    setReviews(Object.fromEntries(picked.map((p) => [p.id, emptyReview(p)])));
    setProblemSecs({});
    setConfig({ mins, count });
    setSecsLeft(mins * 60);
    setStartedAt(now);
    setActiveStartedAt(now);
    setActive(0);
    setSavedSession(null);
    setPhase("running");
  }, [diff]);

  useEffect(() => {
    if (phase !== "running") return;
    if (secsLeft <= 0) {
      stampActiveTime();
      setPhase("review");
      return;
    }
    const t = setTimeout(() => setSecsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secsLeft, stampActiveTime]);

  const switchProblem = (idx: number) => {
    stampActiveTime();
    setActive(idx);
    setActiveStartedAt(Date.now());
  };

  const updateReview = (id: string, patch: Partial<MockProblemReview>) => {
    setReviews((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const finish = () => {
    stampActiveTime();
    setPhase("review");
  };

  const finalizedReviews = useMemo(() => problems.map((p) => ({
    ...(reviews[p.id] ?? emptyReview(p)),
    timeSpentSecs: Math.max(1, problemSecs[p.id] ?? Math.round((Date.now() - startedAt) / 1000 / Math.max(1, problems.length))),
  })), [problems, reviews, problemSecs, startedAt]);

  const solvedCount = finalizedReviews.filter((r) => r.solved).length;
  const lowTime = secsLeft <= 300 && secsLeft > 0;

  const saveReview = () => {
    const session = addMockSession({
      durationMins: config.mins,
      difficulty: diff,
      problems: finalizedReviews,
    });
    for (const r of finalizedReviews) {
      if (r.solved && !isSolved(r.problemId)) toggleSolved(r.problemId, undefined, r.timeSpentSecs);
    }
    setSavedSession(session);
    setPhase("done");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 48px" }}>
        {phase === "setup" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4 }}>Mock Interview</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
              Timed practice with a real post-interview rubric.
            </p>

            {/* Difficulty + Company */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>DIFFICULTY</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {DIFFS.map((d) => (
                  <button key={d} onClick={() => setDiff(d)} style={{
                    padding: "5px 14px", fontSize: 12, borderRadius: 5, cursor: "pointer",
                    background: diff === d ? "var(--accent-soft)" : "transparent",
                    color: diff === d ? "var(--accent)" : "var(--text-muted)",
                    border: diff === d ? "1px solid rgba(79,140,255,0.25)" : "1px solid var(--border-subtle)",
                    fontWeight: diff === d ? 600 : 400, transition: "all 0.1s",
                  }}>{d}</button>
                ))}
              </div>

              <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>COMPANY FOCUS</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {MOCK_COMPANIES.map((c) => (
                  <button key={c} onClick={() => setCompany(c)} style={{
                    padding: "5px 14px", fontSize: 12, borderRadius: 5, cursor: "pointer",
                    background: company === c ? "rgba(167,139,250,0.12)" : "transparent",
                    color: company === c ? "#A78BFA" : "var(--text-muted)",
                    border: company === c ? "1px solid rgba(167,139,250,0.25)" : "1px solid var(--border-subtle)",
                    fontWeight: company === c ? 600 : 400, transition: "all 0.1s",
                  }}>{c}</button>
                ))}
              </div>
            </div>

            {/* Duration cards */}
            <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>SESSION LENGTH — click to start</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {DURATIONS.map((d) => (
                <button key={d.label} onClick={() => start(d.mins, d.count)} style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "18px 16px", textAlign: "left", cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2, fontFamily: "var(--font-mono)" }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{d.count} problem{d.count > 1 ? "s" : ""}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "running" && problems[active] && (
          <div>
            {/* Timer bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "var(--bg-card)", border: `1px solid ${lowTime ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
              borderRadius: 9, padding: "10px 16px", marginBottom: 16,
              position: "sticky", top: 0, zIndex: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  fontSize: 22, fontWeight: 700, fontFamily: "var(--font-mono)",
                  color: lowTime ? "#EF4444" : "var(--text-primary)", letterSpacing: "0.05em",
                }}>{fmt(secsLeft)}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{solvedCount}/{problems.length} solved</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {problems.map((p, i) => (
                  <button key={p.id} onClick={() => switchProblem(i)} style={{
                    width: 28, height: 28, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    background: i === active ? "var(--accent)" : reviews[p.id]?.solved ? "rgba(47,191,113,0.15)" : "transparent",
                    color: i === active ? "#fff" : reviews[p.id]?.solved ? "#2FBF71" : "var(--text-muted)",
                    border: `1px solid ${i === active ? "transparent" : "var(--border-subtle)"}`,
                  }}>{reviews[p.id]?.solved ? "✓" : i + 1}</button>
                ))}
                <button onClick={finish} style={{
                  marginLeft: 4, padding: "4px 12px", fontSize: 11, borderRadius: 5, cursor: "pointer",
                  background: "rgba(239,68,68,0.1)", color: "#EF4444",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}>End</button>
              </div>
            </div>

            <ProblemPrompt
              problem={problems[active]}
              review={reviews[problems[active].id]}
              onUpdate={(patch) => updateReview(problems[active].id, patch)}
            />
          </div>
        )}

        {phase === "review" && (
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Post-Mock Review</h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Grade the same behaviors an interviewer sees. This is where the prep actually compounds.
            </p>
            <div className="space-y-4">
              {finalizedReviews.map((r) => (
                <ReviewCard key={r.problemId} review={r} onUpdate={(patch) => updateReview(r.problemId, patch)} />
              ))}
            </div>
            <div className="sticky bottom-4 mt-6 card p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Estimated score: {Math.round(finalizedReviews.reduce((sum, r) => sum + perProblemScore(r), 0) / Math.max(1, finalizedReviews.length))}/100
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Saves review history, schedules retries, and marks solved problems.
                </div>
              </div>
              <button onClick={saveReview} className="btn-primary px-5 py-2.5 text-sm">Save Review</button>
            </div>
          </div>
        )}

        {phase === "done" && savedSession && (
          <div className="max-w-2xl mx-auto py-10">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{savedSession.score >= 80 ? "✓" : savedSession.score >= 55 ? "↻" : "!"}</div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                Mock Score: {savedSession.score}/100
              </h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {savedSession.durationMins} min session · {savedSession.difficulty} difficulty · {solvedCount}/{savedSession.problems.length} solved
              </p>
            </div>
            <div className="card p-5 mb-5">
              <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--accent)" }}>Coaching Insights</h2>
              <ul className="space-y-2">
                {savedSession.insights.map((i) => (
                  <li key={i} className="text-sm" style={{ color: "var(--text-secondary)" }}>→ {i}</li>
                ))}
              </ul>
            </div>
            <div className="card p-4 mb-6">
              {savedSession.problems.map((p) => (
                <div key={p.problemId} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <Link href={`/problems/${p.problemId}`} className="text-sm hover:underline" style={{ color: "var(--text-primary)" }}>{p.title}</Link>
                  <span className="text-xs" style={{ color: p.solved ? "#2FBF71" : "#EF4444" }}>
                    {p.solved ? "Solved" : "Retry"} · {fmt(p.timeSpentSecs)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setPhase("setup")} className="btn-primary px-5 py-2.5 text-sm">New Session</button>
              <Link href="/analytics" className="btn-ghost px-5 py-2.5 text-sm">View Analytics</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProblemPrompt({ problem, review, onUpdate }: {
  problem: Problem;
  review: MockProblemReview;
  onUpdate: (patch: Partial<MockProblemReview>) => void;
}) {
  const content = PROBLEM_CONTENT[problem.id];
  const diffColor = problem.difficulty === "Easy" ? "var(--accent-green)" : problem.difficulty === "Medium" ? "var(--accent-orange)" : "var(--accent-red)";

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{problem.title}</h2>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ color: diffColor, border: `1px solid ${diffColor}40` }}>{problem.difficulty}</span>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {problem.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}>{t}</span>
          ))}
        </div>
        {content?.intuition && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {content.intuition.split(".").slice(0, 2).join(".")}.
          </p>
        )}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-1.5 text-xs">Full statement on LeetCode</a>
          <button onClick={() => onUpdate({ solved: !review.solved })} className="px-3 py-1.5 text-xs rounded-lg transition-all"
            style={{ background: review.solved ? "var(--accent-soft)" : "var(--bg-hover)", color: review.solved ? "var(--accent-green)" : "var(--text-secondary)", border: "1px solid var(--border)" }}>
            {review.solved ? "✓ Solved" : "Mark solved"}
          </button>
          <button onClick={() => onUpdate({ solutionRevealed: true })} className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            Peeked at solution
          </button>
        </div>
      </div>

      {/* Interview checklist */}
      <div className="card p-4">
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>INTERVIEW CHECKLIST</div>
        <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
          {["Restate problem in own words", "Clarify constraints & edge cases", "Talk through brute force", "Identify pattern / optimization", "Solve on LeetCode", "State time & space complexity"].map((step) => (
            <div key={step} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <span style={{ color: "var(--accent)", fontSize: 10 }}>→</span> {step}
            </div>
          ))}
        </div>
        <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "rgba(255,161,22,0.1)", color: "#F5A524", border: "1px solid rgba(255,161,22,0.25)", textDecoration: "none" }}>
          Open on LeetCode ↗
        </a>
      </div>
    </div>
  );
}

function ReviewCard({ review, onUpdate }: { review: MockProblemReview; onUpdate: (patch: Partial<MockProblemReview>) => void }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{review.title}</h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{review.pattern} · {review.difficulty} · {fmt(review.timeSpentSecs)}</p>
        </div>
        <div className="text-lg font-bold" style={{ color: perProblemScore(review) >= 75 ? "#2FBF71" : perProblemScore(review) >= 50 ? "#F5A524" : "#EF4444" }}>
          {perProblemScore(review)}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <Check label="Correct solution" checked={review.solved} onChange={(v) => onUpdate({ solved: v })} />
        <Check label="Stated time/space complexity" checked={review.complexityStated} onChange={(v) => onUpdate({ complexityStated: v })} />
        <Check label="Considered edge cases" checked={review.edgeCasesConsidered} onChange={(v) => onUpdate({ edgeCasesConsidered: v })} />
        <Check label="Peeked at solution" checked={review.solutionRevealed} onChange={(v) => onUpdate({ solutionRevealed: v })} />
      </div>
      <label className="block text-xs mb-2" style={{ color: "var(--text-muted)" }}>Could I explain this clearly? {review.selfExplainScore}/5</label>
      <input type="range" min={1} max={5} value={review.selfExplainScore} onChange={(e) => onUpdate({ selfExplainScore: Number(e.target.value) })}
        className="w-full mb-4" />
      <textarea value={review.notes} onChange={(e) => onUpdate({ notes: e.target.value })}
        placeholder="What broke? Pattern miss, bug, edge case, complexity, communication..."
        rows={3}
        className="w-full rounded-xl text-sm p-3 resize-none outline-none"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
      />
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 cursor-pointer" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
