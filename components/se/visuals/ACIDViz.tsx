"use client";
import { useState } from "react";

const PROPS = [
  { k: "A", name: "Atomicity", color: "var(--accent)", note: "All-or-nothing. Transfer $100: debit AND credit both happen, or neither. A crash mid-way rolls back.", demo: "BEGIN; debit A −100; CRASH → ROLLBACK (A unchanged)" },
  { k: "C", name: "Consistency", color: "var(--accent-green)", note: "DB moves from one valid state to another. Constraints (balance ≥ 0, FKs) never violated by a committed txn.", demo: "Total money before = total after. Invariants hold." },
  { k: "I", name: "Isolation", color: "var(--accent-orange)", note: "Concurrent txns don't see each other's half-done work. Result equals some serial order.", demo: "T1 and T2 interleave but read as if run one-after-another" },
  { k: "D", name: "Durability", color: "var(--accent-purple)", note: "Once committed, survives crashes/power loss — written to the WAL/disk, not just RAM.", demo: "COMMIT → flushed to log → survives a pull-the-plug" },
];

export default function ACIDViz() {
  const [sel, setSel] = useState(0);
  const p = PROPS[sel];
  return (
    <div>
      <div className="flex gap-2 mb-3">
        {PROPS.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)} className="flex-1 rounded-lg py-3 text-center transition-all"
            style={{ background: sel === i ? `${x.color}1f` : "var(--bg-hover)", border: `1px solid ${sel === i ? x.color : "var(--border)"}` }}>
            <div className="text-2xl font-bold" style={{ color: x.color }}>{x.k}</div>
            <div className="text-xs" style={{ color: sel === i ? x.color : "var(--text-muted)" }}>{x.name}</div>
          </button>
        ))}
      </div>
      <div className="rounded-lg px-4 py-3" style={{ background: `${p.color}10`, border: `1px solid ${p.color}40` }}>
        <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{p.note}</p>
        <code className="text-xs block px-2 py-1.5 rounded" style={{ background: "var(--bg-card)", color: p.color }}>{p.demo}</code>
      </div>
    </div>
  );
}
