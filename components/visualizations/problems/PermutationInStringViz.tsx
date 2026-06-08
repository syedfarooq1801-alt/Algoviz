"use client";
import { useState, useEffect, useRef } from "react";

const S1 = "ab", S2 = "eidbaooo";

export default function PermutationInStringViz() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState(`Find if any permutation of "${S1}" exists as substring in "${S2}"`);
  const stateRef = useRef({ left: 0, right: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildFreq = (s: string) => {
    const f: Record<string, number> = {};
    for (const c of s) f[c] = (f[c] || 0) + 1;
    return f;
  };
  const s1Freq = buildFreq(S1);

  const isPermutation = (l: number, r: number) => {
    if (r - l + 1 !== S1.length) return false;
    const wf = buildFreq(S2.slice(l, r + 1));
    return Object.keys(s1Freq).every(c => wf[c] === s1Freq[c]);
  };

  const reset = () => {
    stateRef.current = { left: 0, right: 0 };
    setLeft(0); setRight(0); setDone(false); setResult(false); setPlaying(false);
    setMsg(`Find if any permutation of "${S1}" exists as substring in "${S2}"`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { left: l, right: r } = stateRef.current;
    if (l + S1.length - 1 >= S2.length) {
      setDone(true); setResult(false); setPlaying(false);
      setMsg("No permutation found. Return false."); return;
    }
    const newR = l + S1.length - 1;
    const window = S2.slice(l, newR + 1);
    const isPerm = isPermutation(l, newR);
    stateRef.current = { left: l + 1, right: newR };
    setLeft(l + 1); setRight(newR);
    setMsg(`Window "${window}" [${l},${newR}]: ${isPerm ? "✓ PERMUTATION FOUND!" : "not a permutation"}`);
    if (isPerm) { setDone(true); setResult(true); setPlaying(false); }
    else if (l + 1 + S1.length - 1 >= S2.length) {
      setDone(true); setResult(false); setPlaying(false);
      setMsg("No permutation found. Return false.");
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const windowL = left - 1 < 0 ? 0 : left - 1;
  const windowR = windowL + S1.length - 1;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Permutation in String — Sliding Window</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Fixed window of size |s1|. Check if window chars match s1 frequency map.</div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="300" max="1500" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-1 font-semibold" style={{ color: "var(--accent-purple)" }}>s1 = "{S1}" | s2 = "{S2}"</div>
        <div className="flex gap-2 mt-3">
          {S2.split("").map((c, i) => {
            const inWindow = !done && i >= windowL && i <= windowR;
            const isFound = done && result && i >= windowL && i <= windowR;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{ background: isFound ? "rgba(34,197,94,0.3)" : inWindow ? "rgba(79,142,247,0.25)" : "var(--bg-hover)", border: isFound ? "2px solid #22c55e" : inWindow ? "2px solid #4f8ef7" : "1px solid var(--border)", color: isFound ? "#22c55e" : inWindow ? "#4f8ef7" : "var(--text-secondary)" }}>
                  {c}
                </div>
                <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>[{i}]</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? (result ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)") : "rgba(79,142,247,0.07)", color: done ? (result ? "#22c55e" : "#ef4444") : "#4f8ef7", border: `1px solid ${done ? (result ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") : "rgba(79,142,247,0.18)"}` }}>
        {msg}
      </div>
    </div>
  );
}
