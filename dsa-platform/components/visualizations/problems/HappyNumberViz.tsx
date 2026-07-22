"use client";
import { useState, useEffect, useRef } from "react";

const N_HAPPY = 19;
const N_UNHAPPY = 4;

function sumOfSquares(n: number): number {
  let s = 0;
  while (n > 0) { const d = n % 10; s += d * d; n = Math.floor(n / 10); }
  return s;
}

function getDigits(n: number): number[] {
  return String(n).split("").map(Number);
}

// Pre-build sequences
function buildSequence(start: number, maxSteps = 20): { val: number; calc: string }[] {
  const seq: { val: number; calc: string }[] = [];
  const seen = new Set<number>();
  let cur = start;
  while (!seen.has(cur) && cur !== 1 && seq.length < maxSteps) {
    seen.add(cur);
    const digits = getDigits(cur);
    const calc = digits.map(d => `${d}²`).join("+") + `=${sumOfSquares(cur)}`;
    seq.push({ val: cur, calc });
    cur = sumOfSquares(cur);
  }
  // add terminal
  const digits = getDigits(cur);
  const calc = digits.map(d => `${d}²`).join("+") + `=${sumOfSquares(cur)}`;
  seq.push({ val: cur, calc });
  return seq;
}

const SEQ_HAPPY = buildSequence(N_HAPPY);
const SEQ_UNHAPPY = buildSequence(N_UNHAPPY);

export default function HappyNumberViz() {
  const [activeN, setActiveN] = useState<19 | 4>(19);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const stateRef = useRef({ step: 0, activeN: 19 as 19 | 4 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const seq = activeN === 19 ? SEQ_HAPPY : SEQ_UNHAPPY;
  const isHappy = activeN === 19;

  const reset = () => {
    stateRef.current = { step: 0, activeN };
    setStep(0); setDone(false); setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const nextStep = s + 1;
    if (nextStep >= seq.length) {
      stateRef.current.step = nextStep;
      setStep(nextStep); setDone(true); setPlaying(false);
    } else {
      stateRef.current.step = nextStep;
      setStep(nextStep);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed, activeN]);

  const switchN = (n: 19 | 4) => {
    stateRef.current = { step: 0, activeN: n };
    setActiveN(n); setStep(0); setDone(false); setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Happy Number — Cycle Detection</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Replace n with sum of squares of digits. If it reaches 1 → happy. If it loops → not happy.
        </div>
        <div className="flex gap-2 flex-wrap items-center mb-3">
          <button onClick={() => switchN(19)}
            className="px-3 py-1.5 rounded text-xs font-medium transition-all"
            style={{ background: activeN === 19 ? "rgba(34,197,94,0.2)" : "var(--bg-hover)", color: activeN === 19 ? "#22c55e" : "var(--text-secondary)", border: `1px solid ${activeN === 19 ? "rgba(34,197,94,0.4)" : "var(--border)"}` }}>
            n = 19 (Happy)
          </button>
          <button onClick={() => switchN(4)}
            className="px-3 py-1.5 rounded text-xs font-medium transition-all"
            style={{ background: activeN === 4 ? "rgba(239,68,68,0.2)" : "var(--bg-hover)", color: activeN === 4 ? "#ef4444" : "var(--text-secondary)", border: `1px solid ${activeN === 4 ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
            n = 4 (Unhappy)
          </button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing}
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

      {/* Sequence */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
          Sequence for n = {activeN}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {seq.map((entry, i) => {
            const isVisible = i <= step;
            const isCurrent = i === step;
            const isTerminal = i === seq.length - 1 && done;
            const isOne = entry.val === 1;
            const seenBefore = !isOne && seq.slice(0, i).some(e => e.val === entry.val);
            let bg = "var(--bg-hover)";
            let borderColor = "var(--border)";
            let color = "var(--text-secondary)";
            if (isTerminal && isOne) { bg = "rgba(34,197,94,0.2)"; borderColor = "#22c55e"; color = "#22c55e"; }
            else if (isTerminal && seenBefore) { bg = "rgba(239,68,68,0.2)"; borderColor = "#ef4444"; color = "#ef4444"; }
            else if (isCurrent) { bg = "rgba(79,142,247,0.2)"; borderColor = "#4f8ef7"; color = "#4f8ef7"; }
            else if (i < step && isOne) { bg = "rgba(34,197,94,0.15)"; borderColor = "rgba(34,197,94,0.4)"; color = "#22c55e"; }
            else if (i < step) { bg = "rgba(168,85,247,0.1)"; borderColor = "rgba(168,85,247,0.3)"; color = "#a855f7"; }

            return isVisible ? (
              <div key={i} className="flex items-center gap-1">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-base font-bold transition-all"
                    style={{ background: bg, border: `2px solid ${borderColor}`, color }}>
                    {entry.val}
                  </div>
                  {isTerminal && isOne && <span className="text-xs font-semibold mt-0.5" style={{ color: "#22c55e" }}>Happy!</span>}
                  {isTerminal && seenBefore && <span className="text-xs font-semibold mt-0.5" style={{ color: "#ef4444" }}>Loop!</span>}
                </div>
                {i < seq.length - 1 && isVisible && i < step && (
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>→</span>
                )}
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Calculation breakdown */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Digit-by-digit calculation</div>
        <div className="space-y-1.5">
          {seq.slice(0, step + 1).map((entry, i) => {
            if (i === seq.length - 1 && !done) return null;
            const digits = getDigits(entry.val);
            const result = sumOfSquares(entry.val);
            const isLast = i === step;
            const isOne = entry.val === 1;
            if (isOne) return null;
            return (
              <div key={i} className="flex items-center gap-2 text-xs font-mono px-2 py-1.5 rounded-lg"
                style={{ background: isLast ? "rgba(79,142,247,0.1)" : "rgba(255,255,255,0.02)", border: isLast ? "1px solid rgba(79,142,247,0.3)" : "1px solid transparent" }}>
                <span className="font-bold" style={{ color: "#4f8ef7", minWidth: "24px" }}>{entry.val}</span>
                <span style={{ color: "var(--text-muted)" }}>→</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  {digits.map((d, di) => (
                    <span key={di}>
                      <span style={{ color: "#f97316" }}>{d}</span>
                      <span style={{ color: "var(--text-muted)" }}>²</span>
                      {di < digits.length - 1 && <span style={{ color: "var(--text-muted)" }}>+</span>}
                    </span>
                  ))}
                </span>
                <span style={{ color: "var(--text-muted)" }}>=</span>
                <span className="font-bold" style={{ color: result === 1 ? "#22c55e" : "#a855f7" }}>{result}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: isHappy ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${isHappy ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}` }}>
          <div className="text-lg font-bold" style={{ color: isHappy ? "#22c55e" : "#ef4444" }}>
            {isHappy ? `${activeN} is a Happy Number ✓` : `${activeN} is NOT a Happy Number — cycle detected`}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {isHappy ? "Sequence reached 1" : "Sequence loops back to a previous value"}
          </div>
        </div>
      )}
    </div>
  );
}
