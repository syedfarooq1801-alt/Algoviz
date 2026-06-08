"use client";
import { useState, useRef, useEffect } from "react";

const NUMS = [2, 3, -2, 4];

export default function MaxProductSubarrayViz() {
  const [idx, setIdx] = useState(0);
  const [maxP, setMaxP] = useState(NUMS[0]);
  const [minP, setMinP] = useState(NUMS[0]);
  const [result, setResult] = useState(NUMS[0]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Track both max and min product. Negative can flip min→max!");
  const stateRef = useRef({ idx: 1, maxP: NUMS[0], minP: NUMS[0], result: NUMS[0] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 1, maxP: NUMS[0], minP: NUMS[0], result: NUMS[0] };
    setIdx(1); setMaxP(NUMS[0]); setMinP(NUMS[0]); setResult(NUMS[0]); setDone(false); setPlaying(false);
    setMsg("Track both max and min product. Negative can flip min→max!");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, maxP: mx, minP: mn, result: r } = stateRef.current;
    if (i >= NUMS.length) { setDone(true); setPlaying(false); setMsg(`Max product subarray = ${r}`); return; }
    const v = NUMS[i];
    const candidates = [v, mx * v, mn * v];
    const newMx = Math.max(...candidates);
    const newMn = Math.min(...candidates);
    const newR = Math.max(r, newMx);
    stateRef.current = { idx: i + 1, maxP: newMx, minP: newMn, result: newR };
    setIdx(i + 1); setMaxP(newMx); setMinP(newMn); setResult(newR);
    setMsg(`i=${i} val=${v}: candidates=[${v},${mx}×${v}=${mx*v},${mn}×${v}=${mn*v}] → maxP=${newMx}, minP=${newMn}, result=${newR}`);
    if (i + 1 >= NUMS.length) { setDone(true); setPlaying(false); setMsg(`Max product = ${newR}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Max Product Subarray — Kadane Variant</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Track max AND min (negatives flip). At each step: max(v, maxP×v, minP×v).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 mb-4">
          {NUMS.map((v, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="py-3 rounded-lg font-bold transition-all" style={{
                background: i === idx - 1 ? "rgba(249,115,22,0.3)" : i < idx ? "rgba(107,114,128,0.15)" : "var(--bg-hover)",
                border: i === idx - 1 ? "2px solid #f97316" : i === idx ? "2px solid #4f8ef7" : "1px solid var(--border)",
                color: v < 0 ? "#ef4444" : v > 0 ? "#22c55e" : "var(--text-muted)"
              }}>{v}</div>
              <div className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>[{i}]</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg p-3 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>maxP (local)</div>
            <div className="text-xl font-bold" style={{ color: "#22c55e" }}>{maxP}</div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>minP (local)</div>
            <div className="text-xl font-bold" style={{ color: "#ef4444" }}>{minP}</div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: done ? "rgba(34,197,94,0.12)" : "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>result (global max)</div>
            <div className="text-xl font-bold" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>{result}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
