"use client";
import { useEffect, useState } from "react";

type NodeRole = "primary" | "replica" | "replica2";
interface Write { id: number; key: string; value: string; replicated: number }

const WRITES = [
  { key: "user.name", value: "Alice" }, { key: "order.id", value: "42" },
  { key: "cart.qty", value: "3" }, { key: "session", value: "abc123" },
  { key: "balance", value: "$50" }, { key: "post.id", value: "99" },
];

export default function ReplicationViz() {
  const [writeLog, setWriteLog] = useState<Write[]>([]);
  const [activeWrite, setActiveWrite] = useState<number | null>(null);
  const [replicaLag, setReplicaLag] = useState([0, 0]);
  const [tick, setTick] = useState(0);
  const [mode, setMode] = useState<"sync" | "async">("sync");

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const w = WRITES[t % WRITES.length];
        const newId = t;
        setActiveWrite(newId);
        const newWrite: Write = { id: newId, key: w.key, value: w.value, replicated: 0 };
        setWriteLog((prev) => [newWrite, ...prev].slice(0, 5));

        // simulate replication lag
        const lag0 = mode === "async" ? Math.floor(Math.random() * 3) + 1 : 0;
        const lag1 = mode === "async" ? Math.floor(Math.random() * 4) + 1 : 0;
        setReplicaLag([lag0, lag1]);

        setTimeout(() => {
          setWriteLog((prev) => prev.map((w2) => w2.id === newId ? { ...w2, replicated: 1 } : w2));
        }, mode === "sync" ? 200 : lag0 * 400);
        setTimeout(() => {
          setWriteLog((prev) => prev.map((w2) => w2.id === newId ? { ...w2, replicated: 2 } : w2));
          setActiveWrite(null);
        }, mode === "sync" ? 400 : (lag0 + lag1) * 400);

        if (t % 8 === 7) setMode((m) => m === "sync" ? "async" : "sync");
        return t + 1;
      });
    }, 1400);
    return () => clearInterval(id);
  }, [mode]);

  const nodeStyle = (role: NodeRole, active: boolean) => {
    const colors: Record<NodeRole, string> = { primary: "#4f8ef7", replica: "#22c55e", replica2: "#a855f7" };
    const c = colors[role];
    return { background: active ? `${c}20` : "var(--bg-card)", border: `2px solid ${active ? c : `${c}40`}`, color: c, boxShadow: active ? `0 0 16px ${c}40` : "none" };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <span className="text-xs px-2 py-1 rounded-md" style={{ background: mode === "sync" ? "rgba(79,142,247,0.15)" : "rgba(249,115,22,0.12)", color: mode === "sync" ? "#4f8ef7" : "#f97316", border: `1px solid ${mode === "sync" ? "rgba(79,142,247,0.4)" : "rgba(249,115,22,0.35)"}` }}>
          {mode === "sync" ? "Synchronous Replication" : "Asynchronous Replication"}
        </span>
      </div>

      {/* Nodes */}
      <div className="flex gap-4 justify-center items-start">
        {/* Primary */}
        <div className="flex flex-col items-center gap-2">
          <div className="px-5 py-3 rounded-xl text-xs font-bold text-center transition-all duration-300"
            style={nodeStyle("primary", activeWrite !== null)}>
            <div className="text-base mb-1">🗄️</div>
            <div>Primary</div>
            <div className="text-xs mt-1 font-normal" style={{ color: "var(--text-muted)" }}>Leader</div>
          </div>
          {activeWrite !== null && (
            <div className="text-xs px-2 py-0.5 rounded font-mono animate-pulse" style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7" }}>
              WRITE ↓
            </div>
          )}
        </div>

        {/* Replicas */}
        {(["replica", "replica2"] as NodeRole[]).map((role, i) => (
          <div key={role} className="flex flex-col items-center gap-2">
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              {mode === "async" ? `~${replicaLag[i]}s lag` : "0ms lag"}
            </div>
            <div className="px-5 py-3 rounded-xl text-xs font-bold text-center transition-all duration-300"
              style={nodeStyle(role, writeLog[0]?.replicated > i)}>
              <div className="text-base mb-1">🗄️</div>
              <div>Replica {i + 1}</div>
              <div className="text-xs mt-1 font-normal" style={{ color: "var(--text-muted)" }}>Follower</div>
            </div>
          </div>
        ))}
      </div>

      {/* Write log */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="px-4 py-2 text-xs font-semibold" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
          Write Log
        </div>
        <div className="p-2 space-y-1.5">
          {writeLog.slice(0, 4).map((w) => (
            <div key={w.id} className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--border-subtle)" }}>
              <span className="font-mono" style={{ color: "#4f8ef7" }}>SET</span>
              <span className="font-mono flex-1" style={{ color: "var(--text-primary)" }}>{w.key} = {w.value}</span>
              <span>{w.replicated >= 1 ? "✓" : "⏳"} R1</span>
              <span>{w.replicated >= 2 ? "✓" : "⏳"} R2</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
