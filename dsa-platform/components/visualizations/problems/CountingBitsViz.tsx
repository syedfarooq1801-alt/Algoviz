"use client";
import { useState, useEffect, useRef } from "react";

const N = 8;

const toBin = (n: number) => n.toString(2).padStart(4, "0");

// Precompute full dp array
const FULL_DP = Array.from({ length: N + 1 }, (_, i) => {
  const bits: number[] = [0];
  for (let j = 1; j <= i; j++) bits[j] = bits[j >> 1] + (j & 1);
  return bits[i];
});

export default function CountingBitsViz() {
  const [current, setCurrent] = useState(0); // index being processed (0-based, step = index+1 processed)
  const [dp, setDp] = useState<number[]>([0]); // built so far
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const stateRef = useRef({ current: 0, dp: [0] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { current: 0, dp: [0] };
    setCurrent(0);
    setDp([0]);
    setDone(false);
    setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { current: c, dp: d } = stateRef.current;
    if (c >= N) {
      setDone(true);
      setPlaying(false);
      return;
    }
    const next = c + 1;
    const newDp = [...d, d[next >> 1] + (next & 1)];
    stateRef.current = { current: next, dp: newDp };
    setCurrent(next);
    setDp(newDp);
    if (next >= N) {
      setDone(true);
      setPlaying(false);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Counting Bits — DP Recurrence</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          bits[i] = bits[i&gt;&gt;1] + (i&amp;1) — right-shift drops LSB, already computed; add LSB of i.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="2000" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>

      {/* DP array visual */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>dp[ ] — bit counts built so far</div>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: N + 1 }, (_, i) => {
            const isActive = i === current && !done;
            const computed = i < dp.length;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{i}</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: isActive ? "rgba(79,142,247,0.3)" : computed ? "rgba(34,197,94,0.15)" : "var(--bg-hover)",
                    border: isActive ? "2px solid #4f8ef7" : computed ? "1px solid rgba(34,197,94,0.4)" : "1px solid var(--border)",
                    color: isActive ? "#4f8ef7" : computed ? "#22c55e" : "var(--text-muted)",
                    transform: isActive ? "scale(1.12)" : "scale(1)"
                  }}>
                  {computed ? dp[i] : "·"}
                </div>
                <div style={{ fontSize: "8px", color: "var(--text-muted)", fontFamily: "monospace" }}>{toBin(i)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step detail */}
      {current > 0 && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Current step: i = {current}</div>
          <div className="font-mono text-xs space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ color: "var(--text-muted)" }}>i =</span>
              <span className="px-2 py-0.5 rounded" style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7" }}>{current} ({toBin(current)})</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ color: "var(--text-muted)" }}>i &gt;&gt; 1 =</span>
              <span className="px-2 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>{current >> 1} ({toBin(current >> 1)})</span>
              <span style={{ color: "var(--text-muted)" }}>→ dp[{current >> 1}] =</span>
              <span style={{ color: "#a855f7", fontWeight: "bold" }}>{dp[current >> 1]}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ color: "var(--text-muted)" }}>i &amp; 1 (LSB) =</span>
              <span className="px-2 py-0.5 rounded" style={{ background: current & 1 ? "rgba(249,115,22,0.15)" : "rgba(107,114,128,0.15)", color: current & 1 ? "#f97316" : "#6b7280" }}>
                {current & 1}
              </span>
            </div>
            <div className="flex items-center gap-3 px-3 py-1.5 rounded" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <span style={{ color: "var(--text-muted)" }}>dp[{current}] =</span>
              <span style={{ color: "#a855f7" }}>{dp[current >> 1]}</span>
              <span style={{ color: "var(--text-muted)" }}>+</span>
              <span style={{ color: "#f97316" }}>{current & 1}</span>
              <span style={{ color: "var(--text-muted)" }}>=</span>
              <span style={{ color: "#22c55e", fontWeight: "bold", fontSize: "14px" }}>{dp[current]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Full table */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>DP table</div>
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "11px", fontFamily: "monospace" }}>
            <thead>
              <tr>
                {["i", "binary", "dp[i>>1]", "LSB", "bits[i]"].map(h => (
                  <th key={h} style={{ padding: "4px 8px", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: N + 1 }, (_, i) => {
                const computed = i < dp.length;
                const isActive = i === current && !done;
                return (
                  <tr key={i} style={{ background: isActive ? "rgba(79,142,247,0.08)" : "transparent" }}>
                    <td style={{ padding: "3px 8px", color: isActive ? "#4f8ef7" : "var(--text-secondary)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{i}</td>
                    <td style={{ padding: "3px 8px", color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{toBin(i)}</td>
                    <td style={{ padding: "3px 8px", color: computed ? "#a855f7" : "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {computed ? `dp[${i >> 1}]=${dp[i >> 1] ?? "·"}` : "·"}
                    </td>
                    <td style={{ padding: "3px 8px", color: (i & 1) ? "#f97316" : "#6b7280", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {i & 1}
                    </td>
                    <td style={{ padding: "3px 8px", fontWeight: 600, color: computed ? "#22c55e" : "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {computed ? dp[i] : "·"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>
            Result: [{dp.join(", ")}]
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Each computed in O(1) using dp[i&gt;&gt;1] + (i&amp;1)</div>
        </div>
      )}
    </div>
  );
}
