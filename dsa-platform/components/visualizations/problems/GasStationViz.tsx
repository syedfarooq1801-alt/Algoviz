"use client";
import { useState, useRef, useEffect } from "react";

const GAS  = [1, 2, 3, 4, 5];
const COST = [3, 4, 5, 1, 2];
const NET = GAS.map((g, i) => g - COST[i]); // [-2,-2,-2,3,3]

export default function GasStationViz() {
  const [idx, setIdx] = useState(0);
  const [tank, setTank] = useState(0);
  const [totalSurplus, setTotalSurplus] = useState(0);
  const [start, setStart] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("If tank < 0 at any station, reset start to next station. Surplus must be ≥ 0 to have solution.");
  const stateRef = useRef({ idx: 0, tank: 0, totalSurplus: 0, start: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, tank: 0, totalSurplus: 0, start: 0 };
    setIdx(0); setTank(0); setTotalSurplus(0); setStart(0); setDone(false); setPlaying(false);
    setMsg("If tank < 0 at any station, reset start to next station. Surplus must be ≥ 0 to have solution.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, tank: t, totalSurplus: ts, start: s } = stateRef.current;
    if (i >= GAS.length) {
      const ans = ts >= 0 ? s : -1;
      setDone(true); setPlaying(false);
      setMsg(`totalSurplus=${ts} ${ts >= 0 ? ">= 0" : "< 0"} → start=${ans}`); return;
    }
    const net = NET[i];
    const newT = t + net;
    const newTs = ts + net;
    let newS = s;
    let action = `Station ${i}: gas=${GAS[i]}, cost=${COST[i]}, net=${net}. Tank=${t}+${net}=${newT}`;
    if (newT < 0) {
      newS = i + 1; action += `. Tank<0 → reset start to ${newS}, tank=0`;
      stateRef.current = { idx: i + 1, tank: 0, totalSurplus: newTs, start: newS };
      setIdx(i + 1); setTank(0); setTotalSurplus(newTs); setStart(newS);
    } else {
      stateRef.current = { idx: i + 1, tank: newT, totalSurplus: newTs, start: s };
      setIdx(i + 1); setTank(newT); setTotalSurplus(newTs);
    }
    setMsg(action);
    if (i + 1 >= GAS.length) {
      const ans = newTs >= 0 ? newS : -1;
      setDone(true); setPlaying(false);
      setMsg(`Done! totalSurplus=${newTs} ≥ 0 → answer = station ${ans}`);
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const maxGas = Math.max(...GAS);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Gas Station — Greedy</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>If can't reach next station, start must be after current. Track totalSurplus to check if solution exists.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 mb-3">
          {GAS.map((g, i) => {
            const net = NET[i];
            const isCurrent = i === idx - 1;
            const isPast = i < idx - 1;
            const isStart = i === start;
            return (
              <div key={i} className="flex-1 text-center">
                <div className="rounded-lg p-2 mb-1 text-xs" style={{
                  background: isCurrent ? "rgba(249,115,22,0.25)" : isStart && !done ? "rgba(168,85,247,0.2)" : isPast ? "rgba(107,114,128,0.1)" : "var(--bg-hover)",
                  border: isStart ? "2px solid #a855f7" : isCurrent ? "2px solid #f97316" : "1px solid var(--border)"
                }}>
                  <div className="text-xs" style={{ color: "#22c55e" }}>+{g}</div>
                  <div className="text-xs" style={{ color: "#ef4444" }}>-{COST[i]}</div>
                  <div className="text-xs font-bold" style={{ color: net >= 0 ? "#22c55e" : "#ef4444" }}>{net >= 0 ? "+" : ""}{net}</div>
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>S{i}</div>
                {isStart && <div className="text-xs" style={{ color: "#a855f7" }}>start</div>}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4">
          <div className="flex-1 rounded-lg p-3 text-center" style={{ background: "var(--bg-hover)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Tank</div>
            <div className="text-2xl font-bold" style={{ color: tank >= 0 ? "#22c55e" : "#ef4444" }}>{tank}</div>
          </div>
          <div className="flex-1 rounded-lg p-3 text-center" style={{ background: "var(--bg-hover)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>totalSurplus</div>
            <div className="text-2xl font-bold" style={{ color: totalSurplus >= 0 ? "#22c55e" : "#ef4444" }}>{totalSurplus}</div>
          </div>
          <div className="flex-1 rounded-lg p-3 text-center" style={{ background: "var(--bg-hover)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Start</div>
            <div className="text-2xl font-bold" style={{ color: "#a855f7" }}>{start}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
