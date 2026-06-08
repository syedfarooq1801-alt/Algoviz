"use client";
import { useState, useEffect, useRef } from "react";

const DEFAULT_NUMS = [1, 2, 3];

export default function SubsetsViz() {
  const [nums, setNums] = useState(DEFAULT_NUMS);
  const [input, setInput] = useState(DEFAULT_NUMS.join(", "));
  const [visibleSets, setVisibleSets] = useState<number[][]>([[]]);
  const [step, setStep] = useState(0); // which num we're processing
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildAllSteps = (arr: number[]) => {
    const snapshots: { sets: number[][]; msg: string }[] = [{ sets: [[]], msg: "Start with empty set: [[]]" }];
    let current: number[][] = [[]];
    for (const num of arr) {
      const newSets = current.map((s) => [...s, num]);
      current = [...current, ...newSets];
      snapshots.push({ sets: [...current], msg: `Add ${num}: copy all existing sets + append ${num} to each copy` });
    }
    return snapshots;
  };

  const allSteps = buildAllSteps(nums);

  const reset = (arr = nums) => {
    const s = buildAllSteps(arr);
    setVisibleSets([[]]);
    setStep(0);
    setDone(false);
    setLog([]);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const doStep = () => {
    setStep((prev) => {
      const next = prev + 1;
      if (next >= allSteps.length) {
        setDone(true);
        setPlaying(false);
        return prev;
      }
      const snap = allSteps[next];
      setVisibleSets(snap.sets);
      setLog((l) => [...l.slice(-6), `Step ${next}: ${snap.msg}`]);
      return next;
    });
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep((prev) => {
          const next = prev + 1;
          if (next >= allSteps.length) {
            setDone(true);
            setPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          const snap = allSteps[next];
          setVisibleSets(snap.sets);
          setLog((l) => [...l.slice(-6), `Step ${next}: ${snap.msg}`]);
          return next;
        });
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  const apply = () => {
    try {
      const arr = input.split(",").map((x) => parseInt(x.trim(), 10)).filter((x) => !isNaN(x)).slice(0, 5);
      setNums(arr);
      reset(arr);
    } catch {}
  };

  const currentNum = step > 0 && step <= nums.length ? nums[step - 1] : null;
  const prevCount = step > 0 ? allSteps[step - 1]?.sets.length : 1;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Subsets — Iterative Visualization (max 5 elements)
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Array:</label>
            <input className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "150px" }}
              value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setPlaying(!playing)} disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={() => reset()} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Step {step}/{allSteps.length - 1}</span>
          <div className="flex items-center gap-2">
            <input type="range" min="300" max="2000" step="200" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "80px", accentColor: "#4f8ef7" }} />
          </div>
        </div>
      </div>

      {/* Current number being processed */}
      {currentNum !== null && (
        <div className="rounded-lg px-4 py-2 text-xs" style={{ background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)", color: "#4f8ef7" }}>
          Processing element: <strong>{currentNum}</strong> → Doubling result set ({prevCount} → {visibleSets.length} subsets)
        </div>
      )}

      {/* Subsets grid */}
      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>
          Current result: {visibleSets.length} subsets
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleSets.map((subset, i) => {
            const isNew = step > 0 && i >= (allSteps[step - 1]?.sets.length ?? 0);
            return (
              <div
                key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300"
                style={{
                  background: isNew ? "rgba(79,142,247,0.15)" : "var(--bg-hover)",
                  border: isNew ? "1px solid rgba(79,142,247,0.4)" : "1px solid var(--border)",
                  color: isNew ? "#4f8ef7" : "var(--text-secondary)",
                  transform: isNew ? "scale(1.05)" : "scale(1)",
                }}
              >
                [{subset.join(", ")}]
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          Total subsets = 2^{nums.length} = {Math.pow(2, nums.length)}
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div className="h-full progress-bar" style={{ width: `${(visibleSets.length / Math.pow(2, nums.length)) * 100}%` }} />
        </div>
        <div className="text-xs mt-1 text-right" style={{ color: "var(--text-muted)" }}>
          {visibleSets.length} / {Math.pow(2, nums.length)}
        </div>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Log</h4>
          <div className="space-y-1 text-xs font-mono" style={{ maxHeight: "100px", overflowY: "auto" }}>
            {log.map((l, i) => <div key={i} style={{ color: "var(--text-secondary)" }}>{l}</div>)}
          </div>
        </div>
      )}

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color: "#22c55e" }}>
            ✓ All {Math.pow(2, nums.length)} subsets generated!
          </div>
        </div>
      )}
    </div>
  );
}
