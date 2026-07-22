"use client";
import { useState, useRef, useEffect } from "react";

// Main tree: [3,4,5,1,2], Sub tree: [4,1,2]
const MAIN_POS: Record<number,{x:number,y:number,v:number}> = {
  0:{x:200,y:30,v:3}, 1:{x:120,y:90,v:4}, 2:{x:280,y:90,v:5},
  3:{x:80,y:155,v:1}, 4:{x:160,y:155,v:2}
};
const MAIN_EDGES = [[0,1],[0,2],[1,3],[1,4]];
const SUB_POS: Record<number,{x:number,y:number,v:number}> = {
  0:{x:60,y:30,v:4}, 1:{x:30,y:90,v:1}, 2:{x:90,y:90,v:2}
};
const SUB_EDGES = [[0,1],[0,2]];

const STEPS = [
  { checking: 1, match: false, msg: "Check node 4 as subtree root. Start DFS comparison with subRoot." },
  { checking: 1, match: true, msg: "Node 4: val 4=4 ✓, left 1=1 ✓, right 2=2 ✓ — subtree FOUND!" },
];

export default function SubtreeOfAnotherViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("For each node in main tree, check if subtree rooted there = subRoot.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("For each node in main tree, check if subtree rooted there = subRoot.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("TRUE — node 4 in main tree matches subRoot exactly!"); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("TRUE — subtree exists at node 4!"); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Subtree of Another Tree — DFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>For each node, check if tree rooted there is identical to subRoot. O(m×n) time.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Main Tree [3,4,5,1,2]</div>
          <svg width="360" height="180" viewBox="0 0 360 180" style={{ width: "100%", height: "auto" }} role="img" aria-label="Main tree being searched">
            {MAIN_EDGES.map(([a,b],i) => (
              <line key={i} x1={MAIN_POS[a].x} y1={MAIN_POS[a].y} x2={MAIN_POS[b].x} y2={MAIN_POS[b].y} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
            ))}
            {Object.entries(MAIN_POS).map(([k, n]) => {
              const isChecking = parseInt(k) === cur.checking;
              const isMatch = cur.match && parseInt(k) === cur.checking;
              return (
                <g key={k}>
                  <circle cx={n.x} cy={n.y} r={18} fill={isMatch ? "rgba(34,197,94,0.3)" : isChecking ? "rgba(249,115,22,0.3)" : "var(--bg-hover)"} stroke={isMatch ? "#22c55e" : isChecking ? "#f97316" : "rgba(107,114,128,0.4)"} strokeWidth="2" />
                  <text x={n.x} y={n.y+5} textAnchor="middle" fill={isMatch ? "#22c55e" : isChecking ? "#f97316" : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{n.v}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>subRoot [4,1,2]</div>
          <svg width="160" height="120" viewBox="0 0 160 120" style={{ width: "100%", height: "auto" }} role="img" aria-label="Candidate subtree to match">
            {SUB_EDGES.map(([a,b],i) => (
              <line key={i} x1={SUB_POS[a].x} y1={SUB_POS[a].y} x2={SUB_POS[b].x} y2={SUB_POS[b].y} stroke="rgba(79,142,247,0.5)" strokeWidth="1.5" />
            ))}
            {Object.entries(SUB_POS).map(([k, n]) => (
              <g key={k}>
                <circle cx={n.x} cy={n.y} r={18} fill={done ? "rgba(34,197,94,0.25)" : "rgba(79,142,247,0.2)"} stroke={done ? "#22c55e" : "#4f8ef7"} strokeWidth="2" />
                <text x={n.x} y={n.y+5} textAnchor="middle" fill={done ? "#22c55e" : "#4f8ef7"} fontSize="13" fontWeight="bold">{n.v}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
