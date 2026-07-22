"use client";
import { useState, useRef, useEffect } from "react";

// n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0,dst=3,k=1
// Answer: 700 (0→1→3 with 1 stop)
const N = 4;
const FLIGHTS = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]];
const SRC=0, DST=3, K=1;
const NODE_POS = [{x:60,y:110},{x:180,y:40},{x:300,y:110},{x:180,y:190}];

// Bellman-Ford k+1 iterations
const buildSteps = () => {
  const steps: {prices: number[], msg: string, relaxed: number[]}[] = [];
  const INF = Infinity;
  let prices = Array(N).fill(INF);
  prices[SRC] = 0;
  steps.push({prices:[...prices], msg: `Init: prices=[0,∞,∞,∞]. Run ${K+1} Bellman-Ford iterations (k stops = k+1 edges).`, relaxed:[]});
  for (let i = 0; i <= K; i++) {
    const tmp = [...prices];
    const relaxed: number[] = [];
    for (const [u,v,w] of FLIGHTS) {
      if (prices[u] !== INF && prices[u]+w < tmp[v]) {
        tmp[v] = prices[u]+w;
        relaxed.push(v);
      }
    }
    prices = tmp;
    steps.push({prices:[...prices], msg: `Iter ${i+1}/${K+1}: relax edges. prices=[${prices.map(p=>p===INF?"∞":p).join(",")}]`, relaxed});
  }
  return steps;
};
const STEPS = buildSteps();

export default function CheapestFlightsViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Bellman-Ford with k+1 iterations. At most k stops = at most k+1 edges.`);
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Bellman-Ford with k+1 iterations. At most k stops = at most k+1 edges.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Min cost = ${STEPS[STEPS.length-1].prices[DST]} (0→1→3, 1 stop)`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Answer = ${STEPS[next].prices[DST]}: 0→1(+100)→3(+600)=700`); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Cheapest Flights Within K Stops — Bellman-Ford</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>k stops = k+1 edges. Run Bellman-Ford exactly k+1 times. Work on copy to prevent chaining.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="380" height="240" viewBox="0 0 380 240" style={{ width: "100%", height: "auto" }} role="img" aria-label="Flight route graph with cost and stop constraints">
          <defs>
            <marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(107,114,128,0.5)" />
            </marker>
          </defs>
          {FLIGHTS.map(([u,v,w],i) => {
            const p1=NODE_POS[u], p2=NODE_POS[v];
            const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
            const dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.sqrt(dx*dx+dy*dy);
            const nx=-dy/len*12, ny=dx/len*12;
            return (
              <g key={i}>
                <line x1={p1.x+(p2.x-p1.x)*0.15} y1={p1.y+(p2.y-p1.y)*0.15} x2={p2.x-(p2.x-p1.x)*0.15} y2={p2.y-(p2.y-p1.y)*0.15} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" markerEnd="url(#arr2)" />
                <text x={mx+nx} y={my+ny} textAnchor="middle" fill="var(--text-muted)" fontSize="10">{w}</text>
              </g>
            );
          })}
          {NODE_POS.map((p,i) => {
            const price = cur.prices[i];
            const relaxed = cur.relaxed?.includes(i);
            const isSrc = i === SRC, isDst = i === DST;
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={24} fill={relaxed ? "rgba(34,197,94,0.25)" : isSrc ? "rgba(79,142,247,0.3)" : isDst && done ? "rgba(34,197,94,0.35)" : "var(--bg-hover)"} stroke={relaxed ? "#22c55e" : isSrc ? "#4f8ef7" : isDst ? "#f97316" : "rgba(107,114,128,0.4)"} strokeWidth="2" />
                <text x={p.x} y={p.y-3} textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontWeight="bold">{i}{isSrc?"(src)":isDst?"(dst)":""}</text>
                <text x={p.x} y={p.y+12} textAnchor="middle" fill={price === Infinity ? "rgba(107,114,128,0.4)" : relaxed ? "#22c55e" : "#4f8ef7"} fontSize="10">{price === Infinity ? "∞" : price}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
