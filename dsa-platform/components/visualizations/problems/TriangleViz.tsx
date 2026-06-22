"use client";
import { useState, useRef, useEffect } from "react";

const TRIANGLE = [[2],[3,4],[6,5,7],[4,1,8,3]];
// Bottom-up DP: dp[i] = min path sum from bottom to row i
// Start from second-to-last row, work up
const buildDP = () => {
  const dp = [...TRIANGLE[TRIANGLE.length - 1]];
  const steps: { row: number; col: number; val: number; dp: number[] }[] = [];
  const dpHistory: number[][] = []; dpHistory.push([...dp]);
  for (let r = TRIANGLE.length - 2; r >= 0; r--) {
    for (let c = 0; c < TRIANGLE[r].length; c++) {
      dp[c] = TRIANGLE[r][c] + Math.min(dp[c], dp[c+1]);
      steps.push({ row: r, col: c, val: dp[c], dp: [...dp] });
    }
    dpHistory.push([...dp]);
  }
  return { steps, answer: dp[0] };
};
const { steps: STEPS, answer: ANSWER } = buildDP();

export default function TriangleViz() {
  const [step, setStep] = useState(-1);
  const [dp, setDp] = useState([...TRIANGLE[TRIANGLE.length-1]]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("Bottom-up: each cell = its value + min of two cells below it.");
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDp([...TRIANGLE[TRIANGLE.length-1]]); setDone(false); setPlaying(false);
    setMsg("Bottom-up: each cell = its value + min of two cells below it.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Min path sum = dp[0] = ${ANSWER}`); return; }
    const cur = STEPS[next];
    stateRef.current = { step: next };
    setStep(next); setDp([...cur.dp]);
    setMsg(`dp[${cur.row}][${cur.col}]=${TRIANGLE[cur.row][cur.col]} + min(below) = ${cur.val}`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Min sum from top to bottom = ${ANSWER}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Triangle — DP Bottom-Up</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Process from bottom row up. O(n²) time, O(n) space using single row.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Triangle (top→bot)</div>
          <div className="space-y-2">
            {TRIANGLE.map((row, r) => (
              <div key={r} className="flex gap-2 justify-center">
                {row.map((v, c) => (
                  <div key={c} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{
                    background: cur?.row === r && cur?.col === c ? "rgba(249,115,22,0.35)" : "var(--bg-hover)",
                    border: cur?.row === r && cur?.col === c ? "2px solid #f97316" : "1px solid var(--border)",
                    color: "var(--text-secondary)"
                  }}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>DP row (current)</div>
          <div className="flex flex-wrap gap-2">
            {dp.slice(0, cur ? TRIANGLE[cur.row].length + 1 : TRIANGLE[TRIANGLE.length-1].length).map((v, i) => (
              <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{
                background: done && i === 0 ? "rgba(34,197,94,0.35)" : "rgba(79,142,247,0.2)",
                border: done && i === 0 ? "2px solid #22c55e" : "1px solid rgba(79,142,247,0.4)",
                color: done && i === 0 ? "#22c55e" : "#4f8ef7"
              }}>{v}</div>
            ))}
          </div>
          {done && <div className="mt-3 text-lg font-bold" style={{ color: "#22c55e" }}>Answer: {ANSWER}</div>}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
