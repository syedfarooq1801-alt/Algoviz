"use client";
import { useState, useRef, useEffect } from "react";

// n=5, edges=[[0,1],[1,2],[3,4]]
// Components: {0,1,2} and {3,4}
const N = 5;
const EDGES = [[0,1],[1,2],[3,4]];
const ADJ: number[][] = Array.from({ length: N }, () => []);
EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });

const NODE_POS = [{ x: 80, y: 80 }, { x: 160, y: 40 }, { x: 240, y: 80 }, { x: 310, y: 130 }, { x: 390, y: 100 }];
const COLORS = ["#4f8ef7", "#22c55e", "#f97316"];

const BFS_STEPS = [
  { visit: 0, component: 0, queue: [0], visited: [0], msg: "Start BFS from 0. Component 0." },
  { visit: 1, component: 0, queue: [1], visited: [0,1], msg: "0's neighbor: 1. Add to queue." },
  { visit: 2, component: 0, queue: [2], visited: [0,1,2], msg: "1's neighbor: 2. Add to queue." },
  { visit: 2, component: 0, queue: [], visited: [0,1,2], msg: "2's neighbors exhausted. Component 0 done: {0,1,2}." },
  { visit: 3, component: 1, queue: [3], visited: [0,1,2,3], msg: "Node 3 unvisited. Start BFS from 3. Component 1." },
  { visit: 4, component: 1, queue: [4], visited: [0,1,2,3,4], msg: "3's neighbor: 4. Add to queue." },
  { visit: 4, component: 1, queue: [], visited: [0,1,2,3,4], msg: "All nodes visited. Total components = 2." },
];

export default function NumConnectedComponentsViz() {
  const [step, setStep] = useState(-1);
  const [nodeColors, setNodeColors] = useState<number[]>(Array(N).fill(-1));
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("BFS/DFS: count connected components. Each new unvisited node = new component.");
  const stateRef = useRef({ step: -1, nodeColors: Array(N).fill(-1) });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1, nodeColors: Array(N).fill(-1) };
    setStep(-1); setNodeColors(Array(N).fill(-1)); setDone(false); setPlaying(false);
    setMsg("BFS/DFS: count connected components. Each new unvisited node = new component.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s, nodeColors: nc } = stateRef.current;
    const next = s + 1;
    if (next >= BFS_STEPS.length) { setDone(true); setPlaying(false); setMsg("2 connected components found!"); return; }
    const cur = BFS_STEPS[next];
    const newNc = [...nc];
    cur.visited.forEach(v => { newNc[v] = cur.component; });
    stateRef.current = { step: next, nodeColors: newNc };
    setStep(next); setNodeColors(newNc); setMsg(cur.msg);
    if (next + 1 >= BFS_STEPS.length) { setDone(true); setPlaying(false); setMsg("Total connected components = 2 ✓"); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const components = step >= 0 ? BFS_STEPS[step] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Number of Connected Components — BFS/Union Find</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Iterate nodes. For each unvisited: BFS to mark all reachable, increment count.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="480" height="180" viewBox="0 0 480 180" style={{ width: "100%", height: "auto" }} role="img" aria-label="Graph with connected components highlighted">
          {EDGES.map(([a, b], i) => (
            <line key={i} x1={NODE_POS[a].x} y1={NODE_POS[a].y} x2={NODE_POS[b].x} y2={NODE_POS[b].y} stroke="rgba(107,114,128,0.5)" strokeWidth="2" />
          ))}
          {Array.from({ length: N }, (_, i) => {
            const colorIdx = nodeColors[i];
            const color = colorIdx >= 0 ? COLORS[colorIdx] : "rgba(107,114,128,0.4)";
            const fill = colorIdx >= 0 ? `${color}33` : "rgba(107,114,128,0.1)";
            const isActive = components?.visit === i;
            return (
              <g key={i}>
                <circle cx={NODE_POS[i].x} cy={NODE_POS[i].y} r={20} fill={isActive ? `${color}55` : fill} stroke={color} strokeWidth={isActive ? 3 : 2} />
                <text x={NODE_POS[i].x} y={NODE_POS[i].y + 5} textAnchor="middle" fill={colorIdx >= 0 ? color : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{i}</text>
              </g>
            );
          })}
        </svg>
        <div className="flex gap-3 mt-2">
          {COLORS.slice(0, done ? 2 : (components ? components.component + 1 : 0)).map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: c }}>
              <div className="w-3 h-3 rounded-full" style={{ background: c }} />
              Component {i}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>Components found</div>
        <div className="text-3xl font-bold" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>{done ? 2 : components ? components.component + 1 : 0}</div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
