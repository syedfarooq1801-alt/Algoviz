"use client";
import { useState, useRef, useEffect } from "react";

const GRID = [[1,3,1],[1,5,1],[4,2,1]];
const ROWS = GRID.length, COLS = GRID[0].length;
// dp[i][j] = min path sum to reach (i,j)
const buildDP = () => {
  const dp = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  const steps: { r: number; c: number; val: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const top = r > 0 ? dp[r-1][c] : Infinity;
      const left = c > 0 ? dp[r][c-1] : Infinity;
      if (r === 0 && c === 0) dp[r][c] = GRID[r][c];
      else if (r === 0) dp[r][c] = dp[r][c-1] + GRID[r][c];
      else if (c === 0) dp[r][c] = dp[r-1][c] + GRID[r][c];
      else dp[r][c] = Math.min(top, left) + GRID[r][c];
      steps.push({ r, c, val: dp[r][c] });
    }
  }
  return { dp, steps };
};
const { dp: DP, steps: STEPS } = buildDP();

export default function MinimumPathSumViz() {
  const [step, setStep] = useState(-1);
  const [dp, setDp] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]. Only move right/down.");
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDp(Array.from({ length: ROWS }, () => Array(COLS).fill(null))); setDone(false); setPlaying(false);
    setMsg("dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]. Only move right/down.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Min path sum = dp[${ROWS-1}][${COLS-1}] = ${DP[ROWS-1][COLS-1]}`); return; }
    const cur = STEPS[next];
    stateRef.current = { step: next };
    setStep(next);
    setDp(prev => {
      const newDp = prev.map(r => [...r]);
      newDp[cur.r][cur.c] = cur.val;
      return newDp;
    });
    const top = cur.r > 0 ? DP[cur.r-1][cur.c] : "∞";
    const left = cur.c > 0 ? DP[cur.r][cur.c-1] : "∞";
    setMsg(`dp[${cur.r}][${cur.c}] = min(${top},${left}) + ${GRID[cur.r][cur.c]} = ${cur.val}`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Min path sum = ${DP[ROWS-1][COLS-1]}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Minimum Path Sum — 2D DP</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Can only move right or down. Build DP table: min cost to reach each cell.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Grid</div>
          <div className="space-y-2">
            {GRID.map((row, r) => (
              <div key={r} className="flex gap-2">
                {row.map((v, c) => (
                  <div key={c} className="flex-1 py-2.5 rounded-lg text-center text-sm font-bold" style={{
                    background: cur?.r === r && cur?.c === c ? "rgba(249,115,22,0.3)" : "var(--bg-hover)",
                    border: cur?.r === r && cur?.c === c ? "2px solid #f97316" : (done && r === ROWS-1 && c === COLS-1) ? "2px solid #22c55e" : "1px solid var(--border)",
                    color: "var(--text-secondary)"
                  }}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>DP table</div>
          <div className="space-y-2">
            {dp.map((row, r) => (
              <div key={r} className="flex gap-2">
                {row.map((v, c) => (
                  <div key={c} className="flex-1 py-2.5 rounded-lg text-center text-sm font-bold transition-all" style={{
                    background: cur?.r === r && cur?.c === c ? "rgba(249,115,22,0.3)" : v !== null ? "rgba(34,197,94,0.15)" : "var(--bg-hover)",
                    border: done && r === ROWS-1 && c === COLS-1 ? "2px solid #22c55e" : "1px solid var(--border)",
                    color: done && r === ROWS-1 && c === COLS-1 ? "#22c55e" : v !== null ? "#4f8ef7" : "var(--text-muted)"
                  }}>{v !== null ? v : "?"}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
