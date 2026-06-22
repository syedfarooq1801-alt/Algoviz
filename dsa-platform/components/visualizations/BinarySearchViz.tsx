"use client";
import { useState, useEffect, useRef } from "react";

const DEFAULT_NUMS = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const DEFAULT_TARGET = 7;

export default function BinarySearchViz() {
  const [nums, setNums] = useState(DEFAULT_NUMS);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [numsInput, setNumsInput] = useState(DEFAULT_NUMS.join(", "));
  const [targetInput, setTargetInput] = useState(String(DEFAULT_TARGET));
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(nums.length - 1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const stateRef = useRef({ l: 0, r: nums.length - 1, done: false });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = (arr = nums, tgt = target) => {
    setLeft(0);
    setRight(arr.length - 1);
    setMid(-1);
    setFound(null);
    setNotFound(false);
    setDone(false);
    setLog([]);
    setPlaying(false);
    stateRef.current = { l: 0, r: arr.length - 1, done: false };
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const doStep = () => {
    if (stateRef.current.done) return;
    const { l, r } = stateRef.current;
    if (l > r) {
      setNotFound(true);
      setDone(true);
      setPlaying(false);
      stateRef.current.done = true;
      setLog((p) => [...p.slice(-9), `left(${l}) > right(${r}) — target ${target} NOT FOUND`]);
      return;
    }
    const m = l + Math.floor((r - l) / 2);
    setMid(m);
    setLeft(l);
    setRight(r);
    if (nums[m] === target) {
      setFound(m);
      setDone(true);
      setPlaying(false);
      stateRef.current.done = true;
      setLog((p) => [...p.slice(-9), `mid=${m}, nums[${m}]=${nums[m]} == target ${target} ✓ FOUND at index ${m}`]);
    } else if (nums[m] < target) {
      const newL = m + 1;
      stateRef.current = { l: newL, r, done: false };
      setLog((p) => [...p.slice(-9), `mid=${m}, nums[${m}]=${nums[m]} < ${target} → search right half [${newL}..${r}]`]);
    } else {
      const newR = m - 1;
      stateRef.current = { l, r: newR, done: false };
      setLog((p) => [...p.slice(-9), `mid=${m}, nums[${m}]=${nums[m]} > ${target} → search left half [${l}..${newR}]`]);
    }
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (stateRef.current.done) {
          setPlaying(false);
          clearInterval(intervalRef.current!);
          return;
        }
        doStep();
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  const apply = () => {
    try {
      const arr = numsInput.split(",").map((x) => parseInt(x.trim(), 10));
      const t = parseInt(targetInput, 10);
      if (arr.some(isNaN) || isNaN(t)) return;
      const sorted = [...arr].sort((a, b) => a - b);
      setNums(sorted);
      setTarget(t);
      reset(sorted, t);
    } catch {}
  };

  const eliminated = (i: number) => i < left || i > right;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Binary Search Visualization
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Sorted Array:</label>
            <input
              className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "240px" }}
              value={numsInput} onChange={(e) => setNumsInput(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Target:</label>
            <input
              className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "60px" }}
              value={targetInput} onChange={(e) => setTargetInput(e.target.value)}
            />
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
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Speed:</span>
            <input type="range" min="200" max="2000" step="200" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "80px", accentColor: "#4f8ef7" }} />
          </div>
        </div>
      </div>

      {/* Array */}
      <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>Target:</span>
          <span className="font-bold" style={{ color: "#f97316" }}>{target}</span>
          <span className="ml-4">Search space: [{left}..{right}]</span>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {nums.map((n, i) => {
            const elim = eliminated(i);
            const isFoundIdx = found === i;
            const isMidIdx = i === mid;
            const isL = i === left;
            const isR = i === right;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 font-mono"
                  style={{
                    background: isFoundIdx ? "rgba(34,197,94,0.25)" : isMidIdx ? "rgba(168,85,247,0.25)" : elim ? "rgba(0,0,0,0.3)" : "var(--bg-hover)",
                    border: isFoundIdx ? "2px solid #22c55e" : isMidIdx ? "2px solid #a855f7" : elim ? "2px solid #1e1e2e" : "2px solid var(--border)",
                    color: isFoundIdx ? "#22c55e" : isMidIdx ? "#a855f7" : elim ? "var(--text-muted)" : "var(--text-primary)",
                    opacity: elim ? 0.3 : 1,
                    transform: isMidIdx && !isFoundIdx ? "scale(1.1) translateY(-4px)" : "scale(1)",
                    boxShadow: isFoundIdx ? "0 0 20px rgba(34,197,94,0.4)" : isMidIdx ? "0 8px 20px rgba(168,85,247,0.3)" : "none",
                  }}
                >
                  {n}
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "9px" }}>{i}</span>
                <span className="text-xs font-bold" style={{ fontSize: "9px", color: isL && isR ? "#a855f7" : isL ? "#4f8ef7" : isR ? "#f97316" : "transparent" }}>
                  {isL && isR ? "L=R" : isL ? "L" : isR ? "R" : "."}
                </span>
                {isMidIdx && (
                  <span className="text-xs font-bold" style={{ fontSize: "9px", color: "#a855f7" }}>mid</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: "rgba(79,142,247,0.3)", border: "1px solid #4f8ef7" }} /><span>Left</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: "rgba(168,85,247,0.3)", border: "1px solid #a855f7" }} /><span>Mid</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: "rgba(249,115,22,0.3)", border: "1px solid #f97316" }} /><span>Right</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ opacity: 0.3, background: "var(--border)" }} /><span>Eliminated</span></div>
        </div>
      </div>

      {/* Search space bar */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Search Space Remaining</div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              marginLeft: `${(left / nums.length) * 100}%`,
              width: `${((right - left + 1) / nums.length) * 100}%`,
              background: found !== null ? "#22c55e" : "linear-gradient(90deg, #4f8ef7, #a855f7)",
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          <span>Remaining: {done ? 0 : Math.max(0, right - left + 1)} of {nums.length}</span>
          <span>
            {done ? (found !== null ? "✓" : "✗") : `~${Math.ceil(Math.log2(right - left + 2))} steps left`}
          </span>
        </div>
      </div>

      {/* Result */}
      {done && (
        <div className="rounded-xl p-4 text-center" style={{
          background: found !== null ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${found !== null ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
        }}>
          <div className="font-semibold text-sm" style={{ color: found !== null ? "#22c55e" : "#ef4444" }}>
            {found !== null ? `✓ Found ${target} at index ${found}` : `✗ ${target} not in array`}
          </div>
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Log</h4>
          <div className="space-y-1 text-xs font-mono" style={{ maxHeight: "120px", overflowY: "auto" }}>
            {log.map((l, i) => (
              <div key={i} style={{ color: l.includes("FOUND") ? "#22c55e" : l.includes("NOT FOUND") ? "#ef4444" : l.includes("right") ? "#f97316" : "#4f8ef7" }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
