"use client";
import { useState, useEffect, useRef } from "react";

// Tree: root=1, left=[2,3,4], right=[2,4,3]
//        1
//       / \
//      2   2
//     / \ / \
//    3  4 4  3
interface TreeNode {
  val: number;
  left: number | null;
  right: number | null;
  id: number;
}

const TREE: TreeNode[] = [
  { id: 0, val: 1, left: 1, right: 2 },    // root
  { id: 1, val: 2, left: 3, right: 4 },    // left subtree root
  { id: 2, val: 2, left: 5, right: 6 },    // right subtree root
  { id: 3, val: 3, left: null, right: null }, // left-left
  { id: 4, val: 4, left: null, right: null }, // left-right
  { id: 5, val: 4, left: null, right: null }, // right-left
  { id: 6, val: 3, left: null, right: null }, // right-right
];

// Node positions for SVG layout
const NODE_POS: Record<number, { x: number; y: number }> = {
  0: { x: 220, y: 40 },
  1: { x: 110, y: 110 },
  2: { x: 330, y: 110 },
  3: { x: 55,  y: 185 },
  4: { x: 165, y: 185 },
  5: { x: 275, y: 185 },
  6: { x: 385, y: 185 },
};

interface CompareEntry {
  left: number | null;
  right: number | null;
}

interface AlgoState {
  queue: CompareEntry[];
  compared: Array<{ left: number | null; right: number | null; match: boolean }>;
  currentLeft: number | null;
  currentRight: number | null;
  done: boolean;
  isSymmetric: boolean | null;
}

function buildInitial(): AlgoState {
  return {
    queue: [{ left: 1, right: 2 }],
    compared: [],
    currentLeft: null,
    currentRight: null,
    done: false,
    isSymmetric: null,
  };
}

const PAIR_COLORS = ["#4f8ef7", "#f97316", "#a855f7", "#22c55e", "#ef4444"];

export default function SymmetricTreeViz() {
  const [queue, setQueue] = useState<CompareEntry[]>([{ left: 1, right: 2 }]);
  const [compared, setCompared] = useState<Array<{ left: number | null; right: number | null; match: boolean }>>([]);
  const [currentLeft, setCurrentLeft] = useState<number | null>(null);
  const [currentRight, setCurrentRight] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [isSymmetric, setIsSymmetric] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("Press Play — BFS mirror check: compare left-left↔right-right, left-right↔right-left");
  const stateRef = useRef<AlgoState>(buildInitial());
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    const s = buildInitial();
    stateRef.current = s;
    setQueue(s.queue); setCompared(s.compared);
    setCurrentLeft(null); setCurrentRight(null);
    setDone(false); setIsSymmetric(null); setPlaying(false);
    setMsg("Queue: [(L=1, R=2)] — compare left subtree root with right subtree root");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.done) return;

    if (st.queue.length === 0) {
      stateRef.current = { ...st, done: true, isSymmetric: true, currentLeft: null, currentRight: null };
      setDone(true); setIsSymmetric(true); setCurrentLeft(null); setCurrentRight(null); setPlaying(false);
      setMsg("Queue empty — all symmetric pairs matched! Tree IS symmetric.");
      return;
    }

    const [entry, ...rest] = st.queue;
    const { left: li, right: ri } = entry;

    const lNode = li !== null ? TREE[li] : null;
    const rNode = ri !== null ? TREE[ri] : null;

    // Both null => symmetric at this pair
    if (li === null && ri === null) {
      const nc = [...st.compared, { left: null, right: null, match: true }];
      stateRef.current = { ...st, queue: rest, compared: nc, currentLeft: null, currentRight: null };
      setQueue(rest); setCompared(nc); setCurrentLeft(null); setCurrentRight(null);
      setMsg("Both null — symmetric (trivially). Continue...");
      return;
    }

    // One null => mismatch
    if (li === null || ri === null) {
      const nc = [...st.compared, { left: li, right: ri, match: false }];
      stateRef.current = { ...st, queue: [], compared: nc, done: true, isSymmetric: false, currentLeft: li, currentRight: ri };
      setQueue([]); setCompared(nc); setDone(true); setIsSymmetric(false);
      setCurrentLeft(li); setCurrentRight(ri); setPlaying(false);
      setMsg(`One side is null, other is not — NOT symmetric!`);
      return;
    }

    setCurrentLeft(li); setCurrentRight(ri);

    const match = lNode!.val === rNode!.val;
    const nc = [...st.compared, { left: li, right: ri, match }];

    if (!match) {
      stateRef.current = { ...st, queue: [], compared: nc, done: true, isSymmetric: false, currentLeft: li, currentRight: ri };
      setQueue([]); setCompared(nc); setDone(true); setIsSymmetric(false); setCurrentLeft(li); setCurrentRight(ri);
      setPlaying(false);
      setMsg(`Node[${li}]=${lNode!.val} ≠ Node[${ri}]=${rNode!.val} — NOT symmetric!`);
      return;
    }

    // Push mirror children: (left.left, right.right) and (left.right, right.left)
    const newQueue: CompareEntry[] = [
      ...rest,
      { left: lNode!.left, right: rNode!.right },
      { left: lNode!.right, right: rNode!.left },
    ];

    stateRef.current = { ...st, queue: newQueue, compared: nc, currentLeft: li, currentRight: ri };
    setQueue(newQueue); setCompared(nc); setCurrentLeft(li); setCurrentRight(ri);
    setMsg(`Node[${li}]=${lNode!.val} == Node[${ri}]=${rNode!.val} ✓ — push (${li}.left↔${ri}.right) and (${li}.right↔${ri}.left)`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const isDone = done;

  const getNodeColor = (id: number) => {
    // Currently being compared
    if (id === currentLeft) return { bg: "rgba(79,142,247,0.3)", stroke: "#4f8ef7" };
    if (id === currentRight) return { bg: "rgba(249,115,22,0.3)", stroke: "#f97316" };

    // Find in compared list
    const pairIdx = compared.findIndex(c => c.left === id || c.right === id);
    if (pairIdx >= 0) {
      const pair = compared[pairIdx];
      if (!pair.match) return { bg: "rgba(239,68,68,0.25)", stroke: "#ef4444" };
      const color = PAIR_COLORS[pairIdx % PAIR_COLORS.length];
      return { bg: `${color}25`, stroke: color };
    }

    return { bg: "rgba(79,142,247,0.08)", stroke: "rgba(79,142,247,0.4)" };
  };

  // Edges
  const edges: Array<{ from: number; to: number }> = [];
  TREE.forEach(n => {
    if (n.left !== null) edges.push({ from: n.id, to: n.left });
    if (n.right !== null) edges.push({ from: n.id, to: n.right });
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Symmetric Tree — BFS Mirror Comparison
        </h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Tree: 1 → [2(left), 2(right)] → [3,4 | 4,3] — check if left subtree mirrors right subtree
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setPlaying(!playing)}
            disabled={isDone}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={isDone} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>

      {/* SVG Tree */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="440" height="230" style={{ display: "block", margin: "0 auto" }} role="img" aria-label="Binary tree symmetry check diagram">
          {edges.map(({ from, to }) => {
            const p = NODE_POS[from], c = NODE_POS[to];
            return <line key={`${from}-${to}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.25)" strokeWidth={1.5} />;
          })}
          {TREE.map(node => {
            const { x, y } = NODE_POS[node.id];
            const c = getNodeColor(node.id);
            const isCurrL = node.id === currentLeft;
            const isCurrR = node.id === currentRight;
            return (
              <g key={node.id}>
                <circle
                  cx={x} cy={y} r={20}
                  fill={c.bg}
                  stroke={c.stroke}
                  strokeWidth={isCurrL || isCurrR ? 2.5 : 1.5}
                />
                <text x={x} y={y + 5} textAnchor="middle" fill={isCurrL ? "#4f8ef7" : isCurrR ? "#f97316" : "#e8e8f0"} fontSize={13} fontFamily="monospace" fontWeight="bold">
                  {node.val}
                </text>
                {isCurrL && <text x={x} y={y - 27} textAnchor="middle" fill="#4f8ef7" fontSize={9} fontWeight="bold">LEFT</text>}
                {isCurrR && <text x={x} y={y - 27} textAnchor="middle" fill="#f97316" fontSize={9} fontWeight="bold">RIGHT</text>}
              </g>
            );
          })}
          {/* Symmetry axis */}
          <line x1={220} y1={10} x2={220} y2={220} stroke="rgba(168,85,247,0.2)" strokeWidth={1} strokeDasharray="4,4" />
          <text x={220} y={8} textAnchor="middle" fill="rgba(168,85,247,0.5)" fontSize={9}>axis</text>
        </svg>
        <div className="flex gap-4 justify-center text-xs mt-2">
          <span style={{ color: "#4f8ef7" }}>■ left node</span>
          <span style={{ color: "#f97316" }}>■ right node</span>
          <span style={{ color: "#22c55e" }}>■ matched pair</span>
          <span style={{ color: "#ef4444" }}>■ mismatched</span>
        </div>
      </div>

      {/* Comparison queue */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
          Comparison queue ({queue.length} pending)
        </div>
        {queue.length === 0 && !isDone && (
          <div className="text-xs italic" style={{ color: "var(--text-muted)" }}>empty</div>
        )}
        <div className="flex flex-wrap gap-2">
          {queue.map((entry, idx) => {
            const lv = entry.left !== null ? TREE[entry.left].val : "null";
            const rv = entry.right !== null ? TREE[entry.right].val : "null";
            return (
              <div key={idx} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.3)", color: "#4f8ef7" }}>
                ({lv} ↔ {rv})
              </div>
            );
          })}
        </div>
      </div>

      {/* Compared pairs */}
      {compared.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Compared pairs</div>
          <div className="flex flex-wrap gap-2">
            {compared.map((c, idx) => {
              const lv = c.left !== null ? TREE[c.left].val : "null";
              const rv = c.right !== null ? TREE[c.right].val : "null";
              return (
                <div key={idx} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{
                  background: c.match ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                  border: `1px solid ${c.match ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
                  color: c.match ? "#22c55e" : "#ef4444",
                }}>
                  {lv} ↔ {rv} {c.match ? "✓" : "✗"}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)" }}>
        {msg}
      </div>

      {isSymmetric !== null && (
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: isSymmetric ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${isSymmetric ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
          }}
        >
          <div className="font-bold text-base" style={{ color: isSymmetric ? "#22c55e" : "#ef4444" }}>
            {isSymmetric ? "SYMMETRIC TREE" : "NOT SYMMETRIC"}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {isSymmetric ? "The tree is a mirror of itself around its center" : "Mirror pairs do not match"}
          </div>
        </div>
      )}
    </div>
  );
}
