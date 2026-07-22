"use client";
import { useState, useRef, useEffect } from "react";

const NUMS = [1, 5, 11, 5];
const TOTAL = NUMS.reduce((a, b) => a + b, 0);
const TARGET = TOTAL / 2; // 11

// dp[j] = can we achieve sum j using subset of nums
const buildSteps = () => {
  const dp = Array(TARGET + 1).fill(false);
  dp[0] = true;
  const steps: { num: number; j: number; dp: boolean[] }[] = [];
  for (const num of NUMS) {
    for (let j = TARGET; j >= num; j--) {
      if (!dp[j] && dp[j - num]) {
        dp[j] = true;
        steps.push({ num, j, dp: [...dp] });
      }
    }
  }
  return { dp, steps };
};
const { dp: DP, steps: STEPS } = buildSteps();

export default function PartitionEqualSubsetViz() {
  const [step, setStep] = useState(-1);
  const [dp, setDp] = useState(Array(TARGET + 1).fill(false).map((_, i) => i === 0));
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState(`Partition [${NUMS.join(",")}] into 2 equal subsets. Target sum=${TARGET}.`);
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDp(Array(TARGET + 1).fill(false).map((_, i) => i === 0)); setDone(false); setPlaying(false);
    setMsg(`Partition [${NUMS.join(",")}] into 2 equal subsets. Target sum=${TARGET}.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) {
      setDone(true); setPlaying(false);
      setMsg(`dp[${TARGET}]=${DP[TARGET]} → ${DP[TARGET] ? "CAN partition equally! ✓" : "CANNOT ✗"}`); return;
    }
    const cur = STEPS[next];
    stateRef.current = { step: next };
    setStep(next); setDp([...cur.dp]);
    setMsg(`Num=${cur.num}: dp[${cur.j}] = dp[${cur.j}-${cur.num}]=dp[${cur.j-cur.num}] → TRUE (sum ${cur.j} achievable!)`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`dp[${TARGET}]=${DP[TARGET]} → ${DP[TARGET]?"Equal partition possible!":"Not possible"}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Partition Equal Subset Sum — 0/1 Knapsack DP</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Reduce to: can any subset sum = total/2? Use boolean DP array. Iterate backwards to avoid reuse.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-2 mb-3">
          {NUMS.map((v, i) => (
            <div key={i} className="px-3 py-2 rounded text-sm font-bold" style={{ background: cur?.num === v ? "rgba(249,115,22,0.2)" : "var(--bg-hover)", border: cur?.num === v ? "1px solid #f97316" : "1px solid var(--border)", color: "var(--text-secondary)" }}>{v}</div>
          ))}
          <div className="ml-auto text-xs flex items-center" style={{ color: "var(--text-muted)" }}>total={TOTAL}, target={TARGET}</div>
        </div>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>DP: can achieve sum [0..{TARGET}]</div>
        <div className="flex flex-wrap gap-1">
          {dp.map((v, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all" style={{
                background: i === TARGET && v ? "rgba(34,197,94,0.4)" : v ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.1)",
                border: cur?.j === i ? "2px solid #f97316" : i === TARGET ? "2px solid #22c55e" : "1px solid var(--border)",
                color: v ? "#22c55e" : "var(--text-muted)"
              }}>{v ? "T" : "F"}</div>
              <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{i}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
