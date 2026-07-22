"use client";
import { useState, useEffect, useRef } from "react";

const MAX = 16;

const isPow2 = (n: number) => n > 0 && (n & (n - 1)) === 0;
const toBin = (n: number, bits = 5) => n.toString(2).padStart(bits, "0");

export default function PowerOfTwoViz() {
  const [current, setCurrent] = useState(0); // 0 = not started; 1..MAX = currently inspecting this number
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const stateRef = useRef({ current: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { current: 0 };
    setCurrent(0);
    setDone(false);
    setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { current: c } = stateRef.current;
    if (c >= MAX) {
      setDone(true);
      setPlaying(false);
      return;
    }
    const nc = c + 1;
    stateRef.current = { current: nc };
    setCurrent(nc);
    if (nc >= MAX) {
      setDone(true);
      setPlaying(false);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const n = current;
  const nm1 = n - 1;
  const andResult = n > 0 ? n & nm1 : null;
  const pow2 = n > 0 ? isPow2(n) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Power of Two — Bit Trick</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          n &amp; (n−1) clears the lowest set bit. Powers of 2 have exactly one set bit → result is always 0.
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

      {/* Powers of 2 reference */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Powers of 2 in range 1..16</div>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 4, 8, 16].map(v => (
            <div key={v} className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#22c55e" }}>
                {v}
              </div>
              <span style={{ fontSize: "8px", color: "#22c55e", fontFamily: "monospace" }}>{toBin(v)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Number grid */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Numbers 1..16</div>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: MAX }, (_, i) => {
            const num = i + 1;
            const isP2 = isPow2(num);
            const isCur = num === current;
            const visited = num < current || (num === current);
            return (
              <div key={num} className="flex flex-col items-center gap-0.5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: isCur
                      ? (isP2 ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)")
                      : visited
                        ? (isP2 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.08)")
                        : "var(--bg-hover)",
                    border: isCur
                      ? `2px solid ${isP2 ? "#22c55e" : "#ef4444"}`
                      : visited
                        ? `1px solid ${isP2 ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.2)"}`
                        : "1px solid var(--border)",
                    color: isCur
                      ? (isP2 ? "#22c55e" : "#ef4444")
                      : visited
                        ? (isP2 ? "#22c55e" : "#ef4444")
                        : "var(--text-muted)",
                    transform: isCur ? "scale(1.12)" : "scale(1)"
                  }}>
                  {num}
                </div>
                {visited && (
                  <span style={{ fontSize: "8px", fontFamily: "monospace", color: isP2 ? "#22c55e" : "#ef4444" }}>
                    {isP2 ? "✓" : "✗"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bit trick detail for current number */}
      {n > 0 && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
            Bit trick: n={n}, n−1={nm1}
          </div>
          <div className="font-mono text-xs space-y-2">
            {/* n row */}
            <div className="flex items-center gap-2">
              <span style={{ width: "60px", color: "var(--text-muted)" }}>n = {n}</span>
              <div className="flex gap-0.5">
                {toBin(n).split("").map((b, i) => (
                  <div key={i} className="w-7 h-7 rounded flex items-center justify-center font-bold"
                    style={{ background: b === "1" ? "rgba(79,142,247,0.25)" : "var(--bg-hover)", border: b === "1" ? "1px solid rgba(79,142,247,0.5)" : "1px solid var(--border)", color: b === "1" ? "#4f8ef7" : "var(--text-muted)" }}>
                    {b}
                  </div>
                ))}
              </div>
            </div>
            {/* n-1 row */}
            <div className="flex items-center gap-2">
              <span style={{ width: "60px", color: "var(--text-muted)" }}>n−1 = {nm1}</span>
              <div className="flex gap-0.5">
                {toBin(nm1).split("").map((b, i) => (
                  <div key={i} className="w-7 h-7 rounded flex items-center justify-center font-bold"
                    style={{ background: b === "1" ? "rgba(168,85,247,0.2)" : "var(--bg-hover)", border: b === "1" ? "1px solid rgba(168,85,247,0.4)" : "1px solid var(--border)", color: b === "1" ? "#a855f7" : "var(--text-muted)" }}>
                    {b}
                  </div>
                ))}
              </div>
            </div>
            {/* divider */}
            <div style={{ borderTop: "1px solid var(--border)", marginLeft: "68px", width: "calc(100% - 68px)" }} />
            {/* AND result */}
            <div className="flex items-center gap-2">
              <span style={{ width: "60px", color: "var(--text-muted)" }}>n &amp; n−1</span>
              <div className="flex gap-0.5">
                {andResult !== null && toBin(andResult).split("").map((b, i) => (
                  <div key={i} className="w-7 h-7 rounded flex items-center justify-center font-bold"
                    style={{ background: b === "1" ? "rgba(249,115,22,0.2)" : "rgba(34,197,94,0.08)", border: b === "1" ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(34,197,94,0.3)", color: b === "1" ? "#f97316" : "#22c55e" }}>
                    {b}
                  </div>
                ))}
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold"
                style={{ background: pow2 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: pow2 ? "#22c55e" : "#ef4444", border: `1px solid ${pow2 ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}` }}>
                = {andResult} → {pow2 ? "Power of 2 ✓" : "Not power of 2 ✗"}
              </span>
            </div>
          </div>
          {/* Insight */}
          <div className="mt-3 text-xs px-3 py-2 rounded" style={{ background: pow2 ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", color: "var(--text-muted)", border: `1px solid ${pow2 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}` }}>
            {pow2
              ? `${n} has exactly one set bit. n−1 flips all lower bits. AND = 0. → isPowerOfTwo(${n}) = true`
              : `${n} has multiple set bits. n−1 only clears the lowest. AND ≠ 0. → isPowerOfTwo(${n}) = false`}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="rounded-xl px-4 py-3 flex gap-4 flex-wrap" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {[
          { color: "#22c55e", label: "power of 2" },
          { color: "#ef4444", label: "not power of 2" },
          { color: "#4f8ef7", label: "bits of n" },
          { color: "#a855f7", label: "bits of n−1" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <div className="w-3 h-3 rounded" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>
            Powers of 2 in 1..16: {[1, 2, 4, 8, 16].join(", ")}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Trick: n &gt; 0 &amp;&amp; (n &amp; (n−1)) === 0 — O(1) check, no loops needed
          </div>
        </div>
      )}
    </div>
  );
}
