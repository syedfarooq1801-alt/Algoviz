"use client";
import { useState } from "react";

const CURVES = [
  { id: "O(1)", color: "var(--accent-green)", f: () => 1 },
  { id: "O(log n)", color: "#2dd4c0", f: (n: number) => Math.log2(Math.max(1, n)) },
  { id: "O(n)", color: "var(--accent)", f: (n: number) => n },
  { id: "O(n log n)", color: "var(--accent-purple)", f: (n: number) => n * Math.log2(Math.max(1, n)) },
  { id: "O(n²)", color: "var(--accent-orange)", f: (n: number) => n * n },
  { id: "O(2ⁿ)", color: "var(--accent-red)", f: (n: number) => Math.pow(2, n) },
];

export default function BigOViz() {
  const [n, setN] = useState(16);
  const W = 420, H = 200, maxN = 32;
  // log-scaled y so the fast-growers stay on screen
  const cap = Math.pow(2, maxN);
  const ly = (v: number) => H - (Math.log2(Math.max(1, v)) / Math.log2(cap)) * (H - 20) - 10;
  const lx = (x: number) => 10 + (x / maxN) * (W - 20);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        <line x1="10" y1={H - 10} x2={W - 10} y2={H - 10} stroke="var(--border)" />
        <line x1="10" y1="10" x2="10" y2={H - 10} stroke="var(--border)" />
        {CURVES.map((c) => {
          const pts = Array.from({ length: maxN + 1 }, (_, x) => `${lx(x)},${ly(c.f(x))}`).join(" ");
          return <polyline key={c.id} points={pts} fill="none" stroke={c.color} strokeWidth="2" opacity="0.9" />;
        })}
        <line x1={lx(n)} y1="10" x2={lx(n)} y2={H - 10} stroke="var(--text-muted)" strokeDasharray="3 3" />
      </svg>

      <div className="mt-2">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>n = {n}</label>
        <input type="range" min={1} max={maxN} value={n} onChange={(e) => setN(+e.target.value)} className="w-full" />
      </div>

      <div className="grid grid-cols-3 gap-1.5 mt-2">
        {CURVES.map((c) => {
          const v = c.f(n);
          return (
            <div key={c.id} className="rounded-md px-2 py-1.5 text-xs flex items-center justify-between" style={{ background: "var(--bg-hover)", border: `1px solid ${c.color}33` }}>
              <span style={{ color: c.color, fontWeight: 600 }}>{c.id}</span>
              <span className="font-mono" style={{ color: "var(--text-secondary)" }}>{v >= 1e6 ? v.toExponential(1) : Math.round(v).toLocaleString()}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Operations for input size n. Notice how O(2ⁿ) and O(n²) explode — that's why they're unusable at scale.</p>
    </div>
  );
}
