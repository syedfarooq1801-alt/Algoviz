"use client";
import { useState, useEffect, useRef } from "react";

const EXPR = "1 + (2 - (3 + 4)) + 5";

interface St { ci: number; result: number; sign: number; num: number; stack: [number, number][]; msg: string }

function buildSteps(): St[] {
  const steps: St[] = [];
  let result = 0, sign = 1, num = 0;
  const stack: [number, number][] = [];

  for (let ci = 0; ci < EXPR.length; ci++) {
    const c = EXPR[ci];
    if (c >= "0" && c <= "9") {
      num = num * 10 + +c;
      steps.push({ ci, result, sign, num, stack: stack.map(x => [...x] as [number, number]), msg: `Digit '${c}': num=${num}` });
    } else if (c === "+" || c === "-") {
      result += sign * num;
      sign = c === "+" ? 1 : -1;
      num = 0;
      steps.push({ ci, result, sign, num, stack: stack.map(x => [...x] as [number, number]), msg: `'${c}': apply prev num → result=${result}, new sign=${c === "+" ? "+1" : "-1"}` });
    } else if (c === "(") {
      stack.push([result, sign]);
      result = 0; sign = 1;
      steps.push({ ci, result, sign, num, stack: stack.map(x => [...x] as [number, number]), msg: `'(': push {result,sign} to stack. Reset result=0, sign=+1` });
    } else if (c === ")") {
      result += sign * num; num = 0;
      const [savedResult, savedSign] = stack.pop()!;
      result = savedResult + savedSign * result;
      steps.push({ ci, result, sign, num, stack: stack.map(x => [...x] as [number, number]), msg: `) : finalize inner → outer_result + outer_sign * inner_result = ${result}` });
    }
  }
  result += sign * num;
  steps.push({ ci: EXPR.length, result, sign, num, stack: [], msg: `End: add last num ${num} → result=${result}` });
  return steps;
}

const STEPS = buildSteps();

export default function BasicCalculatorViz() {
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

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Basic Calculator — Stack + Scan</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          '(' saves context. ')' restores and combines. +/- applies previous number, updates sign.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={200} max={2000} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      {/* Expression display */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Expression: "{EXPR}"</div>
        <div className="flex flex-wrap gap-1">
          {EXPR.split("").map((c, i) => (
            <div key={i} className="w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold transition-all"
              style={{
                background: i === cur.ci ? "rgba(79,142,247,0.25)" : i < cur.ci ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${i === cur.ci ? "#4f8ef7" : "var(--border)"}`,
                color: i === cur.ci ? "#4f8ef7" : c === "(" || c === ")" ? "#f97316" : c === "+" || c === "-" ? "#a855f7" : "var(--text-secondary)",
              }}>{c === " " ? "·" : c}</div>
          ))}
        </div>
      </div>

      {/* State */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="rounded p-2 text-center" style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>result</div>
            <div className="text-lg font-bold font-mono" style={{ color: "#4f8ef7" }}>{cur.result}</div>
          </div>
          <div className="rounded p-2 text-center" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>sign</div>
            <div className="text-lg font-bold font-mono" style={{ color: "#a855f7" }}>{cur.sign > 0 ? "+1" : "−1"}</div>
          </div>
          <div className="rounded p-2 text-center" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>num</div>
            <div className="text-lg font-bold font-mono" style={{ color: "#f97316" }}>{cur.num}</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Stack [{cur.stack.length}]</div>
          {cur.stack.length === 0 ? <div className="text-xs" style={{ color: "var(--text-muted)" }}>empty</div> : (
            <div className="flex gap-2">
              {cur.stack.map(([r, s], i) => (
                <div key={i} className="text-xs px-2 py-1 rounded font-mono" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}>
                  r={r}, s={s > 0 ? "+1" : "−1"}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{cur.msg}</span>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-lg font-bold" style={{ color: "#22c55e" }}>calculate("{EXPR}") = {cur.result}</div>
        </div>
      )}
    </div>
  );
}
