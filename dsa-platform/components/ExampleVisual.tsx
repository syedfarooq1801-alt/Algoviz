"use client";
import { parseExampleVisual, type TreeNode } from "@/lib/exampleVisual";

// Renders a small inline SVG diagram for tree- or grid-shaped example
// inputs, generated on the fly from the same input string already shown
// as text — mirrors LeetCode's example images without copying any assets.
export default function ExampleVisual({ input }: { input: string }) {
  const visual = parseExampleVisual(input);
  if (!visual) return null;

  if (visual.type === "tree") {
    return <TreeDiagram root={visual.root} />;
  }
  return <GridDiagram cells={visual.cells} />;
}

function TreeDiagram({ root }: { root: TreeNode | null }) {
  if (!root) return null;

  // Assign x via in-order position (spreads siblings out), y via depth.
  const positions = new Map<TreeNode, { x: number; y: number }>();
  let nextX = 0;
  const NODE_GAP = 46;
  const ROW_GAP = 56;

  function layout(node: TreeNode | null, depth: number) {
    if (!node) return;
    layout(node.left, depth + 1);
    const x = nextX++;
    positions.set(node, { x: x * NODE_GAP, y: depth * ROW_GAP });
    layout(node.right, depth + 1);
  }
  layout(root, 0);

  const maxX = (nextX - 1) * NODE_GAP;
  const maxY = Math.max(...[...positions.values()].map((p) => p.y));
  const PAD = 24;
  const width = maxX + PAD * 2;
  const height = maxY + PAD * 2 + 16;

  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  function collectEdges(node: TreeNode | null) {
    if (!node) return;
    const p = positions.get(node)!;
    for (const child of [node.left, node.right]) {
      if (child) {
        const cp = positions.get(child)!;
        edges.push({ x1: p.x, y1: p.y, x2: cp.x, y2: cp.y });
        collectEdges(child);
      }
    }
  }
  collectEdges(root);

  return (
    <div className="mb-2 overflow-x-auto rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", margin: "0 auto" }}>
        <g transform={`translate(${PAD}, ${PAD})`}>
          {edges.map((e, i) => (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="var(--border)" strokeWidth={1.5} />
          ))}
          {[...positions.entries()].map(([node, p], i) => (
            <g key={i} transform={`translate(${p.x}, ${p.y})`}>
              <circle r={14} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
              <text textAnchor="middle" dy="0.32em" fontSize={11} fontFamily="var(--font-mono)" fill="var(--text-primary)">
                {node.val}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function GridDiagram({ cells }: { cells: string[][] }) {
  const CELL = 32;
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const width = cols * CELL;
  const height = rows * CELL;

  const colorFor = (v: string) => {
    if (v === "0" || v === "." || v === "false") return "var(--bg-card)";
    if (v === "1" || v === "true" || v === "#" || v === "X") return "var(--accent-soft)";
    if (v === "2") return "rgba(239,68,68,0.18)";
    return "var(--bg-card)";
  };

  return (
    <div className="mb-2 overflow-x-auto rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", margin: "0 auto" }}>
        {cells.map((row, r) =>
          row.map((v, c) => (
            <g key={`${r}-${c}`} transform={`translate(${c * CELL}, ${r * CELL})`}>
              <rect width={CELL} height={CELL} fill={colorFor(v)} stroke="var(--border)" strokeWidth={1} />
              <text x={CELL / 2} y={CELL / 2} textAnchor="middle" dy="0.32em" fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-secondary)">
                {v.length > 4 ? "" : v}
              </text>
            </g>
          ))
        )}
      </svg>
    </div>
  );
}
