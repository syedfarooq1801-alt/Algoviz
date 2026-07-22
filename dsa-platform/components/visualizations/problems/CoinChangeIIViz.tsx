"use client";
import { useState, useRef, useEffect } from "react";

const COINS = [1, 2, 5];
const AMOUNT = 5;
// dp[i] = number of ways to make amount i
// dp[0]=1, for each coin c, for each amount j>=c: dp[j]+=dp[j-c]

const buildSteps = () => {
  const dp = Array(AMOUNT + 1).fill(0);
  dp[0] = 1;
  const steps: { coin: number; j: number; prev: number; add: number; dp: number[] }[] = [];
  for (const coin of COINS) {
    for (let j = coin; j <= AMOUNT; j++) {
      const prev = dp[j];
      const add = dp[j - coin];
      dp[j] += add;
      steps.push({ coin, j, prev, add, dp: [...dp] });
    }
  }
  return { dp, steps };
};
const { dp: DP, steps: STEPS } = buildSteps();

export default function CoinChangeIIViz() {
  const [step, setStep] = useState(-1);
  const [dp, setDp] = useState([1, ...Array(AMOUNT).fill(0)]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState(`Count ways to make amount=${AMOUNT} using coins [${COINS.join(",")}].`);
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDp([1, ...Array(AMOUNT).fill(0)]); setDone(false); setPlaying(false);
    setMsg(`Count ways to make amount=${AMOUNT} using coins [${COINS.join(",")}].`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`dp[${AMOUNT}] = ${DP[AMOUNT]} ways to make change`); return; }
    const cur = STEPS[next];
    stateRef.current = { step: next };
    setStep(next); setDp([...cur.dp]);
    setMsg(`Coin ${cur.coin}, j=${cur.j}: dp[${cur.j}] += dp[${cur.j}-${cur.coin}] = ${cur.prev} + ${cur.add} = ${cur.dp[cur.j]}`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`dp[${AMOUNT}] = ${DP[AMOUNT]} ways`); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Coin Change II — 1D DP (Combinations)</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Outer loop: coins. Inner loop: amounts. dp[j] += dp[j-coin]. Avoids counting permutations.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 mb-3">
          {COINS.map(c => (
            <div key={c} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: cur?.coin === c ? "rgba(249,115,22,0.25)" : "var(--bg-hover)", border: cur?.coin === c ? "2px solid #f97316" : "1px solid var(--border)", color: cur?.coin === c ? "#f97316" : "var(--text-secondary)" }}>¢{c}</div>
          ))}
          {cur && <div className="ml-auto text-xs flex items-center" style={{ color: "var(--text-muted)" }}>Processing coin={cur.coin}, j={cur.j}</div>}
        </div>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>dp[0..{AMOUNT}] = number of ways</div>
        <div className="flex gap-2">
          {dp.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full py-2.5 rounded-lg text-center text-sm font-bold transition-all" style={{
                background: cur?.j === i ? "rgba(249,115,22,0.3)" : v > 0 ? "rgba(79,142,247,0.2)" : "var(--bg-hover)",
                border: done && i === AMOUNT ? "2px solid #22c55e" : cur?.j === i ? "2px solid #f97316" : "1px solid var(--border)",
                color: done && i === AMOUNT ? "#22c55e" : v > 0 ? "#4f8ef7" : "var(--text-muted)"
              }}>{v}</div>
              <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{i}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
