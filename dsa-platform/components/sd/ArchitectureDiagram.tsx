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

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)" }}>
        <span>🏗️</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Architecture Diagram</h3>
      </div>
      <div className="p-4 space-y-2" style={{ background: "rgba(0,0,0,0.15)" }}>
        {byDepth.map((row, di) => (
          <div key={di}>
            <div className="flex flex-wrap gap-2 justify-center">
              {row.map((node) => {
                const c = TYPE_COLOR[node.type] ?? TYPE_COLOR.service;
                return (
                  <div
                    key={node.name}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, minWidth: 100, maxWidth: 160 }}
                  >
                    <span className="text-base">{c.icon}</span>
                    <span className="text-xs font-semibold text-center" style={{ color: c.text }}>{node.name}</span>
                    {node.note && (
                      <span className="text-xs text-center leading-tight" style={{ color: "var(--text-muted)" }}>{node.note}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {di < byDepth.length - 1 && (
              <div className="flex justify-center my-1.5">
                <div className="flex flex-col items-center gap-0.5">
                  {row.flatMap((node) => node.connects_to).filter(Boolean).slice(0, 3).map((_, i) => (
                    <div key={i} className="h-1.5 w-px" style={{ background: "var(--border)" }} />
                  ))}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ color: "var(--text-muted)" }}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
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
