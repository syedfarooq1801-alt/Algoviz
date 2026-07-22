"use client";
import { useState, useRef, useEffect } from "react";

const NUMS = [2, 3, 1, 1, 4];

export default function JumpGameViz() {
  const [idx, setIdx] = useState(0);
  const [maxReach, setMaxReach] = useState(0);
  const [done, setDone] = useState(false);
  const [canReach, setCanReach] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("Track max reachable index. If current index > maxReach, stuck!");
  const stateRef = useRef({ idx: 0, maxReach: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, maxReach: 0 };
    setIdx(0); setMaxReach(0); setDone(false); setCanReach(false); setPlaying(false);
    setMsg("Track max reachable index. If current index > maxReach, stuck!");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, maxReach: mr } = stateRef.current;
    if (i > mr) {
      setDone(true); setCanReach(false); setPlaying(false);
      setMsg(`Index ${i} > maxReach ${mr} → STUCK! Cannot reach end.`); return;
    }
    if (i >= NUMS.length) {
      setDone(true); setCanReach(true); setPlaying(false);
      setMsg(`Reached end! maxReach=${mr} ≥ ${NUMS.length - 1} → TRUE`); return;
    }
    const newMr = Math.max(mr, i + NUMS[i]);
    stateRef.current = { idx: i + 1, maxReach: newMr };
    setIdx(i + 1); setMaxReach(newMr);
    setMsg(`i=${i}, jump=${NUMS[i]}: maxReach = max(${mr}, ${i}+${NUMS[i]}) = ${newMr}`);
    if (newMr >= NUMS.length - 1) {
      setDone(true); setCanReach(true); setPlaying(false);
      setMsg(`maxReach=${newMr} ≥ last index ${NUMS.length-1} → CAN reach end!`);
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Jump Game — Greedy</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Track max reachable index. Greedy: always update reach. If i exceeds reach, return false.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 mb-4">
          {NUMS.map((v, i) => {
            const reachable = i <= maxReach;
            const isCurrent = i === idx - 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full py-3 rounded-lg text-center text-sm font-bold transition-all" style={{
                  background: isCurrent ? "rgba(249,115,22,0.35)" : reachable ? "rgba(79,142,247,0.2)" : "rgba(107,114,128,0.1)",
                  border: isCurrent ? "2px solid #f97316" : i === NUMS.length - 1 ? "2px solid #22c55e" : "1px solid var(--border)",
                  color: isCurrent ? "#f97316" : reachable ? "#4f8ef7" : "var(--text-muted)"
                }}>{v}</div>
                <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>[{i}]</div>
                {i === maxReach && !done && <div className="text-xs" style={{ color: "#22c55e" }}>max</div>}
              </div>
            );
          })}
        </div>
        <div className="rounded-lg p-3 flex items-center gap-4" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
          <div className="text-center">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Current i</div>
            <div className="text-2xl font-bold" style={{ color: "#f97316" }}>{idx}</div>
          </div>
          <div className="text-center">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>maxReach</div>
            <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{maxReach}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? (canReach ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)") : "rgba(79,142,247,0.07)", color: done ? (canReach ? "#22c55e" : "#ef4444") : "#4f8ef7", border: `1px solid ${done ? (canReach ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
