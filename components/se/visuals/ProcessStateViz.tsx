"use client";
import { useState } from "react";

// new -> ready -> running -> (waiting -> ready) -> terminated
const STATES: Record<string, { x: number; y: number; color: string; label: string }> = {
  new: { x: 60, y: 40, color: "var(--text-secondary)", label: "New" },
  ready: { x: 200, y: 40, color: "var(--accent)", label: "Ready" },
  running: { x: 340, y: 40, color: "var(--accent-green)", label: "Running" },
  waiting: { x: 200, y: 140, color: "var(--accent-orange)", label: "Waiting" },
  terminated: { x: 340, y: 140, color: "var(--accent-red)", label: "Terminated" },
};
const EDGES: [string, string, string][] = [
  ["new", "ready", "admitted"],
  ["ready", "running", "dispatch"],
  ["running", "ready", "interrupt"],
  ["running", "waiting", "I/O wait"],
  ["waiting", "ready", "I/O done"],
  ["running", "terminated", "exit"],
];

export default function ProcessStateViz() {
  const [cur, setCur] = useState("new");
  const next: Record<string, string[]> = {
    new: ["ready"], ready: ["running"], running: ["ready", "waiting", "terminated"], waiting: ["ready"], terminated: [],
  };

  return (
    <div>
      <svg viewBox="0 0 420 190" width="100%" style={{ maxWidth: 460 }}>
        {EDGES.map(([a, b, lbl], i) => {
          const A = STATES[a], B = STATES[b];
          const active = cur === a && next[a]?.includes(b);
          return (
            <g key={i} opacity={active ? 1 : 0.4}>
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={active ? "var(--accent)" : "var(--border)"} strokeWidth={active ? 2 : 1.25} markerEnd="url(#ar)" />
            </g>
          );
        })}
        <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-muted)" /></marker></defs>
        {Object.entries(STATES).map(([id, s]) => {
          const isCur = id === cur;
          const reachable = next[cur]?.includes(id);
          return (
            <g key={id} style={{ cursor: reachable ? "pointer" : "default" }} onClick={() => reachable && setCur(id)}>
              <rect x={s.x - 42} y={s.y - 16} width="84" height="32" rx="8"
                fill={isCur ? `${s.color}28` : "var(--bg-hover)"} stroke={isCur ? s.color : reachable ? "var(--accent)" : "var(--border)"} strokeWidth={isCur ? 2 : 1.25} />
              <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill={isCur ? s.color : "var(--text-secondary)"}>{s.label}</text>
            </g>
          );
        })}
      </svg>
      <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
        Current: <b style={{ color: STATES[cur].color }}>{STATES[cur].label}</b>. {next[cur]?.length ? "Click a highlighted state to transition." : "Process finished — reset to replay."}
      </p>
      <button onClick={() => setCur("new")} className="btn-ghost px-3 py-1.5 text-xs mt-2">Reset</button>
    </div>
  );
}
