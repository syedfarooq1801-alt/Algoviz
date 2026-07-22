"use client";
import { useState, useRef, useEffect } from "react";

// Tree: [1,2,3,null,5,null,4]
const LEVELS = [
  [{ val: 1, x: 200 }],
  [{ val: 2, x: 120 }, { val: 3, x: 280 }],
  [{ val: 5, x: 160 }, { val: 4, x: 280 }],
];

export default function RightSideViewViz() {
  const [level, setLevel] = useState(-1);
  const [visible, setVisible] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("BFS level by level. Last node of each level = rightmost visible.");
  const stateRef = useRef({ level: -1, visible: [] as number[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { level: -1, visible: [] };
    setLevel(-1); setVisible([]); setDone(false); setPlaying(false);
    setMsg("BFS level by level. Last node of each level = rightmost visible.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { level: l, visible: v } = stateRef.current;
    const next = l + 1;
    if (next >= LEVELS.length) {
      setDone(true); setPlaying(false);
      setMsg(`Right side view: [${v.join(", ")}]`); return;
    }
    const lvl = LEVELS[next];
    const rightmost = lvl[lvl.length - 1].val;
    const newV = [...v, rightmost];
    stateRef.current = { level: next, visible: newV };
    setLevel(next); setVisible(newV);
    setMsg(`Level ${next}: nodes [${lvl.map(n => n.val).join(", ")}] → rightmost = ${rightmost}`);
    if (next + 1 >= LEVELS.length) { setTimeout(() => { setDone(true); setPlaying(false); setMsg(`Right side view: [${newV.join(", ")}]`); }, 300); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const EDGES = [
    [200, 30, 120, 100], [200, 30, 280, 100],
    [120, 120, 160, 190], [280, 120, 280, 190],
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Binary Tree Right Side View — BFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>BFS level order. Last element at each level is visible from right side.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Tree</div>
          <svg width="380" height="230" viewBox="0 0 380 230" style={{ width: "100%", height: "auto" }} role="img" aria-label="Binary tree with right-side view highlighted">
            {EDGES.map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
            ))}
            {LEVELS.map((lvl, li) =>
              lvl.map((node, ni) => {
                const isCurrentLevel = li === level;
                const isRightmost = ni === lvl.length - 1 && isCurrentLevel;
                const visited = li < level;
                const y = 10 + li * 70;
                return (
                  <g key={`${li}-${ni}`}>
                    <circle cx={node.x} cy={y + 20} r={18} fill={isRightmost ? "rgba(249,115,22,0.35)" : isCurrentLevel ? "rgba(79,142,247,0.25)" : visited ? "rgba(107,114,128,0.2)" : "rgba(79,142,247,0.08)"} stroke={isRightmost ? "#f97316" : isCurrentLevel ? "#4f8ef7" : visited ? "rgba(107,114,128,0.4)" : "rgba(79,142,247,0.3)"} strokeWidth={isRightmost ? 2.5 : 1.5} />
                    <text x={node.x} y={y + 25} textAnchor="middle" fill={isRightmost ? "#f97316" : isCurrentLevel ? "#4f8ef7" : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{node.val}</text>
                  </g>
                );
              })
            )}
            {/* right side annotation */}
            <text x="370" y="30" fill="#f97316" fontSize="9" textAnchor="end">← cam</text>
          </svg>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Result (right side)</div>
          <div className="space-y-2 mt-2">
            {visible.map((v, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-16 text-xs" style={{ color: "var(--text-muted)" }}>Level {i}:</span>
                <div className="px-3 py-1.5 rounded-lg font-bold" style={{ background: "rgba(249,115,22,0.2)", border: "1px solid #f97316", color: "#f97316" }}>{v}</div>
              </div>
            ))}
            {visible.length === 0 && <div className="text-xs" style={{ color: "var(--text-muted)" }}>Processing...</div>}
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
