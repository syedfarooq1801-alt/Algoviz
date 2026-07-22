"use client";
import { useEffect, useState } from "react";

type NodeState = "follower" | "candidate" | "leader" | "crashed";

interface RaftNode {
  id: string;
  state: NodeState;
  term: number;
  votes: number;
  log: number[];
  x: number; y: number;
}

const INITIAL_NODES: RaftNode[] = [
  { id: "N1", state: "follower",  term: 1, votes: 0, log: [], x: 130, y: 50  },
  { id: "N2", state: "follower",  term: 1, votes: 0, log: [], x: 220, y: 130 },
  { id: "N3", state: "follower",  term: 1, votes: 0, log: [], x: 180, y: 220 },
  { id: "N4", state: "follower",  term: 1, votes: 0, log: [], x: 80,  y: 220 },
  { id: "N5", state: "follower",  term: 1, votes: 0, log: [], x: 40,  y: 130 },
];

export default function ConsensusViz() {
  const [nodes, setNodes] = useState<RaftNode[]>(INITIAL_NODES);
  const [phase, setPhase] = useState<"election" | "replication" | "steady">("election");
  const [tick, setTick] = useState(0);
  const [message, setMessage] = useState("Waiting for leader timeout...");
  const [crashedNode, setCrashedNode] = useState<string | null>(null);

  const leader = nodes.find((n) => n.state === "leader");

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const newT = t + 1;

        if (newT === 1) {
          // Start election — N1 becomes candidate
          setMessage("N1 timeout → starts election (term 2)");
          setPhase("election");
          setNodes((prev) => prev.map((n) => n.id === "N1" ? { ...n, state: "candidate", term: 2, votes: 1 } : { ...n, term: 2 }));
        } else if (newT === 2) {
          setMessage("Sending RequestVote to all nodes...");
          setNodes((prev) => prev.map((n) => ({ ...n, votes: n.id === "N1" ? 1 : 0 })));
        } else if (newT === 3) {
          setMessage("N2, N3, N4 vote YES → N1 wins majority");
          setNodes((prev) => prev.map((n) => n.id === "N1" ? { ...n, votes: 4 } : n));
        } else if (newT === 4) {
          setMessage("N1 becomes LEADER (term 2)");
          setPhase("steady");
          setNodes((prev) => prev.map((n) => ({
            ...n,
            state: n.id === "N1" ? "leader" : (n.id === "N5" ? "follower" : "follower"),
          })));
        } else if (newT >= 5 && newT <= 10) {
          // Log replication
          const entry = newT - 4;
          setPhase("replication");
          setMessage(`Leader replicates log entry #${entry} → AppendEntries RPC`);
          setNodes((prev) => prev.map((n) => ({
            ...n,
            log: n.state === "leader" || (n.id !== "N5" && newT > 5) ? [...n.log.filter((e) => e !== entry), entry].slice(-4) : n.log,
          })));
        } else if (newT === 11) {
          // Crash leader
          setMessage("⚠️ Leader N1 crashes! New election needed...");
          setCrashedNode("N1");
          setNodes((prev) => prev.map((n) => n.id === "N1" ? { ...n, state: "crashed" } : n));
        } else if (newT === 13) {
          setMessage("N3 timeout → starts new election (term 3)");
          setNodes((prev) => prev.map((n) => n.id === "N3" ? { ...n, state: "candidate", term: 3, votes: 1 } : { ...n, term: 3 }));
        } else if (newT === 15) {
          setMessage("N3 elected new leader (term 3) — cluster recovered!");
          setCrashedNode(null);
          setNodes((prev) => prev.map((n) => ({
            ...n,
            state: n.id === "N3" ? "leader" : n.id === "N1" ? "follower" : "follower",
            term: 3,
          })));
        } else if (newT > 16) {
          // Reset
          setNodes(INITIAL_NODES.map((n) => ({ ...n, log: [] })));
          setMessage("Waiting for leader timeout...");
          setPhase("election");
          setCrashedNode(null);
          return 0;
        }

        return newT;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const stateColor: Record<NodeState, string> = {
    follower: "#4f8ef7", candidate: "#f59e0b", leader: "#22c55e", crashed: "#ef4444",
  };
  const stateIcon: Record<NodeState, string> = {
    follower: "F", candidate: "C", leader: "L", crashed: "✗",
  };

  return (
    <div className="space-y-4">
      {/* Phase */}
      <div className="flex justify-center gap-2">
        {(["election", "replication", "steady"] as const).map((p) => (
          <span key={p} className="text-xs px-2 py-1 rounded-md"
            style={{ background: phase === p ? "rgba(168,85,247,0.15)" : "transparent", color: phase === p ? "#a855f7" : "var(--text-muted)", border: `1px solid ${phase === p ? "rgba(168,85,247,0.4)" : "transparent"}` }}>
            {p}
          </span>
        ))}
      </div>

      {/* Raft cluster diagram */}
      <div className="relative rounded-xl overflow-hidden" style={{ height: 290, background: "rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}>
        <svg width="100%" height={290} viewBox="0 0 270 270" role="img" aria-label="Distributed consensus protocol diagram">
          {/* Connections */}
          {nodes.filter((n) => n.state !== "crashed").map((n1) =>
            nodes.filter((n2) => n2.id > n1.id && n2.state !== "crashed").map((n2) => (
              <line key={`${n1.id}-${n2.id}`}
                x1={n1.x + 18} y1={n1.y + 18}
                x2={n2.x + 18} y2={n2.y + 18}
                stroke="var(--border)" strokeWidth={1} />
            ))
          )}

          {/* Nodes */}
          {nodes.map((n) => {
            const c = stateColor[n.state];
            const isLeader = n.state === "leader";
            return (
              <g key={n.id}>
                {isLeader && <circle cx={n.x + 18} cy={n.y + 18} r={30} fill="none" stroke={c} strokeWidth={1} strokeDasharray="4 2" opacity={0.5} />}
                <circle cx={n.x + 18} cy={n.y + 18} r={22}
                  fill={`${c}15`} stroke={c} strokeWidth={isLeader ? 2.5 : 1.5}
                  style={{ filter: isLeader ? `drop-shadow(0 0 8px ${c})` : "none" }} />
                <text x={n.x + 18} y={n.y + 13} textAnchor="middle" fontSize={11} fontWeight="bold" fill={c}>{n.id}</text>
                <text x={n.x + 18} y={n.y + 26} textAnchor="middle" fontSize={9} fill={c}>{stateIcon[n.state]} t{n.term}</text>
                {n.log.length > 0 && (
                  <text x={n.x + 18} y={n.y + 46} textAnchor="middle" fontSize={7} fill="var(--text-muted)">[{n.log.join(",")}]</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Message */}
      <div className="px-4 py-2.5 rounded-lg text-xs transition-all" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)", minHeight: 36 }}>
        {message}
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center flex-wrap">
        {(Object.entries(stateColor) as [NodeState, string][]).map(([state, color]) => (
          <div key={state} className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span style={{ color: "var(--text-muted)" }}>{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
