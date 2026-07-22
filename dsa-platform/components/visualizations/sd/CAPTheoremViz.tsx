"use client";
import { useEffect, useState } from "react";

type Mode = "CP" | "AP" | "CA";

const MODES: { id: Mode; label: string; desc: string; color: string; examples: string }[] = [
  { id: "CP", label: "CP", desc: "Consistent + Partition Tolerant", color: "#4f8ef7", examples: "HBase, Zookeeper, MongoDB (strict)" },
  { id: "AP", label: "AP", desc: "Available + Partition Tolerant", color: "#22c55e", examples: "Cassandra, CouchDB, DynamoDB" },
  { id: "CA", label: "CA", desc: "Consistent + Available", color: "#f97316", examples: "RDBMS (no partitions), MySQL single-node" },
];

interface Node { id: string; x: number; y: number; data: string; synced: boolean }

export default function CAPTheoremViz() {
  const [mode, setMode] = useState<Mode>("CP");
  const [partitioned, setPartitioned] = useState(false);
  const [tick, setTick] = useState(0);
  const [nodes, setNodes] = useState<Node[]>([
    { id: "N1", x: 60, y: 140, data: "v1", synced: true },
    { id: "N2", x: 200, y: 80, data: "v1", synced: true },
    { id: "N3", x: 200, y: 200, data: "v1", synced: true },
  ]);
  const [writeResult, setWriteResult] = useState<string>("");

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const newT = t + 1;
        if (newT % 5 === 0) {
          setPartitioned((p) => !p);
        }
        if (newT % 3 === 1) {
          const version = `v${newT}`;
          setNodes((prev) => {
            if (!partitioned) {
              setWriteResult(`Write ${version} → all nodes ✓`);
              return prev.map((n) => ({ ...n, data: version, synced: true }));
            }
            if (mode === "CP") {
              setWriteResult(`Write rejected — partition detected ✗`);
              return prev;
            }
            if (mode === "AP") {
              setWriteResult(`Write ${version} → N1 only (N2/N3 stale)`);
              return prev.map((n) => n.id === "N1" ? { ...n, data: version, synced: true } : { ...n, synced: false });
            }
            setWriteResult(`Write ${version} → local only (CA ignores partition)`);
            return prev.map((n) => n.id === "N1" ? { ...n, data: version } : n);
          });
        }
        return newT;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [mode, partitioned]);

  const modeInfo = MODES.find((m) => m.id === mode)!;

  return (
    <div className="space-y-4">
      {/* CAP triangle */}
      <div className="flex justify-center gap-2">
        {MODES.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: mode === m.id ? `${m.color}20` : "var(--bg-card)", color: m.color, border: `1.5px solid ${mode === m.id ? m.color : `${m.color}30`}` }}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-3 text-xs" style={{ background: `${modeInfo.color}08`, border: `1px solid ${modeInfo.color}30`, color: "var(--text-secondary)" }}>
        <span className="font-bold" style={{ color: modeInfo.color }}>{modeInfo.label} ({modeInfo.desc})</span>
        <span className="ml-2">{modeInfo.examples}</span>
      </div>

      {/* Network diagram */}
      <div className="relative rounded-xl overflow-hidden" style={{ height: 280, background: "rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}>
        {/* Partition label */}
        {partitioned && (
          <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded"
            style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.35)" }}>
            ⚡ Network Partition
          </div>
        )}
        <svg width="100%" height={280} viewBox="0 0 280 280" role="img" aria-label="CAP theorem triangle diagram">
          {/* Connections */}
          {!partitioned ? (
            <>
              <line x1={60} y1={140} x2={200} y2={80} stroke="#4f8ef7" strokeWidth={2} opacity={0.5} />
              <line x1={60} y1={140} x2={200} y2={200} stroke="#4f8ef7" strokeWidth={2} opacity={0.5} />
              <line x1={200} y1={80} x2={200} y2={200} stroke="#4f8ef7" strokeWidth={2} opacity={0.5} />
            </>
          ) : (
            <>
              <line x1={60} y1={140} x2={200} y2={80} stroke="#ef4444" strokeWidth={2} strokeDasharray="6 4" opacity={0.6} />
              <line x1={60} y1={140} x2={200} y2={200} stroke="#ef4444" strokeWidth={2} strokeDasharray="6 4" opacity={0.6} />
              <line x1={200} y1={80} x2={200} y2={200} stroke="#4f8ef7" strokeWidth={1.5} opacity={0.5} />
            </>
          )}
          {/* Nodes */}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={28}
                fill={n.synced ? `${modeInfo.color}18` : "rgba(239,68,68,0.12)"}
                stroke={n.synced ? modeInfo.color : "#ef4444"} strokeWidth={2} />
              <text x={n.x} y={n.y - 6} textAnchor="middle" fontSize={11} fontWeight="bold" fill={n.synced ? modeInfo.color : "#ef4444"}>{n.id}</text>
              <text x={n.x} y={n.y + 10} textAnchor="middle" fontSize={10} fill="var(--text-secondary)">{n.data}</text>
              {!n.synced && <text x={n.x} y={n.y + 24} textAnchor="middle" fontSize={9} fill="#ef4444">stale</text>}
            </g>
          ))}
        </svg>
        {writeResult && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              {writeResult}
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        CAP: pick 2. During partition, choose Consistency (reject writes) or Availability (allow stale reads).
      </p>
    </div>
  );
}
