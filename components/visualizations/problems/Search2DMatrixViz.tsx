"use client";
import { useState, useEffect, useRef } from "react";

const MATRIX = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];
const TARGET = 3;

export default function Search2DMatrixViz() {
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(MATRIX.length * MATRIX[0].length - 1);
  const [mid, setMid] = useState(-1);
  const [done, setDone] = useState(false);
  const [found, setFound] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState(`Search for ${TARGET} in matrix. Treat as flat sorted array.`);
  const stateRef = useRef({ lo: 0, hi: MATRIX.length * MATRIX[0].length - 1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cols = MATRIX[0].length;

  const getVal = (idx: number) => MATRIX[Math.floor(idx / cols)][idx % cols];
  const idxToRC = (idx: number) => [Math.floor(idx / cols), idx % cols];

  const reset = () => {
    const total = MATRIX.length * cols - 1;
    stateRef.current = { lo: 0, hi: total };
    setLo(0); setHi(total); setMid(-1); setDone(false); setFound(false); setPlaying(false);
    setMsg(`Search for ${TARGET} in matrix. Treat as flat sorted array.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { lo: l, hi: h } = stateRef.current;
    if (l > h) { setDone(true); setPlaying(false); setMsg(`${TARGET} not found`); return; }
    const m = Math.floor((l + h) / 2);
    const val = getVal(m);
    const [r, c] = idxToRC(m);
    setMid(m);
    if (val === TARGET) {
      setDone(true); setFound(true); setPlaying(false);
      setMsg(`Found ${TARGET} at matrix[${r}][${c}] (flat idx ${m})`);
    } else if (val < TARGET) {
      stateRef.current = { lo: m + 1, hi: h };
      setLo(m + 1); setMsg(`matrix[${r}][${c}]=${val} < ${TARGET} → lo=${m + 1}`);
    } else {
      stateRef.current = { lo: l, hi: m - 1 };
      setHi(m - 1); setMsg(`matrix[${r}][${c}]=${val} > ${TARGET} → hi=${m - 1}`);
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const [mr, mc] = mid >= 0 ? idxToRC(mid) : [-1, -1];
  const total = MATRIX.length * cols;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Search a 2D Matrix — Binary Search</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Map flat index to (row,col). Treat entire matrix as one sorted array.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Matrix (target={TARGET})</div>
        <div className="space-y-2">
          {MATRIX.map((row, ri) => (
            <div key={ri} className="flex gap-2">
              {row.map((v, ci) => {
                const flatIdx = ri * cols + ci;
                const isSearch = flatIdx >= lo && flatIdx <= hi;
                const isMid = ri === mr && ci === mc;
                const isFound = found && v === TARGET;
                return (
                  <div key={ci} className="flex-1 py-2 rounded-lg text-center text-sm font-bold transition-all" style={{
                    background: isFound ? "rgba(34,197,94,0.3)" : isMid ? "rgba(249,115,22,0.3)" : isSearch ? "rgba(79,142,247,0.15)" : "rgba(107,114,128,0.1)",
                    border: isFound ? "2px solid #22c55e" : isMid ? "2px solid #f97316" : isSearch ? "1px solid rgba(79,142,247,0.4)" : "1px solid var(--border)",
                    color: isFound ? "#22c55e" : isMid ? "#f97316" : isSearch ? "#4f8ef7" : "var(--text-muted)"
                  }}>
                    {v}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Flat view (indices 0..{total - 1})</div>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className="w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-all" style={{
              background: i === mid ? "rgba(249,115,22,0.3)" : i >= lo && i <= hi ? "rgba(79,142,247,0.2)" : "rgba(107,114,128,0.1)",
              border: i === mid ? "1px solid #f97316" : "1px solid transparent",
              color: i === mid ? "#f97316" : i >= lo && i <= hi ? "#4f8ef7" : "var(--text-muted)"
            }}>
              {getVal(i)}
            </div>
          ))}
        </div>
        <div className="flex gap-4 text-xs mt-2">
          <span style={{ color: "#22c55e" }}>lo={lo}</span>
          <span style={{ color: "#a855f7" }}>hi={hi}</span>
          {mid >= 0 && <span style={{ color: "#f97316" }}>mid={mid}</span>}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? (found ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)") : "rgba(79,142,247,0.07)", color: done ? (found ? "#22c55e" : "#ef4444") : "#4f8ef7", border: `1px solid ${done ? (found ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
