"use client";
import { useState, useEffect, useRef } from "react";

const PRICES = [7, 1, 5, 3, 6, 4];

export default function BestTimeStockIIViz() {
  const [day, setDay] = useState(1);
  const [profit, setProfit] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [done, setDone] = useState(false);
  const [gains, setGains] = useState<number[]>([]);
  const [msg, setMsg] = useState("Sum all positive price differences (buy low, sell high every day)");
  const stateRef = useRef({ day: 1, profit: 0, gains: [] as number[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { day: 1, profit: 0, gains: [] };
    setDay(1); setProfit(0); setDone(false); setGains([]); setPlaying(false);
    setMsg("Sum all positive price differences (buy low, sell high every day)");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { day: d, profit: p, gains: g } = stateRef.current;
    if (d >= PRICES.length) { setDone(true); setPlaying(false); setMsg(`Total profit = ${p}`); return; }
    const diff = PRICES[d] - PRICES[d - 1];
    const add = diff > 0 ? diff : 0;
    const newP = p + add;
    const newG = [...g, add];
    stateRef.current = { day: d + 1, profit: newP, gains: newG };
    setDay(d + 1); setProfit(newP); setGains(newG);
    setMsg(diff > 0 ? `Day ${d}: ${PRICES[d - 1]}→${PRICES[d]}, diff=+${diff} → ADD to profit` : `Day ${d}: ${PRICES[d - 1]}→${PRICES[d]}, diff=${diff} → skip (negative)`);
    if (d + 1 >= PRICES.length) { setDone(true); setPlaying(false); setMsg(`Total profit = ${newP}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Best Time to Buy/Sell Stock II — Greedy</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Unlimited transactions. Collect every upward price movement.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="300" max="1500" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 items-end" style={{ height: "80px" }}>
          {PRICES.map((p, i) => {
            const isActive = i === day - 1 || i === day;
            const maxP = Math.max(...PRICES);
            return (
              <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                <div className="text-xs font-bold" style={{ color: isActive ? "#4f8ef7" : "var(--text-muted)" }}>{p}</div>
                <div className="w-full rounded-t-sm transition-all" style={{ height: `${(p / maxP) * 55}px`, background: isActive ? "rgba(79,142,247,0.5)" : i < day - 1 && gains[i - 1] > 0 ? "rgba(34,197,94,0.3)" : "var(--bg-hover)", border: isActive ? "1px solid #4f8ef7" : "1px solid var(--border)" }} />
                <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>D{i}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-3 flex-wrap">
          {gains.map((g, i) => g > 0 ? (
            <div key={i} className="text-xs px-2 py-1 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>+{g}</div>
          ) : null)}
        </div>
      </div>
      <div className="rounded-xl p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Total Profit</div>
        <div className="text-3xl font-bold font-mono" style={{ color: "#22c55e" }}>{profit}</div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
