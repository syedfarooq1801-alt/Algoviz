"use client";
import { useState, useRef, useEffect } from "react";

const NUMS = [2, 3, 1, 1, 4];

export default function JumpGameIIViz() {
  const [idx, setIdx] = useState(0);
  const [jumps, setJumps] = useState(0);
  const [curEnd, setCurEnd] = useState(0);
  const [farthest, setFarthest] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("Greedy: track current window end. At window end, jump (increment jumps).");
  const stateRef = useRef({ idx: 0, jumps: 0, curEnd: 0, farthest: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, jumps: 0, curEnd: 0, farthest: 0 };
    setIdx(0); setJumps(0); setCurEnd(0); setFarthest(0); setDone(false); setPlaying(false);
    setMsg("Greedy: track current window end. At window end, jump (increment jumps).");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, jumps: j, curEnd: ce, farthest: f } = stateRef.current;
    if (i >= NUMS.length - 1) { setDone(true); setPlaying(false); setMsg(`Reached end! Min jumps = ${j}`); return; }
    const newF = Math.max(f, i + NUMS[i]);
    let newJ = j, newCe = ce;
    let action = `i=${i}: farthest=max(${f},${i}+${NUMS[i]})=${newF}`;
    if (i === ce) {
      newJ = j + 1; newCe = newF;
      action += ` → i==curEnd, JUMP! jumps=${newJ}, newEnd=${newCe}`;
    }
    stateRef.current = { idx: i + 1, jumps: newJ, curEnd: newCe, farthest: newF };
    setIdx(i + 1); setJumps(newJ); setCurEnd(newCe); setFarthest(newF); setMsg(action);
    if (i + 1 >= NUMS.length - 1) { setDone(true); setPlaying(false); setMsg(`Min jumps = ${newJ}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Jump Game II — Greedy (Min Jumps)</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Extend window greedily. Jump when at window end. Track farthest reachable.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 mb-4">
          {NUMS.map((v, i) => {
            const inWindow = i <= curEnd;
            const isCurrent = i === idx - 1;
            const isWindowEnd = i === curEnd;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full py-3 rounded-lg text-center text-sm font-bold transition-all" style={{
                  background: isCurrent ? "rgba(249,115,22,0.35)" : inWindow ? "rgba(79,142,247,0.2)" : "rgba(107,114,128,0.1)",
                  border: isWindowEnd ? "2px solid #a855f7" : isCurrent ? "2px solid #f97316" : "1px solid var(--border)",
                  color: isCurrent ? "#f97316" : inWindow ? "#4f8ef7" : "var(--text-muted)"
                }}>{v}</div>
                <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>[{i}]</div>
                {isWindowEnd && <div className="text-xs" style={{ color: "#a855f7" }}>end</div>}
                {i === farthest && <div className="text-xs" style={{ color: "#22c55e" }}>far</div>}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4">
          {[["i", idx - 1, "#f97316"], ["curEnd", curEnd, "#a855f7"], ["farthest", farthest, "#22c55e"], ["jumps", jumps, "#4f8ef7"]].map(([label, val, color]) => (
            <div key={label as string} className="flex-1 text-center rounded-lg py-2" style={{ background: "var(--bg-hover)" }}>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label as string}</div>
              <div className="text-xl font-bold" style={{ color: color as string }}>{val as number}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
