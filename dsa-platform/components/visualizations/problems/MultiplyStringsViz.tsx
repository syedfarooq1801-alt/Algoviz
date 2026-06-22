"use client";
import { useState, useEffect, useRef } from "react";

const NUM1 = "23";
const NUM2 = "45";

// Pre-build all steps of the digit-by-digit multiplication
type MulStep = {
  i: number;
  j: number;
  d1: number;
  d2: number;
  product: number;
  carry: number;
  addPos: number;     // result[i+j+1]
  carryPos: number;   // result[i+j]
  resultArr: number[];
};

function buildMulSteps(): MulStep[] {
  const steps: MulStep[] = [];
  const len1 = NUM1.length;
  const len2 = NUM2.length;
  const result = new Array(len1 + len2).fill(0);

  for (let i = len1 - 1; i >= 0; i--) {
    for (let j = len2 - 1; j >= 0; j--) {
      const d1 = parseInt(NUM1[i]);
      const d2 = parseInt(NUM2[j]);
      const mul = d1 * d2;
      const p1 = i + j;
      const p2 = i + j + 1;
      const sum = mul + result[p2];
      result[p2] = sum % 10;
      result[p1] += Math.floor(sum / 10);
      steps.push({
        i, j, d1, d2, product: mul, carry: Math.floor(sum / 10),
        addPos: p2, carryPos: p1,
        resultArr: [...result]
      });
    }
  }
  return steps;
}

const STEPS = buildMulSteps();

function resultToString(arr: number[]): string {
  const s = arr.join("");
  const trimmed = s.replace(/^0+/, "");
  return trimmed === "" ? "0" : trimmed;
}

export default function MultiplyStringsViz() {
  const [stepIdx, setStepIdx] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const stateRef = useRef({ stepIdx: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const len1 = NUM1.length;
  const len2 = NUM2.length;
  const totalLen = len1 + len2;

  const currentStep = stepIdx >= 0 && stepIdx < STEPS.length ? STEPS[stepIdx] : null;
  const resultArr = currentStep ? currentStep.resultArr : new Array(totalLen).fill(0);
  const finalResult = STEPS.length > 0 ? resultToString(STEPS[STEPS.length - 1].resultArr) : "";

  const reset = () => {
    stateRef.current = { stepIdx: -1 };
    setStepIdx(-1); setDone(false); setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { stepIdx: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) {
      stateRef.current.stepIdx = next;
      setStepIdx(next); setDone(true); setPlaying(false);
    } else {
      stateRef.current.stepIdx = next;
      setStepIdx(next);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Multiply Strings — "{NUM1}" × "{NUM2}" = {Number(NUM1) * Number(NUM2)}</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Multiply each digit pair, accumulate into result array. result[i+j+1] += d1×d2; carry propagates to result[i+j].
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            → Step
          </button>
          <button onClick={reset}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            ↺ Reset
          </button>
          <input type="range" min="200" max="2000" step="100" value={speed}
            onChange={e => setSpeed(+e.target.value)}
            style={{ width: "80px", accentColor: "#4f8ef7" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{speed}ms</span>
        </div>
      </div>

      {/* Digit highlights */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Current digit pair</div>
        <div className="flex items-center gap-6">
          {/* NUM1 digits */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>nums1</span>
            <div className="flex gap-1.5">
              {NUM1.split("").map((d, i) => (
                <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold transition-all"
                  style={{
                    background: currentStep && i === currentStep.i ? "rgba(79,142,247,0.3)" : "var(--bg-hover)",
                    border: currentStep && i === currentStep.i ? "2px solid #4f8ef7" : "1px solid var(--border)",
                    color: currentStep && i === currentStep.i ? "#4f8ef7" : "var(--text-secondary)",
                    transform: currentStep && i === currentStep.i ? "scale(1.15)" : "scale(1)"
                  }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              {NUM1.split("").map((_, i) => (
                <span key={i} className="w-10 text-center" style={{ fontSize: "8px", color: "var(--text-muted)", fontFamily: "monospace" }}>[{i}]</span>
              ))}
            </div>
          </div>

          <div className="text-xl font-bold" style={{ color: "var(--text-muted)" }}>×</div>

          {/* NUM2 digits */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>nums2</span>
            <div className="flex gap-1.5">
              {NUM2.split("").map((d, j) => (
                <div key={j} className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold transition-all"
                  style={{
                    background: currentStep && j === currentStep.j ? "rgba(249,115,22,0.3)" : "var(--bg-hover)",
                    border: currentStep && j === currentStep.j ? "2px solid #f97316" : "1px solid var(--border)",
                    color: currentStep && j === currentStep.j ? "#f97316" : "var(--text-secondary)",
                    transform: currentStep && j === currentStep.j ? "scale(1.15)" : "scale(1)"
                  }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              {NUM2.split("").map((_, j) => (
                <span key={j} className="w-10 text-center" style={{ fontSize: "8px", color: "var(--text-muted)", fontFamily: "monospace" }}>[{j}]</span>
              ))}
            </div>
          </div>

          {currentStep && (
            <div className="flex flex-col items-center px-4 py-2 rounded-xl"
              style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>product</span>
              <span className="text-2xl font-bold font-mono" style={{ color: "#a855f7" }}>{currentStep.product}</span>
              <span className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                {currentStep.d1} × {currentStep.d2}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Result array */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
          Result array (size {totalLen} = {len1}+{len2})
        </div>
        <div className="flex gap-2">
          {resultArr.map((val, pos) => {
            const isAddPos = currentStep && pos === currentStep.addPos;
            const isCarryPos = currentStep && pos === currentStep.carryPos && currentStep.carry > 0;
            let bg = "var(--bg-hover)";
            let borderColor = "var(--border)";
            let color = "var(--text-secondary)";
            if (isAddPos) { bg = "rgba(79,142,247,0.25)"; borderColor = "#4f8ef7"; color = "#4f8ef7"; }
            else if (isCarryPos) { bg = "rgba(249,115,22,0.2)"; borderColor = "#f97316"; color = "#f97316"; }
            else if (val > 0) { bg = "rgba(34,197,94,0.1)"; borderColor = "rgba(34,197,94,0.3)"; color = "#22c55e"; }
            return (
              <div key={pos} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold transition-all"
                  style={{ background: bg, border: `2px solid ${borderColor}`, color }}>
                  {val}
                </div>
                <span style={{ fontSize: "8px", color: "var(--text-muted)", fontFamily: "monospace" }}>[{pos}]</span>
                {isAddPos && <span style={{ fontSize: "8px", color: "#4f8ef7" }}>i+j+1</span>}
                {isCarryPos && <span style={{ fontSize: "8px", color: "#f97316" }}>carry</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          String: "{done ? finalResult : resultArr.join("")}"
          {done && <span className="ml-2 font-bold" style={{ color: "#22c55e" }}>→ trimmed: "{finalResult}"</span>}
        </div>
      </div>

      {/* Step log */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Partial products log</div>
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {STEPS.slice(0, Math.max(0, stepIdx + 1)).map((s, k) => (
            <div key={k} className="flex items-center gap-2 text-xs font-mono px-2 py-1 rounded"
              style={{
                background: k === stepIdx ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)",
                border: k === stepIdx ? "1px solid rgba(168,85,247,0.3)" : "1px solid transparent"
              }}>
              <span style={{ color: "var(--text-muted)" }}>i={s.i} j={s.j}</span>
              <span style={{ color: "#4f8ef7" }}>{s.d1}</span>
              <span style={{ color: "var(--text-muted)" }}>×</span>
              <span style={{ color: "#f97316" }}>{s.d2}</span>
              <span style={{ color: "var(--text-muted)" }}>=</span>
              <span style={{ color: "#a855f7" }}>{s.product}</span>
              <span style={{ color: "var(--text-muted)" }}>→ result[{s.addPos}]</span>
              {s.carry > 0 && <span style={{ color: "#f97316" }}>carry={s.carry}→[{s.carryPos}]</span>}
            </div>
          ))}
          {stepIdx < 0 && <div className="text-xs" style={{ color: "var(--text-muted)" }}>Steps will appear here...</div>}
        </div>
      </div>

      {/* Final result */}
      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>"{NUM1}" × "{NUM2}"</div>
          <div className="text-3xl font-bold font-mono" style={{ color: "#22c55e" }}>{finalResult}</div>
        </div>
      )}
    </div>
  );
}
