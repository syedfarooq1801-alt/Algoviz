"use client";
import { useState, useEffect, useRef } from "react";

const S = "abcde";
const T = "ace";

type Phase = "forward" | "backward" | "record";
interface St { si: number; ti: number; phase: Phase; windowStart: number; windowEnd: number; bestL: number; bestR: number; msg: string }

function buildSteps() {
  const steps: St[] = [];
  let si = 0;
  let bestL = -1, bestR = -1;

  while (si < S.length) {
    // forward pass
    let ti = 0;
    const fwdStart = si;
    while (si < S.length && ti < T.length) {
      steps.push({ si, ti, phase: "forward", windowStart: fwdStart, windowEnd: si, bestL, bestR, msg: `Forward: S[${si}]='${S[si]}' vs T[${ti}]='${T[ti]}' — ${S[si] === T[ti] ? "match! advance both" : "no match, advance S"}` });
      if (S[si] === T[ti]) ti++;
      si++;
    }
    if (ti < T.length) break;
    const end = si;
    // backward pass
    ti = T.length - 1;
    while (ti >= 0) {
      si--;
      steps.push({ si, ti, phase: "backward", windowStart: si, windowEnd: end - 1, bestL, bestR, msg: `Backward: S[${si}]='${S[si]}' vs T[${ti}]='${T[ti]}' — ${S[si] === T[ti] ? "match! advance both" : "advance S backward"}` });
      if (S[si] === T[ti]) ti--;
    }
    const start = si;
    if (bestL === -1 || end - start < bestR - bestL) { bestL = start; bestR = end; }
    steps.push({ si, ti: -1, phase: "record", windowStart: start, windowEnd: end, bestL, bestR, msg: `Record window [${start},${end}): "${S.slice(start, end)}" len=${end - start}${bestL === start ? " — new best!" : ""}` });
    si = start + 1;
  }
  return steps;
}

const STEPS = buildSteps();

export default function MinimumWindowSubsequenceViz() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = idx >= STEPS.length;
  const cur = STEPS[Math.min(idx, STEPS.length - 1)];

  const doStep = () => setIdx(p => { const n = Math.min(p + 1, STEPS.length); if (n >= STEPS.length) setPlaying(false); return n; });
  const reset = () => { setIdx(0); setPlaying(false); };

  useEffect(() => {
    if (playing && !done) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed, done]);

  const phaseColor = cur?.phase === "forward" ? "#4f8ef7" : cur?.phase === "backward" ? "#a855f7" : "#22c55e";

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Minimum Window Subsequence</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Forward: find where T ends in S. Backward: shrink window start. Record shortest.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={300} max={2000} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>S = "{S}"</div>
        <div className="flex gap-2 mt-2">
          {S.split("").map((c, i) => {
            const inWindow = cur && i >= cur.windowStart && i < cur.windowEnd;
            const isSi = cur && i === cur.si;
            const isBest = cur && cur.bestL >= 0 && i >= cur.bestL && i < cur.bestR;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: isSi ? `rgba(${cur.phase === "forward" ? "79,142,247" : "168,85,247"},0.25)` : inWindow ? "rgba(249,115,22,0.12)" : isBest ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
                    border: `2px solid ${isSi ? phaseColor : inWindow ? "rgba(249,115,22,0.4)" : isBest ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
                    color: isSi ? phaseColor : inWindow ? "#f97316" : isBest ? "#22c55e" : "var(--text-secondary)"
                  }}>{c}</div>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>T = "{T}"</div>
        <div className="flex gap-2">
          {T.split("").map((c, i) => {
            const active = cur && i === cur.ti;
            const matched = cur && (cur.phase === "backward" ? i > cur.ti : i < cur.ti);
            return (
              <div key={i} className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: active ? "rgba(79,142,247,0.2)" : matched ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", border: `2px solid ${active ? "#4f8ef7" : matched ? "rgba(34,197,94,0.4)" : "var(--border)"}`, color: active ? "#4f8ef7" : matched ? "#22c55e" : "var(--text-secondary)" }}>{c}</div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: `${phaseColor}22`, color: phaseColor }}>{cur?.phase?.toUpperCase()}</span>
          <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{cur?.msg}</span>
        </div>
        {cur?.bestL >= 0 && <div className="text-xs" style={{ color: "#22c55e" }}>Best so far: "{S.slice(cur.bestL, cur.bestR)}"</div>}
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>
            Answer: "{STEPS[STEPS.length - 1].bestL >= 0 ? S.slice(STEPS[STEPS.length - 1].bestL, STEPS[STEPS.length - 1].bestR) : ""}"
          </div>
        </div>
      )}
    </div>
  );
}
