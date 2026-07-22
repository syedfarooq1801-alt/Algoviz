"use client";
import { useState, useRef, useEffect } from "react";

const NUM = 11; // 1011 in binary

export default function Number1BitsViz() {
  const [n, setN] = useState(NUM);
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(0);
  const [bits, setBits] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState(`Count set bits in ${NUM} = ${NUM.toString(2)}. Use n & (n-1) trick.`);
  const stateRef = useRef({ n: NUM, count: 0, step: 0, bits: [] as string[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { n: NUM, count: 0, step: 0, bits: [] };
    setN(NUM); setCount(0); setStep(0); setBits([]); setDone(false); setPlaying(false);
    setMsg(`Count set bits in ${NUM} = ${NUM.toString(2)}. Use n & (n-1) trick.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { n: curN, count: c, step: s, bits: b } = stateRef.current;
    if (curN === 0) { setDone(true); setPlaying(false); setMsg(`n=0, done! Total set bits = ${c}`); return; }
    const nMinus1 = curN - 1;
    const newN = curN & nMinus1;
    const newC = c + 1;
    const bitRecord = `${curN.toString(2).padStart(4,'0')} & ${nMinus1.toString(2).padStart(4,'0')} = ${newN.toString(2).padStart(4,'0')}`;
    const newBits = [...b, bitRecord];
    stateRef.current = { n: newN, count: newC, step: s + 1, bits: newBits };
    setN(newN); setCount(newC); setStep(s + 1); setBits(newBits);
    setMsg(`Step ${s+1}: ${curN}(${curN.toString(2)}) & ${nMinus1}(${nMinus1.toString(2)}) = ${newN}(${newN.toString(2)}). count=${newC}`);
    if (newN === 0) { setDone(true); setPlaying(false); setMsg(`n=0! Total set bits = ${newC}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const binStr = n.toString(2).padStart(4, "0");

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Number of 1 Bits — Bit Manipulation</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Brian Kernighan: n & (n-1) removes lowest set bit. Repeat until n=0. Count iterations.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Current n = {n} ({n.toString(2).padStart(4,"0")})</div>
        <div className="flex gap-2 justify-center mb-4">
          {binStr.split("").map((b, i) => (
            <div key={i} className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold" style={{
              background: b === "1" ? "rgba(79,142,247,0.3)" : "rgba(107,114,128,0.1)",
              border: b === "1" ? "2px solid #4f8ef7" : "1px solid var(--border)",
              color: b === "1" ? "#4f8ef7" : "var(--text-muted)"
            }}>{b}</div>
          ))}
        </div>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>n & (n-1) operations:</div>
        <div className="space-y-1 font-mono text-xs">
          {bits.map((b, i) => (
            <div key={i} className="px-3 py-1 rounded" style={{ background: "var(--bg-hover)", color: "#22c55e" }}>{b} → bit {i+1} removed</div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Set bits count</div>
        <div className="text-4xl font-bold" style={{ color: done ? "#22c55e" : "#f97316" }}>{count}</div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
