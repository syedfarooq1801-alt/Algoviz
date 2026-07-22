"use client";
import { useState, useRef, useEffect } from "react";

// 1→2→3→4→5 becomes 1→5→2→4→3
const ORIGINAL = [1,2,3,4,5];
const STEPS = [
  { list: [1,2,3,4,5], phase: "find", slow: 2, fast: 4, msg: "Find middle with slow/fast. slow=3, fast=5." },
  { list: [1,2,3,null,null], phase: "reverse", rev: [5,4,3], msg: "Reverse second half: [3,4,5]→[5,4,3]." },
  { list: [1,5,2,4,3], phase: "merge", msg: "Merge: 1→5→2→4→3. Interleave from both halves." },
];

export default function ReorderListViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Find mid (slow/fast) → reverse second half → merge two halves.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Find mid (slow/fast) → reverse second half → merge two halves.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Done! 1→5→2→4→3"); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Reordered: 1→5→2→4→3 ✓"); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];
  const phaseColors: Record<string,string> = { find: "#4f8ef7", reverse: "#f97316", merge: "#22c55e" };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Reorder List — 3-Phase</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Phase 1: Find middle. Phase 2: Reverse second half. Phase 3: Merge.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: phaseColors[cur.phase] }}>Phase: {cur.phase.toUpperCase()}</div>
        {cur.phase === "find" && (
          <div>
            <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Original list with slow/fast pointers</div>
            <div className="flex items-center gap-2">
              {ORIGINAL.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: i === 2 ? "rgba(79,142,247,0.25)" : i === 4 ? "rgba(249,115,22,0.2)" : "var(--bg-hover)", border: i === 2 ? "2px solid #4f8ef7" : i === 4 ? "2px solid #f97316" : "1px solid var(--border)", color: "var(--text-secondary)" }}>{v}</div>
                  <div className="text-xs" style={{ color: i === 2 ? "#4f8ef7" : i === 4 ? "#f97316" : "transparent" }}>{i === 2 ? "slow" : i === 4 ? "fast" : "."}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {cur.phase === "reverse" && (
          <div className="space-y-3">
            <div>
              <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>First half: 1→2</div>
              <div className="flex gap-2">
                {[1,2].map((v,i) => (
                  <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}>{v}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Reversed second half: 5→4→3</div>
              <div className="flex gap-2">
                {[5,4,3].map((v,i) => (
                  <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", color: "#f97316" }}>{v}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        {cur.phase === "merge" && (
          <div>
            <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Merged (interleaved)</div>
            <div className="flex items-center gap-1">
              {[1,5,2,4,3].map((v,i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: i%2===0 ? "rgba(34,197,94,0.2)" : "rgba(249,115,22,0.15)", border: i%2===0 ? "2px solid #22c55e" : "2px solid #f97316", color: i%2===0 ? "#22c55e" : "#f97316" }}>{v}</div>
                  {i < 4 && <span style={{ color: "var(--text-muted)" }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
