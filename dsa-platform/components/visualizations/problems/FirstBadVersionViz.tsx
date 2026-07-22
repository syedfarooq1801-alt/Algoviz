"use client";
import { useState, useEffect, useRef } from "react";

const N = 8;
const BAD = 4; // first bad version

export default function FirstBadVersionViz() {
  const [lo, setLo] = useState(1);
  const [hi, setHi] = useState(N);
  const [mid, setMid] = useState(-1);
  const [calls, setCalls] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState(`Find first bad version (1..${N}). Bad starts at version ${BAD}.`);
  const stateRef = useRef({ lo: 1, hi: N, calls: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isBad = (v: number) => v >= BAD;

  const reset = () => {
    stateRef.current = { lo: 1, hi: N, calls: 0 };
    setLo(1); setHi(N); setMid(-1); setCalls(0); setDone(false); setPlaying(false);
    setMsg(`Find first bad version (1..${N}). Bad starts at version ${BAD}.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { lo: l, hi: h, calls: c } = stateRef.current;
    if (l >= h) {
      setDone(true); setMid(l); setPlaying(false);
      setMsg(`lo=hi=${l} → first bad version = ${l} (API calls: ${c})`); return;
    }
    const m = Math.floor((l + h) / 2);
    const bad = isBad(m);
    stateRef.current.calls = c + 1;
    setCalls(c + 1); setMid(m);
    if (bad) {
      stateRef.current = { lo: l, hi: m, calls: c + 1 };
      setHi(m); setMsg(`isBad(${m})=true → search left half: hi=${m} (call #${c + 1})`);
    } else {
      stateRef.current = { lo: m + 1, hi: h, calls: c + 1 };
      setLo(m + 1); setMsg(`isBad(${m})=false → search right half: lo=${m + 1} (call #${c + 1})`);
    }
    if (l >= h - 1 && !bad) {
      // will converge next step
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>First Bad Version — Binary Search</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Minimize API calls. If mid is bad, search left. If not bad, search right.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-2 mb-3">
          {Array.from({ length: N }, (_, i) => i + 1).map(v => (
            <div key={v} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full py-2 rounded-lg text-center text-xs font-bold transition-all" style={{
                background: v === mid ? "rgba(249,115,22,0.35)" : isBad(v) ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                border: v === mid ? "2px solid #f97316" : v === lo ? "2px solid #22c55e" : v === hi ? "2px solid #a855f7" : "1px solid var(--border)",
                color: v === mid ? "#f97316" : isBad(v) ? "#ef4444" : "#22c55e"
              }}>
                {v}
              </div>
              <div className="text-xs" style={{ color: isBad(v) ? "#ef4444" : "#22c55e" }}>{isBad(v) ? "✗" : "✓"}</div>
              <div className="text-xs font-mono flex flex-col items-center" style={{ color: "var(--text-muted)" }}>
                {v === lo && <span style={{ color: "#22c55e" }}>lo</span>}
                {v === mid && <span style={{ color: "#f97316" }}>mid</span>}
                {v === hi && <span style={{ color: "#a855f7" }}>hi</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 text-xs mt-2">
          <span style={{ color: "#22c55e" }}>✓ Good versions</span>
          <span style={{ color: "#ef4444" }}>✗ Bad versions</span>
          <span style={{ color: "#f97316" }}>mid (current check)</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>lo</div>
          <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{lo}</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>hi</div>
          <div className="text-2xl font-bold" style={{ color: "#a855f7" }}>{hi}</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>API calls</div>
          <div className="text-2xl font-bold" style={{ color: "#f97316" }}>{calls}</div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
