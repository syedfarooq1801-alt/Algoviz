"use client";
import { useState, useRef, useEffect } from "react";

// Graph: [[2,4],[1,3],[2,4],[1,3]] — 4 nodes
const NODE_POS = [{ x:120,y:60 },{ x:260,y:60 },{ x:260,y:160 },{ x:120,y:160 }];
const EDGES = [[0,1],[1,2],[2,3],[3,0]];

const STEPS = [
  { cloned: [] as number[], visiting: 0, msg: "DFS from node 1. Not in visited map → create clone 1'." },
  { cloned: [0], visiting: 1, msg: "Visit neighbor 2. Not cloned → create clone 2'. DFS into it." },
  { cloned: [0,1], visiting: 2, msg: "Visit neighbor 3. Not cloned → create clone 3'. DFS into it." },
  { cloned: [0,1,2], visiting: 3, msg: "Visit neighbor 4. Not cloned → create clone 4'. DFS into it." },
  { cloned: [0,1,2,3], visiting: -1, msg: "All neighbors of 4 already cloned. Backtrack. All nodes cloned!" },
];

export default function CloneGraphViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("DFS/BFS + hashmap. visited[node] = clone. If already visited, return clone.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("DFS/BFS + hashmap. visited[node] = clone. If already visited, return clone.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Deep clone complete! All 4 nodes and 4 edges copied."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Graph cloned! O(n) time and space."); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Clone Graph — DFS + HashMap</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Map old→new node. If already mapped, return existing clone (prevents infinite loop).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Original</div>
          <svg width="360" height="220" viewBox="0 0 360 220" style={{ width: "100%", height: "auto" }} role="img" aria-label="Original graph before cloning">
            {EDGES.map(([a,b],i) => (
              <line key={i} x1={NODE_POS[a].x} y1={NODE_POS[a].y} x2={NODE_POS[b].x} y2={NODE_POS[b].y} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
            ))}
            {NODE_POS.map((p,i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={22} fill={i === cur.visiting ? "rgba(249,115,22,0.3)" : "rgba(79,142,247,0.15)"} stroke={i === cur.visiting ? "#f97316" : "#4f8ef7"} strokeWidth="2" />
                <text x={p.x} y={p.y+5} textAnchor="middle" fill={i === cur.visiting ? "#f97316" : "#4f8ef7"} fontSize="13" fontWeight="bold">{i+1}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Clone</div>
          <svg width="360" height="220" viewBox="0 0 360 220" style={{ width: "100%", height: "auto" }} role="img" aria-label="Cloned graph after deep copy">
            {EDGES.filter(([a,b]) => cur.cloned.includes(a) && cur.cloned.includes(b)).map(([a,b],i) => (
              <line key={i} x1={NODE_POS[a].x} y1={NODE_POS[a].y} x2={NODE_POS[b].x} y2={NODE_POS[b].y} stroke="rgba(34,197,94,0.5)" strokeWidth="1.5" />
            ))}
            {NODE_POS.map((p,i) => {
              const cloned = cur.cloned.includes(i);
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={22} fill={cloned ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.05)"} stroke={cloned ? "#22c55e" : "rgba(107,114,128,0.2)"} strokeWidth="2" strokeDasharray={cloned ? undefined : "4"} />
                  <text x={p.x} y={p.y+5} textAnchor="middle" fill={cloned ? "#22c55e" : "rgba(107,114,128,0.3)"} fontSize="13" fontWeight="bold">{cloned ? `${i+1}'` : "?"}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
