"use client";
import { useState, useRef, useEffect } from "react";

// nums=[1,2,3], multipliers=[3,2,1], k=3
// At each step pick from left or right of nums
const NUMS = [1,2,3];
const MULT = [3,2,1];
const K = 3;

// DP: dp[i][j] = max score using i multipliers, j from left (so right removes = i-j)
const buildSteps = () => {
  const dp: number[][] = Array.from({length:K+1}, () => Array(K+1).fill(0));
  const steps: {i:number,j:number,left:number,right:number,val:number,dp:number[][], msg:string}[] = [];
  steps.push({i:0,j:0,left:0,right:0,val:0,dp:dp.map(r=>[...r]),msg:"dp[i][j] = max score after i ops with j from left."});
  for (let i = K-1; i >= 0; i--) {
    for (let j = i; j >= 0; j--) {
      const right = i - j;
      const takeLeft = MULT[i] * NUMS[j] + dp[i+1][j+1];
      const takeRight = MULT[i] * NUMS[NUMS.length-1-right] + dp[i+1][j];
      dp[i][j] = Math.max(takeLeft, takeRight);
      steps.push({i,j,left:j,right,val:dp[i][j],dp:dp.map(r=>[...r]),msg:`dp[${i}][${j}]: take left=${NUMS[j]}*${MULT[i]}+dp[${i+1}][${j+1}]=${takeLeft} OR right=${NUMS[NUMS.length-1-right]}*${MULT[i]}+dp[${i+1}][${j}]=${takeRight} → max=${dp[i][j]}`});
    }
  }
  return {steps, answer: dp[0][0]};
};
const {steps:STEPS, answer:ANSWER} = buildDP();

function buildDP() { return buildSteps(); }

export default function MaxScoreMultiplicationViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState(`nums=[${NUMS}], mult=[${MULT}]. Pick from left or right each step.`);
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg(`nums=[${NUMS}], mult=[${MULT}]. Pick from left or right each step.`);
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Max score = ${ANSWER}`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Max score = ${ANSWER}`); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Maximum Score from Multiplications — 2D DP</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>dp[i][j]: i ops done, j from left. Try take-left vs take-right. Bottom-up.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>DP table (i=step, j=left picks)</div>
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <td className="w-8 h-6 text-center font-bold" style={{ color: "var(--text-muted)" }}>i\j</td>
              {Array.from({length:K+1},(_,j) => <td key={j} className="w-12 h-6 text-center font-bold" style={{ color: "var(--text-muted)" }}>{j}</td>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({length:K+1},(_,i) => (
              <tr key={i}>
                <td className="w-8 text-center font-bold" style={{ color: "var(--text-muted)" }}>{i}</td>
                {Array.from({length:K+1},(_,j) => {
                  const isActive = cur.i===i && cur.j===j;
                  const filled = cur.dp[i][j] !== 0 || (i===K);
                  return (
                    <td key={j} className="w-12 h-8 text-center rounded" style={{ background: isActive ? "rgba(249,115,22,0.4)" : filled ? "rgba(79,142,247,0.12)" : "transparent", border: isActive ? "2px solid #f97316" : "1px solid rgba(107,114,128,0.1)", color: isActive ? "#f97316" : filled ? "#4f8ef7" : "var(--text-muted)" }}>
                      {filled ? cur.dp[i][j] : "·"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {done && <div className="mt-2 text-lg font-bold" style={{ color: "#22c55e" }}>dp[0][0] = {ANSWER}</div>}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
