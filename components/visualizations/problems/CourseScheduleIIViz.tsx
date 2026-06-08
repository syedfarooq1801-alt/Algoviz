"use client";
import { useState, useRef, useEffect } from "react";

// 4 courses, prereqs: [[1,0],[2,0],[3,1],[3,2]]
// Topological order: [0,1,2,3] or [0,2,1,3]
const N = 4;
const PREREQS = [[1,0],[2,0],[3,1],[3,2]];
const TOPO_STEPS = [
  { processed: 0, queue: [0], indegree: [0,1,1,2], msg: "In-degrees: 0→0, 1→1, 2→1, 3→2. Start with in-degree 0: [0]" },
  { processed: 0, queue: [1,2], indegree: [0,0,0,2], msg: "Take 0 from queue. Neighbors 1,2 get in-degree--. Now [1,2] have in-degree 0." },
  { processed: 1, queue: [2,3], indegree: [0,0,0,1], msg: "Take 1 from queue. Order=[0,1]. Neighbor 3 in-degree-- → 1." },
  { processed: 2, queue: [3], indegree: [0,0,0,0], msg: "Take 2 from queue. Order=[0,1,2]. Neighbor 3 in-degree-- → 0, add to queue." },
  { processed: 3, queue: [], indegree: [0,0,0,0], msg: "Take 3 from queue. Order=[0,1,2,3]. Done! Valid order found." },
];

export default function CourseScheduleIIViz() {
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Kahn's algorithm: BFS with in-degree tracking.");
  const stateRef = useRef({ step: 0, order: [] as number[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0, order: [] };
    setStep(0); setOrder([]); setDone(false); setPlaying(false);
    setMsg("Kahn's algorithm: BFS with in-degree tracking.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s, order: o } = stateRef.current;
    if (s >= TOPO_STEPS.length) { setDone(true); setPlaying(false); return; }
    const cur = TOPO_STEPS[s];
    let newOrder = [...o];
    if (s > 0) newOrder = [...o, cur.processed];
    stateRef.current = { step: s + 1, order: newOrder };
    setStep(s + 1); setOrder(newOrder); setMsg(cur.msg);
    if (s + 1 >= TOPO_STEPS.length) {
      setDone(true); setPlaying(false);
      setMsg(`Course order: [${[...newOrder].join(" → ")}]`);
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const currentStep = TOPO_STEPS[Math.min(step, TOPO_STEPS.length - 1)];
  const NODE_POS = [{ x: 80, y: 100 }, { x: 200, y: 40 }, { x: 200, y: 160 }, { x: 320, y: 100 }];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Course Schedule II — Topological Sort (BFS)</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Kahn's: track in-degrees. Repeatedly take 0-in-degree nodes. If all processed = valid order.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Graph (directed edges = prereqs)</div>
          <svg width="360" height="200" viewBox="0 0 360 200" style={{ width: "100%", height: "auto" }}>
            {PREREQS.map(([a,b], i) => {
              const from = NODE_POS[b], to = NODE_POS[a];
              return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(107,114,128,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" />;
            })}
            <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(107,114,128,0.6)" /></marker></defs>
            {Array.from({length: N}, (_, i) => {
              const inOrder = order.includes(i);
              const isQueue = currentStep.queue.includes(i);
              return (
                <g key={i}>
                  <circle cx={NODE_POS[i].x} cy={NODE_POS[i].y} r={22} fill={inOrder ? "rgba(34,197,94,0.3)" : isQueue ? "rgba(79,142,247,0.3)" : "rgba(107,114,128,0.1)"} stroke={inOrder ? "#22c55e" : isQueue ? "#4f8ef7" : "rgba(107,114,128,0.4)"} strokeWidth="2" />
                  <text x={NODE_POS[i].x} y={NODE_POS[i].y + 5} textAnchor="middle" fill={inOrder ? "#22c55e" : isQueue ? "#4f8ef7" : "var(--text-secondary)"} fontSize="14" fontWeight="bold">{i}</text>
                  <text x={NODE_POS[i].x} y={NODE_POS[i].y - 27} textAnchor="middle" fill="#f97316" fontSize="10">d={currentStep.indegree[i]}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div>
            <div className="text-xs mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>Queue</div>
            <div className="flex gap-2">
              {currentStep.queue.map(v => (
                <div key={v} className="px-3 py-2 rounded text-sm font-bold" style={{ background: "rgba(79,142,247,0.2)", border: "1px solid #4f8ef7", color: "#4f8ef7" }}>{v}</div>
              ))}
              {currentStep.queue.length === 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>empty</span>}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>Order so far</div>
            <div className="flex gap-2 flex-wrap">
              {order.map((v, i) => (
                <div key={i} className="px-3 py-2 rounded text-sm font-bold" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}>{v}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
