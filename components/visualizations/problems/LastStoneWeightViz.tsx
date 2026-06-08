"use client";
import { useState, useRef, useEffect } from "react";

const INITIAL = [2, 7, 4, 1, 8, 1];

export default function LastStoneWeightViz() {
  const [stones, setStones] = useState([...INITIAL].sort((a, b) => b - a));
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Max heap: repeatedly smash two heaviest stones.");
  const stateRef = useRef({ stones: [...INITIAL].sort((a, b) => b - a), log: [] as string[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    const init = [...INITIAL].sort((a, b) => b - a);
    stateRef.current = { stones: init, log: [] };
    setStones(init); setLog([]); setDone(false); setPlaying(false);
    setMsg("Max heap: repeatedly smash two heaviest stones.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { stones: st, log: l } = stateRef.current;
    if (st.length <= 1) {
      setDone(true); setPlaying(false);
      setMsg(`Last stone weight = ${st.length === 0 ? 0 : st[0]}`);
      return;
    }
    const sorted = [...st].sort((a, b) => b - a);
    const a = sorted[0], b = sorted[1];
    let newStones = sorted.slice(2);
    let logEntry = "";
    if (a === b) {
      logEntry = `${a} vs ${b} → equal, both destroyed!`;
    } else {
      newStones.push(a - b);
      newStones.sort((x, y) => y - x);
      logEntry = `${a} vs ${b} → survivor: ${a - b}`;
    }
    const newLog = [...l, logEntry];
    stateRef.current = { stones: newStones, log: newLog };
    setStones(newStones); setLog(newLog); setMsg(logEntry);
    if (newStones.length <= 1) {
      setDone(true); setPlaying(false);
      setMsg(`Last stone weight = ${newStones.length === 0 ? 0 : newStones[0]}`);
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const maxStone = Math.max(...INITIAL);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Last Stone Weight — Max Heap</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Each round: take 2 heaviest. If equal both gone. Else diff survives.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Current stones (max heap)</div>
        <div className="flex items-end gap-3" style={{ height: "80px" }}>
          {stones.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
              <div className="text-xs font-bold" style={{ color: i < 2 ? "#ef4444" : "var(--text-muted)" }}>{s}</div>
              <div className="w-full rounded-t transition-all" style={{ height: `${(s / maxStone) * 60}px`, background: i < 2 ? "rgba(239,68,68,0.5)" : "rgba(79,142,247,0.3)", border: i < 2 ? "1px solid #ef4444" : "1px solid rgba(79,142,247,0.4)" }} />
            </div>
          ))}
          {stones.length === 0 && <div className="text-sm text-center w-full" style={{ color: "var(--text-muted)" }}>All stones destroyed!</div>}
        </div>
        <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>Red = top 2 heaviest (next to smash)</div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Smash log</div>
        <div className="space-y-1">
          {log.map((l, i) => (
            <div key={i} className="text-xs px-2 py-1 rounded" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)" }}>Round {i + 1}: {l}</div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
