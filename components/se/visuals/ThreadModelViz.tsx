"use client";
import { useState } from "react";

const MODELS = {
  "many-to-one": { label: "Many-to-One", note: "Many user threads map to ONE kernel thread. One blocking call blocks all; no true parallelism." },
  "one-to-one": { label: "One-to-One", note: "Each user thread has its own kernel thread. True parallelism, but threads are heavier (Linux/Windows use this)." },
  "many-to-many": { label: "Many-to-Many", note: "Many user threads multiplexed onto a smaller pool of kernel threads. Best of both — flexible and parallel." },
} as const;
type M = keyof typeof MODELS;

export default function ThreadModelViz() {
  const [m, setM] = useState<M>("one-to-one");
  const user = [0, 1, 2, 3];
  const kernelCount = m === "many-to-one" ? 1 : m === "one-to-one" ? 4 : 2;
  const kernel = Array.from({ length: kernelCount }, (_, i) => i);
  const mapUK = (u: number) => m === "many-to-one" ? 0 : m === "one-to-one" ? u : u % 2;

  return (
    <div>
      <div className="flex gap-2 mb-3 flex-wrap">
        {(Object.keys(MODELS) as M[]).map((k) => (
          <button key={k} onClick={() => setM(k)} className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ background: m === k ? "var(--accent-soft)" : "var(--bg-hover)", color: m === k ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${m === k ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>{MODELS[k].label}</button>
        ))}
      </div>
      <svg viewBox="0 0 360 170" width="100%" style={{ maxWidth: 400 }}>
        <text x="60" y="16" textAnchor="middle" fontSize="11" fill="var(--accent)" fontWeight="600">User threads</text>
        <text x="300" y="16" textAnchor="middle" fontSize="11" fill="var(--accent-green)" fontWeight="600">Kernel threads</text>
        {user.map((u, i) => {
          const uy = 40 + i * 32, ky = 40 + mapUK(u) * (m === "many-to-one" ? 0 : m === "one-to-one" ? 32 : 64) + (m === "many-to-many" ? 16 : 0);
          return <line key={u} x1={88} y1={uy} x2={272} y2={ky} stroke="var(--border)" strokeWidth="1.5" />;
        })}
        {user.map((u, i) => (
          <g key={u}><circle cx={60} cy={40 + i * 32} r="13" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" /><text x={60} y={44 + i * 32} textAnchor="middle" fontSize="10" fill="var(--accent)">U{u}</text></g>
        ))}
        {kernel.map((k) => {
          const ky = m === "many-to-one" ? 40 : m === "one-to-one" ? 40 + k * 32 : 56 + k * 64;
          return <g key={k}><rect x={286} y={ky - 13} width="26" height="26" rx="5" fill="rgba(45,212,160,0.12)" stroke="var(--accent-green)" strokeWidth="1.5" /><text x={299} y={ky + 4} textAnchor="middle" fontSize="10" fill="var(--accent-green)">K{k}</text></g>;
        })}
      </svg>
      <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{MODELS[m].note}</p>
    </div>
  );
}
