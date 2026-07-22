"use client";
import { useState, useRef, useEffect } from "react";

// points=[[0,0],[2,2],[3,10],[5,2],[7,0]]
const POINTS = [[0,0],[2,2],[3,10],[5,2],[7,0]];
const N = POINTS.length;
const SCALE = 30;
const OFFSET_X = 30, OFFSET_Y = 20;

const px = (x: number) => OFFSET_X + x * SCALE;
const py = (y: number) => 230 - OFFSET_Y - y * SCALE;

const dist = (a: number[], b: number[]) => Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);

// Prim's MST steps
const buildSteps = () => {
  const steps: {inMST: number[], edges: [number,number,number][], totalCost: number, msg: string}[] = [];
  const inMST = new Set<number>();
  const mstEdges: [number,number,number][] = [];
  let total = 0;
  inMST.add(0);
  steps.push({inMST:[0], edges:[], totalCost:0, msg:"Prim's from node 0. Pick min-cost edge to non-MST node."});
  while (inMST.size < N) {
    let minD = Infinity, minU = -1, minV = -1;
    for (const u of inMST) {
      for (let v = 0; v < N; v++) {
        if (!inMST.has(v)) {
          const d = dist(POINTS[u], POINTS[v]);
          if (d < minD) { minD=d; minU=u; minV=v; }
        }
      }
    }
    inMST.add(minV);
    mstEdges.push([minU!, minV, minD]);
    total += minD;
    steps.push({inMST:[...inMST], edges:[...mstEdges], totalCost:total, msg:`Add edge ${minU}→${minV} cost=${minD}. Total=${total}.`});
  }
  return steps;
};
const STEPS = buildSteps();

export default function MinCostConnectPointsViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Prim's MST. Connect all points with min total Manhattan distance.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Prim's MST. Connect all points with min total Manhattan distance.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Min cost = ${STEPS[STEPS.length-1].totalCost}`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`MST complete! Min cost = ${STEPS[next].totalCost}`); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Min Cost to Connect All Points — Prim's MST</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Manhattan distance edges. Prim's greedily picks minimum edge to unvisited node. O(n² log n).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="400" height="250" viewBox="0 0 400 250" style={{ width: "100%", height: "auto" }} role="img" aria-label="Points on a plane with minimum spanning tree connections">
          {cur.edges.map(([u,v,w],i) => (
            <g key={i}>
              <line x1={px(POINTS[u][0])} y1={py(POINTS[u][1])} x2={px(POINTS[v][0])} y2={py(POINTS[v][1])} stroke={i === cur.edges.length-1 && !done ? "#f97316" : "#22c55e"} strokeWidth="2" />
              <text x={(px(POINTS[u][0])+px(POINTS[v][0]))/2} y={(py(POINTS[u][1])+py(POINTS[v][1]))/2-5} textAnchor="middle" fill="var(--text-muted)" fontSize="9">{w}</text>
            </g>
          ))}
          {POINTS.map((p,i) => {
            const inMST = cur.inMST.includes(i);
            return (
              <g key={i}>
                <circle cx={px(p[0])} cy={py(p[1])} r={14} fill={inMST ? "rgba(34,197,94,0.3)" : "var(--bg-hover)"} stroke={inMST ? "#22c55e" : "rgba(107,114,128,0.5)"} strokeWidth="2" />
                <text x={px(p[0])} y={py(p[1])+4} textAnchor="middle" fill={inMST ? "#22c55e" : "var(--text-secondary)"} fontSize="11" fontWeight="bold">{i}</text>
                <text x={px(p[0])} y={py(p[1])+22} textAnchor="middle" fill="var(--text-muted)" fontSize="8">({p[0]},{p[1]})</text>
              </g>
            );
          })}
        </svg>
        <div className="flex items-center justify-between text-xs mt-1">
          <span style={{ color: "var(--text-muted)" }}>Total cost:</span>
          <span className="font-bold text-lg" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>{cur.totalCost}</span>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
