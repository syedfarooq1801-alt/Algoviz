"use client";
import { useState, useRef, useEffect } from "react";

// s="rabbbit", t="rabbit"  → 3
const S = "rabbbit";
const T = "rabbit";
const M = T.length, N = S.length;

// dp[i][j] = # ways to form t[0..i-1] using s[0..j-1]
const buildDP = () => {
  const dp: number[][] = Array.from({length: M+1}, () => Array(N+1).fill(0));
  for (let j = 0; j <= N; j++) dp[0][j] = 1;
  const steps: {i:number, j:number, val:number, dp:number[][], msg:string}[] = [];
  steps.push({i:-1, j:-1, val:-1, dp: dp.map(r=>[...r]), msg: "dp[0][*]=1 (empty t matchable from any prefix of s)."});
  for (let i = 1; i <= M; i++) {
    for (let j = 1; j <= N; j++) {
      if (T[i-1] === S[j-1]) {
        dp[i][j] = dp[i-1][j-1] + dp[i][j-1];
      } else {
        dp[i][j] = dp[i][j-1];
      }
      steps.push({i, j, val:dp[i][j], dp: dp.map(r=>[...r]), msg: T[i-1]===S[j-1] ? `t[${i-1}]='${T[i-1]}'=s[${j-1}]='${S[j-1]}': dp[${i}][${j}]=dp[${i-1}][${j-1}]+dp[${i}][${j-1}]=${dp[i][j]}` : `t[${i-1}]='${T[i-1]}'≠s[${j-1}]='${S[j-1]}': dp[${i}][${j}]=dp[${i}][${j-1}]=${dp[i][j]}`});
    }
  }
  return {steps, answer: dp[M][N]};
};
const {steps: STEPS, answer: ANSWER} = buildDP();

export default function DistinctSubsequencesViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [msg, setMsg] = useState(`Count ways t="${T}" appears as subsequence in s="${S}".`);
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg(`Count ways t="${T}" appears as subsequence in s="${S}".`);
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`${ANSWER} distinct subsequences`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Answer = ${ANSWER}`); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Distinct Subsequences — 2D DP</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>dp[i][j] = ways to form t[0..i-1] from s[0..j-1]. Match: +dp[i-1][j-1]. Always: +dp[i][j-1].</div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: "var(--text-muted)" }}>Speed</span>
            <input type="range" min={50} max={800} value={800-speed+50} onChange={e => setSpeed(800-(+e.target.value)+50)} className="w-16" />
          </div>
        </div>
      </div>
      <div className="rounded-xl p-4 overflow-auto" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <td className="w-6 h-6"></td>
              <td className="w-6 h-6 text-center font-bold" style={{ color: "var(--text-muted)" }}>ε</td>
              {S.split("").map((c,j) => (
                <td key={j} className="w-7 h-6 text-center font-bold font-mono" style={{ color: "var(--text-secondary)" }}>{c}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(M+1)].map((_,i) => (
              <tr key={i}>
                <td className="w-6 text-center font-bold font-mono" style={{ color: "var(--text-secondary)" }}>{i===0?"ε":T[i-1]}</td>
                {[...Array(N+1)].map((_,j) => {
                  const isActive = cur.i===i && cur.j===j;
                  const isDone_ = i < cur.i || (i===cur.i && j<=cur.j);
                  const val = cur.dp[i][j];
                  return (
                    <td key={j} className="w-7 h-7 text-center rounded" style={{ background: isActive ? "rgba(249,115,22,0.4)" : isDone_ && val>0 ? "rgba(79,142,247,0.15)" : "transparent", border: isActive ? "2px solid #f97316" : "1px solid rgba(107,114,128,0.1)", color: isActive ? "#f97316" : isDone_ ? (val>0?"#4f8ef7":"var(--text-muted)") : "rgba(107,114,128,0.3)" }}>
                      {isDone_ ? val : "·"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {done && <div className="mt-3 text-lg font-bold" style={{ color: "#22c55e" }}>Answer: dp[{M}][{N}] = {ANSWER}</div>}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
