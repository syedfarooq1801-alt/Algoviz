"use client";
import { useState, useRef, useEffect } from "react";

const NUMS = [2, 3, 2];
// House robber II: circular. Run DP on [0..n-2] and [1..n-1], take max.
const arr1 = NUMS.slice(0, NUMS.length - 1); // [2,3]
const arr2 = NUMS.slice(1); // [3,2]

function robLinear(arr: number[]): { max: number; steps: { i: number; prev2: number; prev1: number; cur: number }[] } {
  if (arr.length === 0) return { max: 0, steps: [] };
  let prev2 = 0, prev1 = 0;
  const steps: { i: number; prev2: number; prev1: number; cur: number }[] = [];
  for (let i = 0; i < arr.length; i++) {
    const cur = Math.max(prev1, prev2 + arr[i]);
    steps.push({ i, prev2, prev1, cur });
    prev2 = prev1; prev1 = cur;
  }
  return { max: prev1, steps };
}

const res1 = robLinear(arr1);
const res2 = robLinear(arr2);

export default function HouseRobberIIViz() {
  const [phase, setPhase] = useState(0); // 0=intro, 1=range1, 2=range2, 3=done
  const [dpStep, setDpStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Houses in circle. Can't rob first AND last. Split into 2 ranges.");
  const stateRef = useRef({ phase: 0, dpStep: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { phase: 0, dpStep: 0 };
    setPhase(0); setDpStep(0); setDone(false); setPlaying(false);
    setMsg("Houses in circle. Can't rob first AND last. Split into 2 ranges.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { phase: p, dpStep: ds } = stateRef.current;
    if (p === 0) {
      stateRef.current = { phase: 1, dpStep: 0 };
      setPhase(1); setDpStep(0);
      setMsg(`Range 1: [${arr1}] (houses 0..${NUMS.length-2}, skip last house)`);
    } else if (p === 1) {
      if (ds < res1.steps.length) {
        const s = res1.steps[ds];
        stateRef.current = { phase: 1, dpStep: ds + 1 };
        setDpStep(ds + 1);
        setMsg(`Range 1, house ${s.i}(val=${arr1[s.i]}): max(${s.prev1}, ${s.prev2}+${arr1[s.i]})=${s.cur}`);
      } else {
        stateRef.current = { phase: 2, dpStep: 0 };
        setPhase(2); setDpStep(0);
        setMsg(`Range 1 max=${res1.max}. Now Range 2: [${arr2}] (houses 1..${NUMS.length-1}, skip first)`);
      }
    } else if (p === 2) {
      if (ds < res2.steps.length) {
        const s = res2.steps[ds];
        stateRef.current = { phase: 2, dpStep: ds + 1 };
        setDpStep(ds + 1);
        setMsg(`Range 2, house ${s.i+1}(val=${arr2[s.i]}): max(${s.prev1}, ${s.prev2}+${arr2[s.i]})=${s.cur}`);
      } else {
        stateRef.current = { phase: 3, dpStep: 0 };
        setPhase(3); setDone(true); setPlaying(false);
        setMsg(`Answer = max(${res1.max}, ${res2.max}) = ${Math.max(res1.max, res2.max)}`);
      }
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>House Robber II — DP (Circular)</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Circular: first and last are neighbors. Solve twice: skip first, skip last. Take max.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Houses (circular): [{NUMS.join(", ")}]</div>
        <div className="flex gap-3 justify-center">
          {NUMS.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-base font-bold" style={{
                background: phase === 1 && i < NUMS.length - 1 ? "rgba(79,142,247,0.25)" : phase === 2 && i > 0 ? "rgba(249,115,22,0.25)" : "var(--bg-hover)",
                border: (phase === 1 && i === NUMS.length - 1) || (phase === 2 && i === 0) ? "2px dashed #ef4444" : "1px solid var(--border)",
                color: "var(--text-secondary)"
              }}>{v}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>H{i}</div>
              {(phase === 1 && i === NUMS.length - 1) && <div className="text-xs" style={{ color: "#ef4444" }}>skip</div>}
              {(phase === 2 && i === 0) && <div className="text-xs" style={{ color: "#ef4444" }}>skip</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-3" style={{ background: phase >= 1 ? "rgba(79,142,247,0.06)" : "var(--bg-card)", border: phase >= 1 ? "1px solid rgba(79,142,247,0.3)" : "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "#4f8ef7" }}>Range 1: [{arr1.join(",")}]</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Skip H{NUMS.length-1}</div>
          {phase >= 2 && <div className="text-lg font-bold mt-1" style={{ color: "#4f8ef7" }}>{res1.max}</div>}
        </div>
        <div className="rounded-xl p-3" style={{ background: phase >= 2 ? "rgba(249,115,22,0.06)" : "var(--bg-card)", border: phase >= 2 ? "1px solid rgba(249,115,22,0.3)" : "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "#f97316" }}>Range 2: [{arr2.join(",")}]</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Skip H0</div>
          {phase >= 3 && <div className="text-lg font-bold mt-1" style={{ color: "#f97316" }}>{res2.max}</div>}
        </div>
      </div>
      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>max({res1.max}, {res2.max})</div>
          <div className="text-3xl font-bold" style={{ color: "#22c55e" }}>{Math.max(res1.max, res2.max)}</div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
