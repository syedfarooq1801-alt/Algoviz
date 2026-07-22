"use client";
import { useState, useEffect, useRef } from "react";

const MATRIX = [
  ["1","0","1","0","0"],
  ["1","0","1","1","1"],
  ["1","1","1","1","1"],
  ["1","0","0","1","0"],
];
const M = MATRIX.length, N = MATRIX[0].length;

interface St { heights: number[]; row: number; maxArea: number; histStep: number; stack: number[]; rectL: number; rectR: number; rectH: number; msg: string }

function buildSteps(): St[] {
  const steps: St[] = [];
  const heights = new Array(N).fill(0);
  let maxArea = 0;

  for (let r = 0; r < M; r++) {
    for (let j = 0; j < N; j++) heights[j] = MATRIX[r][j] === "1" ? heights[j] + 1 : 0;
    steps.push({ heights: [...heights], row: r, maxArea, histStep: -1, stack: [], rectL: -1, rectR: -1, rectH: -1, msg: `Row ${r}: update heights` });

    // histogram scan
    const h = [...heights, 0];
    const stk: number[] = [];
    for (let i = 0; i <= N; i++) {
      while (stk.length && h[stk[stk.length - 1]] > h[i]) {
        const hi = h[stk.pop()!];
        const w = stk.length === 0 ? i : i - stk[stk.length - 1] - 1;
        const area = hi * w;
        const l = stk.length === 0 ? 0 : stk[stk.length - 1] + 1;
        if (area > maxArea) maxArea = area;
        steps.push({ heights: [...heights], row: r, maxArea, histStep: i, stack: [...stk], rectL: l, rectR: i - 1, rectH: hi, msg: `Pop h=${hi}, width=${w}, area=${area}${area === maxArea ? " ← new max!" : ""}` });
      }
      stk.push(i);
    }
  }
  return steps;
}

const STEPS = buildSteps();

export default function MaximalRectangleViz() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = idx >= STEPS.length;
  const cur = STEPS[Math.min(idx, STEPS.length - 1)];

  const doStep = () => setIdx(p => { const n = Math.min(p + 1, STEPS.length); if (n >= STEPS.length) setPlaying(false); return n; });
  const reset = () => { setIdx(0); setPlaying(false); };

  useEffect(() => {
    if (playing && !done) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed, done]);

  const maxH = Math.max(...cur.heights, 1);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Maximal Rectangle — Histogram per Row</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Each row = histogram heights. Run largest-rectangle-in-histogram on each row.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={200} max={2000} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Matrix (current row highlighted)</div>
        <div className="space-y-1">
          {MATRIX.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((cell, c) => (
                <div key={c} className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                  style={{
                    background: r === cur.row ? (cell === "1" ? "rgba(79,142,247,0.3)" : "rgba(239,68,68,0.15)") : cell === "1" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${r === cur.row ? (cell === "1" ? "#4f8ef7" : "#ef4444") : "var(--border)"}`,
                    color: cell === "1" ? "var(--text-primary)" : "var(--text-muted)"
                  }}>{cell}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Heights histogram for row {cur.row}</div>
        <div className="flex gap-2 items-end" style={{ height: 80 }}>
          {cur.heights.map((h, i) => {
            const inRect = cur.rectL >= 0 && i >= cur.rectL && i <= cur.rectR;
            const barH = maxH > 0 ? (h / maxH) * 70 : 0;
            return (
              <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)", fontSize: "9px" }}>{h}</span>
                <div style={{ height: Math.max(barH, h > 0 ? 4 : 0), background: inRect ? "rgba(34,197,94,0.6)" : "rgba(79,142,247,0.5)", borderRadius: "3px 3px 0 0", width: "100%", border: inRect ? "1px solid #22c55e" : "none" }} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{cur.msg}</span>
        <span className="text-sm font-bold" style={{ color: "#22c55e" }}>Max: {cur.maxArea}</span>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-lg font-bold" style={{ color: "#22c55e" }}>Maximal Rectangle Area = {STEPS[STEPS.length - 1].maxArea}</div>
        </div>
      )}
    </div>
  );
}
