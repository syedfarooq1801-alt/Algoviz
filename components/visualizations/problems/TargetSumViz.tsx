"use client";
import { useState, useRef, useEffect } from "react";

const NUMS = [1, 1, 1, 1, 1];
const TARGET = 3;
// Ways: choose +/- for each. Count combinations summing to target.
// Answer = 5 (C(5,1) = 5 ways to place one minus)

const buildWays = () => {
  const steps: { idx: number; pos: number[]; neg: number[]; sum: number; valid: boolean }[] = [];
  const ways: number[][] = [];
  const bt = (i: number, chosen: ("+"|"-")[]) => {
    if (i === NUMS.length) {
      let s = 0;
      for (let j = 0; j < NUMS.length; j++) s += chosen[j] === "+" ? NUMS[j] : -NUMS[j];
      const pos = chosen.map((c, j) => c === "+" ? j : -1).filter(x => x >= 0);
      const neg = chosen.map((c, j) => c === "-" ? j : -1).filter(x => x >= 0);
      const valid = s === TARGET;
      steps.push({ idx: i, pos, neg, sum: s, valid });
      if (valid) ways.push([...pos]);
      return;
    }
    bt(i + 1, [...chosen, "+"]);
    bt(i + 1, [...chosen, "-"]);
  };
  bt(0, []);
  return { steps: steps.filter(s => s.valid), total: steps.filter(s => s.valid).length };
};
const { steps: VALID_WAYS, total: TOTAL } = buildWays();

export default function TargetSumViz() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState(`Find ways to assign +/- to [${NUMS}] to get sum=${TARGET}.`);
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDone(false); setPlaying(false);
    setMsg(`Find ways to assign +/- to [${NUMS}] to get sum=${TARGET}.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= VALID_WAYS.length) { setDone(true); setPlaying(false); setMsg(`Total valid assignments = ${TOTAL}`); return; }
    stateRef.current = { step: next };
    setStep(next);
    const cur = VALID_WAYS[next];
    const signs = NUMS.map((_, i) => cur.pos.includes(i) ? "+" : "-");
    setMsg(`Way ${next+1}: [${signs.join(",")}] → ${signs.map((s,i) => `${s}${NUMS[i]}`).join()} = ${cur.sum} ✓`);
    if (next + 1 >= VALID_WAYS.length) { setDone(true); setPlaying(false); setMsg(`All ${TOTAL} ways found! (DP solution: O(n×target))`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = step >= 0 && step < VALID_WAYS.length ? VALID_WAYS[step] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Target Sum — DP / Backtracking</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Assign +/- to each number. Count combos summing to target. DP: reduce to subset sum problem.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>nums=[{NUMS.join(",")}], target={TARGET}</div>
        <div className="flex gap-3 justify-center mb-4">
          {NUMS.map((v, i) => {
            const sign = cur ? (cur.pos.includes(i) ? "+" : "-") : "?";
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-5 flex items-center justify-center text-sm font-bold transition-all" style={{ color: sign === "+" ? "#22c55e" : sign === "-" ? "#ef4444" : "var(--text-muted)" }}>{sign}</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: cur ? (cur.pos.includes(i) ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)") : "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{v}</div>
              </div>
            );
          })}
          {cur && (
            <div className="flex items-center gap-2">
              <span style={{ color: "var(--text-muted)" }}>=</span>
              <div className="text-xl font-bold" style={{ color: cur.sum === TARGET ? "#22c55e" : "#4f8ef7" }}>{cur.sum}</div>
            </div>
          )}
        </div>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Valid ways found:</div>
        <div className="space-y-1">
          {VALID_WAYS.slice(0, step + 1).map((w, i) => {
            const signs = NUMS.map((_, j) => w.pos.includes(j) ? "+" : "-");
            return (
              <div key={i} className="text-xs px-3 py-1 rounded font-mono" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                {signs.map((s, j) => `${s}${NUMS[j]}`).join("")} = {w.sum}
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>Ways found</div>
        <div className="text-3xl font-bold" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>{step + 1} / {TOTAL}</div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
