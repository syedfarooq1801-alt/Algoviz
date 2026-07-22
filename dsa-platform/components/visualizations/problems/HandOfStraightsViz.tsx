"use client";
import { useState, useRef, useEffect } from "react";

const HAND = [1,2,3,6,2,3,4,7,8];
const GROUP_SIZE = 3;
// Sort and group into consecutive sequences

const buildSteps = () => {
  const freq: Map<number,number> = new Map();
  const sorted = [...HAND].sort((a,b)=>a-b);
  sorted.forEach(v => freq.set(v, (freq.get(v)||0)+1));
  const steps: { action: string; groupFormed: number[]; freq: [number,number][] }[] = [];
  const keys = [...freq.keys()].sort((a,b)=>a-b);
  const fCopy = new Map(freq);
  for (const k of keys) {
    if (!fCopy.get(k)) continue;
    const count = fCopy.get(k)!;
    const group: number[] = [];
    for (let i = 0; i < GROUP_SIZE; i++) {
      const needed = fCopy.get(k+i) || 0;
      if (needed < count) { steps.push({ action: `FAIL: not enough ${k+i}`, groupFormed: [], freq: [...fCopy] }); return { steps, valid: false }; }
      fCopy.set(k+i, needed - count);
      for (let c = 0; c < count; c++) group.push(k+i);
    }
    steps.push({ action: `Form ${count} group(s) of [${group.slice(0,GROUP_SIZE).join(",")}]`, groupFormed: group, freq: [...fCopy] });
  }
  return { steps, valid: true };
};
const { steps: STEPS, valid: VALID } = buildSteps();

export default function HandOfStraightsViz() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Can [${HAND.sort().join(",")}] be rearranged into groups of ${GROUP_SIZE} consecutive?`);
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDone(false); setPlaying(false);
    setMsg(`Can [${[...HAND].sort((a,b)=>a-b).join(",")}] form groups of ${GROUP_SIZE} consecutive?`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`${VALID ? "YES — all groups formed! ✓" : "NO — cannot form groups ✗"}`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].action);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`${VALID ? "TRUE — all cards form valid groups ✓" : "FALSE ✗"}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const sorted = [...HAND].sort((a,b)=>a-b);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Hand of Straights — Greedy + Sorting</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Sort cards. Always start new group from smallest available. Use freq map.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Hand (sorted), groupSize={GROUP_SIZE}</div>
        <div className="flex gap-2 flex-wrap mb-3">
          {sorted.map((v, i) => (
            <div key={i} className="w-8 h-8 rounded text-xs flex items-center justify-center font-bold" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{v}</div>
          ))}
        </div>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Groups formed</div>
        <div className="space-y-1">
          {STEPS.slice(0, step + 1).map((s, i) => (
            <div key={i} className="flex gap-2 items-center text-xs px-3 py-1.5 rounded" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <span style={{ color: "#22c55e" }}>✓</span>
              <span style={{ color: "var(--text-secondary)" }}>{s.action}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? (VALID ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)") : "rgba(79,142,247,0.07)", color: done ? (VALID ? "#22c55e" : "#ef4444") : "#4f8ef7", border: `1px solid ${done ? (VALID ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
