"use client";
import { useState, useRef, useEffect } from "react";

const S = "babad";
// Expand around center approach
const STEPS: { center: number; left: number; right: number; palin: string; isMax: boolean }[] = [];
let maxPalin = "";
for (let c = 0; c < S.length * 2 - 1; c++) {
  let l = Math.floor(c / 2), r = Math.ceil(c / 2);
  while (l >= 0 && r < S.length && S[l] === S[r]) { l--; r++; }
  l++; r--;
  const palin = S.slice(l, r + 1);
  if (palin.length > maxPalin.length) maxPalin = palin;
  STEPS.push({ center: c, left: l, right: r, palin, isMax: palin === maxPalin });
}

export default function LongestPalindromicSubstrViz() {
  const [step, setStep] = useState(-1);
  const [best, setBest] = useState("");
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState(`Expand around each center. Track longest palindrome in "${S}".`);
  const stateRef = useRef({ step: -1, best: "" });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1, best: "" };
    setStep(-1); setBest(""); setDone(false); setPlaying(false);
    setMsg(`Expand around each center. Track longest palindrome in "${S}".`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Longest palindromic substring = "${best}"`); return; }
    const cur = STEPS[next];
    const newBest = cur.isMax ? cur.palin : (stateRef.current.best || cur.palin);
    if (cur.palin.length >= (stateRef.current.best || "").length) {
      stateRef.current = { step: next, best: cur.palin };
      setBest(cur.palin);
    } else {
      stateRef.current = { ...stateRef.current, step: next };
    }
    setStep(next);
    setMsg(`Center ${cur.center}: expand → "${cur.palin}" (len=${cur.palin.length})${cur.isMax ? " ← NEW BEST!" : ""}`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Longest palindrome = "${stateRef.current.best}"`); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Longest Palindromic Substring — Expand Center</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>For each center (char or gap between chars): expand while chars match. O(n²) time O(1) space.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-2 justify-center mb-3">
          {S.split("").map((c, i) => {
            const inCur = cur && i >= cur.left && i <= cur.right;
            const inBest = best && S.indexOf(best) <= i && S.indexOf(best) + best.length > i;
            return (
              <div key={i} className="w-12 h-12 rounded-lg flex items-center justify-center text-base font-bold transition-all" style={{
                background: inCur ? "rgba(249,115,22,0.3)" : done && inBest ? "rgba(34,197,94,0.3)" : "var(--bg-hover)",
                border: inCur ? "2px solid #f97316" : "1px solid var(--border)",
                color: inCur ? "#f97316" : done && inBest ? "#22c55e" : "var(--text-secondary)"
              }}>{c}</div>
            );
          })}
        </div>
        {cur && (
          <div className="flex gap-3 justify-center text-xs">
            <span style={{ color: "var(--text-muted)" }}>left={cur.left}</span>
            <span style={{ color: "#f97316", fontWeight: "bold" }}>"{cur.palin}"</span>
            <span style={{ color: "var(--text-muted)" }}>right={cur.right}</span>
          </div>
        )}
      </div>
      <div className="rounded-xl p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Best palindrome so far</div>
        <div className="text-2xl font-bold font-mono" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>"{best}"</div>
        {best && <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>length = {best.length}</div>}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
