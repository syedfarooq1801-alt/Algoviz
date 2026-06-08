"use client";
import { useState, useRef, useEffect } from "react";

// Tree [3,9,20,null,null,15,7]
const NODES = [
  { id:0, x:200, y:35, v:3, level:0 },
  { id:1, x:110, y:100, v:9, level:1 },
  { id:2, x:290, y:100, v:20, level:1 },
  { id:3, x:245, y:165, v:15, level:2 },
  { id:4, x:335, y:165, v:7, level:2 },
];
const EDGES = [[0,1],[0,2],[2,3],[2,4]];
const LEVEL_AVGS = [3, 14.5, 11]; // [3], [9,20], [15,7]

const STEPS = [
  { level: 0, active: [0], msg: "Level 0: [3]. avg=3/1=3.0" },
  { level: 1, active: [1,2], msg: "Level 1: [9,20]. avg=29/2=14.5" },
  { level: 2, active: [3,4], msg: "Level 2: [15,7]. avg=22/2=11.0" },
];

export default function AverageOfLevelsViz() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("BFS level by level. Sum all nodes / count = average.");
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDone(false); setPlaying(false);
    setMsg("BFS level by level. Sum all nodes / count = average.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Result: [${LEVEL_AVGS.join(", ")}]`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Averages: [${LEVEL_AVGS.join(", ")}]`); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = step >= 0 ? STEPS[step] : null;
  const processedLevels = step >= 0 ? step + 1 : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Average of Levels in Binary Tree — BFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>BFS level-order. For each level: sum/count. Return array of averages.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="400" height="200" viewBox="0 0 400 200" style={{ width: "100%", height: "auto" }}>
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
          ))}
          {NODES.map(n => {
            const isActive = cur?.active.includes(n.id);
            const isDone = n.level < processedLevels;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={18} fill={isActive ? "rgba(249,115,22,0.35)" : isDone ? "rgba(34,197,94,0.2)" : "var(--bg-hover)"} stroke={isActive ? "#f97316" : isDone ? "#22c55e" : "rgba(107,114,128,0.4)"} strokeWidth="2" />
                <text x={n.x} y={n.y+5} textAnchor="middle" fill={isActive ? "#f97316" : isDone ? "#22c55e" : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{n.v}</text>
              </g>
            );
          })}
          {/* Level labels */}
          {[0,1,2].map(l => (
            <text key={l} x={10} y={[35,100,165][l]+5} fill={step >= l ? "#22c55e" : "var(--text-muted)"} fontSize="9">L{l}</text>
          ))}
        </svg>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Result array</div>
        <div className="flex gap-3">
          {LEVEL_AVGS.map((avg, i) => (
            <div key={i} className="flex-1 text-center rounded-lg py-2" style={{ background: i < processedLevels ? "rgba(34,197,94,0.12)" : "var(--bg-hover)", border: i === processedLevels - 1 ? "2px solid #f97316" : "1px solid var(--border)" }}>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>level {i}</div>
              <div className="text-lg font-bold" style={{ color: i < processedLevels ? "#22c55e" : "var(--text-muted)" }}>{i < processedLevels ? avg : "?"}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
