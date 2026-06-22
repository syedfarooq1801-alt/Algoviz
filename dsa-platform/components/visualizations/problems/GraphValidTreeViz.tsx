"use client";
import { useState, useRef, useEffect } from "react";

// n=5, edges=[[0,1],[0,2],[0,3],[1,4]] → valid tree (4 edges, connected, no cycle)
const N = 5;
const EDGES = [[0,1],[0,2],[0,3],[1,4]];
const NODE_POS = [{ x: 200, y: 40 }, { x: 100, y: 130 }, { x: 200, y: 130 }, { x: 300, y: 130 }, { x: 100, y: 220 }];

const BFS_STEPS = [
  { visited: [0], queue: [0], msg: "BFS from 0. Visited={0}. Tree needs: n-1 edges AND connected." },
  { visited: [0,1,2,3], queue: [1,2,3], msg: "0's neighbors: 1,2,3 added to visited." },
  { visited: [0,1,2,3,4], queue: [4], msg: "1's neighbor: 4 added. 2,3 no new neighbors." },
  { visited: [0,1,2,3,4], queue: [], msg: "All 5 nodes visited! edges=4=n-1=4. VALID TREE ✓" },
];

export default function GraphValidTreeViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Valid tree: n nodes, n-1 edges, all connected (no cycle).");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Valid tree: n nodes, n-1 edges, all connected (no cycle).");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= BFS_STEPS.length) { setDone(true); setPlaying(false); setMsg("TRUE — valid tree! n-1 edges, all nodes reachable."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(BFS_STEPS[next].msg);
    if (next + 1 >= BFS_STEPS.length) { setDone(true); setPlaying(false); setMsg("VALID TREE ✓ (connected, n-1 edges, no cycles)"); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = BFS_STEPS[step];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Graph Valid Tree — BFS + Edge Count</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Valid tree = n-1 edges AND all n nodes connected. Use BFS or Union-Find.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="400" height="260" viewBox="0 0 400 260" style={{ width: "100%", height: "auto" }}>
          {EDGES.map(([a, b], i) => (
            <line key={i} x1={NODE_POS[a].x} y1={NODE_POS[a].y} x2={NODE_POS[b].x} y2={NODE_POS[b].y} stroke="rgba(79,142,247,0.4)" strokeWidth="2" />
          ))}
          {Array.from({ length: N }, (_, i) => {
            const visited = cur.visited.includes(i);
            return (
              <g key={i}>
                <circle cx={NODE_POS[i].x} cy={NODE_POS[i].y} r={22} fill={visited ? "rgba(34,197,94,0.25)" : "rgba(107,114,128,0.1)"} stroke={visited ? "#22c55e" : "rgba(107,114,128,0.4)"} strokeWidth="2" />
                <text x={NODE_POS[i].x} y={NODE_POS[i].y + 5} textAnchor="middle" fill={visited ? "#22c55e" : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{i}</text>
              </g>
            );
          })}
        </svg>
        <div className="flex gap-4 text-xs mt-2">
          <span>n={N}</span>
          <span>edges={EDGES.length}</span>
          <span>n-1={N-1}</span>
          <span style={{ color: EDGES.length === N-1 ? "#22c55e" : "#ef4444" }}>edges=n-1? {EDGES.length === N-1 ? "✓" : "✗"}</span>
          <span style={{ color: cur.visited.length === N && done ? "#22c55e" : "var(--text-muted)" }}>all connected? {done ? "✓" : "..."}</span>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
