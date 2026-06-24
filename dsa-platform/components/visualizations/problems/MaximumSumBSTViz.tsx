"use client";
import { useState, useEffect, useRef } from "react";

// Tree: [1, null, 2, 3, null, null, 4, 5, null, null, null, null, null, 6, null]
// Simpler: hand-built tree
interface Node { id: number; val: number; left: number | null; right: number | null }
const NODES: Node[] = [
  { id: 0, val: 1,  left: 1,    right: 2    },
  { id: 1, val: 4,  left: 3,    right: 4    },
  { id: 2, val: 3,  left: null, right: null },
  { id: 3, val: 2,  left: null, right: null },
  { id: 4, val: 4,  left: null, right: null },
  // node 2 subtree [3] is valid BST sum=3
  // node 1 subtree: 2<4<4? No, 4==4, not strict. Let's use different values
];

// Use a cleaner tree: root=1, left subtree valid BST [2,3,4]
// Let me use: root=-4363, left=2 (left=1, right=3), right=6 (left=5, right=7)
// Simpler hand-crafted for viz
interface TreeNode2 { id: number; val: number; left: number | null; right: number | null }
const TREE: TreeNode2[] = [
  { id: 0, val: -4363, left: 1, right: 2 },   // root
  { id: 1, val: 2,     left: 3, right: 4 },    // left subtree
  { id: 2, val: 6,     left: 5, right: 6 },    // right subtree (valid BST)
  { id: 3, val: 1,     left: null, right: null },
  { id: 4, val: 3,     left: null, right: null },
  { id: 5, val: 5,     left: null, right: null },
  { id: 6, val: 7,     left: null, right: null },
];

interface DfsResult { isBST: boolean; min: number; max: number; sum: number }
interface St { nodeId: number; result: DfsResult; maxSum: number; returning: boolean; msg: string }

function buildSteps(): St[] {
  const steps: St[] = [];
  let maxSum = 0;

  function dfs(id: number | null): DfsResult {
    if (id === null) return { isBST: true, min: Infinity, max: -Infinity, sum: 0 };
    const node = TREE[id];
    const L = dfs(node.left);
    const R = dfs(node.right);
    if (L.isBST && R.isBST && L.max < node.val && node.val < R.min) {
      const sum = L.sum + R.sum + node.val;
      if (sum > maxSum) maxSum = sum;
      const res: DfsResult = { isBST: true, min: Math.min(L.min === Infinity ? node.val : L.min, node.val), max: Math.max(R.max === -Infinity ? node.val : R.max, node.val), sum };
      steps.push({ nodeId: id, result: res, maxSum, returning: true, msg: `Node ${node.val}: valid BST subtree, sum=${sum}${sum === maxSum ? " ← new max!" : ""}` });
      return res;
    }
    steps.push({ nodeId: id, result: { isBST: false, min: 0, max: 0, sum: 0 }, maxSum, returning: true, msg: `Node ${node.val}: NOT valid BST (propagate invalid)` });
    return { isBST: false, min: 0, max: 0, sum: 0 };
  }

  dfs(0);
  return steps;
}

const STEPS = buildSteps();

// Simple tree layout
const POS: Record<number, { x: number; y: number }> = {
  0: { x: 160, y: 20 },
  1: { x: 80,  y: 90 },
  2: { x: 240, y: 90 },
  3: { x: 40,  y: 160 },
  4: { x: 120, y: 160 },
  5: { x: 200, y: 160 },
  6: { x: 280, y: 160 },
};

export default function MaximumSumBSTViz() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
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

  const visitedIds = new Set(STEPS.slice(0, idx + 1).map(s => s.nodeId));

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Maximum Sum BST — Post-order DFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Each node returns (isBST, min, max, sum) to parent. Update global max when subtree is valid BST.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={300} max={2000} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="320" height="200" style={{ display: "block", margin: "0 auto" }}>
          {TREE.map(node => {
            if (node.left !== null) {
              const p = POS[node.id], c = POS[node.left];
              return <line key={`l${node.id}`} x1={p.x} y1={p.y + 16} x2={c.x} y2={c.y - 16} stroke="var(--border)" strokeWidth={1.5} />;
            }
            return null;
          })}
          {TREE.map(node => {
            if (node.right !== null) {
              const p = POS[node.id], c = POS[node.right];
              return <line key={`r${node.id}`} x1={p.x} y1={p.y + 16} x2={c.x} y2={c.y - 16} stroke="var(--border)" strokeWidth={1.5} />;
            }
            return null;
          })}
          {TREE.map(node => {
            const pos = POS[node.id];
            const isActive = cur && node.id === cur.nodeId;
            const visited = visitedIds.has(node.id);
            const step = STEPS.slice(0, idx).find(s => s.nodeId === node.id);
            const isBST = step?.result.isBST;
            const fill = isActive ? "#4f8ef7" : isBST === true ? "#22c55e" : isBST === false ? "#ef4444" : "var(--bg-hover)";
            return (
              <g key={node.id}>
                <circle cx={pos.x} cy={pos.y} r={16} fill={`${fill}22`} stroke={fill} strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight="bold" fill={isActive ? "#4f8ef7" : visited ? fill : "var(--text-muted)"}>{node.val}</text>
              </g>
            );
          })}
        </svg>
        <div className="flex gap-4 justify-center mt-2">
          <span className="text-xs flex items-center gap-1"><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />valid BST</span>
          <span className="text-xs flex items-center gap-1"><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />invalid</span>
          <span className="text-xs flex items-center gap-1"><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4f8ef7", display: "inline-block" }} />current</span>
        </div>
      </div>

      <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{cur?.msg}</span>
        <span className="text-sm font-bold" style={{ color: "#22c55e" }}>Max: {cur?.maxSum ?? 0}</span>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-lg font-bold" style={{ color: "#22c55e" }}>Max BST Sum = {STEPS[STEPS.length - 1].maxSum}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Subtree rooted at node 6 (5+6+7=18) or node 2 (sum=18)</div>
        </div>
      )}
    </div>
  );
}
