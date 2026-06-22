"use client";
import { useState, useRef, useEffect } from "react";

const S = "(*))";
// Greedy: track range [lo, hi] of possible open count
// For each char: '(' → lo++, hi++; ')' → lo--, hi--; '*' → lo--, hi++
// If hi < 0: impossible. Clamp lo at 0. Valid if lo==0 at end.

export default function ValidParenthesisStringViz() {
  const [idx, setIdx] = useState(0);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(0);
  const [done, setDone] = useState(false);
  const [valid, setValid] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState(`Track range [lo,hi] of possible open parentheses counts for "${S}".`);
  const stateRef = useRef({ idx: 0, lo: 0, hi: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, lo: 0, hi: 0 };
    setIdx(0); setLo(0); setHi(0); setDone(false); setValid(false); setPlaying(false);
    setMsg(`Track range [lo,hi] of possible open parentheses counts for "${S}".`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, lo: l, hi: h } = stateRef.current;
    if (i >= S.length) {
      const isValid = l === 0;
      setDone(true); setValid(isValid); setPlaying(false);
      setMsg(`lo=${l}, valid=${isValid ? "YES (lo=0)" : "NO (lo>0, unclosed)"}`); return;
    }
    const c = S[i];
    let newLo = l, newHi = h;
    if (c === "(") { newLo++; newHi++; }
    else if (c === ")") { newLo--; newHi--; }
    else { newLo--; newHi++; } // '*'
    if (newHi < 0) {
      setDone(true); setValid(false); setPlaying(false);
      setMsg(`hi<0 at i=${i}! Too many ')' even with '*' as '(' → INVALID`); return;
    }
    newLo = Math.max(0, newLo);
    stateRef.current = { idx: i + 1, lo: newLo, hi: newHi };
    setIdx(i + 1); setLo(newLo); setHi(newHi);
    setMsg(`'${c}' at i=${i}: ${c==="("?"lo++,hi++":c===")"?"lo--,hi--":"lo--,hi++ (*)"} → range=[${newLo},${newHi}]`);
    if (i + 1 >= S.length) {
      const isValid = newLo === 0;
      setDone(true); setValid(isValid); setPlaying(false);
      setMsg(`Done! lo=${newLo} ${isValid ? "=0 → VALID ✓" : ">0 → INVALID ✗"}`);
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Valid Parenthesis String — Greedy Range</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Track [lo,hi] possible open counts. '*'=any. Invalid if hi&lt;0. Valid if lo=0 at end.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 justify-center mb-4">
          {S.split("").map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-all" style={{
                background: i === idx - 1 ? "rgba(249,115,22,0.35)" : i < idx ? "rgba(107,114,128,0.15)" : "var(--bg-hover)",
                border: i === idx - 1 ? "2px solid #f97316" : i === idx ? "2px solid #4f8ef7" : "1px solid var(--border)",
                color: c === "(" ? "#22c55e" : c === ")" ? "#ef4444" : "#a855f7"
              }}>{c}</div>
              {i < idx - 1 && <div className="text-xs" style={{ color: "var(--text-muted)" }}>done</div>}
              {i === idx - 1 && <div className="text-xs" style={{ color: "#f97316" }}>cur</div>}
              {i === idx && !done && <div className="text-xs" style={{ color: "#4f8ef7" }}>next</div>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg-hover)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>lo (min open)</div>
            <div className="text-3xl font-bold" style={{ color: lo === 0 && done ? "#22c55e" : "#4f8ef7" }}>{lo}</div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg-hover)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>hi (max open)</div>
            <div className="text-3xl font-bold" style={{ color: hi < 0 ? "#ef4444" : "#f97316" }}>{hi}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? (valid ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)") : "rgba(79,142,247,0.07)", color: done ? (valid ? "#22c55e" : "#ef4444") : "#4f8ef7", border: `1px solid ${done ? (valid ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
