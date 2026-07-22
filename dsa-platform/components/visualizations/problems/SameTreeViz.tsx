"use client";
import { useState, useRef, useEffect } from "react";

// p = [1,2,3], q = [1,2,3]
const STEPS = [
  { nodeP: 1, nodeQ: 1, same: true, msg: "Root: p=1, q=1. Equal. Recurse left." },
  { nodeP: 2, nodeQ: 2, same: true, msg: "Left: p=2, q=2. Equal. Recurse left (null)." },
  { nodeP: null, nodeQ: null, same: true, msg: "Both null. Return true." },
  { nodeP: 2, nodeQ: 2, same: true, msg: "Recurse right of node 2 (null)." },
  { nodeP: null, nodeQ: null, same: true, msg: "Both null. Return true. Node 2 done." },
  { nodeP: 3, nodeQ: 3, same: true, msg: "Right: p=3, q=3. Equal. Both children null → true." },
  { nodeP: 1, nodeQ: 1, same: true, msg: "All nodes matched! Trees are SAME ✓" },
];

export default function SameTreeViz() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("DFS simultaneously on both trees. Compare val, then recurse left and right.");
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDone(false); setPlaying(false);
    setMsg("DFS simultaneously on both trees. Compare val, then recurse left and right.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  const TreeNode = ({ val, x, y, active }: { val: number|null; x: number; y: number; active: boolean }) => (
    <g>
      <circle cx={x} cy={y} r={18} fill={active ? "rgba(34,197,94,0.35)" : "rgba(79,142,247,0.12)"} stroke={active ? "#22c55e" : "#4f8ef7"} strokeWidth={active ? 2.5 : 1.5} />
      <text x={x} y={y+5} textAnchor="middle" fill={active ? "#22c55e" : "var(--text-secondary)"} fontSize="13" fontWeight="bold">{val ?? "∅"}</text>
    </g>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Same Tree — DFS Simultaneous Traversal</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Traverse both trees in sync. If any mismatch (val or structure), return false.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {["Tree P", "Tree Q"].map((label, ti) => (
          <div key={ti} className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>{label}</div>
            <svg width="200" height="150" viewBox="0 0 200 150" style={{ width: "100%", height: "auto" }} role="img" aria-label="Two binary trees compared for structural equality">
              <line x1="100" y1="28" x2="55" y2="88" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
              <line x1="100" y1="28" x2="145" y2="88" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
              <TreeNode val={1} x={100} y={20} active={cur?.nodeP === 1 && step <= 1} />
              <TreeNode val={2} x={55} y={100} active={cur?.nodeP === 2 && step >= 1 && step <= 4} />
              <TreeNode val={3} x={145} y={100} active={cur?.nodeP === 3} />
            </svg>
          </div>
        ))}
      </div>
      {cur && (
        <div className="rounded-xl p-3 flex gap-6 justify-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-center text-xs">
            <div style={{ color: "var(--text-muted)" }}>p</div>
            <div className="text-xl font-bold" style={{ color: "#4f8ef7" }}>{cur.nodeP ?? "null"}</div>
          </div>
          <div className="text-center text-xl" style={{ color: cur.same ? "#22c55e" : "#ef4444" }}>{cur.same ? "=" : "≠"}</div>
          <div className="text-center text-xs">
            <div style={{ color: "var(--text-muted)" }}>q</div>
            <div className="text-xl font-bold" style={{ color: "#4f8ef7" }}>{cur.nodeQ ?? "null"}</div>
          </div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
