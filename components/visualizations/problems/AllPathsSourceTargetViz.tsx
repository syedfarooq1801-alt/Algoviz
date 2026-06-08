"use client";
import { useState, useRef, useEffect } from "react";

// graph = [[1,2],[3],[3],[]]
// Paths: 0→1→3, 0→2→3
const GRAPH = [[1,2],[3],[3],[]];
const N = 4;
const PATHS = [[0,1,3],[0,2,3]];

const STEPS = [
  { current: [0], msg: "Start DFS from 0. Path=[0]" },
  { current: [0,1], msg: "Visit 1. Path=[0,1]" },
  { current: [0,1,3], msg: "Visit 3 (target!). Add path [0,1,3]. Backtrack." },
  { current: [0,2], msg: "Backtrack to 0. Visit 2. Path=[0,2]" },
  { current: [0,2,3], msg: "Visit 3 (target!). Add path [0,2,3]. Done!" },
];

const NODE_POS = [{ x: 50, y: 90 }, { x: 160, y: 30 }, { x: 160, y: 150 }, { x: 280, y: 90 }];

export default function AllPathsSourceTargetViz() {
  const [step, setStep] = useState(-1);
  const [foundPaths, setFoundPaths] = useState<number[][]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("DFS from 0 to n-1. Collect all paths via backtracking.");
  const stateRef = useRef({ step: -1, foundPaths: [] as number[][] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1, foundPaths: [] };
    setStep(-1); setFoundPaths([]); setDone(false); setPlaying(false);
    setMsg("DFS from 0 to n-1. Collect all paths via backtracking.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s, foundPaths: fp } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Found ${PATHS.length} paths from 0 to ${N-1}`); return; }
    const cur = STEPS[next];
    let newFp = [...fp];
    if (cur.current[cur.current.length - 1] === N - 1) {
      newFp = [...fp, [...cur.current]];
    }
    stateRef.current = { step: next, foundPaths: newFp };
    setStep(next); setFoundPaths(newFp); setMsg(cur.msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`All paths: ${PATHS.map(p => p.join("→")).join(" | ")}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const currentPath = step >= 0 ? STEPS[step].current : [];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>All Paths Source → Target — DFS Backtracking</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>DFS with backtracking. Add node to path, recurse on neighbors, then remove.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <svg width="300" height="200" viewBox="0 0 300 200" style={{ width: "100%", height: "auto" }}>
            <defs><marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(107,114,128,0.5)" /></marker></defs>
            {GRAPH.map((neighbors, from) =>
              neighbors.map(to => {
                const onPath = currentPath.includes(from) && currentPath.includes(to);
                return <line key={`${from}-${to}`} x1={NODE_POS[from].x} y1={NODE_POS[from].y} x2={NODE_POS[to].x} y2={NODE_POS[to].y} stroke={onPath ? "#4f8ef7" : "rgba(107,114,128,0.4)"} strokeWidth={onPath ? 2.5 : 1.5} markerEnd="url(#arr2)" />;
              })
            )}
            {Array.from({length: N}, (_, i) => {
              const onPath = currentPath.includes(i);
              const isTarget = i === N - 1;
              return (
                <g key={i}>
                  <circle cx={NODE_POS[i].x} cy={NODE_POS[i].y} r={20} fill={onPath ? (isTarget && onPath ? "rgba(34,197,94,0.35)" : "rgba(79,142,247,0.3)") : "rgba(107,114,128,0.1)"} stroke={onPath ? (isTarget ? "#22c55e" : "#4f8ef7") : "rgba(107,114,128,0.4)"} strokeWidth={onPath ? 2.5 : 1.5} />
                  <text x={NODE_POS[i].x} y={NODE_POS[i].y + 5} textAnchor="middle" fill={onPath ? (isTarget ? "#22c55e" : "#4f8ef7") : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{i}</text>
                  {i === 0 && <text x={NODE_POS[i].x} y={NODE_POS[i].y - 25} textAnchor="middle" fill="#f97316" fontSize="9">src</text>}
                  {isTarget && <text x={NODE_POS[i].x} y={NODE_POS[i].y - 25} textAnchor="middle" fill="#22c55e" fontSize="9">dst</text>}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Current path</div>
          <div className="flex gap-1 items-center mb-4 flex-wrap">
            {currentPath.map((v, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "rgba(79,142,247,0.2)", border: "1px solid #4f8ef7", color: "#4f8ef7" }}>{v}</div>
                {i < currentPath.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
              </div>
            ))}
          </div>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Found paths</div>
          {foundPaths.map((p, i) => (
            <div key={i} className="text-xs px-2 py-1.5 rounded mb-1 font-mono" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>{p.join(" → ")}</div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
