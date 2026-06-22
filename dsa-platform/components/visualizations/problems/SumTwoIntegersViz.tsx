"use client";
import { useState, useRef, useEffect } from "react";

const A = 2, B = 3; // 010 + 011 = 101 = 5

export default function SumTwoIntegersViz() {
  const [a, setA] = useState(A);
  const [b, setB] = useState(B);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState(`Add ${A}+${B} without + operator. Use XOR for sum, AND<<1 for carry.`);
  const stateRef = useRef({ a: A, b: B, step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { a: A, b: B, step: 0 };
    setA(A); setB(B); setStep(0); setDone(false); setPlaying(false);
    setMsg(`Add ${A}+${B} without + operator. Use XOR for sum, AND<<1 for carry.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { a: ca, b: cb } = stateRef.current;
    if (cb === 0) { setDone(true); setPlaying(false); setMsg(`Carry=0 → Done! Result = ${ca}`); return; }
    const xor = ca ^ cb;
    const carry = (ca & cb) << 1;
    stateRef.current = { a: xor, b: carry, step: stateRef.current.step + 1 };
    setA(xor); setB(carry); setStep(s => s + 1);
    setMsg(`a=${ca}(${ca.toString(2)}), b=${cb}(${cb.toString(2)}): XOR=${xor}(${xor.toString(2)}), carry=${carry}(${carry.toString(2)})`);
    if (carry === 0) { setDone(true); setPlaying(false); setMsg(`Carry=0! Result = ${xor}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Sum of Two Integers — Bit Manipulation</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>XOR = sum without carry. AND &lt;&lt; 1 = carry. Repeat until carry=0.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {[["a (sum bits)", a, "#4f8ef7"], ["b (carry)", b, "#f97316"]].map(([label, val, color]) => (
          <div key={label as string}>
            <div className="text-xs mb-2 font-semibold" style={{ color: color as string }}>{label as string} = {val as number}</div>
            <div className="flex gap-1">
              {(val as number).toString(2).padStart(4, "0").split("").map((bit, i) => (
                <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold" style={{
                  background: bit === "1" ? `${color}33` : "var(--bg-hover)",
                  border: bit === "1" ? `2px solid ${color}` : "1px solid var(--border)",
                  color: bit === "1" ? color as string : "var(--text-muted)"
                }}>{bit}</div>
              ))}
              <div className="ml-2 flex items-center text-sm font-bold" style={{ color: color as string }}>{val as number}</div>
            </div>
          </div>
        ))}
        <div className="text-xs px-3 py-2 rounded font-mono" style={{ background: "rgba(0,0,0,0.2)", color: "#a855f7" }}>
          a = a ^ b;  // XOR: add without carry<br />
          b = (a_old & b_old) &lt;&lt; 1;  // carry
        </div>
      </div>
      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{A} + {B} =</div>
          <div className="text-4xl font-bold" style={{ color: "#22c55e" }}>{a}</div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
