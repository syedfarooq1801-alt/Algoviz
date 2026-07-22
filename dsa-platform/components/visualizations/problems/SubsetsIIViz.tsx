"use client";
import { useState, useRef, useEffect } from "react";

const NUMS = [1, 2, 2];
// All subsets with no duplicates
const ALL_SUBSETS = [[], [1], [1,2], [1,2,2], [2], [2,2]];

export default function SubsetsIIViz() {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState(`Generate all unique subsets of [${NUMS}]. Skip duplicate elements at same level.`);
  const stateRef = useRef({ idx: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0 };
    setIdx(0); setDone(false); setPlaying(false);
    setMsg(`Generate all unique subsets of [${NUMS}]. Skip duplicate elements at same level.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i } = stateRef.current;
    const next = i + 1;
    if (next > ALL_SUBSETS.length) { setDone(true); setPlaying(false); setMsg(`Done! ${ALL_SUBSETS.length} unique subsets found.`); return; }
    stateRef.current = { idx: next };
    setIdx(next);
    const sub = ALL_SUBSETS[next - 1];
    setMsg(next === 1 ? "Add empty set []" : `Add subset [${sub.join(",")}]`);
    if (next >= ALL_SUBSETS.length) { setDone(true); setPlaying(false); setMsg(`All ${ALL_SUBSETS.length} unique subsets generated! Key: skip nums[i]==nums[i-1] at same depth.`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Subsets II — Backtracking (No Duplicates)</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Sort first. At each recursion level skip if nums[i]==nums[i-1] (same level duplicate).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Input (sorted): [{NUMS.join(", ")}]</div>
        <div className="text-xs mb-3 px-3 py-2 rounded font-mono" style={{ background: "rgba(0,0,0,0.2)", color: "#a855f7" }}>
          Skip duplicate: if(i&gt;start && nums[i]==nums[i-1]) continue;
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SUBSETS.map((sub, i) => (
            <div key={i} className="px-3 py-2 rounded-lg text-xs font-mono transition-all" style={{
              background: i < idx ? "rgba(34,197,94,0.15)" : "var(--bg-hover)",
              border: i === idx - 1 ? "2px solid #22c55e" : i < idx ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border)",
              color: i < idx ? "#22c55e" : "var(--text-muted)"
            }}>
              [{sub.join(",")}]
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>Showing {Math.min(idx, ALL_SUBSETS.length)} / {ALL_SUBSETS.length} subsets</div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
