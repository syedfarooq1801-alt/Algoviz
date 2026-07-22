"use client";
import { useState, useEffect, useRef } from "react";

interface LLNode { val: number; next: number | null; }
type NodeMap = Record<number, LLNode>;

function buildList(vals: number[]): { nodes: NodeMap; head: number | null } {
  const nodes: NodeMap = {};
  for (let i = 0; i < vals.length; i++) {
    nodes[i] = { val: vals[i], next: i + 1 < vals.length ? i + 1 : null };
  }
  return { nodes, head: vals.length > 0 ? 0 : null };
}

function reverseSteps(vals: number[]) {
  const steps: { prev: number | null; curr: number | null; next: number | null; arrows: [number, number][]; msg: string }[] = [];
  const arr = vals.map((v, i) => ({ id: i, val: v, next: i + 1 < vals.length ? i + 1 : null }));
  const arrows: [number, number][] = arr.slice(0, -1).map((_, i) => [i, i + 1]);

  let prev: number | null = null;
  let curr: number | null = 0;

  steps.push({ prev, curr, next: curr !== null ? arr[curr].next : null, arrows: [...arrows], msg: "Initial: prev=null, curr=head" });

  while (curr !== null) {
    const nextNode: number | null = arr[curr].next;
    steps.push({ prev, curr, next: nextNode, arrows: [...arrows], msg: `Save next=${nextNode !== null ? arr[nextNode].val : "null"}` });

    // flip arrow
    const newArrows = arrows.filter(([, b]) => b !== curr);
    if (prev !== null) newArrows.push([curr, prev]);

    prev = curr;
    curr = nextNode;
    steps.push({ prev, curr, next: curr !== null ? arr[curr!].next : null, arrows: newArrows, msg: `curr→prev flipped. prev=${arr[prev].val}, curr=${curr !== null ? arr[curr].val : "null"}` });
    Object.assign(arrows, newArrows);
  }

  return steps;
}

const DEFAULT_VALS = [1, 2, 3, 4, 5];

export default function LinkedListViz() {
  const [vals, setVals] = useState(DEFAULT_VALS);
  const [input, setInput] = useState(DEFAULT_VALS.join(" → "));
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = reverseSteps(vals);

  const reset = (v = vals) => {
    setStepIdx(0);
    setDone(false);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIdx((prev) => {
          if (prev + 1 >= steps.length) {
            setPlaying(false);
            setDone(true);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, steps.length]);

  const apply = () => {
    try {
      const v = input.split(/[\s,→]+/).map((x) => parseInt(x.trim(), 10)).filter((x) => !isNaN(x));
      if (v.length === 0) return;
      setVals(v);
      reset(v);
    } catch {}
  };

  const current = steps[stepIdx] ?? steps[0];
  const nodeW = 56, nodeH = 44, gap = 40;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Reverse Linked List Visualization
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>List (space/→ separated):</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "200px" }}
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
          <button onClick={() => setStepIdx((p) => Math.min(p + 1, steps.length - 1))} disabled={done || playing}
            className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={() => reset()} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Step {stepIdx + 1}/{steps.length}</span>
          <div className="flex items-center gap-2">
            <input type="range" min="200" max="1500" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "80px", accentColor: "#4f8ef7" }} />
          </div>
        </div>
      </div>

      {/* SVG visualization */}
      <div className="rounded-xl p-6 overflow-x-auto" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-mono px-1" style={{ color: "#a855f7" }}>{current.msg}</div>
        <svg
          width={Math.max(vals.length * (nodeW + gap) + 40, 400)}
          height={140}
          style={{ overflow: "visible" }}
         role="img" aria-label="Linked list node diagram">
          {/* Arrows */}
          {current.arrows.map(([from, to], i) => {
            const x1 = from * (nodeW + gap) + nodeW + 20;
            const x2 = to * (nodeW + gap) + 20;
            const y = 50;
            const reversed = from > to;
            return (
              <g key={`${from}-${to}-${i}`}>
                <defs>
                  <marker id={`arrow-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill={reversed ? "#22c55e" : "#4f8ef7"} />
                  </marker>
                </defs>
                <line
                  x1={x1} y1={y} x2={x2 + (reversed ? nodeW : 0)} y2={y}
                  stroke={reversed ? "#22c55e" : "#4f8ef7"}
                  strokeWidth="2"
                  markerEnd={`url(#arrow-${i})`}
                  strokeDasharray={reversed ? "4,2" : "none"}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {vals.map((v, i) => {
            const x = i * (nodeW + gap) + 20;
            const y = 28;
            const isPrev = current.prev === i;
            const isCurr = current.curr === i;
            const isNext = current.next === i;
            const color = isPrev ? "#22c55e" : isCurr ? "#4f8ef7" : isNext ? "#f97316" : "#2a2a3a";
            const textColor = isPrev ? "#22c55e" : isCurr ? "#4f8ef7" : isNext ? "#f97316" : "var(--text-primary)";
            return (
              <g key={i}>
                <rect x={x} y={y} width={nodeW} height={nodeH} rx="8"
                  fill={isPrev ? "rgba(34,197,94,0.15)" : isCurr ? "rgba(79,142,247,0.15)" : isNext ? "rgba(249,115,22,0.1)" : "var(--bg-hover)"}
                  stroke={color} strokeWidth={isPrev || isCurr ? "2" : "1"}
                />
                <text x={x + nodeW / 2} y={y + nodeH / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={textColor} fontSize="14" fontWeight="700" fontFamily="monospace">
                  {v}
                </text>
                {isPrev && <text x={x + nodeW / 2} y={y + nodeH + 14} textAnchor="middle" fill="#22c55e" fontSize="10">prev</text>}
                {isCurr && <text x={x + nodeW / 2} y={y + nodeH + 14} textAnchor="middle" fill="#4f8ef7" fontSize="10">curr</text>}
                {isNext && !isCurr && <text x={x + nodeW / 2} y={y + nodeH + 14} textAnchor="middle" fill="#f97316" fontSize="10">next</text>}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Pointer state */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "prev", val: current.prev !== null ? vals[current.prev] : "null", color: "#22c55e" },
          { label: "curr", val: current.curr !== null ? vals[current.curr] : "null", color: "#4f8ef7" },
          { label: "next", val: current.next !== null ? vals[current.next] : "null", color: "#f97316" },
        ].map(({ label, val, color }) => (
          <div key={label} className="rounded-xl p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</div>
            <div className="text-lg font-bold font-mono" style={{ color }}>{String(val)}</div>
          </div>
        ))}
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color: "#22c55e" }}>
            ✓ List reversed! New head = {vals[vals.length - 1]}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Original: {vals.join(" → ")} | Reversed: {[...vals].reverse().join(" → ")}
          </div>
        </div>
      )}
    </div>
  );
}
