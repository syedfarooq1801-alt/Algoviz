"use client";
import { useState, useEffect, useRef } from "react";

const DEFAULT_STRING = "abcabcbb";

export default function SlidingWindowViz() {
  const [input, setInput] = useState(DEFAULT_STRING);
  const [str, setStr] = useState(DEFAULT_STRING);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(-1);
  const [charSet, setCharSet] = useState<Set<string>>(new Set());
  const [maxLen, setMaxLen] = useState(0);
  const [bestWindow, setBestWindow] = useState<[number, number]>([-1, -1]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const stateRef = useRef({ l: 0, r: -1, set: new Set<string>(), best: 0, bestW: [-1, -1] as [number,number] });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = (s?: string) => {
    const target = s ?? str;
    setLeft(0);
    setRight(-1);
    setCharSet(new Set());
    setMaxLen(0);
    setBestWindow([-1, -1]);
    setLog([]);
    setDone(false);
    setPlaying(false);
    stateRef.current = { l: 0, r: -1, set: new Set(), best: 0, bestW: [-1, -1] };
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const step = () => {
    const { l, r, set, best, bestW } = stateRef.current;
    const n = str.length;

    if (r + 1 >= n) {
      setDone(true);
      setPlaying(false);
      return;
    }

    const nextR = r + 1;
    const c = str[nextR];

    if (!set.has(c)) {
      // Expand
      set.add(c);
      const newLen = nextR - l + 1;
      const newBest = newLen > best ? newLen : best;
      const newBestW: [number, number] = newLen > best ? [l, nextR] : bestW;
      stateRef.current = { l, r: nextR, set: new Set(set), best: newBest, bestW: newBestW };
      setRight(nextR);
      setCharSet(new Set(set));
      setMaxLen(newBest);
      setBestWindow(newBestW);
      setLog((prev) => [...prev.slice(-9), `Expand right: add '${c}' at ${nextR}. Window=[${l}..${nextR}] len=${newLen}. Best=${newBest}`]);
    } else {
      // Shrink from left until duplicate removed
      let newL = l;
      const newSet = new Set(set);
      while (newSet.has(c)) {
        newSet.delete(str[newL]);
        newL++;
      }
      newSet.add(c);
      stateRef.current = { l: newL, r: nextR, set: newSet, best, bestW };
      setLeft(newL);
      setRight(nextR);
      setCharSet(newSet);
      setLog((prev) => [...prev.slice(-9), `Duplicate '${c}'! Shrink left to ${newL}. Window=[${newL}..${nextR}]`]);
    }
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (stateRef.current.r + 1 >= str.length) {
          setDone(true);
          setPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }
        step();
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, str]);

  const apply = () => {
    setStr(input);
    reset(input);
    // need to update ref after state
    setTimeout(() => {
      stateRef.current = { l: 0, r: -1, set: new Set(), best: 0, bestW: [-1, -1] };
    }, 0);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Longest Substring Without Repeating Characters — Sliding Window
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>String:</label>
            <input
              className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "200px" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>
            Apply
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPlaying(!playing)}
            disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={step} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            → Step
          </button>
          <button onClick={() => reset()} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            ↺ Reset
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Speed:</span>
            <input type="range" min="150" max="1500" step="150" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "80px", accentColor: "#4f8ef7" }} />
          </div>
        </div>
      </div>

      {/* String visualization */}
      <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: "rgba(79,142,247,0.3)", border: "1px solid #4f8ef7" }} />
            <span>Current window</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.5)" }} />
            <span>Best window</span>
          </div>
        </div>

        <div className="flex gap-1 flex-wrap mb-4">
          {str.split("").map((c, i) => {
            const inWindow = right >= 0 && i >= left && i <= right;
            const isBest = bestWindow[0] >= 0 && i >= bestWindow[0] && i <= bestWindow[1] && !inWindow;
            const isLeft = i === left && right >= 0;
            const isRight = i === right;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold font-mono transition-all duration-200"
                  style={{
                    background: inWindow ? "rgba(79,142,247,0.2)" : isBest ? "rgba(34,197,94,0.1)" : "var(--bg-hover)",
                    border: inWindow ? "2px solid #4f8ef7" : isBest ? "1px solid rgba(34,197,94,0.4)" : "2px solid var(--border)",
                    color: inWindow ? "#4f8ef7" : isBest ? "#22c55e" : "var(--text-primary)",
                    transform: inWindow ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {c}
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "9px" }}>{i}</span>
                {isLeft && <div style={{ color: "#4f8ef7", fontSize: "9px" }}>L</div>}
                {isRight && <div style={{ color: "#f97316", fontSize: "9px" }}>R</div>}
              </div>
            );
          })}
        </div>

        {/* Window bracket */}
        {right >= 0 && (
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Window: &quot;{str.slice(left, right + 1)}&quot; (length {right - left + 1})
          </div>
        )}
      </div>

      {/* Char Set */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h4 className="text-xs font-semibold mb-2" style={{ color: "#a855f7" }}>Window Char Set (Hash Set)</h4>
        <div className="flex gap-2 flex-wrap min-h-8">
          {charSet.size === 0 ? (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Empty</span>
          ) : (
            Array.from(charSet).map((c) => (
              <span key={c} className="px-2.5 py-1 rounded-full text-xs font-mono" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>
                {c}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Current Window</div>
          <div className="text-2xl font-bold" style={{ color: "#4f8ef7" }}>{right >= 0 ? right - left + 1 : 0}</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: done ? "rgba(34,197,94,0.1)" : "var(--bg-card)", border: done ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Best Length</div>
          <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{maxLen}</div>
          {done && <div className="text-xs mt-1" style={{ color: "#22c55e" }}>Final Answer ✓</div>}
        </div>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Log</h4>
          <div className="space-y-1 text-xs font-mono" style={{ maxHeight: "120px", overflowY: "auto" }}>
            {log.map((l, i) => (
              <div key={i} style={{ color: l.includes("Duplicate") ? "#f97316" : l.includes("Best") ? "#22c55e" : "var(--text-secondary)" }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
