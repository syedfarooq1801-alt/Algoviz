"use client";
import { useState } from "react";

const FORMS = [
  { nf: "Unnormalized", note: "Repeating groups: one row crams multiple courses into a single cell.",
    tables: [{ name: "Student", cols: ["SID", "Name", "Courses"], rows: [["1", "Ann", "DBMS, OS"], ["2", "Bob", "CN"]] }] },
  { nf: "1NF", note: "Atomic values — no repeating groups. One course per row.",
    tables: [{ name: "Student", cols: ["SID", "Name", "Course"], rows: [["1", "Ann", "DBMS"], ["1", "Ann", "OS"], ["2", "Bob", "CN"]] }] },
  { nf: "2NF", note: "Remove partial dependencies — Name depends only on SID, so split it out.",
    tables: [
      { name: "Student", cols: ["SID", "Name"], rows: [["1", "Ann"], ["2", "Bob"]] },
      { name: "Enrollment", cols: ["SID", "Course"], rows: [["1", "DBMS"], ["1", "OS"], ["2", "CN"]] },
    ] },
  { nf: "3NF", note: "Remove transitive dependencies — Dept→DeptHead doesn't belong with the student key.",
    tables: [
      { name: "Student", cols: ["SID", "Name", "Dept"], rows: [["1", "Ann", "CS"], ["2", "Bob", "EE"]] },
      { name: "Dept", cols: ["Dept", "Head"], rows: [["CS", "Dr.X"], ["EE", "Dr.Y"]] },
    ] },
];

export default function NormalizationViz() {
  const [step, setStep] = useState(0);
  const f = FORMS[step];
  return (
    <div>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {FORMS.map((x, i) => (
          <button key={i} onClick={() => setStep(i)} className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ background: step === i ? "var(--accent-soft)" : "var(--bg-hover)", color: step === i ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${step === i ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>{x.nf}</button>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {f.tables.map((t, ti) => (
          <div key={ti} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", minWidth: 150 }}>
            <div className="text-xs font-semibold px-3 py-1.5" style={{ background: "var(--bg-hover)", color: "var(--accent)", borderBottom: "1px solid var(--border)" }}>{t.name}</div>
            <table className="text-xs">
              <thead><tr>{t.cols.map((c) => <th key={c} className="px-3 py-1 text-left font-mono" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>{c}</th>)}</tr></thead>
              <tbody>{t.rows.map((r, ri) => <tr key={ri}>{r.map((cell, ci) => <td key={ci} className="px-3 py-1 font-mono" style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        ))}
      </div>
      <p className="text-sm mt-3" style={{ color: "var(--text-secondary)" }}><b style={{ color: "var(--accent)" }}>{f.nf}:</b> {f.note}</p>
    </div>
  );
}
