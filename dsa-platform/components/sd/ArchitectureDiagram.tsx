"use client";
import { ArchLayer, ArchLayerType } from "@/data/systemDesign";

const TYPE_COLOR: Record<ArchLayerType, { bg: string; border: string; text: string; icon: string }> = {
  client:  { bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.4)",   text: "#22c55e",  icon: "👤" },
  cdn:     { bg: "rgba(6,182,212,0.1)",    border: "rgba(6,182,212,0.4)",   text: "#06b6d4",  icon: "🌐" },
  lb:      { bg: "rgba(79,142,247,0.1)",   border: "rgba(79,142,247,0.4)",  text: "#4f8ef7",  icon: "⚖️" },
  gateway: { bg: "rgba(79,142,247,0.1)",   border: "rgba(79,142,247,0.4)",  text: "#4f8ef7",  icon: "🚪" },
  service: { bg: "rgba(168,85,247,0.1)",   border: "rgba(168,85,247,0.4)",  text: "#a855f7",  icon: "⚙️" },
  cache:   { bg: "rgba(249,115,22,0.1)",   border: "rgba(249,115,22,0.4)",  text: "#f97316",  icon: "⚡" },
  db:      { bg: "rgba(34,197,94,0.1)",    border: "rgba(34,197,94,0.4)",   text: "#22c55e",  icon: "🗄️" },
  queue:   { bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.4)",  text: "#f59e0b",  icon: "📨" },
  storage: { bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.4)", text: "#94a3b8",  icon: "📦" },
  search:  { bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.4)",   text: "#ef4444",  icon: "🔍" },
  stream:  { bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.4)",  text: "#f59e0b",  icon: "📡" },
};

interface Props {
  layers: ArchLayer[];
}

const BOX_W = 176;
const BOX_H = 92;
const COL_GAP = 28;
const ROW_GAP = 56;
const PAD = 24;

// Trim a source→target center-to-center segment back from BOTH ends so the
// visible line starts/ends at the box's edge instead of its center — margin
// picks box-half-width or box-half-height depending on which the line is
// more aligned with, which is a good approximation for the rectangular box.
function edgeMargin(dx: number, dy: number): number {
  return Math.abs(dy) > Math.abs(dx) ? BOX_H / 2 + 4 : BOX_W / 2 + 4;
}
function pointAt(x1: number, y1: number, x2: number, y2: number, dist: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return { x: x1 + (dx / len) * dist, y: y1 + (dy / len) * dist };
}

export default function ArchitectureDiagram({ layers }: Props) {
  const nodeMap = new Map<string, ArchLayer>(layers.map((l) => [l.name, l]));

  // Topological sort — find layers (depth from client)
  const depths = new Map<string, number>();
  const incoming = new Map<string, number>();
  for (const l of layers) incoming.set(l.name, 0);
  for (const l of layers) {
    for (const to of l.connects_to) {
      incoming.set(to, (incoming.get(to) ?? 0) + 1);
    }
  }

  const queue: string[] = [];
  for (const l of layers) {
    if ((incoming.get(l.name) ?? 0) === 0) {
      queue.push(l.name);
      depths.set(l.name, 0);
    }
  }
  // Longest-path relaxation, not a real topological BFS — content is
  // author-provided, and a cycle in connects_to (two layers pointing back at
  // each other) would otherwise re-queue both nodes forever with an
  // ever-growing depth and hang the tab. A DAG never needs more than
  // roughly V*E relaxations to settle, so cap iterations well above that and
  // just stop refining if it's exceeded — the diagram still renders with
  // whatever depths were computed so far.
  const maxIterations = layers.length * layers.length + layers.length + 16;
  let iterations = 0;
  while (queue.length > 0) {
    if (++iterations > maxIterations) break;
    const cur = queue.shift()!;
    const d = depths.get(cur) ?? 0;
    const node = nodeMap.get(cur);
    if (node) {
      for (const to of node.connects_to) {
        const existing = depths.get(to) ?? -1;
        if (existing < d + 1) {
          depths.set(to, d + 1);
        }
        queue.push(to);
      }
    }
  }

  const maxDepth = Math.max(...Array.from(depths.values()), 0);
  const byDepth: ArchLayer[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const l of layers) {
    const d = depths.get(l.name) ?? 0;
    byDepth[d].push(l);
  }

  // Layout: assign every node a real (x, y) center so every actual edge in
  // `connects_to` — same-row, adjacent-row, or skip-level — can be drawn as
  // its own arrow, instead of one generic "there's a connection here"
  // indicator between rows that couldn't show WHICH nodes connect or catch
  // same-row / skip-level relationships at all.
  const rowWidth = (n: number) => n * BOX_W + Math.max(0, n - 1) * COL_GAP;
  const canvasWidth = Math.max(...byDepth.map((r) => rowWidth(r.length)), BOX_W) + PAD * 2;
  const canvasHeight = byDepth.length * BOX_H + Math.max(0, byDepth.length - 1) * ROW_GAP + PAD * 2;

  const pos = new Map<string, { x: number; y: number }>();
  byDepth.forEach((row, di) => {
    const w = rowWidth(row.length);
    const startX = (canvasWidth - w) / 2;
    row.forEach((node, ci) => {
      pos.set(node.name, {
        x: startX + ci * (BOX_W + COL_GAP) + BOX_W / 2,
        y: PAD + di * (BOX_H + ROW_GAP) + BOX_H / 2,
      });
    });
  });

  const edges = layers.flatMap((l) =>
    l.connects_to
      .filter((to) => pos.has(to) && to !== l.name)
      .map((to) => ({ from: l.name, to }))
  );

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)" }}>
        <span>🏗️</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Architecture Diagram</h3>
      </div>
      <div className="p-4" style={{ background: "rgba(0,0,0,0.15)", overflowX: "auto" }}>
        <svg width={canvasWidth} height={canvasHeight} viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} style={{ display: "block", margin: "0 auto" }}>
          <defs>
            <marker id="arch-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-muted)" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            const s = pos.get(e.from)!, t = pos.get(e.to)!;
            const dx = t.x - s.x, dy = t.y - s.y;
            const start = pointAt(s.x, s.y, t.x, t.y, edgeMargin(dx, dy));
            const end = pointAt(t.x, t.y, s.x, s.y, edgeMargin(dx, dy) + 6); // +6 so the arrowhead tip lands right at the box edge
            const sameRow = s.y === t.y;
            if (sameRow || Math.abs(dx) < 4) {
              return (
                <line key={i} x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                  stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arch-arrow)" />
              );
            }
            // Cross-row (including skip-level) edges get a gentle S-curve
            // instead of a straight diagonal — reads as "flow downward" even
            // when it jumps more than one row, and avoids overlapping other
            // boxes it passes near.
            const midY = (start.y + end.y) / 2;
            const path = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
            return <path key={i} d={path} fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arch-arrow)" />;
          })}
          {layers.map((node) => {
            const p = pos.get(node.name);
            if (!p) return null;
            const c = TYPE_COLOR[node.type] ?? TYPE_COLOR.service;
            return (
              <foreignObject key={node.name} x={p.x - BOX_W / 2} y={p.y - BOX_H / 2} width={BOX_W} height={BOX_H}>
                <div
                  style={{
                    width: "100%", height: "100%", boxSizing: "border-box",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 3, padding: "8px 10px", borderRadius: 10,
                    background: c.bg, border: `1px solid ${c.border}`, textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{c.icon}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: c.text, lineHeight: 1.2 }}>{node.name}</span>
                  {node.note && (
                    <span style={{ fontSize: 10, lineHeight: 1.3, color: "var(--text-muted)" }}>{node.note}</span>
                  )}
                </div>
              </foreignObject>
            );
          })}
        </svg>
      </div>
      {/* Legend */}
      <div className="px-4 py-2 flex flex-wrap gap-3 border-t" style={{ background: "rgba(0,0,0,0.1)", borderColor: "var(--border-subtle)" }}>
        {(["client","lb","service","cache","db","queue","storage"] as ArchLayerType[]).map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: TYPE_COLOR[t].border }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{TYPE_COLOR[t].icon} {t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
