"use client";
import { useState, useEffect, useRef } from "react";

const INIT = [3, 4, -1, 1];

type Phase = "swap" | "scan" | "done";
interface St { nums: number[]; i: number; phase: Phase; swapping: boolean; answer: number; msg: string }

function buildSteps(init: number[]) {
  const steps: St[] = [];
  const nums = [...init];
  const n = nums.length;
  // swap phase
  let i = 0;
  while (i < n) {
    const x = nums[i];
    if (x > 0 && x <= n && nums[x - 1] !== x) {
      const tmp = nums[x - 1]; nums[x - 1] = nums[i]; nums[i] = tmp;
      steps.push({ nums: [...nums], i, phase: "swap", swapping: true, answer: -1, msg: `Swap: put ${x} at index ${x - 1}` });
    } else {
      steps.push({ nums: [...nums], i, phase: "swap", swapping: false, answer: -1, msg: `Skip index ${i}: ${x <= 0 || x > n ? "out of range" : "already in place"}` });
      i++;
    }
  }
  // scan phase
  for (let j = 0; j < n; j++) {
    const ok = nums[j] === j + 1;
    steps.push({ nums: [...nums], i: j, phase: "scan", swapping: false, answer: ok ? -1 : j + 1, msg: ok ? `Index ${j}: ${nums[j]} == ${j + 1} ✓` : `Index ${j}: ${nums[j]} ≠ ${j + 1} → answer = ${j + 1}` });
    if (!ok) { steps.push({ nums: [...nums], i: j, phase: "done", swapping: false, answer: j + 1, msg: `First missing positive = ${j + 1}` }); break; }
  }
  if (!steps.find(s => s.phase === "done")) steps.push({ nums: [...nums], i: n, phase: "done", swapping: false, answer: n + 1, msg: `All indices correct → answer = ${n + 1}` });
  return steps;
}

export default function FirstMissingPositiveViz() {
  const [input] = useState(INIT);
  const steps = buildSteps(input);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cur = steps[Math.min(idx, steps.length - 1)];
  const done = cur.phase === "done";

  const doStep = () => setIdx(p => { const n = Math.min(p + 1, steps.length - 1); if (n === steps.length - 1) setPlaying(false); return n; });
  const reset = () => { setIdx(0); setPlaying(false); };

  useEffect(() => {
    if (playing && !done) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed, done]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>First Missing Positive — Cyclic Sort</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Place each number x at index x-1. Then scan for first slot where nums[i] ≠ i+1.</div>
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
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
          Phase: <span style={{ color: cur.phase === "swap" ? "#a855f7" : cur.phase === "scan" ? "#f97316" : "#22c55e" }}>{cur.phase.toUpperCase()}</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {cur.nums.map((v, i) => {
            const correct = v === i + 1;
            const active = i === cur.i;
            const positive = v > 0 && v <= cur.nums.length;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: active ? "rgba(79,142,247,0.2)" : correct ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
                    border: `2px solid ${active ? "#4f8ef7" : correct ? "rgba(34,197,94,0.5)" : "var(--border)"}`,
                    color: active ? "#4f8ef7" : correct ? "#22c55e" : positive ? "#f97316" : "var(--text-muted)",
                    transform: active && cur.swapping ? "scale(1.1)" : "scale(1)",
                  }}>
                  {v}
                </div>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>[{i}]</span>
                <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "9px" }}>→{i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-mono" style={{ color: cur.phase === "done" ? "#22c55e" : "var(--text-secondary)" }}>{cur.msg}</div>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-lg font-bold" style={{ color: "#22c55e" }}>Answer: {cur.answer}</div>
        </div>
      )}
    </div>
  );
}
