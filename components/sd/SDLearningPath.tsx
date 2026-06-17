"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSDStore } from "@/lib/sdStore";

// Curated dependency graph of core concepts. Each node sits in a tier (row);
// prereqs point from an earlier concept to this one. Beginner reads top→bottom.
interface Node { id: string; title: string; tier: number; prereqs: string[]; }

const NODES: Node[] = [
  // Tier 0 — the absolute basics
  { id: "scalability", title: "Scalability", tier: 0, prereqs: [] },
  { id: "latency-vs-throughput", title: "Latency vs Throughput", tier: 0, prereqs: [] },
  { id: "availability", title: "Availability", tier: 0, prereqs: [] },
  // Tier 1 — first building blocks
  { id: "load-balancing", title: "Load Balancing", tier: 1, prereqs: ["scalability"] },
  { id: "caching", title: "Caching", tier: 1, prereqs: ["latency-vs-throughput"] },
  { id: "database-indexing", title: "DB Indexing", tier: 1, prereqs: ["latency-vs-throughput"] },
  // Tier 2 — distributing data
  { id: "cdn", title: "CDN & Edge", tier: 2, prereqs: ["caching"] },
  { id: "replication", title: "Replication", tier: 2, prereqs: ["availability", "database-indexing"] },
  { id: "sharding", title: "Sharding", tier: 2, prereqs: ["scalability", "database-indexing"] },
  // Tier 3 — the hard tradeoffs
  { id: "consistent-hashing", title: "Consistent Hashing", tier: 3, prereqs: ["sharding"] },
  { id: "cap-theorem", title: "CAP Theorem", tier: 3, prereqs: ["replication", "sharding"] },
  { id: "message-queues", title: "Message Queues", tier: 3, prereqs: ["availability"] },
  // Tier 4 — consistency models
  { id: "acid-vs-base", title: "ACID vs BASE", tier: 4, prereqs: ["cap-theorem"] },
  { id: "eventual-consistency", title: "Eventual Consistency", tier: 4, prereqs: ["cap-theorem"] },
  { id: "distributed-databases", title: "Distributed DBs", tier: 4, prereqs: ["replication", "sharding"] },
  // Tier 5 — advanced
  { id: "paxos-raft", title: "Paxos & Raft", tier: 5, prereqs: ["eventual-consistency"] },
  { id: "saga-2pc", title: "Saga / 2PC", tier: 5, prereqs: ["acid-vs-base", "message-queues"] },
];

const NODE_W = 150, NODE_H = 40, GAP_X = 30, GAP_Y = 76, PAD = 16;

export default function SDLearningPath() {
  const { mastered } = useSDStore();
  const [open, setOpen] = useState(true);

  const { positions, width, height, tiers } = useMemo(() => {
    const byTier: Record<number, Node[]> = {};
    NODES.forEach((n) => { (byTier[n.tier] ??= []).push(n); });
    const tierKeys = Object.keys(byTier).map(Number).sort((a, b) => a - b);
    const maxPerTier = Math.max(...tierKeys.map((t) => byTier[t].length));
    const width = PAD * 2 + maxPerTier * NODE_W + (maxPerTier - 1) * GAP_X;
    const height = PAD * 2 + tierKeys.length * NODE_H + (tierKeys.length - 1) * GAP_Y;
    const positions: Record<string, { x: number; y: number }> = {};
    tierKeys.forEach((t, row) => {
      const nodes = byTier[t];
      const rowWidth = nodes.length * NODE_W + (nodes.length - 1) * GAP_X;
      const startX = (width - rowWidth) / 2;
      nodes.forEach((n, i) => {
        positions[n.id] = { x: startX + i * (NODE_W + GAP_X), y: PAD + row * (NODE_H + GAP_Y) };
      });
    });
    return { positions, width, height, tiers: byTier };
  }, []);

  const stateOf = (n: Node): "mastered" | "available" | "locked" => {
    if (mastered.has(n.id)) return "mastered";
    if (n.prereqs.every((p) => mastered.has(p))) return "available";
    return "locked";
  };

  return (
    <div className="card overflow-hidden mb-6">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5">
        <div className="text-left">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Learning Path</h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Follow the arrows — each concept builds on the ones above it</p>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
      </button>

      {open && (
        <div className="px-4 pb-4 overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ minWidth: width * 0.6, maxWidth: width }} role="img">
            {/* edges */}
            {NODES.flatMap((n) =>
              n.prereqs.map((p) => {
                const from = positions[p], to = positions[n.id];
                if (!from || !to) return null;
                const x1 = from.x + NODE_W / 2, y1 = from.y + NODE_H;
                const x2 = to.x + NODE_W / 2, y2 = to.y;
                const my = (y1 + y2) / 2;
                const lit = mastered.has(p);
                return (
                  <path key={`${p}-${n.id}`} d={`M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`}
                    fill="none" stroke={lit ? "var(--accent)" : "var(--border)"} strokeWidth={1.5} opacity={lit ? 0.7 : 0.5} />
                );
              })
            )}
            {/* nodes */}
            {NODES.map((n) => {
              const pos = positions[n.id];
              const st = stateOf(n);
              const fill = st === "mastered" ? "rgba(45,212,160,0.12)" : st === "available" ? "var(--accent-soft)" : "var(--bg-hover)";
              const stroke = st === "mastered" ? "var(--accent-green)" : st === "available" ? "var(--accent)" : "var(--border)";
              const text = st === "locked" ? "var(--text-muted)" : "var(--text-primary)";
              return (
                <a key={n.id} href={`/system-design/concept/${n.id}`}>
                  <g style={{ cursor: "pointer" }}>
                    <rect x={pos.x} y={pos.y} width={NODE_W} height={NODE_H} rx={9} fill={fill} stroke={stroke} strokeWidth={1.25} />
                    {st === "mastered" && <text x={pos.x + 12} y={pos.y + NODE_H / 2 + 4} fontSize={12} fill="var(--accent-green)">✓</text>}
                    <text x={pos.x + NODE_W / 2} y={pos.y + NODE_H / 2 + 4} textAnchor="middle" fontSize={12.5}
                      fontFamily="var(--font-sans)" fontWeight={500} fill={text}>{n.title}</text>
                  </g>
                </a>
              );
            })}
          </svg>

          {/* legend */}
          <div className="flex items-center gap-4 mt-2 px-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1.5"><span style={{ width: 10, height: 10, borderRadius: 3, background: "rgba(45,212,160,0.4)", border: "1px solid var(--accent-green)" }} /> Mastered</span>
            <span className="flex items-center gap-1.5"><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--accent-soft)", border: "1px solid var(--accent)" }} /> Ready to learn</span>
            <span className="flex items-center gap-1.5"><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--bg-hover)", border: "1px solid var(--border)" }} /> Locked</span>
          </div>
        </div>
      )}
    </div>
  );
}
