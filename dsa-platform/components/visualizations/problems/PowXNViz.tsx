"use client";
import { useState, useRef, useEffect } from "react";

const BASE = 2.0, EXP = 10;
// Fast power: x^n = (x^(n/2))^2 if even, x*(x^(n/2))^2 if odd

const buildSteps = () => {
  const steps: { n: number; x: number; result: number; action: string }[] = [];
  let x = BASE, n = EXP, result = 1;
  while (n > 0) {
    if (n % 2 === 1) {
      result *= x;
      steps.push({ n, x, result, action: `n=${n} is odd: result *= x(${x}) → result=${result}` });
    } else {
      steps.push({ n, x, result, action: `n=${n} is even: square x: ${x}² = ${x*x}` });
    }
    x *= x;
    n = Math.floor(n / 2);
  }
  return steps;
};
const STEPS = buildSteps();

export default function PowXNViz() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Compute ${BASE}^${EXP} using fast power (O(log n) instead of O(n)).`);
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDone(false); setPlaying(false);
    setMsg(`Compute ${BASE}^${EXP} using fast power (O(log n) instead of O(n)).`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`${BASE}^${EXP} = ${STEPS[STEPS.length-1].result}`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].action);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`${BASE}^${EXP} = ${STEPS[next].result} in ${STEPS.length} steps (log₂${EXP}≈${Math.ceil(Math.log2(EXP))})`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Pow(x, n) — Fast Exponentiation</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Square x each step, halve n. If n odd, multiply result. O(log n) multiplications.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Steps (n={EXP} in binary = {EXP.toString(2)})</div>
        <div className="space-y-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded text-xs" style={{
              background: i === step ? "rgba(249,115,22,0.15)" : i < step ? "rgba(107,114,128,0.08)" : "transparent",
              border: i === step ? "1px solid rgba(249,115,22,0.4)" : "1px solid transparent"
            }}>
              <span className="w-20 font-mono" style={{ color: "#4f8ef7" }}>n={s.n} ({s.n.toString(2)})</span>
              <span style={{ color: i <= step ? "var(--text-secondary)" : "var(--text-muted)" }}>{s.action}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cur ? (
          <>
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>n</div>
              <div className="text-xl font-bold" style={{ color: "#4f8ef7" }}>{cur.n}</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>x</div>
              <div className="text-xl font-bold" style={{ color: "#f97316" }}>{cur.x}</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "var(--border)"}` }}>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>result</div>
              <div className="text-xl font-bold" style={{ color: done ? "#22c55e" : "#22c55e" }}>{cur.result}</div>
            </div>
          </>
        ) : (
          <div className="col-span-3 text-center text-xs py-2" style={{ color: "var(--text-muted)" }}>Press Play or Step to start</div>
        )}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
