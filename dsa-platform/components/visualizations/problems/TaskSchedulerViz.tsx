"use client";
import { useState, useRef, useEffect } from "react";

// tasks=['A','A','A','B','B','B'], n=2
// Optimal: A→B→idle→A→B→idle→A→B = 8
const TASKS = ['A','A','A','B','B','B'];
const N_COOLDOWN = 2;
const SCHEDULE = ['A','B','idle','A','B','idle','A','B'];
const FREQ = {A:3, B:3};

const STEPS = SCHEDULE.map((t, i) => ({
  time: i+1, task: t,
  freqA: Math.max(0, FREQ.A - Math.ceil((i+1)/3)),
  freqB: Math.max(0, FREQ.B - Math.ceil((i+1)/3)),
  msg: t === 'idle' ? `Time ${i+1}: IDLE (cooldown)` : `Time ${i+1}: Execute ${t}`
}));

export default function TaskSchedulerViz() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState(`tasks=[A,A,A,B,B,B], n=${N_COOLDOWN}. Formula: max(N, (maxFreq-1)*(n+1)+countMaxFreq)`);
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDone(false); setPlaying(false);
    setMsg(`tasks=[A,A,A,B,B,B], n=${N_COOLDOWN}. Formula: max(N, (maxFreq-1)*(n+1)+countMaxFreq)`);
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Total time = ${SCHEDULE.length}. Formula: max(8, (3-1)*(2+1)+2) = 8 ✓`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Min intervals = ${SCHEDULE.length}`); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Task Scheduler — Greedy + Formula</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Answer = max(n, (maxF-1)*(n+1) + countMaxF). Most frequent task drives idle slots.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Schedule timeline (n=2 cooldown)</div>
        <div className="flex flex-wrap gap-1.5">
          {SCHEDULE.map((t, i) => {
            const done_ = i <= step;
            const active = i === step;
            const isIdle = t === 'idle';
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: active ? (isIdle ? "rgba(107,114,128,0.3)" : "rgba(249,115,22,0.4)") : done_ ? (isIdle ? "rgba(107,114,128,0.15)" : t === 'A' ? "rgba(79,142,247,0.2)" : "rgba(168,85,247,0.2)") : "var(--bg-hover)", border: active ? "2px solid #f97316" : done_ ? (isIdle ? "1px solid rgba(107,114,128,0.3)" : t === 'A' ? "1px solid rgba(79,142,247,0.4)" : "1px solid rgba(168,85,247,0.4)") : "1px solid var(--border)", color: active ? "#f97316" : done_ ? (isIdle ? "var(--text-muted)" : t === 'A' ? "#4f8ef7" : "#a855f7") : "var(--text-muted)" }}>
                  {t === 'idle' ? '—' : t}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{i+1}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>Formula: maxFreq=3, count(maxFreq)=2, n=2</div>
        <div className="text-xs mt-1" style={{ color: "#4f8ef7" }}>answer = max(tasks.length=6, (3-1)×(2+1)+2) = max(6, 8) = <strong>8</strong></div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
