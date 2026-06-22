"use client";
import { useState } from "react";

const LEVELS = ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"];
const ANOMALIES = ["Dirty Read", "Non-Repeatable Read", "Phantom Read"];
// allowed[level][anomaly] = true means anomaly CAN happen
const ALLOWED = [
  [true, true, true],
  [false, true, true],
  [false, false, true],
  [false, false, false],
];

export default function IsolationViz() {
  const [lvl, setLvl] = useState(1);
  return (
    <div>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {LEVELS.map((l, i) => (
          <button key={l} onClick={() => setLvl(i)} className="px-2.5 py-1.5 rounded-md text-xs font-medium"
            style={{ background: lvl === i ? "var(--accent-soft)" : "var(--bg-hover)", color: lvl === i ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${lvl === i ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>{l}</button>
        ))}
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-xs">
          <thead><tr style={{ background: "var(--bg-hover)" }}>
            <th className="px-3 py-2 text-left" style={{ color: "var(--text-muted)" }}>Anomaly</th>
            <th className="px-3 py-2 text-right" style={{ color: "var(--text-muted)" }}>At {LEVELS[lvl]}</th>
          </tr></thead>
          <tbody>
            {ANOMALIES.map((a, i) => {
              const can = ALLOWED[lvl][i];
              return (
                <tr key={a} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <td className="px-3 py-2" style={{ color: "var(--text-secondary)" }}>{a}</td>
                  <td className="px-3 py-2 text-right font-medium" style={{ color: can ? "var(--accent-red)" : "var(--accent-green)" }}>{can ? "✗ possible" : "✓ prevented"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Higher isolation prevents more anomalies but costs concurrency (more locking). Serializable = safest but slowest.</p>
    </div>
  );
}
