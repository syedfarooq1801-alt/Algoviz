"use client";
import { useState, useRef, useEffect } from "react";

// Tree: [-10, 9, 20, null, null, 15, 7]
// Max path: 15→20→7 = 42
const STEPS = [
  { node: 9, leftGain: 0, rightGain: 0, gain: 9, pathThru: 9, msg: "Node 9: leaf. Gain=9, path_through_9=9. maxSum=9." },
  { node: 15, leftGain: 0, rightGain: 0, gain: 15, pathThru: 15, msg: "Node 15: leaf. Gain=15, path_through=15. maxSum=15." },
  { node: 7, leftGain: 0, rightGain: 0, gain: 7, pathThru: 7, msg: "Node 7: leaf. Gain=7, path_through=7. maxSum=15." },
  { node: 20, leftGain: 15, rightGain: 7, gain: 20, pathThru: 42, msg: "Node 20: leftGain=15, rightGain=7. path_through=15+20+7=42. maxSum=42! Return 20+max(15,7)=35." },
  { node: -10, leftGain: 9, rightGain: 35, gain: -10, pathThru: 34, msg: "Root -10: 9+(-10)+35=34. max gain=-10+35=25. Final maxSum=42." },
];

export default function MaxPathSumViz() {
  const [step, setStep] = useState(-1);
  const [maxSum, setMaxSum] = useState(-Infinity);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1100);
  const [msg, setMsg] = useState("DFS: at each node compute max gain and max path through node.");
  const stateRef = useRef({ step: -1, maxSum: -Infinity });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1, maxSum: -Infinity };
    setStep(-1); setMaxSum(-Infinity); setDone(false); setPlaying(false);
    setMsg("DFS: at each node compute max gain and max path through node.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s, maxSum: ms } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Final maxSum = ${ms}`); return; }
    const cur = STEPS[next];
    const newMs = Math.max(ms, cur.pathThru);
    stateRef.current = { step: next, maxSum: newMs };
    setStep(next); setMaxSum(newMs); setMsg(cur.msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Max path sum = ${newMs} (path: 15→20→7)`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const NODE_POS: Record<number, { x: number; y: number }> = {
    [-10]: { x: 190, y: 20 }, 9: { x: 100, y: 90 }, 20: { x: 280, y: 90 }, 15: { x: 220, y: 160 }, 7: { x: 340, y: 160 }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Binary Tree Max Path Sum — DFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Each node: gain = val + max(left,0) + max(right,0). Track global max.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <svg width="400" height="210" viewBox="0 0 400 210" style={{ width: "100%", height: "auto" }}>
            <line x1="190" y1="40" x2="100" y2="90" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
            <line x1="190" y1="40" x2="280" y2="90" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
            <line x1="280" y1="110" x2="220" y2="160" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
            <line x1="280" y1="110" x2="340" y2="160" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
            {([-10, 9, 20, 15, 7] as number[]).map(v => {
              const pos = NODE_POS[v];
              if (!pos) return null;
              const isActive = step >= 0 && STEPS[step].node === v;
              const visited = step >= 0 && STEPS.slice(0, step + 1).some(s => s.node === v);
              const isPath = done && [15, 20, 7].includes(v);
              return (
                <g key={v}>
                  <circle cx={pos.x} cy={pos.y + 20} r={18} fill={isPath ? "rgba(34,197,94,0.35)" : isActive ? "rgba(249,115,22,0.35)" : visited ? "rgba(79,142,247,0.2)" : "rgba(79,142,247,0.08)"} stroke={isPath ? "#22c55e" : isActive ? "#f97316" : visited ? "#4f8ef7" : "rgba(79,142,247,0.3)"} strokeWidth={isActive || isPath ? 2.5 : 1.5} />
                  <text x={pos.x} y={pos.y + 25} textAnchor="middle" fill={isPath ? "#22c55e" : isActive ? "#f97316" : "var(--text-secondary)"} fontSize="12" fontWeight="bold">{v}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {step >= 0 && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Current node:</span><span style={{ color: "#f97316", fontWeight: "bold" }}>{STEPS[step].node}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Left gain:</span><span style={{ color: "#4f8ef7" }}>{STEPS[step].leftGain}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Right gain:</span><span style={{ color: "#a855f7" }}>{STEPS[step].rightGain}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Path through:</span><span style={{ color: "#22c55e", fontWeight: "bold" }}>{STEPS[step].pathThru}</span></div>
            </div>
          )}
          <div className="rounded-lg p-3 text-center" style={{ background: done ? "rgba(34,197,94,0.1)" : "var(--bg-hover)", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "var(--border)"}` }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Global maxSum</div>
            <div className="text-3xl font-bold" style={{ color: done ? "#22c55e" : "#f97316" }}>{maxSum === -Infinity ? "-∞" : maxSum}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
