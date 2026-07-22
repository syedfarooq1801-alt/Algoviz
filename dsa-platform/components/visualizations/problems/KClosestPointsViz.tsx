"use client";
import { useState, useRef, useEffect } from "react";

const POINTS = [[1, 3], [-2, 2], [5, 8], [0, 1]];
const K = 2;
const dist = (p: number[]) => p[0] * p[0] + p[1] * p[1];

export default function KClosestPointsViz() {
  const [idx, setIdx] = useState(0);
  const [heap, setHeap] = useState<number[][]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Max-heap of size k=${K} by distance. Keep k closest to origin.`);
  const stateRef = useRef({ idx: 0, heap: [] as number[][] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pushHeap = (h: number[][], p: number[]): number[][] => {
    const newH = [...h, p].sort((a, b) => dist(b) - dist(a)); // max-heap by dist
    if (newH.length > K) newH.shift(); // remove farthest
    return newH;
  };

  const reset = () => {
    stateRef.current = { idx: 0, heap: [] };
    setIdx(0); setHeap([]); setDone(false); setPlaying(false);
    setMsg(`Max-heap of size k=${K} by distance. Keep k closest to origin.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, heap: h } = stateRef.current;
    if (i >= POINTS.length) {
      setDone(true); setPlaying(false);
      setMsg(`k closest: ${h.map(p => `[${p}]`).join(", ")}`); return;
    }
    const p = POINTS[i];
    const d = dist(p);
    const newH = pushHeap(h, p);
    let action = "";
    if (h.length < K) action = `[${p}] dist²=${d}: heap<${K}, add`;
    else if (d < dist(h[0])) action = `[${p}] dist²=${d} < max_dist²=${dist(h[0])}, replace farthest`;
    else action = `[${p}] dist²=${d} ≥ max_dist²=${dist(h[0])}, discard (too far)`;
    stateRef.current = { idx: i + 1, heap: newH };
    setIdx(i + 1); setHeap(newH); setMsg(action);
    if (i + 1 >= POINTS.length) { setDone(true); setPlaying(false); setMsg(`k=${K} closest: ${newH.map(p => `[${p}]`).join(", ")}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>K Closest Points to Origin — Max Heap</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Max-heap of size K. If new point closer than max, swap. Use x²+y² (no sqrt needed).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Coordinate plane</div>
          <svg width="200" height="200" viewBox="-10 -10 20 20" style={{ width: "100%", height: "auto", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }} role="img" aria-label="Scatter plot of points with k closest to origin highlighted">
            <line x1="-10" y1="0" x2="10" y2="0" stroke="rgba(107,114,128,0.4)" strokeWidth="0.3" />
            <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(107,114,128,0.4)" strokeWidth="0.3" />
            <circle cx="0" cy="0" r="0.5" fill="#22c55e" />
            {POINTS.map((p, i) => {
              const inHeap = heap.some(h => h[0] === p[0] && h[1] === p[1]);
              const isActive = i === idx - 1;
              return (
                <g key={i}>
                  <circle cx={p[0]} cy={-p[1]} r="0.7" fill={inHeap && done ? "rgba(34,197,94,0.8)" : inHeap ? "rgba(79,142,247,0.7)" : isActive ? "rgba(249,115,22,0.7)" : "rgba(107,114,128,0.4)"} stroke="none" />
                  <text x={p[0] + 0.4} y={-p[1] + 0.4} fill="white" fontSize="1.5">[{p[0]},{p[1]}]</text>
                </g>
              );
            })}
          </svg>
          <div className="mt-2 flex gap-3 text-xs">
            <span style={{ color: "#4f8ef7" }}>● in heap</span>
            <span style={{ color: "#22c55e" }}>● result</span>
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Points (dist²)</div>
          {POINTS.map((p, i) => {
            const d = dist(p);
            const inHeap = heap.some(h => h[0] === p[0] && h[1] === p[1]);
            const isActive = i === idx - 1;
            return (
              <div key={i} className="flex items-center gap-2 mb-1 px-2 py-1.5 rounded text-xs" style={{ background: isActive ? "rgba(249,115,22,0.1)" : inHeap ? "rgba(79,142,247,0.1)" : "transparent", border: isActive ? "1px solid rgba(249,115,22,0.3)" : "1px solid transparent" }}>
                <span style={{ color: inHeap ? "#4f8ef7" : "var(--text-muted)" }}>[{p[0]},{p[1]}]</span>
                <span style={{ color: "var(--text-muted)" }}>dist²={d}</span>
                {inHeap && <span style={{ color: "#4f8ef7" }}>✓ kept</span>}
              </div>
            );
          })}
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Heap (max by dist)</div>
            {heap.map((p, i) => (
              <div key={i} className="text-xs px-2 py-1 rounded mb-1" style={{ background: i === 0 ? "rgba(239,68,68,0.15)" : "rgba(79,142,247,0.1)", color: i === 0 ? "#ef4444" : "#4f8ef7" }}>
                [{p[0]},{p[1]}] d²={dist(p)} {i === 0 ? "← max" : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
