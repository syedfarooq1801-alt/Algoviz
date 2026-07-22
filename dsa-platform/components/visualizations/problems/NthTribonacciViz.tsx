"use client";
import { useState, useRef, useEffect } from "react";

const N = 7;
// T(0)=0, T(1)=1, T(2)=1, T(n)=T(n-1)+T(n-2)+T(n-3)

export default function NthTribonacciViz() {
  const [idx, setIdx] = useState(3);
  const [seq, setSeq] = useState([0, 1, 1]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState(`Compute T(${N}). T(n) = T(n-1) + T(n-2) + T(n-3). Base: T(0)=0,T(1)=1,T(2)=1.`);
  const stateRef = useRef({ idx: 3, seq: [0, 1, 1] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 3, seq: [0, 1, 1] };
    setIdx(3); setSeq([0, 1, 1]); setDone(false); setPlaying(false);
    setMsg(`Compute T(${N}). T(n) = T(n-1) + T(n-2) + T(n-3). Base: T(0)=0,T(1)=1,T(2)=1.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, seq: s } = stateRef.current;
    if (i > N) { setDone(true); setPlaying(false); setMsg(`T(${N}) = ${s[N]}`); return; }
    const next = s[i-1] + s[i-2] + s[i-3];
    const newSeq = [...s, next];
    stateRef.current = { idx: i + 1, seq: newSeq };
    setIdx(i + 1); setSeq(newSeq);
    setMsg(`T(${i}) = T(${i-1}) + T(${i-2}) + T(${i-3}) = ${s[i-1]} + ${s[i-2]} + ${s[i-3]} = ${next}`);
    if (i >= N) { setDone(true); setPlaying(false); setMsg(`T(${N}) = ${next}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>N-th Tribonacci — DP (Bottom-Up)</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Like Fibonacci but sum of 3 previous. Use O(1) space with rolling 3 variables.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Tribonacci sequence (target: T({N}))</div>
        <div className="flex gap-2 flex-wrap">
          {seq.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all" style={{
                background: i === seq.length - 1 && i >= 3 ? "rgba(249,115,22,0.35)" : i >= seq.length - 3 && i < seq.length - 1 ? "rgba(79,142,247,0.25)" : "rgba(107,114,128,0.15)",
                border: i === seq.length - 1 && done && i === N ? "2px solid #22c55e" : i === seq.length - 1 ? "2px solid #f97316" : "1px solid var(--border)",
                color: done && i === N ? "#22c55e" : i >= seq.length - 3 ? "#4f8ef7" : "var(--text-secondary)"
              }}>{v}</div>
              <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>T({i})</div>
            </div>
          ))}
        </div>
        {seq.length >= 3 && (
          <div className="mt-4 flex gap-3">
            {[seq.length - 3, seq.length - 2, seq.length - 1].map((i, j) => i >= 0 && (
              <div key={j} className="flex-1 rounded-lg p-2 text-center" style={{ background: j === 2 ? "rgba(249,115,22,0.15)" : "rgba(79,142,247,0.1)" }}>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>T({i})</div>
                <div className="text-lg font-bold" style={{ color: j === 2 ? "#f97316" : "#4f8ef7" }}>{seq[i]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
