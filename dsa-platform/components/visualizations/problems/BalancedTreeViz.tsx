"use client";
import { useState, useRef, useEffect } from "react";

// Tree: [3,9,20,null,null,15,7]
// heights: 9→1, 15→1, 7→1, 20→2, 3→3
const NODES = [
  { id: 3, left: 9, right: 20, x: 200, y: 30, height: 3 },
  { id: 9, left: null, right: null, x: 100, y: 100, height: 1 },
  { id: 20, left: 15, right: 7, x: 300, y: 100, height: 2 },
  { id: 15, left: null, right: null, x: 240, y: 170, height: 1 },
  { id: 7, left: null, right: null, x: 360, y: 170, height: 1 },
];
const STEPS = [
  { node: 9, msg: "node 9: leaf → height=1. Both children null, balanced ✓" },
  { node: 15, msg: "node 15: leaf → height=1. Balanced ✓" },
  { node: 7, msg: "node 7: leaf → height=1. Balanced ✓" },
  { node: 20, msg: "node 20: left h=1, right h=1. |diff|=0 ≤ 1 → balanced ✓ height=2" },
  { node: 3, msg: "node 3: left h=1(node9), right h=2(node20). |diff|=1 ≤ 1 → BALANCED ✓ height=3" },
];

export default function BalancedTreeViz() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("DFS post-order: check each subtree height. |left_h - right_h| ≤ 1.");
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDone(false); setPlaying(false);
    setMsg("DFS post-order: check each subtree height. |left_h - right_h| ≤ 1.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Tree is BALANCED! All subtrees satisfy height condition."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setTimeout(() => { setDone(true); setPlaying(false); setMsg("Tree is BALANCED! All subtrees satisfy height condition."); }, 300); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const activeNode = step >= 0 ? STEPS[step].node : -1;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Balanced Binary Tree — DFS Post-order</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Returns height from each node. If any subtree unbalanced, propagate -1 up.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="400" height="210" viewBox="0 0 400 210" style={{ width: "100%", height: "auto" }} role="img" aria-label="Binary tree height-balance diagram">
          {/* edges */}
          <line x1="200" y1="50" x2="100" y2="100" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
          <line x1="200" y1="50" x2="300" y2="100" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
          <line x1="300" y1="120" x2="240" y2="170" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
          <line x1="300" y1="120" x2="360" y2="170" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
          {NODES.map(n => {
            const isActive = n.id === activeNode;
            const visited = step >= 0 && STEPS.slice(0, step + 1).some(s => s.node === n.id);
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y + 20} r={20} fill={isActive ? "rgba(249,115,22,0.3)" : visited ? "rgba(34,197,94,0.15)" : "rgba(79,142,247,0.1)"} stroke={isActive ? "#f97316" : visited ? "#22c55e" : "#4f8ef7"} strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={n.x} y={n.y + 25} textAnchor="middle" fill={isActive ? "#f97316" : visited ? "#22c55e" : "#4f8ef7"} fontSize="13" fontWeight="bold">{n.id}</text>
                {visited && <text x={n.x} y={n.y + 48} textAnchor="middle" fill="#22c55e" fontSize="9">h={n.height}</text>}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
