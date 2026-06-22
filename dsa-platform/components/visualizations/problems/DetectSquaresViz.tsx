"use client";
import { useState, useRef, useEffect } from "react";

// Add points: (3,10),(11,2),(3,2) then count squares with (11,10)
const OPERATIONS = [
  { op:"add", pt:[3,10], pts:[[3,10]], msg:"add([3,10]): Store in HashMap {x→{y→count}}." },
  { op:"add", pt:[11,2], pts:[[3,10],[11,2]], msg:"add([11,2]): pts now {(3,10),(11,2)}." },
  { op:"add", pt:[3,2], pts:[[3,10],[11,2],[3,2]], msg:"add([3,2]): pts now {(3,10),(11,2),(3,2)}." },
  { op:"count", pt:[11,10], pts:[[3,10],[11,2],[3,2]], result:1, msg:"count([11,10]): Find axis-aligned squares with this as corner." },
  { op:"count", pt:[11,10], pts:[[3,10],[11,2],[3,2]], result:1, msg:"Diagonal: (3,10)↔(11,10). Check if (3,2) and (11,2) exist: YES → 1 square." },
];

const SCALE = 18;
const OFFSET_X = 15, OFFSET_Y = 15;
const px = (x: number) => OFFSET_X + x * SCALE;
const py = (y: number) => 230 - OFFSET_Y - y * SCALE;

export default function DetectSquaresViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("For each query: pick diagonal point. Check if other 2 corners exist in map.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("For each query: pick diagonal point. Check if other 2 corners exist in map.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= OPERATIONS.length) { setDone(true); setPlaying(false); setMsg("count([11,10]) = 1 square found."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(OPERATIONS[next].msg);
    if (next + 1 >= OPERATIONS.length) { setDone(true); setPlaying(false); setMsg("Answer = 1 ✓"); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = OPERATIONS[step];
  const queryPt = [11,10];
  const isQuery = cur.op === "count";
  const squareCorners = [[3,10],[11,10],[3,2],[11,2]];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Detect Squares — HashMap</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Store points with counts. For count(p): iterate all same-x points as diagonal, check 2 remaining corners.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="400" height="250" viewBox="0 0 400 250" style={{ width: "100%", height: "auto" }}>
          {/* Grid */}
          {[0,2,4,6,8,10,12].map(x => (
            <line key={`gx${x}`} x1={px(x)} y1={py(0)} x2={px(x)} y2={py(12)} stroke="rgba(107,114,128,0.1)" strokeWidth="0.5" />
          ))}
          {[0,2,4,6,8,10,12].map(y => (
            <line key={`gy${y}`} x1={px(0)} y1={py(y)} x2={px(12)} y2={py(y)} stroke="rgba(107,114,128,0.1)" strokeWidth="0.5" />
          ))}
          {/* Axes */}
          <line x1={px(0)} y1={py(0)} x2={px(12)} y2={py(0)} stroke="rgba(107,114,128,0.4)" strokeWidth="1" />
          <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(12)} stroke="rgba(107,114,128,0.4)" strokeWidth="1" />
          {/* Square outline when detected */}
          {isQuery && (
            <rect x={Math.min(px(3),px(11))} y={Math.min(py(10),py(2))} width={Math.abs(px(11)-px(3))} height={Math.abs(py(10)-py(2))} fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" strokeDasharray={done?"none":"5"} />
          )}
          {/* Stored points */}
          {cur.pts.map(([x,y],i) => (
            <g key={i}>
              <circle cx={px(x)} cy={py(y)} r={6} fill="rgba(79,142,247,0.5)" stroke="#4f8ef7" strokeWidth="1.5" />
              <text x={px(x)+8} y={py(y)+4} fill="#4f8ef7" fontSize="9">({x},{y})</text>
            </g>
          ))}
          {/* Query point */}
          {isQuery && (
            <g>
              <circle cx={px(queryPt[0])} cy={py(queryPt[1])} r={8} fill="rgba(249,115,22,0.5)" stroke="#f97316" strokeWidth="2" />
              <text x={px(queryPt[0])+10} y={py(queryPt[1])+4} fill="#f97316" fontSize="9">({queryPt[0]},{queryPt[1]}) ←query</text>
            </g>
          )}
        </svg>
      </div>
      {done && (
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-3xl font-bold" style={{ color: "#22c55e" }}>1</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>square detected</div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
