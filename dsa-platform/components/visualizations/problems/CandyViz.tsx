"use client";
import { useState, useEffect, useRef } from "react";

const RATINGS = [1, 0, 2, 1, 3, 2, 1];

interface St { candy: number[]; phase: "left" | "right" | "done"; i: number; msg: string }

function buildSteps(): St[] {
  const steps: St[] = [];
  const n = RATINGS.length;
  const candy = new Array(n).fill(1);

  // Left pass
  for (let i = 1; i < n; i++) {
    if (RATINGS[i] > RATINGS[i - 1]) {
      candy[i] = candy[i - 1] + 1;
      steps.push({ candy: [...candy], phase: "left", i, msg: `Left pass i=${i}: rating[${i}]=${RATINGS[i]} > rating[${i-1}]=${RATINGS[i-1]} → candy[${i}] = candy[${i-1}]+1 = ${candy[i]}` });
    } else {
      steps.push({ candy: [...candy], phase: "left", i, msg: `Left pass i=${i}: rating[${i}]=${RATINGS[i]} ≤ rating[${i-1}]=${RATINGS[i-1]} → candy[${i}] stays 1` });
    }
  }

  // Right pass
  for (let i = n - 2; i >= 0; i--) {
    if (RATINGS[i] > RATINGS[i + 1]) {
      const newVal = Math.max(candy[i], candy[i + 1] + 1);
      const changed = newVal > candy[i];
      candy[i] = newVal;
      steps.push({ candy: [...candy], phase: "right", i, msg: `Right pass i=${i}: rating[${i}]=${RATINGS[i]} > rating[${i+1}]=${RATINGS[i+1]} → candy[${i}]=max(${changed ? candy[i]-1 : candy[i]}, candy[${i+1}]+1)=${candy[i]}` });
    } else {
      steps.push({ candy: [...candy], phase: "right", i, msg: `Right pass i=${i}: rating[${i}]=${RATINGS[i]} ≤ rating[${i+1}]=${RATINGS[i+1]} → candy[${i}] stays ${candy[i]}` });
    }
  }

  const total = candy.reduce((a, b) => a + b, 0);
  steps.push({ candy: [...candy], phase: "done", i: -1, msg: `Total = ${candy.join("+")} = ${total}` });
  return steps;
}

const STEPS = buildSteps();
const MAX_CANDY = Math.max(...STEPS[STEPS.length - 1].candy);

export default function CandyViz() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
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

  const phaseColor = cur.phase === "left" ? "#4f8ef7" : cur.phase === "right" ? "#a855f7" : "#22c55e";

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Candy — Two-Pass Greedy</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Left→right: uphill slopes get more. Right→left: downhill slopes get more. Max of both satisfies both neighbors.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={200} max={2000} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
          Phase: <span style={{ color: phaseColor }}>{cur.phase === "left" ? "LEFT PASS →" : cur.phase === "right" ? "← RIGHT PASS" : "DONE"}</span>
        </div>
        <div className="flex gap-3 items-end">
          {RATINGS.map((r, i) => {
            const isActive = i === cur.i;
            const c = cur.candy[i];
            const barH = MAX_CANDY > 0 ? (c / MAX_CANDY) * 80 : 20;
            return (
              <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                {/* candy bar */}
                <div className="flex flex-col-reverse items-center w-full" style={{ height: 100 }}>
                  {Array.from({ length: c }, (_, j) => (
                    <div key={j} style={{ width: "100%", height: 12, background: isActive ? phaseColor : j === 0 ? "rgba(79,142,247,0.4)" : "rgba(79,142,247,0.25)", marginBottom: 1, borderRadius: 2, transition: "all 0.2s" }} />
                  ))}
                </div>
                <span className="text-xs font-bold" style={{ color: isActive ? phaseColor : "#4f8ef7" }}>{c}</span>
                <div className="w-full h-8 rounded flex items-center justify-center text-xs font-bold"
                  style={{ background: isActive ? `${phaseColor}22` : "rgba(255,255,255,0.04)", border: `1px solid ${isActive ? phaseColor : "var(--border)"}`, color: isActive ? phaseColor : "var(--text-secondary)" }}>{r}</div>
                <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "9px" }}>[{i}]</span>
              </div>
            );
          })}
        </div>
        <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Bottom row = ratings, bars = candies</div>
      </div>

      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{cur.msg}</span>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-lg font-bold" style={{ color: "#22c55e" }}>Total Candies = {cur.candy.reduce((a, b) => a + b, 0)}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Distribution: [{cur.candy.join(", ")}]</div>
        </div>
      )}
    </div>
  );
}
