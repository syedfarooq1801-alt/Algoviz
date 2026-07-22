"use client";
import { useState, useEffect, useRef } from "react";

interface TreeNode {
  id: number;
  val: number;
  left: number | null;
  right: number | null;
  x: number;
  y: number;
}

type TreeMap = Record<number, TreeNode>;

function buildTree(arr: (number | null)[]): TreeMap {
  const nodes: TreeMap = {};
  const W = 520, startY = 50, levelH = 70;

  function build(idx: number, x: number, y: number, spread: number): number | null {
    if (idx >= arr.length || arr[idx] === null) return null;
    const val = arr[idx]!;
    const leftChild = build(2 * idx + 1, x - spread, y + levelH, spread / 2);
    const rightChild = build(2 * idx + 2, x + spread, y + levelH, spread / 2);
    nodes[idx] = { id: idx, val, left: leftChild, right: rightChild, x, y };
    return idx;
  }

  build(0, W / 2, startY, W / 4);
  return nodes;
}

function invertSteps(nodes: TreeMap): { highlighted: number[]; swapped: number[]; msg: string }[] {
  const steps: { highlighted: number[]; swapped: number[]; msg: string }[] = [];
  const order: number[] = [];

  function postorder(id: number | null) {
    if (id === null || !nodes[id]) return;
    postorder(nodes[id].left);
    postorder(nodes[id].right);
    order.push(id);
  }
  postorder(0);

  for (const id of order) {
    steps.push({ highlighted: [id], swapped: [], msg: `Visit node ${nodes[id].val} — swap left ↔ right children` });
    steps.push({ highlighted: [id], swapped: [id], msg: `Swapped children of ${nodes[id].val} ✓` });
  }
  return steps;
}

const DEFAULT_TREE = [4, 2, 7, 1, 3, 6, 9];

export default function TreeViz() {
  const [treeArr, setTreeArr] = useState<(number | null)[]>(DEFAULT_TREE);
  const [inputVal, setInputVal] = useState(DEFAULT_TREE.join(", "));
  const [nodes, setNodes] = useState<TreeMap>(() => buildTree(DEFAULT_TREE));
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = invertSteps(nodes);

  const reset = () => {
    setStepIdx(-1);
    setDone(false);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIdx((p) => {
          if (p + 1 >= steps.length) { setPlaying(false); setDone(true); return p; }
          return p + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, steps.length]);

  const apply = () => {
    try {
      const arr = inputVal.split(",").map((x) => {
        const t = x.trim();
        return t === "null" || t === "" ? null : parseInt(t, 10);
      });
      setTreeArr(arr);
      setNodes(buildTree(arr));
      reset();
    } catch {}
  };

  const current = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null;
  const highlighted = current?.highlighted ?? [];
  const swapped = current?.swapped ?? [];

  const allNodeIds = Object.keys(nodes).map(Number);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Invert Binary Tree — Postorder DFS Visualization
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Tree (BFS order, null for missing):</label>
            <input className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "220px" }}
              value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
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
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {stepIdx >= 0 ? `Step ${stepIdx + 1}/${steps.length}` : "Press Play or Step"}
          </span>
          <div className="flex items-center gap-2">
            <input type="range" min="200" max="1500" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "80px", accentColor: "#4f8ef7" }} />
          </div>
        </div>
      </div>

      {/* Step message */}
      {current && (
        <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#a855f7" }}>
          {current.msg}
        </div>
      )}

      {/* Tree SVG */}
      <div className="rounded-xl p-4 overflow-x-auto" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width={520} height={280} style={{ overflow: "visible", minWidth: "100%" }} role="img" aria-label="Binary tree diagram">
          {/* Edges */}
          {allNodeIds.map((id) => {
            const node = nodes[id];
            const children = [node.left, node.right].filter((c) => c !== null) as number[];
            return children.map((childId) => {
              if (!nodes[childId]) return null;
              const child = nodes[childId];
              return (
                <line key={`${id}-${childId}`}
                  x1={node.x} y1={node.y} x2={child.x} y2={child.y}
                  stroke="var(--border)" strokeWidth="1.5" />
              );
            });
          })}

          {/* Nodes */}
          {allNodeIds.map((id) => {
            const node = nodes[id];
            const isHighlighted = highlighted.includes(id);
            const isSwapped = swapped.includes(id);
            return (
              <g key={id}>
                <circle cx={node.x} cy={node.y} r={20}
                  fill={isSwapped ? "rgba(34,197,94,0.2)" : isHighlighted ? "rgba(168,85,247,0.2)" : "var(--bg-hover)"}
                  stroke={isSwapped ? "#22c55e" : isHighlighted ? "#a855f7" : "var(--border)"}
                  strokeWidth={isHighlighted || isSwapped ? 2 : 1}
                  style={{ transition: "all 0.3s ease" }}
                />
                <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={isSwapped ? "#22c55e" : isHighlighted ? "#a855f7" : "var(--text-primary)"}
                  fontSize="13" fontWeight="700" fontFamily="monospace">
                  {node.val}
                </text>
                {isSwapped && (
                  <text x={node.x} y={node.y - 26} textAnchor="middle" fill="#22c55e" fontSize="10">↔</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color: "#22c55e" }}>✓ Tree inverted! Every node's children are swapped.</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Postorder DFS: process children before parent.</div>
        </div>
      )}
    </div>
  );
}
