"use client";
import { useState, useEffect, useRef } from "react";

const NUMS = [1, 3, 4, 2, 2];

export default function FindDuplicateNumberViz() {
  const [slow, setSlow] = useState(0);
  const [fast, setFast] = useState(0);
  const [phase, setPhase] = useState(0); // 0=init, 1=find meeting, 2=find entry
  const [slow2, setSlow2] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Floyd's cycle detection: treat array as linked list (index→value)");
  const stateRef = useRef({ slow: 0, fast: 0, phase: 0, slow2: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { slow: 0, fast: 0, phase: 0, slow2: 0 };
    setSlow(0); setFast(0); setPhase(0); setSlow2(0); setDone(false); setPlaying(false);
    setMsg("Floyd's cycle detection: treat array as linked list (index→value)");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { slow: s, fast: f, phase: p, slow2: s2 } = stateRef.current;
    if (p === 0) {
      // Phase 1: find meeting point
      const newS = NUMS[s];
      const newF = NUMS[NUMS[f]];
      stateRef.current = { ...stateRef.current, slow: newS, fast: newF };
      setSlow(newS); setFast(newF);
      setMsg(`Phase 1 — slow: ${s}→${newS}, fast: ${f}→${NUMS[f]}→${newF}`);
      if (newS === newF) {
        stateRef.current = { slow: newS, fast: newF, phase: 1, slow2: 0 };
        setPhase(1); setSlow2(0);
        setMsg(`Meeting point at ${newS}! Phase 2: reset slow2=0, advance slow & slow2 by 1`);
      }
    } else {
      // Phase 2: find cycle entry
      const newS = NUMS[s];
      const newS2 = NUMS[s2];
      stateRef.current = { slow: newS, fast: f, phase: 1, slow2: newS2 };
      setSlow(newS); setSlow2(newS2);
      setMsg(`Phase 2 — slow: ${s}→${newS}, slow2: ${s2}→${newS2}`);
      if (newS === newS2) {
        setDone(true); setPlaying(false);
        setMsg(`slow=slow2=${newS} → duplicate is ${newS}!`);
      }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Find Duplicate Number — Floyd's Cycle</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Array as linked list: node i points to NUMS[i]. Duplicate = cycle entry point.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="400" max="1800" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Array as graph (index → value)</div>
        <div className="flex gap-3">
          {NUMS.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full py-3 rounded-lg text-center text-sm font-bold transition-all relative" style={{
                background: i === slow && i === fast ? "rgba(249,115,22,0.3)" : i === slow || (phase === 1 && i === slow) ? "rgba(79,142,247,0.25)" : i === fast ? "rgba(34,197,94,0.25)" : (phase === 1 && i === slow2) ? "rgba(168,85,247,0.25)" : "var(--bg-hover)",
                border: i === slow && i === fast ? "2px solid #f97316" : "1px solid var(--border)",
                color: "var(--text-secondary)"
              }}>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>i={i}</div>
                <div>{v}</div>
                {i === slow && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs" style={{ color: "#4f8ef7" }}>🐢</div>}
                {i === fast && phase === 0 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs" style={{ color: "#22c55e" }}>🐇</div>}
                {phase === 1 && i === slow2 && <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs" style={{ color: "#a855f7" }}>s2</div>}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>→{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-xs flex-wrap">
          <span style={{ color: "#4f8ef7" }}>🐢 slow={slow}</span>
          {phase === 0 && <span style={{ color: "#22c55e" }}>🐇 fast={fast}</span>}
          {phase === 1 && <span style={{ color: "#a855f7" }}>s2={slow2}</span>}
          <span style={{ color: "var(--text-muted)" }}>Phase {phase + 1}</span>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
