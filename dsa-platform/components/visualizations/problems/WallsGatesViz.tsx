"use client";
import { useState, useRef, useEffect } from "react";

// INF=2147483647, -1=wall, 0=gate
// Grid (4x4):
// INF  -1  0  INF
// INF INF INF  -1
// INF  -1 INF  -1
//  0  -1 INF INF
const INF = 2147483647;
const W = -1;
const G = 0;
const INIT_GRID = [
  [INF, W,   G,   INF],
  [INF, INF, INF, W  ],
  [INF, W,   INF, W  ],
  [G,   W,   INF, INF],
];
const FINAL_GRID = [
  [3,  W, 0,  1 ],
  [2,  2, 1,  W ],
  [1,  W, 2,  W ],
  [0,  W, 3,  4 ],
];

const buildSteps = () => {
  const steps: { grid: (number|string)[][], msg: string }[] = [];
  // BFS from all gates simultaneously
  const grid = INIT_GRID.map(r => [...r]);
  steps.push({ grid: grid.map(r => r.map(v => v === INF ? "∞" : v)), msg: "Multi-source BFS from all gates (0s) simultaneously." });
  // Step 1: dist=1 cells
  const dist1 = [[0,2,0,3],[1,1,1,2],[1,2,3,2]];
  const g1 = INIT_GRID.map(r => [...r]);
  g1[0][3]=1; g1[1][2]=1; g1[2][0]=1;
  steps.push({ grid: g1.map(r => r.map(v => v === INF ? "∞" : v)), msg: "Distance 1: cells adjacent to gates get dist=1." });
  const g2 = FINAL_GRID.map(r => [...r]);
  steps.push({ grid: g2.map(r => r.map(v => v === INF ? "∞" : v)), msg: "BFS complete! All reachable cells have min distance to nearest gate." });
  return steps;
};
const STEPS = buildSteps();

export default function WallsGatesViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Multi-source BFS from all gates. Fill distances outward simultaneously.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Multi-source BFS from all gates. Fill distances outward simultaneously.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("All cells filled with min distance to nearest gate!"); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Walls & Gates complete! Multi-source BFS fills all empty rooms."); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Walls and Gates — Multi-Source BFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Push all gates into queue. BFS outward. Each cell = min dist to nearest gate.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          {cur.grid.map((row, r) => (
            row.map((v, c) => {
              const isGate = v === 0 || v === "0";
              const isWall = v === W || v === -1;
              const isInf = v === "∞";
              const numV = typeof v === 'number' ? v : NaN;
              return (
                <div key={`${r}-${c}`} className="aspect-square flex items-center justify-center rounded-lg text-sm font-bold" style={{ background: isGate ? "rgba(34,197,94,0.35)" : isWall ? "rgba(107,114,128,0.35)" : isInf ? "var(--bg-hover)" : "rgba(79,142,247,0.2)", border: isGate ? "2px solid #22c55e" : isWall ? "1px solid rgba(107,114,128,0.5)" : isInf ? "1px dashed rgba(79,142,247,0.2)" : "1px solid rgba(79,142,247,0.4)", color: isGate ? "#22c55e" : isWall ? "var(--text-muted)" : isInf ? "rgba(79,142,247,0.3)" : "#4f8ef7" }}>
                  {isWall ? "▪" : v.toString()}
                </div>
              );
            })
          ))}
        </div>
        <div className="flex gap-3 mt-3 text-xs">
          <span style={{ color: "#22c55e" }}>■ gate(0)</span>
          <span style={{ color: "var(--text-muted)" }}>■ wall(-1)</span>
          <span style={{ color: "#4f8ef7" }}>■ dist</span>
          <span style={{ color: "rgba(79,142,247,0.5)" }}>■ unreached(∞)</span>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
