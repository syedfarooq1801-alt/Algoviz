"use client";
import { useState } from "react";

const PRINCIPLES = [
  { k: "S", name: "Single Responsibility", note: "A class should have one reason to change. Split a class that both formats a report AND saves it to disk." },
  { k: "O", name: "Open/Closed", note: "Open for extension, closed for modification. Add a new shape by subclassing — don't edit the existing area() switch." },
  { k: "L", name: "Liskov Substitution", note: "Subtypes must be usable wherever the base type is. A Square that breaks Rectangle's setWidth contract violates LSP." },
  { k: "I", name: "Interface Segregation", note: "Don't force clients to depend on methods they don't use. Split a fat interface into focused ones." },
  { k: "D", name: "Dependency Inversion", note: "Depend on abstractions, not concretions. High-level code talks to an interface, not a concrete DB class." },
];

export default function SOLIDViz() {
  const [sel, setSel] = useState(0);
  const p = PRINCIPLES[sel];
  return (
    <div>
      <div className="flex gap-2 mb-3">
        {PRINCIPLES.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)} className="flex-1 rounded-lg py-2.5 text-center transition-all"
            style={{ background: sel === i ? "var(--accent-soft)" : "var(--bg-hover)", border: `1px solid ${sel === i ? "var(--accent)" : "var(--border)"}` }}>
            <div className="text-xl font-bold" style={{ color: sel === i ? "var(--accent)" : "var(--text-muted)" }}>{x.k}</div>
          </button>
        ))}
      </div>
      <div className="rounded-lg px-4 py-3" style={{ background: "var(--accent-soft)", border: "1px solid rgba(91,140,255,0.3)" }}>
        <div className="text-sm font-semibold mb-1" style={{ color: "var(--accent)" }}>{p.k} — {p.name}</div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{p.note}</p>
      </div>
    </div>
  );
}
