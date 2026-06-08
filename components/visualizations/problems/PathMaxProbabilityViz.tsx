"use client";
import { useState, useRef, useEffect } from "react";

// n=3, edges=[[0,1],[1,2],[0,2]], succProb=[0.5,0.5,0.2], start=0, end=2
// Path 0→2 prob=0.2, path 0→1→2 prob=0.5*0.5=0.25 → answer=0.25
const N = 3;
const EDGE_LIST = [[0,1,0.5],[1,2,0.5],[0,2,0.2]];
const NODE_POS = [{x:60,y:110},{x:200,y:30},{x:340,y:110}];

const buildSteps = () => {
  const steps: {prob: number[], visited: number[], msg: string}[] = [];
  const prob = Array(N).fill(0);
  prob[0] = 1.0;
  // Max heap by probability (Dijkstra)
  const pq: [number,number][] = [[1.0, 0]];
  const visited = new Set<number>();
  steps.push({prob:[...prob], visited:[], msg: "Init: prob[0]=1.0. Dijkstra with max-heap by probability."});
  while (pq.length) {
    pq.sort((a,b) => b[0]-a[0]);
    const [p, u] = pq.shift()!;
    if (visited.has(u)) continue;
    visited.add(u);
    for (const [a,b,w] of EDGE_LIST) {
      const v = a===u ? b : b===u ? a : -1;
      if (v === -1 || visited.has(v)) continue;
      const newP = p * w;
      if (newP > prob[v]) {
        prob[v] = newP;
        pq.push([newP, v]);
      }
    }
    steps.push({prob:[...prob], visited:[...visited], msg: `Process node ${u}(p=${p.toFixed(2)}). Update neighbors. prob=[${prob.map(x=>x.toFixed(2)).join(",")}]`});
  }
  return steps;
};
const STEPS = buildSteps();

export default function PathMaxProbabilityViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Modified Dijkstra: max probability instead of min cost. Multiply edge weights.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Modified Dijkstra: max probability instead of min cost. Multiply edge weights.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Max prob from 0 to 2 = ${STEPS[STEPS.length-1].prob[2].toFixed(2)} (path 0→1→2)`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Answer = ${STEPS[next].prob[2].toFixed(2)}`); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Path With Maximum Probability — Dijkstra</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Like Dijkstra but maximize (multiply probabilities). Max-heap, init 0=1.0, rest=0.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="400" height="160" viewBox="0 0 400 160" style={{ width: "100%", height: "auto" }}>
          <defs>
            <marker id="arrp" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(107,114,128,0.5)" />
            </marker>
          </defs>
          {EDGE_LIST.map(([u,v,w],i) => {
            const p1=NODE_POS[u], p2=NODE_POS[v];
            return (
              <g key={i}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
                <text x={(p1.x+p2.x)/2} y={(p1.y+p2.y)/2-6} textAnchor="middle" fill="var(--text-muted)" fontSize="10">{w}</text>
              </g>
            );
          })}
          {NODE_POS.map((p,i) => {
            const prob = cur.prob[i];
            const visited = cur.visited.includes(i);
            const isSrc = i===0, isDst = i===2;
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={24} fill={isDst && done ? "rgba(34,197,94,0.35)" : visited ? "rgba(34,197,94,0.2)" : isSrc ? "rgba(79,142,247,0.3)" : "var(--bg-hover)"} stroke={isDst && done ? "#22c55e" : visited ? "#22c55e" : isSrc ? "#4f8ef7" : "rgba(107,114,128,0.4)"} strokeWidth="2" />
                <text x={p.x} y={p.y-4} textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontWeight="bold">{i}{isSrc?"(src)":isDst?"(dst)":""}</text>
                <text x={p.x} y={p.y+12} textAnchor="middle" fill={prob > 0 ? "#22c55e" : "var(--text-muted)"} fontSize="10">{prob.toFixed(2)}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
