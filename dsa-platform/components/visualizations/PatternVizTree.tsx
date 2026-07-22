"use client";
import { useEffect, useState } from "react";

// BFS level-order traversal demo on tree [4,2,7,1,3,6,9]
const TREE = [4, 2, 7, 1, 3, 6, 9];
const positions = [
  { x: 160, y: 30 },   // 0: root
  { x: 80,  y: 95 },   // 1: left
  { x: 240, y: 95 },   // 2: right
  { x: 40,  y: 160 },  // 3
  { x: 120, y: 160 },  // 4
  { x: 200, y: 160 },  // 5
  { x: 280, y: 160 },  // 6
];
const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

export default function PatternVizTree() {
  const [visited, setVisited] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const [msg, setMsg] = useState("BFS Level-Order Traversal");

  useEffect(() => {
    // BFS frames
    const frames: { visited: number[]; current: number | null; queue: number[]; msg: string }[] = [];
    const vis: number[] = [];
    const q = [0];
    frames.push({ visited: [], current: null, queue: [0], msg: "Start BFS. Enqueue root (4)" });

    while (q.length > 0) {
      const node = q.shift()!;
      vis.push(node);
      frames.push({ visited: [...vis], current: node, queue: [...q], msg: `Visit node ${TREE[node]}. Enqueue children.` });
      const children = edges.filter(([p]) => p === node).map(([,c]) => c);
      for (const c of children) q.push(c);
      if (children.length > 0)
        frames.push({ visited: [...vis], current: node, queue: [...q], msg: `Enqueued: ${children.map(c => TREE[c]).join(", ")}` });
    }
    frames.push({ visited: [...vis], current: null, queue: [], msg: `Done! Level order: ${vis.map(i => TREE[i]).join(" → ")}` });
    for (let i = 0; i < 3; i++) frames.push(frames[frames.length - 1]);
    frames.push({ visited: [], current: null, queue: [0], msg: "Start BFS. Enqueue root (4)" });

    let fi = 0;
    const id = setInterval(() => {
      const f = frames[fi % frames.length];
      setVisited(f.visited); setCurrent(f.current); setQueue(f.queue); setMsg(f.msg);
      fi++;
      if (fi >= frames.length) fi = 0;
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      <svg width={320} height={200} style={{ width: "100%", maxWidth: 320, overflow: "visible" }} role="img" aria-label="Binary tree pattern diagram">
        {edges.map(([p, c]) => (
          <line key={`${p}-${c}`}
            x1={positions[p].x} y1={positions[p].y}
            x2={positions[c].x} y2={positions[c].y}
            stroke={visited.includes(p) && visited.includes(c) ? "#22c55e" : "var(--border)"}
            strokeWidth={visited.includes(p) && visited.includes(c) ? 2 : 1.5}
            style={{ transition: "stroke 0.4s ease" }}
          />
        ))}
        {TREE.map((v, i) => {
          const pos = positions[i];
          const isCurr = current === i;
          const isVis = visited.includes(i);
          const isQueued = queue.includes(i);
          return (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r={isCurr ? 20 : 17}
                fill={isCurr ? "rgba(168,85,247,0.3)" : isVis ? "rgba(34,197,94,0.2)" : isQueued ? "rgba(79,142,247,0.15)" : "var(--bg-hover)"}
                stroke={isCurr ? "#a855f7" : isVis ? "#22c55e" : isQueued ? "#4f8ef7" : "var(--border)"}
                strokeWidth={isCurr ? 2.5 : 1.5}
                style={{ transition: "all 0.35s ease" }}
              />
              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={isCurr ? "#a855f7" : isVis ? "#22c55e" : isQueued ? "#4f8ef7" : "var(--text-primary)"}
                fontSize="12" fontWeight="700" fontFamily="monospace">
                {v}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Queue display */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Queue:</span>
        {queue.length === 0
          ? <span className="text-xs" style={{ color: "var(--text-muted)" }}>empty</span>
          : queue.map((i, k) => (
            <span key={k} className="px-2 py-0.5 rounded text-xs font-mono"
              style={{ background: "rgba(79,142,247,0.12)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>
              {TREE[i]}
            </span>
          ))
        }
      </div>

      <div className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
        style={{ background: "rgba(168,85,247,0.07)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
        {msg}
      </div>
    </div>
  );
}
