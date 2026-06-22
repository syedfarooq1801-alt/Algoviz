"use client";
import { useState, useEffect, useRef } from "react";

const DEFAULT_NUMS = [2, 7, 11, 15];
const DEFAULT_TARGET = 9;

export default function TwoSumViz() {
  const [nums, setNums] = useState<number[]>(DEFAULT_NUMS);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [hashMap, setHashMap] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndices, setFoundIndices] = useState<[number, number] | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [numsInput, setNumsInput] = useState(DEFAULT_NUMS.join(", "));
  const [targetInput, setTargetInput] = useState(String(DEFAULT_TARGET));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = buildSteps(nums, target);

  function buildSteps(arr: number[], t: number) {
    const s: { map: Record<number, number>; i: number; found: [number, number] | null; msg: string }[] = [];
    const map: Record<number, number> = {};
    for (let i = 0; i < arr.length; i++) {
      const complement = t - arr[i];
      if (map[complement] !== undefined) {
        s.push({
          map: { ...map },
          i,
          found: [map[complement], i],
          msg: `i=${i}, nums[i]=${arr[i]}, complement=${complement} → FOUND in map at index ${map[complement]}! Answer: [${map[complement]}, ${i}]`,
        });
      } else {
        s.push({
          map: { ...map },
          i,
          found: null,
          msg: `i=${i}, nums[i]=${arr[i]}, complement=${complement} → not in map. Store ${arr[i]}→${i}`,
        });
        map[arr[i]] = i;
      }
    }
    return s;
  }

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep((prev) => {
          if (prev + 1 >= steps.length) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, steps.length]);

  useEffect(() => {
    if (step >= 0 && step < steps.length) {
      const s = steps[step];
      setHashMap(s.map);
      setCurrentIndex(s.i);
      setFoundIndices(s.found);
      setLog((prev) => [...prev.slice(-8), `Step ${step + 1}: ${s.msg}`]);
    }
  }, [step]);

  const reset = () => {
    setStep(-1);
    setPlaying(false);
    setHashMap({});
    setCurrentIndex(-1);
    setFoundIndices(null);
    setLog([]);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const applyInput = () => {
    try {
      const parsed = numsInput.split(",").map((x) => parseInt(x.trim(), 10));
      const t = parseInt(targetInput, 10);
      if (parsed.some(isNaN) || isNaN(t)) return;
      setNums(parsed);
      setTarget(t);
      reset();
    } catch {}
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div
        className="rounded-xl p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Two Sum — Hash Map Visualization
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Array:</label>
            <input
              className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "180px" }}
              value={numsInput}
              onChange={(e) => setNumsInput(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Target:</label>
            <input
              className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "60px" }}
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
            />
          </div>
          <button
            onClick={applyInput}
            className="px-3 py-1 rounded text-xs"
            style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}
          >
            Apply
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPlaying(!playing)}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => setStep((p) => Math.min(p + 1, steps.length - 1))}
            disabled={step >= steps.length - 1}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            → Step
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            ↺ Reset
          </button>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Speed:</span>
            <input
              type="range" min="200" max="2000" step="200" value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: "80px", accentColor: "#4f8ef7" }}
            />
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Step {step + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Array visualization */}
      <div
        className="rounded-xl p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Target:</span>
          <span className="text-sm font-bold" style={{ color: "#f97316" }}>{target}</span>
        </div>
        <div className="flex items-end gap-3 flex-wrap">
          {nums.map((n, i) => {
            const isActive = i === currentIndex;
            const isFound = foundIndices && (i === foundIndices[0] || i === foundIndices[1]);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300"
                  style={{
                    background: isFound
                      ? "rgba(34,197,94,0.2)"
                      : isActive
                      ? "rgba(79,142,247,0.2)"
                      : "var(--bg-hover)",
                    border: isFound
                      ? "2px solid #22c55e"
                      : isActive
                      ? "2px solid #4f8ef7"
                      : "2px solid var(--border)",
                    color: isFound ? "#22c55e" : isActive ? "#4f8ef7" : "var(--text-primary)",
                    transform: isActive ? "scale(1.1) translateY(-4px)" : "scale(1)",
                    boxShadow: isActive ? "0 8px 24px rgba(79,142,247,0.3)" : isFound ? "0 8px 24px rgba(34,197,94,0.3)" : "none",
                  }}
                >
                  {n}
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  [{i}]
                </span>
                {isActive && (
                  <div className="text-xs" style={{ color: "#4f8ef7" }}>↑ curr</div>
                )}
                {isFound && foundIndices && i === foundIndices[0] && (
                  <div className="text-xs" style={{ color: "#22c55e" }}>✓ found</div>
                )}
                {isActive && (
                  <div className="text-xs" style={{ color: "#f97316" }}>
                    need: {target - n}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hash Map visualization */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h4 className="text-xs font-semibold mb-3" style={{ color: "#a855f7" }}>
          Hash Map: value → index
        </h4>
        <div className="flex flex-wrap gap-2 min-h-12">
          {Object.keys(hashMap).length === 0 ? (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Empty</span>
          ) : (
            Object.entries(hashMap).map(([val, idx]) => (
              <div
                key={val}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                style={{
                  background: "rgba(168,85,247,0.1)",
                  border: "1px solid rgba(168,85,247,0.3)",
                  color: "#a855f7",
                  animation: "fadeInUp 0.2s ease-out",
                }}
              >
                <span>{val}</span>
                <span style={{ color: "var(--text-muted)" }}>→</span>
                <span style={{ color: "#4f8ef7" }}>idx:{idx}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            Execution Log
          </h4>
          <div className="space-y-1 font-mono text-xs" style={{ maxHeight: "140px", overflowY: "auto" }}>
            {log.map((l, i) => (
              <div
                key={i}
                style={{
                  color: l.includes("FOUND") ? "#22c55e" : "var(--text-secondary)",
                  fontWeight: l.includes("FOUND") ? 600 : 400,
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {foundIndices && (
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(79,142,247,0.1))",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>
            ✓ Found! Answer: [{foundIndices[0]}, {foundIndices[1]}]
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            nums[{foundIndices[0]}] + nums[{foundIndices[1]}] = {nums[foundIndices[0]]} + {nums[foundIndices[1]]} = {target}
          </div>
        </div>
      )}
    </div>
  );
}
