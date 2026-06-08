"use client";
import { useState, useRef, useEffect } from "react";

const S = "aaa";
// Expand around center, count all palindromes
const buildSteps = () => {
  const steps: { center: number; left: number; right: number; palin: string; count: number }[] = [];
  let count = 0;
  for (let c = 0; c < S.length * 2 - 1; c++) {
    let l = Math.floor(c / 2), r = Math.ceil(c / 2);
    while (l >= 0 && r < S.length && S[l] === S[r]) {
      count++;
      steps.push({ center: c, left: l, right: r, palin: S.slice(l, r + 1), count });
      l--; r++;
    }
  }
  return steps;
};
const STEPS = buildSteps();

export default function PalindromicSubstringsViz() {
  const [step, setStep] = useState(-1);
  const [palins, setPalins] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState(`Count all palindromic substrings in "${S}". Expand around each center.`);
  const stateRef = useRef({ step: -1, palins: [] as string[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1, palins: [] };
    setStep(-1); setPalins([]); setDone(false); setPlaying(false);
    setMsg(`Count all palindromic substrings in "${S}". Expand around each center.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s, palins: p } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Total palindromic substrings = ${STEPS[STEPS.length-1].count}`); return; }
    const cur = STEPS[next];
    const newP = [...p, cur.palin];
    stateRef.current = { step: next, palins: newP };
    setStep(next); setPalins(newP);
    setMsg(`Center ${cur.center}: "${cur.palin}" is palindrome! Count = ${cur.count}`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Total = ${STEPS[STEPS.length-1].count} palindromic substrings`); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Palindromic Substrings — Expand Center</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Every expansion that stays palindrome = one palindromic substring. Count all expansions.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-3 justify-center mb-4">
          {S.split("").map((c, i) => {
            const inCur = cur && i >= cur.left && i <= cur.right;
            return (
              <div key={i} className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold transition-all" style={{
                background: inCur ? "rgba(79,142,247,0.3)" : "var(--bg-hover)",
                border: inCur ? "2px solid #4f8ef7" : "1px solid var(--border)",
                color: inCur ? "#4f8ef7" : "var(--text-secondary)"
              }}>{c}</div>
            );
          })}
        </div>
        {cur && <div className="text-center text-sm font-bold" style={{ color: "#4f8ef7" }}>"{cur.palin}"</div>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Found palindromes</div>
          <div className="flex flex-wrap gap-1">
            {palins.map((p, i) => (
              <div key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>"{p}"</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4 flex flex-col items-center justify-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Count</div>
          <div className="text-5xl font-bold" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>{palins.length}</div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
