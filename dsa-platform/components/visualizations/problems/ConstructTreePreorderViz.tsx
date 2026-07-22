"use client";
import { useState, useRef, useEffect } from "react";

// preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]
const PRE = [3,9,20,15,7];
const INO = [9,3,15,20,7];

// Build steps manually
const NODES = [
  { id:0, x:200, y:30, v:3 },
  { id:1, x:110, y:95, v:9 },
  { id:2, x:290, y:95, v:20 },
  { id:3, x:245, y:160, v:15 },
  { id:4, x:335, y:160, v:7 },
];
const EDGES = [[0,1],[0,2],[2,3],[2,4]];

const STEPS = [
  { built: [] as number[], active: -1, msg: "preorder[0]=3 → root. inorder: left of 3 = [9], right = [15,20,7]." },
  { built: [0], active: 0, msg: "Root built: 3. Next preorder[1]=9 → leftmost node." },
  { built: [0,1], active: 1, msg: "9 built as left child of 3. inorder[0]=9: no left or right children." },
  { built: [0,1,2], active: 2, msg: "preorder[2]=20 → right subtree root. Left of 20 in inorder=[15], right=[7]." },
  { built: [0,1,2,3], active: 3, msg: "15 built as left child of 20. No children." },
  { built: [0,1,2,3,4], active: 4, msg: "7 built as right child of 20. Tree complete!" },
];

export default function ConstructTreePreorderViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("preorder[0] always = root. Split inorder by root to get left/right subtrees.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("preorder[0] always = root. Split inorder by root to get left/right subtrees.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Tree constructed! Preorder + Inorder uniquely determine the tree."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Construction complete! All nodes placed correctly."); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Construct Tree from Preorder & Inorder — DFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>preorder[i]=root → find in inorder → left/right split. Recurse.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>preorder</div>
          <div className="flex gap-1">
            {PRE.map((v,i) => (
              <div key={i} className="w-8 h-8 flex items-center justify-center rounded font-bold" style={{ background: i < cur.built.length ? "rgba(34,197,94,0.2)" : i === cur.built.length ? "rgba(249,115,22,0.3)" : "var(--bg-hover)", border: i === cur.built.length ? "2px solid #f97316" : "1px solid var(--border)", color: i <= cur.built.length ? "var(--text-secondary)" : "var(--text-muted)" }}>{v}</div>
            ))}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>inorder</div>
          <div className="flex gap-1">
            {INO.map((v,i) => (
              <div key={i} className="w-8 h-8 flex items-center justify-center rounded font-bold" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{v}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Tree being built</div>
        <svg width="400" height="190" viewBox="0 0 400 190" style={{ width: "100%", height: "auto" }} role="img" aria-label="Binary tree construction from preorder and inorder traversal">
          {EDGES.filter(([a,b]) => cur.built.includes(a) && cur.built.includes(b)).map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="rgba(79,142,247,0.5)" strokeWidth="1.5" />
          ))}
          {NODES.map(n => {
            const built = cur.built.includes(n.id);
            const isActive = n.id === cur.active;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={18} fill={isActive ? "rgba(249,115,22,0.35)" : built ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.05)"} stroke={isActive ? "#f97316" : built ? "#22c55e" : "rgba(107,114,128,0.2)"} strokeWidth="2" strokeDasharray={built ? undefined : "4"} />
                <text x={n.x} y={n.y+5} textAnchor="middle" fill={isActive ? "#f97316" : built ? "#22c55e" : "rgba(107,114,128,0.3)"} fontSize="13" fontWeight="bold">{n.v}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
