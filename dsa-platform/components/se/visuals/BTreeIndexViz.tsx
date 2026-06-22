"use client";
import { useState } from "react";

// B-tree style indexed lookup vs full table scan. Sorted keys 10..80.
const KEYS = [10, 20, 30, 40, 50, 60, 70, 80];

export default function BTreeIndexViz() {
  const [target, setTarget] = useState(60);
  const [mode, setMode] = useState<"index" | "scan">("index");

  // index path: binary-search style probes
  const path: number[] = [];
  let lo = 0, hi = KEYS.length - 1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; path.push(mid); if (KEYS[mid] === target) break; if (KEYS[mid] < target) lo = mid + 1; else hi = mid - 1; }
  const scanSteps = KEYS.indexOf(target) + 1;
  const litIdx = mode === "index" ? path : KEYS.map((_, i) => i).slice(0, scanSteps);

  return (
    <div>
      <div className="flex gap-2 mb-3 items-center flex-wrap">
        <button onClick={() => setMode("index")} className="px-3 py-1.5 rounded-md text-xs font-medium" style={{ background: mode === "index" ? "var(--accent-soft)" : "var(--bg-hover)", color: mode === "index" ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${mode === "index" ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>With index (B-tree)</button>
        <button onClick={() => setMode("scan")} className="px-3 py-1.5 rounded-md text-xs font-medium" style={{ background: mode === "scan" ? "rgba(240,82,75,0.12)" : "var(--bg-hover)", color: mode === "scan" ? "var(--accent-red)" : "var(--text-muted)", border: `1px solid ${mode === "scan" ? "rgba(240,82,75,0.4)" : "var(--border)"}` }}>Full table scan</button>
        <label className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>Find
          <select value={target} onChange={(e) => setTarget(+e.target.value)} className="ml-1 px-2 py-1 rounded" style={{ background: "var(--bg-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            {KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>
      </div>
      <div className="flex gap-1 flex-wrap">
        {KEYS.map((k, i) => {
          const lit = litIdx.includes(i);
          const found = k === target && lit;
          return (
            <div key={k} className="w-10 h-10 flex items-center justify-center rounded font-mono text-sm transition-all"
              style={{ background: found ? "rgba(45,212,160,0.18)" : lit ? (mode === "index" ? "var(--accent-soft)" : "rgba(240,82,75,0.14)") : "var(--bg-hover)", color: found ? "var(--accent-green)" : lit ? (mode === "index" ? "var(--accent)" : "var(--accent-red)") : "var(--text-muted)", border: `1px solid ${found ? "rgba(45,212,160,0.4)" : lit ? "var(--border)" : "var(--border-subtle)"}` }}>{k}</div>
          );
        })}
      </div>
      <p className="text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
        {mode === "index"
          ? <>Index probes <b style={{ color: "var(--accent)" }}>{path.length}</b> nodes (O(log n)) — halves the search each step.</>
          : <>Scan reads <b style={{ color: "var(--accent-red)" }}>{scanSteps}</b> rows (O(n)) — checks every row until found.</>}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>An index trades write speed + storage for vastly faster reads. That's why you index columns in WHERE/JOIN clauses.</p>
    </div>
  );
}
