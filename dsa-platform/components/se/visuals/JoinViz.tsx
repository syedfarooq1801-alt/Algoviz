"use client";
import { useState } from "react";

const A = [{ id: 1, v: "Ann" }, { id: 2, v: "Bob" }, { id: 3, v: "Cay" }];
const B = [{ id: 2, v: "HR" }, { id: 3, v: "Eng" }, { id: 4, v: "Ops" }];
type J = "inner" | "left" | "right" | "full";

function compute(j: J) {
  const rows: { l: string; r: string }[] = [];
  if (j === "inner" || j === "left" || j === "full") {
    A.forEach((a) => { const m = B.find((b) => b.id === a.id); if (m) rows.push({ l: `${a.id},${a.v}`, r: `${m.id},${m.v}` }); else if (j !== "inner") rows.push({ l: `${a.id},${a.v}`, r: "NULL" }); });
  } else { // right starts from B matches
    A.forEach((a) => { const m = B.find((b) => b.id === a.id); if (m) rows.push({ l: `${a.id},${a.v}`, r: `${m.id},${m.v}` }); });
  }
  if (j === "right" || j === "full") {
    B.forEach((b) => { if (!A.find((a) => a.id === b.id)) rows.push({ l: "NULL", r: `${b.id},${b.v}` }); });
  }
  return rows;
}

export default function JoinViz() {
  const [j, setJ] = useState<J>("inner");
  const rows = compute(j);
  // Venn fills
  const left = j === "left" || j === "full", right = j === "right" || j === "full", mid = true;
  return (
    <div>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {(["inner", "left", "right", "full"] as J[]).map((x) => (
          <button key={x} onClick={() => setJ(x)} className="px-3 py-1.5 rounded-md text-xs font-medium capitalize"
            style={{ background: j === x ? "var(--accent-soft)" : "var(--bg-hover)", color: j === x ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${j === x ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>{x} join</button>
        ))}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <svg viewBox="0 0 180 110" width="180">
          <defs><clipPath id="lc"><circle cx="70" cy="55" r="42" /></clipPath><clipPath id="rc"><circle cx="110" cy="55" r="42" /></clipPath></defs>
          <circle cx="70" cy="55" r="42" fill={left ? "rgba(91,140,255,0.25)" : "transparent"} stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx="110" cy="55" r="42" fill={right ? "rgba(45,212,160,0.25)" : "transparent"} stroke="var(--accent-green)" strokeWidth="1.5" />
          {mid && <g clipPath="url(#lc)"><circle cx="110" cy="55" r="42" fill="rgba(169,116,255,0.4)" /></g>}
          <text x="52" y="58" fontSize="11" fill="var(--accent)">A</text>
          <text x="120" y="58" fontSize="11" fill="var(--accent-green)">B</text>
        </svg>
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold px-3 py-1" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}>Result · {rows.length} rows</div>
          <table className="text-xs"><thead><tr><th className="px-3 py-1 text-left font-mono" style={{ color: "var(--text-muted)" }}>A.id,name</th><th className="px-3 py-1 text-left font-mono" style={{ color: "var(--text-muted)" }}>B.id,dept</th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i}>{[r.l, r.r].map((c, ci) => <td key={ci} className="px-3 py-0.5 font-mono" style={{ color: c === "NULL" ? "var(--accent-red)" : "var(--text-secondary)" }}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>A=(1,2,3), B=(2,3,4) joined on id. INNER keeps only matches; LEFT/RIGHT keep all of one side (NULLs for misses); FULL keeps everything.</p>
    </div>
  );
}
