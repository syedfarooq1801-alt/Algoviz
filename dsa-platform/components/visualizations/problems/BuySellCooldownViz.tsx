"use client";
import { useState, useRef, useEffect } from "react";

const PRICES = [1, 2, 3, 0, 2];
// States: held, sold, rest
// held[i] = max profit holding stock at day i
// sold[i] = max profit just sold at day i
// rest[i] = max profit in rest/cooldown at day i
const buildDP = () => {
  const n = PRICES.length;
  const held = Array(n).fill(0), sold = Array(n).fill(0), rest = Array(n).fill(0);
  held[0] = -PRICES[0];
  const steps: { i: number; held: number; sold: number; rest: number }[] = [{ i: 0, held: held[0], sold: 0, rest: 0 }];
  for (let i = 1; i < n; i++) {
    held[i] = Math.max(held[i-1], rest[i-1] - PRICES[i]);
    sold[i] = held[i-1] + PRICES[i];
    rest[i] = Math.max(rest[i-1], sold[i-1]);
    steps.push({ i, held: held[i], sold: sold[i], rest: rest[i] });
  }
  return { steps, answer: Math.max(sold[n-1], rest[n-1]) };
};
const { steps: STEPS, answer: ANSWER } = buildDP();

export default function BuySellCooldownViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("3 states: held/sold/rest. Transition between them each day.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("3 states: held/sold/rest. Transition between them each day.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Max profit = max(sold,rest) = ${ANSWER}`); return; }
    const cur = STEPS[next];
    stateRef.current = { step: next };
    setStep(next);
    setMsg(`Day ${cur.i}(price=${PRICES[cur.i]}): held=${cur.held}, sold=${cur.sold}, rest=${cur.rest}`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Max profit = ${ANSWER}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const maxPrice = Math.max(...PRICES);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Buy and Sell Stock with Cooldown — State Machine DP</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>held → sell → rest(cooldown) → can buy again. 3-state DP transitions.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 items-end mb-4" style={{ height: "80px" }}>
          {PRICES.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-xs font-bold" style={{ color: i === step ? "#4f8ef7" : "var(--text-muted)" }}>{p}</div>
              <div className="w-full rounded-t transition-all" style={{ height: `${(p / maxPrice) * 55}px`, background: i === step ? "rgba(79,142,247,0.5)" : i < step ? "rgba(107,114,128,0.2)" : "var(--bg-hover)", border: i === step ? "1px solid #4f8ef7" : "1px solid var(--border)" }} />
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>D{i}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[["held", STEPS[step].held, "#ef4444", "Stock holding profit"], ["sold", STEPS[step].sold, "#22c55e", "Just sold profit"], ["rest", STEPS[step].rest, "#4f8ef7", "Cooldown/rest profit"]].map(([label, val, color, desc]) => (
          <div key={label as string} className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label as string}</div>
            <div className="text-2xl font-bold" style={{ color: color as string }}>{val as number}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{desc as string}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
