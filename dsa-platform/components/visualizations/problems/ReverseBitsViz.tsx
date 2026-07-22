"use client";
import { useState, useRef, useEffect } from "react";

const NUM = 43261596; // binary: 00000010100101000001111010011100
const BITS = NUM.toString(2).padStart(32, "0").split("");
const REVERSED = parseInt(BITS.slice().reverse().join(""), 2);

export default function ReverseBitsViz() {
  const [bit, setBit] = useState(0);
  const [result, setResult] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [msg, setMsg] = useState(`Reverse bits of ${NUM}. Take bit from right, place at 31-i on left.`);
  const stateRef = useRef({ bit: 0, result: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { bit: 0, result: 0 };
    setBit(0); setResult(0); setDone(false); setPlaying(false);
    setMsg(`Reverse bits of ${NUM}. Take bit from right, place at 31-i on left.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { bit: b, result: r } = stateRef.current;
    if (b >= 32) { setDone(true); setPlaying(false); setMsg(`Result: ${r} (${r.toString(2).padStart(32,"0")})`); return; }
    const bitVal = (NUM >>> b) & 1;
    const newR = r | (bitVal << (31 - b));
    stateRef.current = { bit: b + 1, result: newR };
    setBit(b + 1); setResult(newR);
    setMsg(`Bit ${b}: value=${bitVal} → place at position ${31-b}. Result=${newR}`);
    if (b + 1 >= 32) { setDone(true); setPlaying(false); setMsg(`Reversed = ${REVERSED} (${REVERSED.toString(2).padStart(32,"0")})`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const resultBits = result.toString(2).padStart(32, "0");

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Reverse Bits — Bit Manipulation</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>For each bit i (0..31): extract bit from position i, place at position 31-i.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="50" max="500" step="50" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Input bits (position 31..0)</div>
        <div className="flex flex-wrap gap-0.5 font-mono text-xs">
          {BITS.map((b, i) => {
            const isActive = i === 31 - bit + 1;
            return (
              <div key={i} className="w-5 h-6 flex items-center justify-center rounded-sm" style={{
                background: 31 - i < bit ? "rgba(107,114,128,0.15)" : isActive ? "rgba(249,115,22,0.35)" : "var(--bg-hover)",
                color: b === "1" ? (31 - i < bit ? "#4f8ef780" : "#4f8ef7") : "var(--text-muted)",
                border: isActive ? "1px solid #f97316" : "1px solid transparent"
              }}>{b}</div>
            );
          })}
        </div>
        <div className="text-xs mt-2 mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Result bits</div>
        <div className="flex flex-wrap gap-0.5 font-mono text-xs">
          {resultBits.split("").map((b, i) => (
            <div key={i} className="w-5 h-6 flex items-center justify-center rounded-sm" style={{
              background: b === "1" ? "rgba(34,197,94,0.25)" : "rgba(107,114,128,0.1)",
              color: b === "1" ? "#22c55e" : "var(--text-muted)",
              border: i < bit ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent"
            }}>{b}</div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Input</div>
          <div className="text-lg font-bold font-mono" style={{ color: "#4f8ef7" }}>{NUM}</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Result</div>
          <div className="text-lg font-bold font-mono" style={{ color: done ? "#22c55e" : "#f97316" }}>{result}</div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
