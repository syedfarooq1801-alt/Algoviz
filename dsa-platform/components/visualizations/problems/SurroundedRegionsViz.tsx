"use client";
import { useState, useRef, useEffect } from "react";

// 4x4 board
const INIT = [
  ['X','X','X','X'],
  ['X','O','O','X'],
  ['X','X','O','X'],
  ['X','O','X','X'],
];
const FINAL = [
  ['X','X','X','X'],
  ['X','X','X','X'],
  ['X','X','X','X'],
  ['X','O','X','X'],
];

const STEPS = [
  { safe: new Set<string>(), msg: "Find all 'O' cells connected to border. They cannot be captured." },
  { safe: new Set(["3,1"]), msg: "DFS from border O (3,1). Mark it safe (won't be flipped)." },
  { safe: new Set(["3,1"]), flip: true, msg: "Flip all non-safe 'O' → 'X'. Restore safe 'O'. (1,1),(1,2),(2,2) flipped." },
];

export default function SurroundedRegionsViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("DFS from border O-cells. Mark safe. Flip all other O→X.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("DFS from border O-cells. Mark safe. Flip all other O→X.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Done! Surrounded regions flipped. Border-connected O preserved."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Surrounded Regions solved! Only border-connected O cells survive."); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];
  const board = (cur as any).flip ? FINAL : INIT;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Surrounded Regions — DFS from Borders</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>DFS from all border O-cells (they're safe). Flip remaining surrounded O→X.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Board</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {board.map((row, r) => row.map((v, c) => {
              const key = `${r},${c}`;
              const isSafe = cur.safe.has(key);
              return (
                <div key={key} className="aspect-square flex items-center justify-center rounded text-sm font-bold" style={{ background: v === 'O' ? (isSafe ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.3)") : "rgba(107,114,128,0.2)", border: v === 'O' ? (isSafe ? "2px solid #22c55e" : "2px solid #f97316") : "1px solid rgba(107,114,128,0.4)", color: v === 'O' ? (isSafe ? "#22c55e" : "#f97316") : "var(--text-muted)" }}>
                  {v}
                </div>
              );
            }))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Legend</div>
          <div className="space-y-2 text-xs">
            <div className="flex gap-2"><span className="w-6 h-6 rounded flex items-center justify-center font-bold" style={{ background: "rgba(107,114,128,0.2)", color: "var(--text-muted)" }}>X</span><span style={{ color: "var(--text-secondary)" }}>Wall/Flipped</span></div>
            <div className="flex gap-2"><span className="w-6 h-6 rounded flex items-center justify-center font-bold" style={{ background: "rgba(249,115,22,0.3)", color: "#f97316" }}>O</span><span style={{ color: "var(--text-secondary)" }}>Surrounded (flip)</span></div>
            <div className="flex gap-2"><span className="w-6 h-6 rounded flex items-center justify-center font-bold" style={{ background: "rgba(34,197,94,0.3)", color: "#22c55e" }}>O</span><span style={{ color: "var(--text-secondary)" }}>Safe (border-connected)</span></div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
