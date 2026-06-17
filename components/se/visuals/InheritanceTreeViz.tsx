"use client";
import { useState } from "react";

// Animal -> Dog, Cat ; Dog -> Puppy. Click a class to see method resolution for speak().
const CLASSES: Record<string, { parent: string | null; speak: string | null; x: number; y: number }> = {
  Animal: { parent: null, speak: "\"...\" (generic)", x: 210, y: 30 },
  Dog: { parent: "Animal", speak: "\"Woof\"", x: 120, y: 100 },
  Cat: { parent: "Animal", speak: "\"Meow\"", x: 300, y: 100 },
  Puppy: { parent: "Dog", speak: null, x: 120, y: 170 },
};

export default function InheritanceTreeViz() {
  const [sel, setSel] = useState("Puppy");

  // resolve speak() up the chain
  const chain: string[] = [];
  let cur: string | null = sel;
  while (cur) { chain.push(cur); cur = CLASSES[cur].parent; }
  const resolver = chain.find((c) => CLASSES[c].speak !== null)!;

  return (
    <div>
      <svg viewBox="0 0 420 210" width="100%" style={{ maxWidth: 460 }}>
        {Object.entries(CLASSES).map(([name, c]) => c.parent && (
          <line key={name} x1={c.x} y1={c.y - 14} x2={CLASSES[c.parent].x} y2={CLASSES[c.parent].y + 14}
            stroke={chain.includes(name) && chain.includes(c.parent) ? "var(--accent)" : "var(--border)"} strokeWidth="2" />
        ))}
        {Object.entries(CLASSES).map(([name, c]) => {
          const inChain = chain.includes(name);
          const isResolver = name === resolver;
          return (
            <g key={name} style={{ cursor: "pointer" }} onClick={() => setSel(name)}>
              <rect x={c.x - 45} y={c.y - 15} width="90" height="30" rx="7"
                fill={isResolver ? "var(--accent-soft)" : name === sel ? "rgba(45,212,160,0.12)" : "var(--bg-hover)"}
                stroke={isResolver ? "var(--accent)" : name === sel ? "var(--accent-green)" : inChain ? "var(--accent)" : "var(--border)"} strokeWidth="1.5" />
              <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill={inChain ? "var(--text-primary)" : "var(--text-secondary)"}>{name}</text>
            </g>
          );
        })}
      </svg>

      <div className="rounded-lg px-3 py-2 mt-2" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          <span className="font-mono" style={{ color: "var(--accent-green)" }}>{sel}</span>.speak() →
          searches up the chain {chain.join(" → ")} and runs <span className="font-mono" style={{ color: "var(--accent)" }}>{resolver}</span>&apos;s version: <b style={{ color: "var(--text-primary)" }}>{CLASSES[resolver].speak}</b>
        </p>
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Click any class. A subclass inherits the nearest ancestor&apos;s method unless it overrides it — that&apos;s runtime polymorphism via dynamic dispatch.</p>
    </div>
  );
}
