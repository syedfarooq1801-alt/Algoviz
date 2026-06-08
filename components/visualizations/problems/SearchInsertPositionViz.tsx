"use client";
import { useState, useEffect, useRef } from "react";

const ARR = [1, 3, 5, 6];
const TARGET = 5;

export default function SearchInsertPositionViz() {
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(ARR.length - 1);
  const [mid, setMid] = useState(-1);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState(`Binary search for target=${TARGET} in [${ARR}]`);
  const stateRef = useRef({ lo: 0, hi: ARR.length - 1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { lo: 0, hi: ARR.length - 1 };
    setLo(0); setHi(ARR.length - 1); setMid(-1); setDone(false); setResult(-1); setPlaying(false);
    setMsg(`Binary search for target=${TARGET} in [${ARR}]`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { lo: l, hi: h } = stateRef.current;
    if (l > h) {
      setDone(true); setResult(l); setPlaying(false);
      setMid(-1); setMsg(`lo > hi → insert at index ${l}`); return;
    }
    const m = Math.floor((l + h) / 2);
    setMid(m);
    if (ARR[m] === TARGET) {
      setDone(true); setResult(m); setPlaying(false);
      setMsg(`ARR[${m}]=${ARR[m]} === target=${TARGET} → found at index ${m}`);
    } else if (ARR[m] < TARGET) {
      stateRef.current = { lo: m + 1, hi: h };
      setLo(m + 1); setMsg(`ARR[${m}]=${ARR[m]} < ${TARGET} → search right: lo=${m + 1}`);
    } else {
      stateRef.current = { lo: l, hi: m - 1 };
      setHi(m - 1); setMsg(`ARR[${m}]=${ARR[m]} > ${TARGET} → search left: hi=${m - 1}`);
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Search Insert Position — Binary Search</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Standard binary search. If not found, lo = correct insert position.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-2 mb-4">
          {ARR.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full py-3 rounded-lg text-center text-sm font-bold transition-all" style={{
                background: i === mid ? "rgba(249,115,22,0.3)" : (i >= lo && i <= hi) ? "rgba(79,142,247,0.2)" : "rgba(107,114,128,0.1)",
                border: i === mid ? "2px solid #f97316" : (i >= lo && i <= hi) ? "1px solid rgba(79,142,247,0.5)" : "1px solid var(--border)",
                color: i === mid ? "#f97316" : (i >= lo && i <= hi) ? "#4f8ef7" : "var(--text-muted)"
              }}>{v}</div>
              <div className="text-xs font-mono flex flex-col items-center gap-0.5" style={{ color: "var(--text-muted)" }}>
                [{i}]
                {i === lo && <span style={{ color: "#22c55e" }}>lo</span>}
                {i === mid && <span style={{ color: "#f97316" }}>mid</span>}
                {i === hi && <span style={{ color: "#a855f7" }}>hi</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 text-xs">
          <span style={{ color: "#22c55e" }}>lo={lo}</span>
          <span style={{ color: "#f97316" }}>mid={mid >= 0 ? mid : "?"}</span>
          <span style={{ color: "#a855f7" }}>hi={hi}</span>
          <span style={{ color: "var(--text-muted)" }}>target={TARGET}</span>
        </div>
      </div>
      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>Result: {result}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{ARR.includes(TARGET) ? "Found at index" : "Insert at index"} {result}</div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
