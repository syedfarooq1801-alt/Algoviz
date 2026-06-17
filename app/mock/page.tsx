"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import CodeRunner from "@/components/CodeRunner";
import { PATTERNS, Problem } from "@/data/problems";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { useProgressStore } from "@/lib/store";

type Phase = "setup" | "running" | "done";

const DURATIONS = [
  { label: "30 min", mins: 30, count: 1 },
  { label: "45 min", mins: 45, count: 2 },
  { label: "60 min", mins: 60, count: 2 },
] as const;

const DIFFS = ["Any", "Easy", "Medium", "Hard"] as const;
type DiffFilter = typeof DIFFS[number];

function pickProblems(count: number, diff: DiffFilter): Problem[] {
  let pool = PATTERNS.flatMap((p) => p.problems);
  if (diff !== "Any") pool = pool.filter((p) => p.difficulty === diff);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function fmt(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function MockPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [config, setConfig] = useState<{ mins: number; count: number }>({ mins: 45, count: 2 });
  const [diff, setDiff] = useState<DiffFilter>("Medium");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [active, setActive] = useState(0);
  const [secsLeft, setSecsLeft] = useState(0);
  const [solvedFlags, setSolvedFlags] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const { toggleSolved, isSolved } = useProgressStore();

  const start = useCallback((mins: number, count: number) => {
    const picked = pickProblems(count, diff);
    setProblems(picked);
    setConfig({ mins, count });
    setSecsLeft(mins * 60);
    setActive(0);
    setSolvedFlags({});
    setRevealed({});
    setPhase("running");
  }, [diff]);

  // Timer
  useEffect(() => {
    if (phase !== "running") return;
    if (secsLeft <= 0) { setPhase("done"); return; }
    const t = setTimeout(() => setSecsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secsLeft]);

  const finish = () => setPhase("done");

  const markSolved = (p: Problem) => {
    setSolvedFlags((f) => ({ ...f, [p.id]: !f[p.id] }));
  };

  const solvedCount = useMemo(() => Object.values(solvedFlags).filter(Boolean).length, [solvedFlags]);
  const lowTime = secsLeft <= 300 && secsLeft > 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {phase === "setup" && (
          <div>
            <Link href="/" className="text-xs" style={{ color: "var(--text-muted)" }}>← Home</Link>
            <h1 className="text-2xl font-bold mt-3 mb-1" style={{ color: "var(--text-primary)" }}>Mock Interview</h1>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              A timed session with no hints. Solve under pressure — this is what builds real interview muscle.
            </p>

            <div className="card p-6 mb-5">
              <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>DIFFICULTY</div>
              <div className="flex gap-2 mb-6 flex-wrap">
                {DIFFS.map((d) => (
                  <button key={d} onClick={() => setDiff(d)}
                    className="px-3.5 py-1.5 rounded-lg text-sm transition-all"
                    style={{
                      background: diff === d ? "var(--accent-soft)" : "var(--bg-hover)",
                      color: diff === d ? "var(--accent)" : "var(--text-secondary)",
                      border: `1px solid ${diff === d ? "rgba(91,140,255,0.35)" : "var(--border)"}`,
                    }}>
                    {d}
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>SESSION LENGTH</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {DURATIONS.map((d) => (
                  <button key={d.label} onClick={() => start(d.mins, d.count)}
                    className="card card-hover p-5 text-left">
                    <div className="text-lg font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>{d.label}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{d.count} problem{d.count > 1 ? "s" : ""}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === "running" && problems[active] && (
          <div>
            {/* Timer bar */}
            <div className="flex items-center justify-between mb-5 sticky top-16 z-10 card px-4 py-3"
              style={{ borderColor: lowTime ? "rgba(240,82,75,0.4)" : "var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold font-mono tabular-nums"
                  style={{ color: lowTime ? "var(--accent-red)" : "var(--text-primary)" }}>
                  {fmt(secsLeft)}
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{solvedCount}/{problems.length} marked solved</span>
              </div>
              <div className="flex items-center gap-2">
                {problems.map((p, i) => (
                  <button key={p.id} onClick={() => setActive(i)}
                    className="w-7 h-7 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: i === active ? "var(--accent)" : solvedFlags[p.id] ? "var(--accent-soft)" : "var(--bg-hover)",
                      color: i === active ? "#fff" : solvedFlags[p.id] ? "var(--accent-green)" : "var(--text-muted)",
                      border: "1px solid var(--border)",
                    }}>
                    {solvedFlags[p.id] ? "✓" : i + 1}
                  </button>
                ))}
                <button onClick={finish} className="btn-ghost px-3 py-1.5 text-xs ml-2">End</button>
              </div>
            </div>

            {/* Problem */}
            <ProblemPrompt
              problem={problems[active]}
              revealed={!!revealed[problems[active].id]}
              onReveal={() => setRevealed((r) => ({ ...r, [problems[active].id]: true }))}
              solved={!!solvedFlags[problems[active].id]}
              onToggleSolved={() => markSolved(problems[active])}
            />
          </div>
        )}

        {phase === "done" && (
          <div className="max-w-lg mx-auto text-center py-10">
            <div className="text-5xl mb-4">{solvedCount === problems.length ? "🏆" : solvedCount > 0 ? "💪" : "📘"}</div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              {solvedCount}/{problems.length} solved
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              {config.mins} min session · {DIFFS.includes(diff) ? diff : "mixed"} difficulty
            </p>

            <div className="card p-4 mb-6 text-left">
              {problems.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <Link href={`/problems/${p.id}`} className="text-sm hover:underline" style={{ color: "var(--text-primary)" }}>{p.title}</Link>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{
                      color: p.difficulty === "Easy" ? "var(--accent-green)" : p.difficulty === "Medium" ? "var(--accent-orange)" : "var(--accent-red)"
                    }}>{p.difficulty}</span>
                    {solvedFlags[p.id] && !isSolved(p.id) && (
                      <button onClick={() => toggleSolved(p.id)} className="text-xs" style={{ color: "var(--accent)" }}>Save as solved</button>
                    )}
                    <span style={{ color: solvedFlags[p.id] ? "var(--accent-green)" : "var(--text-muted)" }}>{solvedFlags[p.id] ? "✓" : "—"}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setPhase("setup")} className="btn-primary px-5 py-2.5 text-sm">New Session</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProblemPrompt({ problem, revealed, onReveal, solved, onToggleSolved }: {
  problem: Problem; revealed: boolean; onReveal: () => void; solved: boolean; onToggleSolved: () => void;
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
        <div className="flex items-center gap-2 mt-4">
          <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-1.5 text-xs">Full statement on LeetCode ↗</a>
          <button onClick={onToggleSolved} className="px-3 py-1.5 text-xs rounded-lg transition-all"
            style={{ background: solved ? "var(--accent-soft)" : "var(--bg-hover)", color: solved ? "var(--accent-green)" : "var(--text-secondary)", border: "1px solid var(--border)" }}>
            {solved ? "✓ Marked solved" : "Mark solved"}
          </button>
        </div>
      </div>

      <CodeRunner defaultLang="python"
        starterPython={`# ${problem.title}\n# Solve it yourself — no hints during the clock.\n\n`}
        starterCpp={`// ${problem.title}\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}`}
      />

      {/* Solution locked behind explicit reveal */}
      <div className="card p-4">
        {revealed ? (
          <pre className="m-0" style={{ background: "transparent", border: "none", padding: 0 }}>
            <code>{content?.pythonSolution ?? content?.cppSolution ?? "No solution available."}</code>
          </pre>
        ) : (
          <button onClick={onReveal} className="w-full text-center text-sm py-2" style={{ color: "var(--text-muted)" }}>
            🔒 Reveal solution (try not to — solve it first)
          </button>
        )}
      </div>
    </div>
  );
}
