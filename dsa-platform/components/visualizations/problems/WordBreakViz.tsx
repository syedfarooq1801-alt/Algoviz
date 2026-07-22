"use client";
import { useState, useRef, useEffect } from "react";

const S = "leetcode";
const DICT = new Set(["leet", "code"]);
// dp[i] = can s[0..i-1] be segmented
const buildDP = () => {
  const dp = Array(S.length + 1).fill(false);
  dp[0] = true;
  const steps: { i: number; j: number; word: string; match: boolean; dp: boolean[] }[] = [];
  for (let i = 1; i <= S.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j]) {
        const word = S.slice(j, i);
        const match = DICT.has(word);
        if (match) dp[i] = true;
        steps.push({ i, j, word, match, dp: [...dp] });
        if (dp[i]) break;
      }
    }
  }
  return { dp, steps };
};
const { dp: DP, steps: STEPS } = buildDP();

export default function WordBreakViz() {
  const [step, setStep] = useState(-1);
  const [dp, setDp] = useState(Array(S.length + 1).fill(false).map((_, i) => i === 0));
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Word break "${S}" using wordDict [${[...DICT].join(", ")}].`);
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDp(Array(S.length + 1).fill(false).map((_, i) => i === 0)); setDone(false); setPlaying(false);
    setMsg(`Word break "${S}" using wordDict [${[...DICT].join(", ")}].`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`dp[${S.length}]=${DP[S.length]} → "${S}" ${DP[S.length] ? "CAN" : "CANNOT"} be segmented`); return; }
    const cur = STEPS[next];
    stateRef.current = { step: next };
    setStep(next); setDp([...cur.dp]);
    setMsg(`i=${cur.i}, j=${cur.j}: "${cur.word}" ${cur.match ? "✓ in dict" : "✗ not in dict"}. dp[${cur.i}]=${cur.dp[cur.i]}`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Result: "${S}" ${DP[S.length] ? "CAN be segmented" : "cannot be segmented"}! (dp[${S.length}]=${DP[S.length]})`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = step >= 0 ? STEPS[step] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Word Break — 1D DP</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>dp[i]=true if s[0..i-1] can be segmented. For each i, try all j where dp[j]=true and s[j..i-1] in dict.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>String "{S}"</div>
        <div className="flex gap-1 mb-3">
          {S.split("").map((c, i) => (
            <div key={i} className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold" style={{
              background: cur && i >= cur.j && i < cur.i ? "rgba(249,115,22,0.3)" : "var(--bg-hover)",
              border: cur && i >= cur.j && i < cur.i ? "1px solid #f97316" : "1px solid var(--border)",
              color: cur && i >= cur.j && i < cur.i ? "#f97316" : "var(--text-secondary)"
            }}>{c}</div>
          ))}
        </div>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>DP array</div>
        <div className="flex gap-1">
          {dp.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold transition-all" style={{
                background: v ? "rgba(34,197,94,0.25)" : "rgba(107,114,128,0.1)",
                border: cur && i === cur.i ? "2px solid #f97316" : "1px solid var(--border)",
                color: v ? "#22c55e" : "var(--text-muted)"
              }}>{v ? "T" : "F"}</div>
              <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{i}</div>
            </div>
          ))}
        </div>
      </div>
      {cur && (
        <div className="rounded-xl p-3 flex gap-4 text-xs" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div><span style={{ color: "var(--text-muted)" }}>Word: </span><span style={{ color: "#f97316", fontWeight: "bold" }}>"{cur.word}"</span></div>
          <div><span style={{ color: "var(--text-muted)" }}>In dict: </span><span style={{ color: cur.match ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>{cur.match ? "YES ✓" : "NO ✗"}</span></div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
