"use client";
import { useState, useMemo } from "react";

interface Proc { id: string; arrival: number; burst: number; color: string; }
const PROCS: Proc[] = [
  { id: "P1", arrival: 0, burst: 5, color: "var(--accent)" },
  { id: "P2", arrival: 1, burst: 3, color: "var(--accent-green)" },
  { id: "P3", arrival: 2, burst: 6, color: "var(--accent-orange)" },
  { id: "P4", arrival: 4, burst: 2, color: "var(--accent-purple)" },
];

type Algo = "FCFS" | "SJF" | "RR";

function schedule(algo: Algo): { slices: { id: string; start: number; len: number; color: string }[]; waiting: Record<string, number> } {
  const procs = PROCS.map((p) => ({ ...p, remaining: p.burst, done: 0 }));
  const slices: { id: string; start: number; len: number; color: string }[] = [];
  let t = 0; const completion: Record<string, number> = {};
  const quantum = 2;
  if (algo === "RR") {
    const q: typeof procs = [];
    const enqueued = new Set<string>();
    while (procs.some((p) => p.remaining > 0)) {
      procs.filter((p) => p.arrival <= t && p.remaining > 0 && !enqueued.has(p.id)).forEach((p) => { q.push(p); enqueued.add(p.id); });
      if (q.length === 0) { t++; continue; }
      const p = q.shift()!;
      const run = Math.min(quantum, p.remaining);
      slices.push({ id: p.id, start: t, len: run, color: p.color });
      t += run; p.remaining -= run;
      procs.filter((x) => x.arrival <= t && x.remaining > 0 && !enqueued.has(x.id)).forEach((x) => { q.push(x); enqueued.add(x.id); });
      if (p.remaining > 0) q.push(p); else completion[p.id] = t;
    }
  } else {
    while (procs.some((p) => p.remaining > 0)) {
      const avail = procs.filter((p) => p.arrival <= t && p.remaining > 0);
      if (avail.length === 0) { t++; continue; }
      const pick = algo === "SJF" ? avail.sort((a, b) => a.remaining - b.remaining)[0] : avail.sort((a, b) => a.arrival - b.arrival)[0];
      slices.push({ id: pick.id, start: t, len: pick.remaining, color: pick.color });
      t += pick.remaining; pick.remaining = 0; completion[pick.id] = t;
    }
  }
  const waiting: Record<string, number> = {};
  PROCS.forEach((p) => { waiting[p.id] = completion[p.id] - p.arrival - p.burst; });
  return { slices, waiting };
}

export default function SchedulingGanttViz() {
  const [algo, setAlgo] = useState<Algo>("FCFS");
  const { slices, waiting } = useMemo(() => schedule(algo), [algo]);
  const total = slices.reduce((m, s) => Math.max(m, s.start + s.len), 0);
  const avgWait = (Object.values(waiting).reduce((a, b) => a + b, 0) / PROCS.length).toFixed(2);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {(["FCFS", "SJF", "RR"] as Algo[]).map((a) => (
          <button key={a} onClick={() => setAlgo(a)} className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ background: algo === a ? "var(--accent-soft)" : "var(--bg-hover)", color: algo === a ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${algo === a ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>
            {a}{a === "RR" ? " (q=2)" : ""}
          </button>
        ))}
      </div>

      <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Processes: P1(0,5) P2(1,3) P3(2,6) P4(4,2) — (arrival, burst)</div>

      {/* Gantt */}
      <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {slices.map((s, i) => (
          <div key={i} className="flex items-center justify-center text-xs font-bold text-white relative"
            style={{ width: `${(s.len / total) * 100}%`, background: s.color, borderRight: "1px solid rgba(0,0,0,0.3)", minWidth: 18, height: 36 }}>
            {s.id}
          </div>
        ))}
      </div>
      <div className="flex text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
        <span>0</span><span className="ml-auto">{total}</span>
      </div>

      <div className="flex items-center gap-4 mt-3 flex-wrap">
        {PROCS.map((p) => (
          <span key={p.id} className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color, display: "inline-block" }} /> {p.id} wait={waiting[p.id]}
          </span>
        ))}
        <span className="text-xs ml-auto font-semibold" style={{ color: "var(--accent)" }}>Avg wait: {avgWait}</span>
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>SJF minimizes average waiting time but can starve long jobs. RR is fair but adds context-switch overhead.</p>
    </div>
  );
}
