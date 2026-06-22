"use client";
import { useState, useRef, useEffect } from "react";

// matrix=[[9,9,4],[6,6,8],[2,1,1]]
const MATRIX = [[9,9,4],[6,6,8],[2,1,1]];
const R = MATRIX.length, C = MATRIX[0].length;

// DFS + memo: result = 4 (path: 1→2→6→9)
const MEMO: number[][] = [[1,1,2],[2,1,1],[3,4,2]]; // pre-computed

const STEPS = [
  { active: [2,1], path: [] as number[][], msg: "Start DFS from cell (2,1)=1. Check all 4 neighbors." },
  { active: [2,0], path: [[2,1]], msg: "From 1: go to (2,0)=2 (2>1). DFS deeper." },
  { active: [1,0], path: [[2,1],[2,0]], msg: "From 2: go to (1,0)=6 (6>2). DFS deeper." },
  { active: [0,0], path: [[2,1],[2,0],[1,0]], msg: "From 6: go to (0,0)=9 (9>6). DFS deeper." },
  { active: [0,0], path: [[2,1],[2,0],[1,0],[0,0]], msg: "9: no neighbor > 9. Return 1. Backtrack." },
  { active: [2,1], path: [[2,1],[2,0],[1,0],[0,0]], msg: "Path 1→2→6→9 = length 4. Longest = 4!" },
];

export default function LongestIncreasingPathMatrixViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("DFS + memoization. For each cell: max(1 + DFS(neighbor)) if neighbor > current.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("DFS + memoization. For each cell: max(1 + DFS(neighbor)) if neighbor > current.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("LIP = 4: path 1→2→6→9 ✓"); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Longest Increasing Path = 4"); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Longest Increasing Path in Matrix — DFS + Memo</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>DFS from each cell. Cache results. Only go to neighbors strictly greater.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Matrix</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            {MATRIX.map((row, r) => row.map((v, c) => {
              const isActive = cur.active[0]===r && cur.active[1]===c;
              const inPath = cur.path.some(([pr,pc]) => pr===r && pc===c);
              return (
                <div key={`${r}-${c}`} className="aspect-square flex items-center justify-center rounded-lg text-xl font-bold" style={{ background: isActive ? "rgba(249,115,22,0.4)" : inPath ? "rgba(79,142,247,0.25)" : "var(--bg-hover)", border: isActive ? "3px solid #f97316" : inPath ? "2px solid #4f8ef7" : "1px solid var(--border)", color: isActive ? "#f97316" : inPath ? "#4f8ef7" : "var(--text-secondary)" }}>
                  {v}
                </div>
              );
            }))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Memo table</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            {MEMO.map((row, r) => row.map((v, c) => {
              const inPath = cur.path.some(([pr,pc]) => pr===r && pc===c) || (cur.active[0]===r && cur.active[1]===c);
              return (
                <div key={`${r}-${c}`} className="aspect-square flex items-center justify-center rounded-lg text-lg font-bold" style={{ background: inPath ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.08)", border: inPath ? "2px solid #22c55e" : "1px solid rgba(107,114,128,0.15)", color: inPath ? "#22c55e" : "var(--text-muted)" }}>
                  {inPath ? v : "?"}
                </div>
              );
            }))}
          </div>
          {done && <div className="mt-2 text-lg font-bold" style={{ color: "#22c55e" }}>max = 4</div>}
        </div>
      </div>
      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Current path</div>
        <div className="flex items-center gap-1 flex-wrap">
          {cur.path.concat([cur.active]).map(([r,c],i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="px-2 py-1 rounded text-sm font-bold font-mono" style={{ background: i===cur.path.length ? "rgba(249,115,22,0.25)" : "rgba(79,142,247,0.15)", color: i===cur.path.length ? "#f97316" : "#4f8ef7" }}>{MATRIX[r][c]}</span>
              {i < cur.path.length && <span style={{ color: "var(--text-muted)" }}>→</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
