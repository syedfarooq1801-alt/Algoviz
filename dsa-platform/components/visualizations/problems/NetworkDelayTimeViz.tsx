"use client";
import { useState, useRef, useEffect } from "react";

// times = [[2,1,1],[2,3,1],[3,4,1]], n=4, k=2
const N_NODES = 4;
const EDGES = [[2,1,1],[2,3,1],[3,4,1]]; // [from, to, weight]
const SOURCE = 2;
const INF = Infinity;

// Dijkstra steps from node 2
const DIJKSTRA_STEPS: {dist: Record<number,number>, visited: Set<number>, current: number, msg: string}[] = [
  { dist: { 1: INF, 2: 0, 3: INF, 4: INF }, visited: new Set<number>(), current: 2, msg: "Start at node 2, dist[2]=0. All others=∞." },
  { dist: { 1: 1, 2: 0, 3: 1, 4: INF }, visited: new Set([2]), current: 1, msg: "Process node 2: update neighbors. dist[1]=1, dist[3]=1. Pick min: node 1." },
  { dist: { 1: 1, 2: 0, 3: 1, 4: INF }, visited: new Set([2,1]), current: 3, msg: "Process node 1: no unvisited neighbors. Pick next min: node 3." },
  { dist: { 1: 1, 2: 0, 3: 1, 4: 2 }, visited: new Set([2,1,3]), current: 4, msg: "Process node 3: update dist[4]=dist[3]+1=2. Pick node 4." },
  { dist: { 1: 1, 2: 0, 3: 1, 4: 2 }, visited: new Set([2,1,3,4]), current: -1, msg: "All nodes visited! Max dist = max(1,0,1,2) = 2." },
];

const NODE_POS = [{ x: 0, y: 0 }, { x: 90, y: 80 }, { x: 220, y: 40 }, { x: 310, y: 120 }, { x: 400, y: 60 }];

export default function NetworkDelayTimeViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1100);
  const [msg, setMsg] = useState("Dijkstra from source. Network delay = max dist to any node.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Dijkstra from source. Network delay = max dist to any node.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= DIJKSTRA_STEPS.length) { setDone(true); setPlaying(false); setMsg("Max distance = 2. All nodes reachable."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(DIJKSTRA_STEPS[next].msg);
    if (next + 1 >= DIJKSTRA_STEPS.length) { setDone(true); setPlaying(false); setMsg("Network delay = max(1,0,1,2) = 2 ✓"); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = DIJKSTRA_STEPS[step];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Network Delay Time — Dijkstra's Algorithm</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Shortest path from source to all nodes. Answer = max of all shortest paths (if all reachable).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="460" height="180" viewBox="0 0 460 180" style={{ width: "100%", height: "auto" }} role="img" aria-label="Weighted directed graph with shortest-path network delay">
          <defs><marker id="arr3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(107,114,128,0.6)" /></marker></defs>
          {EDGES.map(([from, to, w], i) => (
            <g key={i}>
              <line x1={NODE_POS[from].x} y1={NODE_POS[from].y + 20} x2={NODE_POS[to].x} y2={NODE_POS[to].y + 20} stroke="rgba(107,114,128,0.5)" strokeWidth="1.5" markerEnd="url(#arr3)" />
              <text x={(NODE_POS[from].x + NODE_POS[to].x) / 2} y={(NODE_POS[from].y + NODE_POS[to].y) / 2 + 15} textAnchor="middle" fill="#f97316" fontSize="11">{w}</text>
            </g>
          ))}
          {[1,2,3,4].map(n => {
            const pos = NODE_POS[n];
            const isVisited = cur.visited.has(n);
            const isCurrent = cur.current === n;
            const dist = cur.dist[n];
            return (
              <g key={n}>
                <circle cx={pos.x} cy={pos.y + 20} r={20} fill={isCurrent ? "rgba(249,115,22,0.35)" : isVisited ? "rgba(34,197,94,0.2)" : "rgba(79,142,247,0.1)"} stroke={isCurrent ? "#f97316" : isVisited ? "#22c55e" : "#4f8ef7"} strokeWidth={isCurrent ? 2.5 : 1.5} />
                <text x={pos.x} y={pos.y + 25} textAnchor="middle" fill={isCurrent ? "#f97316" : isVisited ? "#22c55e" : "#4f8ef7"} fontSize="12" fontWeight="bold">{n}</text>
                <text x={pos.x} y={pos.y - 8} textAnchor="middle" fill={dist === INF ? "#ef4444" : "#22c55e"} fontSize="10">{dist === INF ? "∞" : dist}</text>
              </g>
            );
          })}
        </svg>
        <div className="flex gap-3 text-xs mt-2">
          <span style={{ color: "#f97316" }}>■ current</span>
          <span style={{ color: "#22c55e" }}>■ visited</span>
          <span style={{ color: "#4f8ef7" }}>■ unvisited</span>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Distance table</div>
        <div className="flex gap-3">
          {[1,2,3,4].map(n => (
            <div key={n} className="flex-1 text-center rounded-lg py-2" style={{ background: "var(--bg-hover)" }}>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Node {n}</div>
              <div className="text-lg font-bold" style={{ color: cur.dist[n] === INF ? "#ef4444" : "#22c55e" }}>{cur.dist[n] === INF ? "∞" : cur.dist[n]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
