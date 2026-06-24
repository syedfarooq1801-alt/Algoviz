"use client";
import { useState, useEffect, useRef } from "react";

const EMPLOYEES = [
  [[1,3],[6,7]],
  [[2,4]],
  [[2,5],[9,12]],
];
const COLORS = ["#4f8ef7","#a855f7","#f97316"];

interface Interval { s: number; e: number; emp: number }
interface St { sorted: Interval[]; merged: Interval[]; gaps: Interval[]; step: number; merging: number; msg: string }

function buildSteps(): St[] {
  const steps: St[] = [];
  const all: Interval[] = [];
  EMPLOYEES.forEach((emp, ei) => emp.forEach(([s,e]) => all.push({ s, e, emp: ei })));
  const sorted = [...all].sort((a,b) => a.s - b.s);
  steps.push({ sorted: [...sorted], merged: [], gaps: [], step: 0, merging: -1, msg: "Sort all intervals by start time" });

  const merged: Interval[] = [{ ...sorted[0] }];
  const gaps: Interval[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i];
    const last = merged[merged.length - 1];
    if (cur.s <= last.e) {
      merged[merged.length - 1] = { ...last, e: Math.max(last.e, cur.e) };
      steps.push({ sorted: [...sorted], merged: merged.map(m=>({...m})), gaps: [...gaps], step: i, merging: i, msg: `[${cur.s},${cur.e}] overlaps [${last.s},${last.e}] → merge to [${last.s},${merged[merged.length-1].e}]` });
    } else {
      gaps.push({ s: last.e, e: cur.s, emp: -1 });
      steps.push({ sorted: [...sorted], merged: merged.map(m=>({...m})), gaps: [...gaps], step: i, merging: -1, msg: `Gap found: [${last.e},${cur.s}] — free time!` });
      merged.push({ ...cur });
    }
  }
  steps.push({ sorted: [...sorted], merged: merged.map(m=>({...m})), gaps: [...gaps], step: sorted.length, merging: -1, msg: `Done. ${gaps.length} free time interval(s)` });
  return steps;
}

const STEPS = buildSteps();
const TIME_MAX = 13;

export default function EmployeeFreeTimeViz() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = idx >= STEPS.length;
  const cur = STEPS[Math.min(idx, STEPS.length - 1)];

  const doStep = () => setIdx(p => { const n = Math.min(p + 1, STEPS.length); if (n >= STEPS.length) setPlaying(false); return n; });
  const reset = () => { setIdx(0); setPlaying(false); };

  useEffect(() => {
    if (playing && !done) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed, done]);

  const scale = (v: number) => (v / TIME_MAX) * 280;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Employee Free Time</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Flatten all intervals, sort, merge overlaps, gaps = free time.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={300} max={2500} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {/* Timeline grid */}
        <div className="relative" style={{ height: 160 }}>
          <svg width="300" height="160" style={{ position: "absolute", top: 0, left: 0 }}>
            {/* time ticks */}
            {Array.from({length: TIME_MAX + 1}, (_, t) => (
              <g key={t}>
                <line x1={scale(t)} y1={0} x2={scale(t)} y2={150} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />
                <text x={scale(t)} y={155} textAnchor="middle" fontSize={9} fill="var(--text-muted)">{t}</text>
              </g>
            ))}
            {/* Employee intervals */}
            {EMPLOYEES.map((emp, ei) =>
              emp.map(([s,e], j) => (
                <rect key={`${ei}-${j}`} x={scale(s)} y={10 + ei * 35} width={scale(e - s)} height={22}
                  fill={`${COLORS[ei]}33`} stroke={COLORS[ei]} strokeWidth={1.5} rx={3} />
              ))
            )}
            {/* Merged */}
            {cur.merged.map((m, i) => (
              <rect key={i} x={scale(m.s)} y={120} width={scale(m.e - m.s)} height={18}
                fill="rgba(79,142,247,0.25)" stroke="#4f8ef7" strokeWidth={1.5} rx={3} />
            ))}
            {/* Gaps (free time) */}
            {cur.gaps.map((g, i) => (
              <rect key={i} x={scale(g.s)} y={120} width={scale(g.e - g.s)} height={18}
                fill="rgba(34,197,94,0.35)" stroke="#22c55e" strokeWidth={2} rx={3} />
            ))}
          </svg>
          {/* Labels */}
          {EMPLOYEES.map((_, ei) => (
            <div key={ei} style={{ position: "absolute", top: 10 + ei * 35 + 4, left: 305, fontSize: 10, color: COLORS[ei] }}>E{ei}</div>
          ))}
          <div style={{ position: "absolute", top: 122, left: 305, fontSize: 10, color: "#4f8ef7" }}>merged</div>
        </div>
        <div className="flex gap-4 mt-1">
          <span className="text-xs flex items-center gap-1"><span style={{ width: 12, height: 8, background: "rgba(79,142,247,0.4)", border: "1px solid #4f8ef7", display: "inline-block", borderRadius: 2 }} />merged</span>
          <span className="text-xs flex items-center gap-1"><span style={{ width: 12, height: 8, background: "rgba(34,197,94,0.4)", border: "1px solid #22c55e", display: "inline-block", borderRadius: 2 }} />free time</span>
        </div>
      </div>

      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: cur.gaps.length > 0 ? "#22c55e" : "var(--text-secondary)" }}>{cur.msg}</span>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>
            Free Time: {cur.gaps.map(g => `[${g.s},${g.e}]`).join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}
