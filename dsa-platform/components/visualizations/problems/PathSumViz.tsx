"use client";
import { useState, useRef, useEffect } from "react";

// Tree: [5,4,8,11,null,13,4,7,2,null,null,null,1] targetSum=22
// Path 5→4→11→2 = 22
const TARGET_SUM = 22;
const STEPS = [
  { path: [5], rem: 17, msg: "Start at root 5. Remaining = 22-5=17. Go left." },
  { path: [5, 4], rem: 13, msg: "Node 4. Remaining = 17-4=13. Go left." },
  { path: [5, 4, 11], rem: 2, msg: "Node 11. Remaining = 13-11=2. Go left." },
  { path: [5, 4, 11, 7], rem: -5, msg: "Leaf 7. Remaining 2-7=-5 ≠ 0. BACKTRACK." },
  { path: [5, 4, 11, 2], rem: 0, msg: "Leaf 2. Remaining 2-2=0 at leaf → PATH FOUND!" },
];

export default function PathSumViz() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState(`DFS with targetSum=${TARGET_SUM}. Subtract node val, check at leaf.`);
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDone(false); setPlaying(false);
    setMsg(`DFS with targetSum=${TARGET_SUM}. Subtract node val, check at leaf.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (STEPS[next].rem === 0) { setDone(true); setPlaying(false); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const currentPath = step >= 0 ? STEPS[step].path : [];
  const currentRem = step >= 0 ? STEPS[step].rem : TARGET_SUM;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Path Sum — DFS Recursion</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>At each node subtract val from remaining. If leaf and remaining=0, found!</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Current path (root→node)</div>
        <div className="flex items-center gap-2 flex-wrap">
          {currentPath.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all" style={{
                background: i === currentPath.length - 1 && done && currentRem === 0 ? "rgba(34,197,94,0.35)" : i === currentPath.length - 1 ? "rgba(249,115,22,0.35)" : "rgba(79,142,247,0.2)",
                border: i === currentPath.length - 1 ? "2px solid " + (done && currentRem === 0 ? "#22c55e" : "#f97316") : "1px solid #4f8ef7",
                color: i === currentPath.length - 1 ? (done && currentRem === 0 ? "#22c55e" : "#f97316") : "#4f8ef7"
              }}>{v}</div>
              {i < currentPath.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
            </div>
          ))}
          {currentPath.length === 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>Start stepping...</span>}
        </div>
        <div className="mt-4 flex gap-4">
          <div className="rounded-lg px-4 py-2 text-center" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Target</div>
            <div className="text-xl font-bold" style={{ color: "#4f8ef7" }}>{TARGET_SUM}</div>
          </div>
          <div className="rounded-lg px-4 py-2 text-center" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Remaining</div>
            <div className="text-xl font-bold" style={{ color: currentRem === 0 ? "#22c55e" : currentRem < 0 ? "#ef4444" : "#f97316" }}>{currentRem}</div>
          </div>
          <div className="rounded-lg px-4 py-2 text-center" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Sum so far</div>
            <div className="text-xl font-bold" style={{ color: "#a855f7" }}>{TARGET_SUM - currentRem}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
