"use client";
import { useEffect, useState } from "react";

// Coin change DP demo: coins=[1,3,4], amount=6
const COINS = [1, 3, 4];
const AMOUNT = 6;

export default function PatternVizDP() {
  const [dp, setDp] = useState<(number | null)[]>(Array(AMOUNT + 1).fill(null));
  const [activeI, setActiveI] = useState(-1);
  const [activeCoin, setActiveCoin] = useState<number | null>(null);
  const [msg, setMsg] = useState("Fill dp[0]=0 (base case)");

  useEffect(() => {
    const frames: { dp: (number|null)[]; i: number; coin: number | null; msg: string }[] = [];
    const d: (number|null)[] = Array(AMOUNT + 1).fill(null);
    d[0] = 0;
    frames.push({ dp: [...d], i: 0, coin: null, msg: "Base case: dp[0] = 0 (0 coins to make amount 0)" });

    for (let i = 1; i <= AMOUNT; i++) {
      for (const coin of COINS) {
        if (coin <= i && d[i - coin] !== null) {
          const candidate = (d[i - coin] as number) + 1;
          if (d[i] === null || candidate < (d[i] as number)) {
            d[i] = candidate;
            frames.push({ dp: [...d], i, coin, msg: `dp[${i}] = dp[${i}-${coin}]+1 = dp[${i-coin}]+1 = ${candidate}` });
          } else {
            frames.push({ dp: [...d], i, coin, msg: `dp[${i}] via coin ${coin}: ${candidate} ≥ ${d[i]} (skip)` });
          }
        }
      }
    }
    frames.push({ dp: [...d], i: -1, coin: null, msg: `Answer: dp[${AMOUNT}] = ${d[AMOUNT]} coins` });
    for (let i = 0; i < 3; i++) frames.push(frames[frames.length - 1]);
    // reset
    const reset = Array(AMOUNT + 1).fill(null); reset[0] = 0;
    frames.push({ dp: reset, i: 0, coin: null, msg: "Base case: dp[0] = 0" });

    let fi = 0;
    const id = setInterval(() => {
      const f = frames[fi % frames.length];
      setDp(f.dp); setActiveI(f.i); setActiveCoin(f.coin); setMsg(f.msg);
      fi++;
      if (fi >= frames.length) fi = 0;
    }, 650);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 justify-center flex-wrap">
        <span className="text-xs mr-2" style={{ color: "var(--text-muted)" }}>Coins: {COINS.join(", ")} | Amount: {AMOUNT}</span>
      </div>

      {/* DP table */}
      <div className="flex gap-1 justify-center flex-wrap">
        {dp.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono transition-all duration-300"
              style={{
                background: i === activeI ? "rgba(245,158,11,0.3)" : v !== null ? "rgba(34,197,94,0.15)" : "var(--bg-hover)",
                border: i === activeI ? "2px solid #f59e0b" : v !== null ? "1px solid rgba(34,197,94,0.4)" : "2px solid var(--border)",
                color: i === activeI ? "#f59e0b" : v !== null ? "#22c55e" : "var(--text-muted)",
                transform: i === activeI ? "scale(1.1) translateY(-4px)" : "scale(1)",
                boxShadow: i === activeI ? "0 8px 18px rgba(245,158,11,0.3)" : "none",
              }}>
              {v !== null ? v : "∞"}
            </div>
            <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>dp[{i}]</span>
          </div>
        ))}
      </div>

      {activeCoin !== null && (
        <div className="flex items-center gap-2 justify-center text-xs" style={{ color: "var(--text-muted)" }}>
          <span>Using coin:</span>
          <span className="px-2 py-0.5 rounded font-mono font-bold" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}>
            {activeCoin}
          </span>
        </div>
      )}

      <div className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
        style={{ background: "rgba(245,158,11,0.07)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
        {msg}
      </div>
    </div>
  );
}
