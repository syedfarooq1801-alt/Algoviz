"use client";
import { useState, useRef, useEffect } from "react";

// BST: [3,1,4,null,2], k=2
// In-order: 1,2,3,4 → k=2 → answer=2
const INORDER = [1, 2, 3, 4];
const K = 2;

const BST_NODES = [
  { val: 3, x: 200, y: 30 },
  { val: 1, x: 110, y: 100 },
  { val: 4, x: 290, y: 100 },
  { val: 2, x: 160, y: 170 },
];
const EDGES = [[200, 50, 110, 100], [200, 50, 290, 100], [110, 120, 160, 170]];

export default function KthSmallestBSTViz() {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState(`In-order traversal of BST gives sorted order. Find k=${K}th element.`);
  const stateRef = useRef({ idx: 0, count: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, count: 0 };
    setIdx(0); setCount(0); setDone(false); setPlaying(false);
    setMsg(`In-order traversal of BST gives sorted order. Find k=${K}th element.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, count: c } = stateRef.current;
    if (i >= INORDER.length) { setDone(true); setPlaying(false); return; }
    const newC = c + 1;
    stateRef.current = { idx: i + 1, count: newC };
    setIdx(i + 1); setCount(newC);
    if (newC === K) {
      setDone(true); setPlaying(false);
      setMsg(`count=${newC}=k → ${K}th smallest = ${INORDER[i]}`);
    } else {
      setMsg(`Visit ${INORDER[i]} (count=${newC}). k=${K}, need ${K - newC} more.`);
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Kth Smallest in BST — In-order DFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>BST in-order = sorted ascending. Count nodes until count=k.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>BST</div>
          <svg width="350" height="210" viewBox="0 0 350 210" style={{ width: "100%", height: "auto" }}>
            {EDGES.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />)}
            {BST_NODES.map(n => {
              const visited = idx > 0 && INORDER.slice(0, idx).includes(n.val);
              const isActive = idx > 0 && INORDER[idx - 1] === n.val && count <= K;
              const isAnswer = done && n.val === INORDER[K - 1];
              return (
                <g key={n.val}>
                  <circle cx={n.x} cy={n.y + 20} r={18} fill={isAnswer ? "rgba(34,197,94,0.35)" : isActive ? "rgba(249,115,22,0.35)" : visited ? "rgba(107,114,128,0.2)" : "rgba(79,142,247,0.1)"} stroke={isAnswer ? "#22c55e" : isActive ? "#f97316" : visited ? "rgba(107,114,128,0.4)" : "#4f8ef7"} strokeWidth={isActive || isAnswer ? 2.5 : 1.5} />
                  <text x={n.x} y={n.y + 25} textAnchor="middle" fill={isAnswer ? "#22c55e" : isActive ? "#f97316" : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{n.val}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>In-order sequence</div>
          <div className="flex gap-2 mb-4">
            {INORDER.map((v, i) => (
              <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all" style={{
                background: i === K - 1 && done ? "rgba(34,197,94,0.3)" : i < idx ? (i === K - 1 ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.15)") : "var(--bg-hover)",
                border: i === K - 1 && done ? "2px solid #22c55e" : i === idx - 1 ? "2px solid #f97316" : "1px solid var(--border)",
                color: i === K - 1 && done ? "#22c55e" : i < idx ? "var(--text-secondary)" : "var(--text-muted)"
              }}>{v}</div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>count = <span style={{ color: "#f97316", fontWeight: "bold", fontSize: "1.2em" }}>{count}</span> / k={K}</div>
            {done && <div className="text-lg font-bold" style={{ color: "#22c55e" }}>Answer: {INORDER[K - 1]}</div>}
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
