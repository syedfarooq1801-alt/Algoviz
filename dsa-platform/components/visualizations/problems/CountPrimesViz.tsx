"use client";
import { useState, useEffect, useRef } from "react";

const N = 30;

// Pre-build all sieve steps
type SieveStep = {
  prime: number;          // current prime being processed
  marking: number;        // the multiple currently being marked (-1 if none)
  composite: Set<number>; // all composite numbers so far
};

function buildSteps(): SieveStep[] {
  const steps: SieveStep[] = [];
  const composite = new Set<number>();

  for (let p = 2; p * p <= N; p++) {
    if (!composite.has(p)) {
      for (let m = p * p; m <= N; m += p) {
        composite.add(m);
        steps.push({ prime: p, marking: m, composite: new Set(composite) });
      }
    }
  }
  return steps;
}

const STEPS = buildSteps();

export default function CountPrimesViz() {
  const [stepIdx, setStepIdx] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const stateRef = useRef({ stepIdx: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentState = stepIdx >= 0 && stepIdx < STEPS.length ? STEPS[stepIdx] : null;
  const composite = currentState ? currentState.composite : new Set<number>();
  const currentPrime = currentState ? currentState.prime : null;
  const currentMarking = currentState ? currentState.marking : null;

  const primes = Array.from({ length: N - 1 }, (_, i) => i + 2).filter(n => !composite.has(n));
  const primeCount = done
    ? Array.from({ length: N - 1 }, (_, i) => i + 2).filter(n => !STEPS[STEPS.length - 1].composite.has(n)).length
    : primes.length;

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

  const finalComposite = STEPS.length > 0 ? STEPS[STEPS.length - 1].composite : new Set<number>();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Count Primes — Sieve of Eratosthenes (n = {N})</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          For each prime p, mark all multiples starting from p² as composite. Remaining unmarked numbers are prime.
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
          <input type="range" min="100" max="1500" step="100" value={speed}
            onChange={e => setSpeed(+e.target.value)}
            style={{ width: "80px", accentColor: "#4f8ef7" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{speed}ms</span>
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ background: "rgba(79,142,247,0.3)", border: "1px solid #4f8ef7" }} />
            <span style={{ color: "var(--text-muted)" }}>Current prime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ background: "rgba(239,68,68,0.3)", border: "1px solid #ef4444" }} />
            <span style={{ color: "var(--text-muted)" }}>Being marked composite</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)" }} />
            <span style={{ color: "var(--text-muted)" }}>Prime (not composite)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ background: "rgba(100,100,100,0.2)", border: "1px solid rgba(100,100,100,0.3)" }} />
            <span style={{ color: "var(--text-muted)" }}>Composite</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Numbers 2 – {N}</div>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}>
          {Array.from({ length: N - 1 }, (_, i) => i + 2).map(num => {
            const isCurrentPrime = num === currentPrime;
            const isCurrentMarking = num === currentMarking;
            const isComposite = done ? finalComposite.has(num) : composite.has(num);
            const isPrimeSoFar = !isComposite && num !== currentMarking;

            let bg = "var(--bg-hover)";
            let borderColor = "var(--border)";
            let color = "var(--text-secondary)";
            let scale = "scale(1)";

            if (isCurrentMarking) {
              bg = "rgba(239,68,68,0.3)"; borderColor = "#ef4444"; color = "#ef4444"; scale = "scale(1.1)";
            } else if (isCurrentPrime) {
              bg = "rgba(79,142,247,0.3)"; borderColor = "#4f8ef7"; color = "#4f8ef7"; scale = "scale(1.1)";
            } else if (isComposite) {
              bg = "rgba(100,100,100,0.12)"; borderColor = "rgba(100,100,100,0.2)"; color = "var(--text-muted)";
            } else if (isPrimeSoFar && stepIdx >= 0) {
              bg = "rgba(34,197,94,0.15)"; borderColor = "rgba(34,197,94,0.35)"; color = "#22c55e";
            }

            return (
              <div key={num}
                className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                style={{ background: bg, border: `2px solid ${borderColor}`, color, transform: scale }}>
                {num}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress info */}
      <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {currentPrime ? `Processing prime: p = ${currentPrime}  →  marking p² = ${currentPrime * currentPrime} and multiples` : done ? "Sieve complete" : "Ready"}
          </div>
          {currentMarking && (
            <div className="text-xs mt-1" style={{ color: "#ef4444" }}>
              Marking {currentMarking} as composite ({currentPrime} × {currentMarking / (currentPrime ?? 1)})
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Prime count</div>
          <div className="text-2xl font-bold font-mono" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>{primeCount}</div>
          {done && <div className="text-xs" style={{ color: "#22c55e" }}>below {N}</div>}
        </div>
      </div>

      {/* Primes list */}
      {done && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>All primes below {N}</div>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: N - 1 }, (_, i) => i + 2).filter(n => !finalComposite.has(n)).map(p => (
              <div key={p} className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", color: "#22c55e" }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
