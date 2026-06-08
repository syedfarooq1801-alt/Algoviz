"use client";
import { useState, useRef, useEffect } from "react";

// n=6, edges=[[0,1],[0,2],[3,5],[5,4],[4,3]], src=0, dst=5
const N = 6;
const EDGES = [[0,1],[0,2],[3,5],[5,4],[4,3]];
const SRC = 0, DST = 5;
const ADJ: number[][] = Array.from({ length: N }, () => []);
EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });

const NODE_POS = [{ x: 80, y: 80 }, { x: 40, y: 170 }, { x: 160, y: 170 }, { x: 360, y: 80 }, { x: 320, y: 170 }, { x: 400, y: 170 }];

const BFS_STEPS = [
  { visited: [0], queue: [0], msg: "BFS from 0. Visited={0}." },
  { visited: [0,1,2], queue: [1,2], msg: "0's neighbors: 1,2. Added to visited." },
  { visited: [0,1,2], queue: [], msg: "1,2 have no unvisited neighbors. Queue empty." },
  { visited: [0,1,2], queue: [], msg: "5 not in visited! No path from 0 to 5. Return false." },
];

export default function FindPathExistsViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState(`BFS from source ${SRC} to find if path to ${DST} exists.`);
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg(`BFS from source ${SRC} to find if path to ${DST} exists.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= BFS_STEPS.length) { setDone(true); setPlaying(false); setMsg(`Path from ${SRC} to ${DST}: FALSE (disconnected graph)`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(BFS_STEPS[next].msg);
    if (next + 1 >= BFS_STEPS.length) { setDone(true); setPlaying(false); setMsg(`No path exists from ${SRC} to ${DST} → FALSE`); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Find if Path Exists in Graph — BFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>BFS/DFS from source. If destination visited = true. Else false.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="460" height="240" viewBox="0 0 460 240" style={{ width: "100%", height: "auto" }}>
          {EDGES.map(([a, b], i) => (
            <line key={i} x1={NODE_POS[a].x} y1={NODE_POS[a].y} x2={NODE_POS[b].x} y2={NODE_POS[b].y} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
          ))}
          {Array.from({ length: N }, (_, i) => {
            const visited = cur.visited.includes(i);
            const isSrc = i === SRC, isDst = i === DST;
            return (
              <g key={i}>
                <circle cx={NODE_POS[i].x} cy={NODE_POS[i].y} r={22} fill={isSrc ? "rgba(79,142,247,0.35)" : isDst ? "rgba(239,68,68,0.2)" : visited ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.1)"} stroke={isSrc ? "#4f8ef7" : isDst ? "#ef4444" : visited ? "#22c55e" : "rgba(107,114,128,0.4)"} strokeWidth="2" />
                <text x={NODE_POS[i].x} y={NODE_POS[i].y + 5} textAnchor="middle" fill={isSrc ? "#4f8ef7" : isDst ? "#ef4444" : visited ? "#22c55e" : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{i}</text>
                {isSrc && <text x={NODE_POS[i].x} y={NODE_POS[i].y - 27} textAnchor="middle" fill="#4f8ef7" fontSize="9">src</text>}
                {isDst && <text x={NODE_POS[i].x} y={NODE_POS[i].y - 27} textAnchor="middle" fill="#ef4444" fontSize="9">dst</text>}
              </g>
            );
          })}
        </svg>
        <div className="mt-2 flex gap-3 text-xs">
          <span style={{ color: "#4f8ef7" }}>■ source</span>
          <span style={{ color: "#ef4444" }}>■ dest</span>
          <span style={{ color: "#22c55e" }}>■ visited</span>
          <span style={{ color: "var(--text-muted)" }}>■ unvisited</span>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(239,68,68,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#ef4444" : "#4f8ef7", border: `1px solid ${done ? "rgba(239,68,68,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
