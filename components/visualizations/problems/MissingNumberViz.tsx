"use client";
import { useState, useEffect, useRef } from "react";

const NUMS = [3, 0, 1];
const N = NUMS.length; // 3, so range is 0..3

// XOR steps: first XOR all indices 0..N, then XOR all nums
// Phase 0..N: XOR index i (i=0..N)
// Phase N+1..N+1+NUMS.length: XOR each num
const buildSteps = () => {
  const steps: { label: string; val: number; acc: number; phase: "index" | "num" }[] = [];
  let acc = 0;
  for (let i = 0; i <= N; i++) {
    acc ^= i;
    steps.push({ label: `⊕ index ${i}`, val: i, acc, phase: "index" });
  }
  for (let i = 0; i < NUMS.length; i++) {
    acc ^= NUMS[i];
    steps.push({ label: `⊕ nums[${i}]=${NUMS[i]}`, val: NUMS[i], acc, phase: "num" });
  }
  return steps;
};

const ALL_STEPS = buildSteps();
const EXPECTED_SUM = (N * (N + 1)) / 2;
const ACTUAL_SUM = NUMS.reduce((a, b) => a + b, 0);

export default function MissingNumberViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0);
    setDone(false);
    setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    if (s >= ALL_STEPS.length) {
      setDone(true);
      setPlaying(false);
      return;
    }
    const ns = s + 1;
    stateRef.current = { step: ns };
    setStep(ns);
    if (ns >= ALL_STEPS.length) {
      setDone(true);
      setPlaying(false);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const toBin = (n: number) => n.toString(2).padStart(4, "0");
  const currentAcc = step === 0 ? 0 : ALL_STEPS[step - 1].acc;
  const missing = EXPECTED_SUM - ACTUAL_SUM;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Missing Number — XOR &amp; Math</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          XOR all indices 0..n with all nums. Pairs cancel → missing number remains. Also: expected_sum − actual_sum.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="2000" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>

      {/* Input */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>nums = [3, 0, 1]  (n=3, range 0..3, missing=2)</div>
        <div className="flex gap-2 flex-wrap">
          {NUMS.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.3)", color: "#4f8ef7" }}>
                {v}
              </div>
              <span style={{ fontSize: "9px", color: "var(--text-muted)", fontFamily: "monospace" }}>{toBin(v)}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-0.5 ml-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px dashed rgba(239,68,68,0.5)", color: "#ef4444" }}>
              ?
            </div>
            <span style={{ fontSize: "9px", color: "#ef4444", fontFamily: "monospace" }}>miss</span>
          </div>
        </div>
      </div>

      {/* XOR walkthrough */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>XOR accumulation</div>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Phase 1: XOR indices 0..{N} &nbsp;|&nbsp; Phase 2: XOR each num — pairs cancel
        </div>
        <div className="space-y-1 font-mono text-xs">
          <div className="flex items-center gap-2 px-2 py-1 rounded" style={{ color: "var(--text-muted)" }}>
            <span style={{ width: "100px" }}>start:</span>
            <span>0 = {toBin(0)}</span>
          </div>
          {ALL_STEPS.slice(0, step).map((s, i) => {
            const before = i === 0 ? 0 : ALL_STEPS[i - 1].acc;
            const isCurrent = i === step - 1;
            const phaseColor = s.phase === "index" ? "#a855f7" : "#f97316";
            return (
              <div key={i} className="flex items-center gap-2 px-2 py-1 rounded transition-all"
                style={{ background: isCurrent ? "rgba(79,142,247,0.1)" : "rgba(255,255,255,0.02)", border: isCurrent ? "1px solid rgba(79,142,247,0.3)" : "1px solid transparent" }}>
                <span style={{ width: "100px", color: phaseColor }}>{s.label}</span>
                <span style={{ color: "var(--text-muted)" }}>{toBin(before)}</span>
                <span style={{ color: "var(--text-muted)" }}>⊕</span>
                <span style={{ color: phaseColor }}>{toBin(s.val)}</span>
                <span style={{ color: "var(--text-muted)" }}>=</span>
                <span style={{ color: isCurrent ? "#4f8ef7" : "var(--text-secondary)", fontWeight: isCurrent ? "bold" : "normal" }}>{toBin(s.acc)}</span>
                <span style={{ color: "var(--text-muted)" }}>({s.acc})</span>
                {i === ALL_STEPS.length - 1 && <span style={{ color: "#22c55e", fontSize: "9px" }}>← missing!</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Running XOR display */}
      <div className="rounded-xl p-4 flex items-center gap-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>XOR result so far</div>
          <div className="text-2xl font-bold font-mono mt-1" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>{currentAcc}</div>
          <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{toBin(currentAcc)}</div>
        </div>
        {done && (
          <div className="text-sm font-semibold px-3 py-2 rounded-lg" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
            XOR answer = {currentAcc}
          </div>
        )}
      </div>

      {/* Math approach */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Alternative: Math approach</div>
        <div className="font-mono text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <span style={{ width: "140px", color: "var(--text-muted)" }}>expected_sum:</span>
            <span style={{ color: "#a855f7" }}>n*(n+1)/2 = {N}*{N + 1}/2 = {EXPECTED_SUM}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ width: "140px", color: "var(--text-muted)" }}>actual_sum:</span>
            <span style={{ color: "#f97316" }}>{NUMS.join("+")} = {ACTUAL_SUM}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <span style={{ width: "140px", color: "var(--text-muted)" }}>missing:</span>
            <span style={{ color: "#22c55e", fontWeight: "bold" }}>{EXPECTED_SUM} − {ACTUAL_SUM} = {missing}</span>
          </div>
        </div>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>Missing number = {missing}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Both XOR and math approaches agree</div>
        </div>
      )}
    </div>
  );
}
