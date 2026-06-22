"use client";
import { useState, useRef, useEffect } from "react";

// Tree: [3,1,4,3,null,1,5] — good node: no value > it on path from root
const NODES = [
  { id:0, x:200, y:30, v:3, good:true, parent:null },
  { id:1, x:110, y:95, v:1, good:false, parent:0 },
  { id:2, x:290, y:95, v:4, good:true, parent:0 },
  { id:3, x:65, y:160, v:3, good:true, parent:1 },
  { id:4, x:245, y:160, v:1, good:false, parent:2 },
  { id:5, x:335, y:160, v:5, good:true, parent:2 },
];

const STEPS = [
  { visiting: 0, maxSoFar: -Infinity, good: [] as number[], msg: "Visit root 3. maxSoFar=-∞. 3≥-∞ → GOOD. maxSoFar=3." },
  { visiting: 1, maxSoFar: 3, good: [0], msg: "Visit 1. maxSoFar=3. 1<3 → NOT good." },
  { visiting: 3, maxSoFar: 3, good: [0], msg: "Visit 3. maxSoFar=3. 3≥3 → GOOD. count=2." },
  { visiting: 2, maxSoFar: 3, good: [0,3], msg: "Visit 4. maxSoFar=3. 4≥3 → GOOD. count=3." },
  { visiting: 4, maxSoFar: 4, good: [0,3,2], msg: "Visit 1. maxSoFar=4. 1<4 → NOT good." },
  { visiting: 5, maxSoFar: 4, good: [0,3,2], msg: "Visit 5. maxSoFar=4. 5≥4 → GOOD. count=4." },
];

export default function CountGoodNodesViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("DFS with maxSoFar. Node good if val ≥ maxSoFar on root→node path.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("DFS with maxSoFar. Node good if val ≥ maxSoFar on root→node path.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Count = 4 good nodes total."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Total good nodes = 4"); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Count Good Nodes in Binary Tree — DFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Good node: val ≥ max(all ancestors). DFS passes maxSoFar downward.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="400" height="200" viewBox="0 0 400 200" style={{ width: "100%", height: "auto" }}>
          {NODES.filter(n => n.parent !== null).map(n => {
            const par = NODES[n.parent!];
            return <line key={n.id} x1={par.x} y1={par.y} x2={n.x} y2={n.y} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />;
          })}
          {NODES.map(n => {
            const isVisiting = n.id === cur.visiting;
            const isGood = cur.good.includes(n.id);
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={18} fill={isVisiting ? "rgba(249,115,22,0.35)" : isGood ? "rgba(34,197,94,0.25)" : "var(--bg-hover)"} stroke={isVisiting ? "#f97316" : isGood ? "#22c55e" : "rgba(107,114,128,0.4)"} strokeWidth="2" />
                <text x={n.x} y={n.y+5} textAnchor="middle" fill={isVisiting ? "#f97316" : isGood ? "#22c55e" : "var(--text-muted)"} fontSize="13" fontWeight="bold">{n.v}</text>
              </g>
            );
          })}
        </svg>
        <div className="flex gap-4 text-xs mt-2">
          <span style={{ color: "#f97316" }}>■ visiting</span>
          <span style={{ color: "#22c55e" }}>■ good</span>
          <span style={{ color: "var(--text-muted)" }}>■ not good</span>
          {done && <span style={{ color: "#22c55e" }} className="font-bold">Count = 4</span>}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
