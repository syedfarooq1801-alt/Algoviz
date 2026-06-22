"use client";
import { useState, useRef, useEffect } from "react";

// [[7,null],[13,0],[11,4],[10,2],[1,0]]
// Each node: val, random index (or null)
const NODES = [
  { id:0, val:7, rand:null as number|null },
  { id:1, val:13, rand:0 },
  { id:2, val:11, rand:4 },
  { id:3, val:10, rand:2 },
  { id:4, val:1, rand:0 },
];

const STEPS = [
  { phase: 1, created: [] as number[], msg: "Pass 1: Copy each node. Map[original]→copy (no next/random yet)." },
  { phase: 1, created: [0,1,2,3,4], msg: "All 5 copy nodes created. Stored in hashmap." },
  { phase: 2, created: [0,1,2,3,4], msg: "Pass 2: For each original node, set copy.next and copy.random via map." },
  { phase: 2, created: [0,1,2,3,4], msg: "Done! Deep copy with all next and random pointers set correctly." },
];

export default function CopyListRandomViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Copy List with Random Pointer: 2-pass hashmap approach.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Copy List with Random Pointer: 2-pass hashmap approach.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Deep copy complete! O(n) time, O(n) space."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Copy complete! All next & random pointers correctly set."); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Copy List with Random Pointer — HashMap</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Pass 1: create all copies, map old→new. Pass 2: set next/random via map.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Original List</div>
        <div className="flex items-center gap-2 mb-4">
          {NODES.map((n, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="rounded-lg px-2 py-1.5 text-center" style={{ background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", minWidth: 40 }}>
                <div className="text-xs font-bold" style={{ color: "#4f8ef7" }}>{n.val}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>r:{n.rand ?? "∅"}</div>
              </div>
              {i < NODES.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
            </div>
          ))}
        </div>
        <div className="text-xs mb-2 font-semibold" style={{ color: cur.phase === 1 ? "#f97316" : "#22c55e" }}>
          {cur.phase === 1 ? "Phase 1: Creating copies" : "Phase 2: Wiring pointers"}
        </div>
        <div className="flex items-center gap-2">
          {NODES.map((n, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="rounded-lg px-2 py-1.5 text-center" style={{ background: cur.created.includes(i) ? "rgba(34,197,94,0.15)" : "rgba(107,114,128,0.05)", border: cur.created.includes(i) ? `1px solid rgba(34,197,94,0.4)` : "1px dashed rgba(107,114,128,0.3)", minWidth: 40 }}>
                <div className="text-xs font-bold" style={{ color: cur.created.includes(i) ? "#22c55e" : "rgba(107,114,128,0.3)" }}>{cur.created.includes(i) ? n.val : "?"}</div>
                <div className="text-xs" style={{ color: cur.created.includes(i) && cur.phase === 2 ? "#22c55e" : "var(--text-muted)" }}>r:{cur.created.includes(i) && cur.phase === 2 ? (n.rand ?? "∅") : "?"}</div>
              </div>
              {i < NODES.length - 1 && <span style={{ color: cur.created.includes(i) && cur.phase === 2 ? "#22c55e" : "rgba(107,114,128,0.3)" }}>→</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
