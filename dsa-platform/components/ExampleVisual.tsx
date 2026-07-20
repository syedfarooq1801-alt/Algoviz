"use client";
import { parseExampleVisual, type TreeNode } from "@/lib/exampleVisual";

// Renders a small inline SVG diagram for tree/grid/list/graph/interval/point/
// array-shaped example inputs, generated on the fly from the same input
// string already shown as text — mirrors LeetCode's example images without
// copying any image assets.
export default function ExampleVisual({ input }: { input: string }) {
  const visual = parseExampleVisual(input);
  if (!visual) return null;

  switch (visual.type) {
    case "tree":
      return <TreeDiagram root={visual.root} />;
    case "grid":
      return <GridDiagram cells={visual.cells} />;
    case "list":
      return <ListDiagram values={visual.values} />;
    case "intervals":
      return <IntervalsDiagram intervals={visual.intervals} />;
    case "graph":
      return <GraphDiagram nodes={visual.nodes} edges={visual.edges} />;
    case "points":
      return <PointsDiagram points={visual.points} />;
    case "array":
      return <ArrayDiagram values={visual.values} />;
    default:
      return null;
  }
}

const Frame = ({ width, height, children }: { width: number; height: number; children: React.ReactNode }) => (
  <div className="mb-2 overflow-x-auto rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", margin: "0 auto" }}>
      {children}
    </svg>
  </div>
);

function TreeDiagram({ root }: { root: TreeNode | null }) {
  if (!root) return null;

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
    <Frame width={width} height={height}>
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
    </Frame>
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
    <Frame width={width} height={height}>
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
    </Frame>
  );
}

// Linked list: boxed values connected by arrows, left to right.
function ListDiagram({ values }: { values: string[] }) {
  const CELL = 40;
  const GAP = 24;
  const PAD = 10;
  const width = values.length * CELL + (values.length - 1) * GAP + PAD * 2;
  const height = CELL + PAD * 2;

  return (
    <Frame width={width} height={height}>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--text-muted)" />
        </marker>
      </defs>
      {values.map((v, i) => {
        const x = PAD + i * (CELL + GAP);
        const y = PAD;
        return (
          <g key={i}>
            <rect x={x} y={y} width={CELL} height={CELL} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
            <text x={x + CELL / 2} y={y + CELL / 2} textAnchor="middle" dy="0.32em" fontSize={12} fontFamily="var(--font-mono)" fill="var(--text-primary)">
              {v}
            </text>
            {i < values.length - 1 && (
              <line x1={x + CELL} y1={y + CELL / 2} x2={x + CELL + GAP - 3} y2={y + CELL / 2} stroke="var(--text-muted)" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
            )}
          </g>
        );
      })}
    </Frame>
  );
}

// Array/string: boxed cells with index labels underneath.
function ArrayDiagram({ values }: { values: string[] }) {
  const CELL = 34;
  const PAD = 10;
  const width = values.length * CELL + PAD * 2;
  const height = CELL + 18 + PAD;

  return (
    <Frame width={width} height={height}>
      {values.map((v, i) => {
        const x = PAD + i * CELL;
        return (
          <g key={i}>
            <rect x={x} y={4} width={CELL} height={CELL} fill="var(--bg-card)" stroke="var(--border)" strokeWidth={1} />
            <text x={x + CELL / 2} y={4 + CELL / 2} textAnchor="middle" dy="0.32em" fontSize={11} fontFamily="var(--font-mono)" fill="var(--text-primary)">
              {v.length > 5 ? v.slice(0, 4) + "…" : v}
            </text>
            <text x={x + CELL / 2} y={4 + CELL + 13} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-muted)">
              {i}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

// Intervals: a shared number line with each interval drawn as a bar.
function IntervalsDiagram({ intervals }: { intervals: [number, number][] }) {
  const min = Math.min(...intervals.map((iv) => iv[0]));
  const max = Math.max(...intervals.map((iv) => iv[1]));
  const span = Math.max(1, max - min);
  const PAD = 16;
  const TRACK_W = Math.min(420, Math.max(200, span * 14));
  const ROW_H = 22;
  const width = TRACK_W + PAD * 2 + 34;
  const height = intervals.length * ROW_H + PAD;
  const scale = (v: number) => ((v - min) / span) * TRACK_W;

  return (
    <Frame width={width} height={height}>
      {intervals.map(([a, b], i) => {
        const x1 = scale(a);
        const x2 = scale(b);
        const y = PAD / 2 + i * ROW_H;
        return (
          <g key={i} transform={`translate(${PAD}, ${y})`}>
            <line x1={0} y1={8} x2={TRACK_W} y2={8} stroke="var(--border-subtle)" strokeWidth={1} />
            <rect x={x1} y={2} width={Math.max(2, x2 - x1)} height={12} rx={4} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1} />
            <text x={TRACK_W + 8} y={12} fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-secondary)">
              [{a},{b}]
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

// Graph: nodes placed on a circle, edges as straight lines between them.
function GraphDiagram({ nodes, edges }: { nodes: string[]; edges: [string, string][] }) {
  const R = Math.max(50, nodes.length * 12);
  const PAD = 24;
  const width = R * 2 + PAD * 2;
  const height = R * 2 + PAD * 2;
  const cx = width / 2;
  const cy = height / 2;

  const pos = new Map<string, { x: number; y: number }>();
  nodes.forEach((n, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
    pos.set(n, { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) });
  });

  return (
    <Frame width={width} height={height}>
      {edges.map(([a, b], i) => {
        const pa = pos.get(a)!;
        const pb = pos.get(b)!;
        return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="var(--border)" strokeWidth={1.5} />;
      })}
      {nodes.map((n, i) => {
        const p = pos.get(n)!;
        return (
          <g key={i} transform={`translate(${p.x}, ${p.y})`}>
            <circle r={13} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
            <text textAnchor="middle" dy="0.32em" fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-primary)">
              {n}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

// Points: simple scatter plot on an x/y axis.
function PointsDiagram({ points }: { points: [number, number][] }) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const PLOT = 140;
  const PAD = 20;
  const width = PLOT + PAD * 2;
  const height = PLOT + PAD * 2;

  const sx = (v: number) => PAD + ((v - minX) / spanX) * PLOT;
  const sy = (v: number) => PAD + PLOT - ((v - minY) / spanY) * PLOT;

  return (
    <Frame width={width} height={height}>
      <line x1={PAD} y1={PAD} x2={PAD} y2={PAD + PLOT} stroke="var(--border-subtle)" strokeWidth={1} />
      <line x1={PAD} y1={PAD + PLOT} x2={PAD + PLOT} y2={PAD + PLOT} stroke="var(--border-subtle)" strokeWidth={1} />
      {points.map(([x, y], i) => (
        <circle key={i} cx={sx(x)} cy={sy(y)} r={4} fill="var(--accent)" />
      ))}
    </Frame>
  );
}
