"use client";
import { useState } from "react";

// Resource Allocation Graph. Toggle the last edge to create/break a cycle (deadlock).
export default function DeadlockViz() {
  const [cycle, setCycle] = useState(true);

  // P1 holds R1, wants R2 ; P2 holds R2, wants R1 (cycle) OR wants nothing (no cycle)
  const nodes = {
    P1: { x: 90, y: 50, t: "p" }, P2: { x: 90, y: 150, t: "p" },
    R1: { x: 300, y: 50, t: "r" }, R2: { x: 300, y: 150, t: "r" },
  } as const;

  // edges: [from, to, type]  assign=R->P (held), request=P->R (wants)
  const edges: [keyof typeof nodes, keyof typeof nodes, "assign" | "request"][] = [
    ["R1", "P1", "assign"],
    ["P1", "R2", "request"],
    ["R2", "P2", "assign"],
    ...(cycle ? [["P2", "R1", "request"] as [keyof typeof nodes, keyof typeof nodes, "assign" | "request"]] : []),
  ];

  return (
    <div>
      <svg viewBox="0 0 390 200" width="100%" style={{ maxWidth: 440 }}>
        <defs><marker id="dah" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="var(--text-secondary)" /></marker></defs>
        {edges.map(([a, b, type], i) => {
          const A = nodes[a], B = nodes[b];
          const color = type === "request" ? "var(--accent-orange)" : "var(--accent-green)";
          return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={cycle ? color : color} strokeWidth="2" markerEnd="url(#dah)" strokeDasharray={type === "request" ? "5 3" : "0"} opacity="0.85" />;
        })}
        {Object.entries(nodes).map(([id, n]) => n.t === "p" ? (
          <g key={id}><circle cx={n.x} cy={n.y} r="20" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" /><text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent)">{id}</text></g>
        ) : (
          <g key={id}><rect x={n.x - 18} y={n.y - 18} width="36" height="36" rx="5" fill="rgba(45,212,160,0.12)" stroke="var(--accent-green)" strokeWidth="1.5" /><text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent-green)">{id}</text></g>
        ))}
      </svg>

      <div className="rounded-lg px-3 py-2 mt-1" style={{ background: cycle ? "rgba(240,82,75,0.08)" : "rgba(45,212,160,0.08)", border: `1px solid ${cycle ? "rgba(240,82,75,0.3)" : "rgba(45,212,160,0.3)"}` }}>
        <p className="text-sm" style={{ color: cycle ? "var(--accent-red)" : "var(--accent-green)" }}>
          {cycle ? "⚠ DEADLOCK — cycle: P1→R2→P2→R1→P1. Each holds what the other needs." : "✓ No cycle. P2 isn't requesting R1, so the system makes progress."}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs flex-wrap" style={{ color: "var(--text-muted)" }}>
        <span><span style={{ color: "var(--accent-green)" }}>→</span> assignment (holds)</span>
        <span><span style={{ color: "var(--accent-orange)" }}>⇢</span> request (wants)</span>
      </div>
      <button onClick={() => setCycle(!cycle)} className="btn-ghost px-3 py-1.5 text-xs mt-2">{cycle ? "Break the cycle" : "Create deadlock"}</button>
      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Coffman conditions: mutual exclusion, hold-and-wait, no preemption, circular wait. Break any one → no deadlock.</p>
    </div>
  );
}
