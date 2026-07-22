"use client";
import { useEffect, useState } from "react";

const NODES = [
  { id: "Node A", angle: 45,  color: "#4f8ef7" },
  { id: "Node B", angle: 135, color: "#22c55e" },
  { id: "Node C", angle: 225, color: "#f97316" },
  { id: "Node D", angle: 315, color: "#a855f7" },
];
const KEYS = ["user:1", "session:X", "post:42", "cart:7", "auth:Z", "item:99"];
const KEY_ANGLES = [20, 80, 160, 210, 270, 340];

function toXY(angleDeg: number, r: number, cx: number, cy: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function getOwner(keyAngle: number) {
  const sorted = [...NODES].sort((a, b) => a.angle - b.angle);
  for (const n of sorted) {
    if (keyAngle <= n.angle) return n;
  }
  return sorted[0];
}

export default function ConsistentHashingViz() {
  const [activeKey, setActiveKey] = useState(0);
  const [showVNode, setShowVNode] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveKey((k) => (k + 1) % KEYS.length);
    }, 1200);
    const id2 = setInterval(() => {
      setShowVNode((v) => !v);
    }, 7000);
    return () => { clearInterval(id); clearInterval(id2); };
  }, []);

  const CX = 130, CY = 130, R = 100, INNER = 60;

  const currentKey = KEYS[activeKey];
  const currentAngle = KEY_ANGLES[activeKey];
  const owner = getOwner(currentAngle);
  const keyPos = toXY(currentAngle, R, CX, CY);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2 text-xs">
        <button onClick={() => setShowVNode((v) => !v)} className="px-3 py-1 rounded-md transition-all"
          style={{ background: showVNode ? "rgba(168,85,247,0.15)" : "var(--bg-card)", color: showVNode ? "#a855f7" : "var(--text-muted)", border: `1px solid ${showVNode ? "rgba(168,85,247,0.4)" : "var(--border)"}` }}>
          Virtual Nodes {showVNode ? "ON" : "OFF"}
        </button>
      </div>

      <div className="flex gap-6 items-center justify-center flex-wrap">
        {/* Ring SVG */}
        <svg width={260} height={260} viewBox="0 0 260 260" role="img" aria-label="Consistent hashing ring diagram">
          {/* Ring */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--border)" strokeWidth={2} />
          <circle cx={CX} cy={CY} r={INNER} fill="none" stroke="var(--border)" strokeDasharray="4 4" strokeWidth={1} />

          {/* Virtual node arcs */}
          {showVNode && NODES.map((n) => {
            const a1 = toXY(n.angle - 15, R + 8, CX, CY);
            const a2 = toXY(n.angle + 15, R + 8, CX, CY);
            return (
              <line key={`vn-${n.id}`} x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y}
                stroke={n.color} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
            );
          })}

          {/* Ownership arcs (colored ring segments) */}
          {NODES.map((n, i) => {
            const prev = NODES[(i - 1 + NODES.length) % NODES.length];
            const start = toXY(prev.angle, R, CX, CY);
            const end = toXY(n.angle, R, CX, CY);
            const large = (n.angle - prev.angle + 360) % 360 > 180 ? 1 : 0;
            return (
              <path key={`arc-${n.id}`}
                d={`M ${start.x} ${start.y} A ${R} ${R} 0 ${large} 1 ${end.x} ${end.y}`}
                fill="none" stroke={n.color} strokeWidth={4} opacity={owner.id === n.id ? 1 : 0.25}
                strokeLinecap="round" />
            );
          })}

          {/* Node markers */}
          {NODES.map((n) => {
            const pos = toXY(n.angle, R, CX, CY);
            const isOwner = owner.id === n.id;
            return (
              <g key={n.id}>
                <circle cx={pos.x} cy={pos.y} r={isOwner ? 10 : 7}
                  fill={isOwner ? n.color : "var(--bg-card)"} stroke={n.color} strokeWidth={2}
                  style={{ filter: isOwner ? `drop-shadow(0 0 6px ${n.color})` : "none" }} />
                <text x={pos.x} y={pos.y + 22} textAnchor="middle" fontSize={9} fill={n.color}>{n.id}</text>
              </g>
            );
          })}

          {/* Active key */}
          <circle cx={keyPos.x} cy={keyPos.y} r={6} fill="white" stroke="#f59e0b" strokeWidth={2}
            style={{ filter: "drop-shadow(0 0 6px #f59e0b)" }} />

          {/* Arrow to owner */}
          <line x1={CX} y1={CY}
            x2={toXY(owner.angle, R - 14, CX, CY).x}
            y2={toXY(owner.angle, R - 14, CX, CY).y}
            stroke={owner.color} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.7} />

          {/* Center label */}
          <text x={CX} y={CY - 4} textAnchor="middle" fontSize={9} fill="var(--text-muted)">Hash</text>
          <text x={CX} y={CY + 8} textAnchor="middle" fontSize={9} fill="var(--text-muted)">Ring</text>
        </svg>

        {/* Info panel */}
        <div className="space-y-3 text-sm">
          <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Key lookup</div>
            <div className="font-mono font-bold" style={{ color: "#f59e0b" }}>{currentKey}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>pos {currentAngle}°</div>
          </div>
          <div className="px-4 py-3 rounded-xl" style={{ background: `${owner.color}12`, border: `1px solid ${owner.color}40` }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Served by</div>
            <div className="font-bold" style={{ color: owner.color }}>{owner.id}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>at {owner.angle}° (next clockwise)</div>
          </div>
          {showVNode && (
            <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", color: "var(--text-muted)" }}>
              Virtual nodes → each physical node owns 3 ring positions → even distribution
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Key hashes to position on ring → walks clockwise to find owning node
      </p>
    </div>
  );
}
