"use client";
import { useState, useRef, useEffect } from "react";

const COST = [10, 15, 20];
// dp[i] = min cost to reach step i
// dp[0]=cost[0], dp[1]=cost[1]
// dp[i]=cost[i]+min(dp[i-1],dp[i-2])
// answer = min(dp[n-1],dp[n-2])

const buildDP = () => {
  const n = COST.length;
  const dp = [COST[0], COST[1]];
  const steps: { i: number; dp: number[] }[] = [{ i: 0, dp: [...dp] }];
  for (let i = 2; i < n; i++) {
    dp.push(COST[i] + Math.min(dp[i-1], dp[i-2]));
    steps.push({ i, dp: [...dp] });
  }
  return { dp, steps, answer: Math.min(dp[n-1], dp[n-2]) };
};
const { dp: DP, steps: STEPS, answer: ANSWER } = buildDP();

export default function MinCostClimbingViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Minimum cost to climb stairs [${COST.join(",")}]. Can take 1 or 2 steps.`);
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg(`Minimum cost to climb stairs [${COST.join(",")}]. Can take 1 or 2 steps.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Min cost = min(dp[${COST.length-1}]=${DP[COST.length-1]}, dp[${COST.length-2}]=${DP[COST.length-2]}) = ${ANSWER}`); return; }
    const cur = STEPS[next];
    stateRef.current = { step: next };
    setStep(next);
    setMsg(`dp[${cur.i}] = cost[${cur.i}](${COST[cur.i]}) + min(dp[${cur.i-1}]=${DP[cur.i-1]}, dp[${cur.i-2}]=${DP[cur.i-2]}) = ${DP[cur.i]}`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Answer = min(${DP[COST.length-1]}, ${DP[COST.length-2]}) = ${ANSWER}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const dpVisible = STEPS[step].dp;
  const maxH = Math.max(...COST);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Min Cost Climbing Stairs — 1D DP</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Can start from step 0 or 1.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 items-end mb-4" style={{ height: "80px" }}>
          {COST.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-xs font-bold" style={{ color: i === step ? "#f97316" : "var(--text-muted)" }}>{c}</div>
              <div className="w-full rounded-t" style={{ height: `${(c / maxH) * 55}px`, background: i === step ? "rgba(249,115,22,0.5)" : "rgba(79,142,247,0.25)", border: i === step ? "1px solid #f97316" : "1px solid rgba(79,142,247,0.4)" }} />
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>S{i}</div>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="text-xs font-bold" style={{ color: "#22c55e" }}>🏁</div>
            <div className="w-full" style={{ height: "4px", background: "#22c55e", marginBottom: "27px" }} />
            <div className="text-xs" style={{ color: "#22c55e" }}>Top</div>
          </div>
        </div>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>DP (min cost to reach each step)</div>
        <div className="flex gap-3">
          {dpVisible.map((v, i) => (
            <div key={i} className="flex-1 py-2 rounded-lg text-center text-sm font-bold" style={{
              background: i === step ? "rgba(249,115,22,0.25)" : "rgba(34,197,94,0.15)",
              border: i === step ? "2px solid #f97316" : "1px solid rgba(34,197,94,0.25)",
              color: i === step ? "#f97316" : "#22c55e"
            }}>{v}</div>
          ))}
        </div>
      </div>
      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Min cost to top</div>
          <div className="text-3xl font-bold" style={{ color: "#22c55e" }}>{ANSWER}</div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
