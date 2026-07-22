"use client";
import { useState, useRef, useEffect } from "react";

// Tree [2,1,3,null,null,null,4] — BFS finds first leaf at level 2 (node 1 or 3)
const NODES = [
  { id:0, x:200, y:30, v:2, level:1 },
  { id:1, x:100, y:95, v:1, level:2 },
  { id:2, x:300, y:95, v:3, level:2 },
  { id:3, x:360, y:160, v:4, level:3 },
];
const EDGES = [[0,1],[0,2],[2,3]];

const STEPS = [
  { level: 1, active: [0], msg: "Level 1: node 2. Has children → not leaf. Continue BFS." },
  { level: 2, active: [1,2], msg: "Level 2: nodes 1,3. Node 1 has NO children → LEAF! min depth = 2." },
];

export default function MinDepthTreeViz() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("BFS = optimal for min depth. First leaf found = min depth (no need to explore further).");
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDone(false); setPlaying(false);
    setMsg("BFS = optimal for min depth. First leaf found = min depth (no need to explore further).");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Min depth = 2 (node 1 is first leaf found by BFS)."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Min depth = 2 ✓ (BFS stops at first leaf)"); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = step >= 0 ? STEPS[step] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Minimum Depth of Binary Tree — BFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>BFS level-order. First leaf node found = min depth. DFS would be O(n) worst case.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="420" height="200" viewBox="0 0 420 200" style={{ width: "100%", height: "auto" }} role="img" aria-label="Binary tree minimum depth diagram">
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
          ))}
          {NODES.map(n => {
            const isActive = cur?.active.includes(n.id);
            const isLeafFound = done && n.id === 1;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={18} fill={isLeafFound ? "rgba(34,197,94,0.35)" : isActive ? "rgba(249,115,22,0.3)" : "var(--bg-hover)"} stroke={isLeafFound ? "#22c55e" : isActive ? "#f97316" : "rgba(107,114,128,0.4)"} strokeWidth="2" />
                <text x={n.x} y={n.y+5} textAnchor="middle" fill={isLeafFound ? "#22c55e" : isActive ? "#f97316" : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{n.v}</text>
                {isLeafFound && <text x={n.x} y={n.y-25} textAnchor="middle" fill="#22c55e" fontSize="9">LEAF!</text>}
              </g>
            );
          })}
        </svg>
      </div>
      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-4xl font-bold" style={{ color: "#22c55e" }}>2</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Minimum Depth</div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
