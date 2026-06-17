"use client";
import { useState } from "react";

const SHAPES = [
  { name: "Circle", color: "var(--accent)", area: "π·r²", val: "πr² = 28.3", draw: <circle cx="40" cy="40" r="26" /> },
  { name: "Square", color: "var(--accent-green)", area: "s²", val: "s² = 36.0", draw: <rect x="16" y="16" width="48" height="48" rx="3" /> },
  { name: "Triangle", color: "var(--accent-orange)", area: "½·b·h", val: "½bh = 24.0", draw: <polygon points="40,12 68,66 12,66" /> },
];

export default function PolymorphismViz() {
  const [i, setI] = useState(0);
  const s = SHAPES[i];
  return (
    <div>
      <code className="text-xs block px-3 py-2 rounded mb-3" style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}>
        Shape* s = new <span style={{ color: s.color }}>{s.name}</span>(); s-&gt;<b style={{ color: "var(--accent)" }}>area()</b>;  <span style={{ color: "var(--text-muted)" }}>// same call, different code runs</span>
      </code>
      <div className="flex gap-2 mb-3">
        {SHAPES.map((x, k) => (
          <button key={x.name} onClick={() => setI(k)} className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ background: i === k ? `${x.color}22` : "var(--bg-hover)", color: i === k ? x.color : "var(--text-muted)", border: `1px solid ${i === k ? x.color : "var(--border)"}` }}>{x.name}</button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 80 80" width="80" height="80"><g fill={`${s.color}33`} stroke={s.color} strokeWidth="2">{s.draw}</g></svg>
        <div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>dynamic dispatch → {s.name}::area()</div>
          <div className="text-lg font-mono font-bold" style={{ color: s.color }}>{s.val}</div>
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>One interface (Shape::area), many implementations. The vtable picks the right override at runtime based on the actual object type — that's polymorphism.</p>
    </div>
  );
}
