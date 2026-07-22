"use client";
import { useState, useEffect, useRef } from "react";

const NODES = [3, 2, 0, -4];
const CYCLE_POS = 1;

export default function LinkedListCycleViz() {
  const [nodes] = useState(NODES);
  const [cycleAt] = useState(CYCLE_POS);
  const [slow, setSlow] = useState(-1);
  const [fast, setFast] = useState(-1);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<boolean|null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("Press Play — Floyd's cycle detection: slow moves 1, fast moves 2");
  const [trail, setTrail] = useState<number[]>([]);
  const stateRef = useRef({ slow:0, fast:0, step:0, trail:[] as number[] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const next = (idx: number) => idx === nodes.length-1 ? cycleAt : idx+1;

  const reset = () => {
    stateRef.current = { slow:0, fast:0, step:0, trail:[] };
    setSlow(0); setFast(0); setStep(0); setResult(null); setTrail([]); setPlaying(false);
    setMsg("slow=head, fast=head — start Floyd's algorithm");
    if (iRef.current) clearInterval(iRef.current);
  };

  useEffect(() => { reset(); }, []);

  const doStep = () => {
    const st = stateRef.current;
    if (st.step > 0 && (st.slow === st.fast)) {
      stateRef.current = { ...st, step:st.step+1 };
      setResult(true); setPlaying(false); setMsg(`slow(${st.slow}) == fast(${st.fast}) → CYCLE DETECTED!`); return;
    }
    if (st.step > nodes.length * 2) {
      setResult(false); setPlaying(false); setMsg("fast reached null → NO CYCLE"); return;
    }
    const ns = next(st.slow);
    const nf = next(next(st.fast));
    const nt = [...st.trail.slice(-6), st.slow];
    stateRef.current = { slow:ns, fast:nf, step:st.step+1, trail:nt };
    setSlow(ns); setFast(nf); setStep(st.step+1); setTrail(nt);
    setMsg(`step ${st.step+1}: slow → ${ns}(val=${nodes[ns]}), fast → ${nf}(val=${nodes[nf]})`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const done = result !== null;
  const r = 80;
  const cx = 200, cy = 120;
  const angles = nodes.map((_, i) => (i / nodes.length) * 2 * Math.PI - Math.PI / 2);
  const nodePositions = angles.map(a => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }));

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Linked List Cycle — Floyd's Tortoise & Hare</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>
          List: {nodes.join(" → ")} → (cycle back to index {cycleAt})
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* SVG visualization */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <svg width="400" height="240" style={{ display:"block", margin:"0 auto" }} role="img" aria-label="Linked list with fast and slow pointer cycle detection">
          {/* Edges */}
          {nodes.map((_, i) => {
            const from = nodePositions[i];
            const to = nodePositions[next(i)];
            const isCycle = i === nodes.length-1;
            const dx = to.x - from.x, dy = to.y - from.y;
            const len = Math.sqrt(dx*dx+dy*dy);
            const ex = from.x + dx/len*18, ey = from.y + dy/len*18;
            const ex2 = to.x - dx/len*18, ey2 = to.y - dy/len*18;
            return (
              <g key={i}>
                <defs><marker id={`arr${i}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill={isCycle?"#ef4444":"#4f8ef7"}/></marker></defs>
                <line x1={ex} y1={ey} x2={ex2} y2={ey2} stroke={isCycle?"#ef4444":"rgba(79,142,247,0.4)"} strokeWidth={isCycle?2:1.5} strokeDasharray={isCycle?"5,3":""} markerEnd={`url(#arr${i})`}/>
              </g>
            );
          })}
          {/* Nodes */}
          {nodes.map((v, i) => {
            const { x, y } = nodePositions[i];
            const isSlow = i === slow;
            const isFast = i === fast;
            const isBoth = isSlow && isFast;
            const isCycleNode = i === cycleAt;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={18} fill={isBoth?"rgba(239,68,68,0.3)":isSlow?"rgba(34,197,94,0.25)":isFast?"rgba(249,115,22,0.25)":isCycleNode?"rgba(168,85,247,0.15)":"rgba(79,142,247,0.1)"} stroke={isBoth?"#ef4444":isSlow?"#22c55e":isFast?"#f97316":isCycleNode?"#a855f7":"rgba(79,142,247,0.4)"} strokeWidth={isSlow||isFast?2.5:1.5}/>
                <text x={x} y={y+5} textAnchor="middle" fill={isBoth?"#ef4444":isSlow?"#22c55e":isFast?"#f97316":"#e8e8f0"} fontSize={12} fontFamily="monospace" fontWeight="bold">{v}</text>
                {isCycleNode&&<text x={x} y={y+30} textAnchor="middle" fill="#a855f7" fontSize={9}>cycle in</text>}
                {isSlow&&!isBoth&&<text x={x-22} y={y} textAnchor="end" fill="#22c55e" fontSize={9} fontWeight="bold">🐢</text>}
                {isFast&&!isBoth&&<text x={x+22} y={y} textAnchor="start" fill="#f97316" fontSize={9} fontWeight="bold">🐇</text>}
                {isBoth&&<text x={x} y={y-28} textAnchor="middle" fill="#ef4444" fontSize={10} fontWeight="bold">MEET!</text>}
              </g>
            );
          })}
        </svg>
        <div className="flex gap-4 justify-center text-xs mt-2">
          <span style={{ color:"#22c55e" }}>🐢 slow (×1)</span>
          <span style={{ color:"#f97316" }}>🐇 fast (×2)</span>
          <span style={{ color:"#a855f7" }}>◇ cycle entry</span>
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {result !== null && (
        <div className="rounded-xl p-4 text-center" style={{ background:result?"rgba(239,68,68,0.1)":"rgba(34,197,94,0.1)", border:`1px solid ${result?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
          <div className="font-semibold text-sm" style={{ color:result?"#ef4444":"#22c55e" }}>{result?"✓ Cycle detected (slow met fast)":"✗ No cycle found"}</div>
        </div>
      )}
    </div>
  );
}
