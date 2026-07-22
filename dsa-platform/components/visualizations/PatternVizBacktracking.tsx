"use client";
import { useEffect, useState, useRef } from "react";

// Subsets backtracking tree for [1,2,3]
type Node = { id: number; label: string; path: number[]; children: number[]; x: number; y: number; depth: number };

function buildTree(): Node[] {
  const nodes: Node[] = [];
  let id = 0;
  const W = 300;

  function build(path: number[], start: number, depth: number, xCenter: number, spread: number) {
    const nid = id++;
    const arr = [1, 2, 3];
    nodes.push({
      id: nid,
      label: `[${path.join(",")}]`,
      path: [...path],
      children: [],
      x: xCenter,
      y: 20 + depth * 65,
      depth,
    });

    if (depth === 3) return nid;
    const childIds: number[] = [];
    const numChildren = arr.length - start;
    for (let i = start; i < arr.length; i++) {
      const ci = i - start;
      const childX = xCenter + (ci - (numChildren - 1) / 2) * (spread / Math.max(numChildren, 1));
      const child = build([...path, arr[i]], i + 1, depth + 1, childX, spread * 0.6);
      childIds.push(child);
    }
    nodes[nid].children = childIds;
    return nid;
  }

  build([], 0, 0, W / 2, 220);
  return nodes;
}

const TREE_NODES = buildTree();

export default function PatternVizBacktracking() {
  const [activeId, setActiveId] = useState(0);
  const [visitedIds, setVisitedIds] = useState<number[]>([]);
  const orderRef = useRef<number[]>([]);

  useEffect(() => {
    // DFS order
    const order: number[] = [];
    function dfs(id: number) {
      order.push(id);
      for (const c of TREE_NODES[id]?.children ?? []) dfs(c);
    }
    dfs(0);
    orderRef.current = order;

    let fi = 0;
    const visited: number[] = [];
    const id = setInterval(() => {
      if (fi >= order.length) {
        fi = 0;
        visited.length = 0;
        setVisitedIds([]);
        setActiveId(0);
        return;
      }
      const nid = order[fi];
      visited.push(nid);
      setActiveId(nid);
      setVisitedIds([...visited]);
      fi++;
    }, 500);
    return () => clearInterval(id);
  }, []);

  const activeNode = TREE_NODES[activeId];

  return (
    <div className="space-y-3">
      <svg width={300} height={230} style={{ width: "100%", maxWidth: 300, overflow: "visible" }} role="img" aria-label="Backtracking decision tree">
        {/* Edges */}
        {TREE_NODES.map((node) =>
          node.children.map((cid) => {
            const child = TREE_NODES[cid];
            return (
              <line key={`${node.id}-${cid}`}
                x1={node.x} y1={node.y}
                x2={child.x} y2={child.y}
                stroke={visitedIds.includes(cid) ? "#a855f7" : "var(--border)"}
                strokeWidth={visitedIds.includes(cid) ? 1.5 : 1}
                style={{ transition: "stroke 0.3s ease" }}
              />
            );
          })
        )}

        {/* Nodes */}
        {TREE_NODES.map((node) => {
          const isActive = activeId === node.id;
          const isVisited = visitedIds.includes(node.id);
          const r = node.path.length === 0 ? 16 : 14;
          return (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r={isActive ? r + 3 : r}
                fill={isActive ? "rgba(168,85,247,0.3)" : isVisited ? "rgba(168,85,247,0.1)" : "var(--bg-hover)"}
                stroke={isActive ? "#a855f7" : isVisited ? "rgba(168,85,247,0.5)" : "var(--border)"}
                strokeWidth={isActive ? 2 : 1}
                style={{ transition: "all 0.3s ease" }}
              />
              <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={isActive ? "#a855f7" : isVisited ? "#c084fc" : "var(--text-muted)"}
                fontSize={node.depth === 0 ? "11" : "9"} fontFamily="monospace" fontWeight={isActive ? "700" : "400"}>
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
        style={{ background: "rgba(168,85,247,0.07)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
        {activeNode ? `Exploring: ${activeNode.label || "[]"} (depth ${activeNode.depth})` : "Backtracking..."}
      </div>

      <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Subsets found: <strong style={{ color: "#a855f7" }}>{visitedIds.filter(id => TREE_NODES[id]?.depth === TREE_NODES.reduce((m,n) => Math.max(m, n.depth), 0) || TREE_NODES[id]?.children.length === 0).length}</strong> / 8
      </div>
    </div>
  );
}
