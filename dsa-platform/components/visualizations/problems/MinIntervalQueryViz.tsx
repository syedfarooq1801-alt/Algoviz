"use client";
import { useState, useRef, useEffect } from "react";

// intervals=[[1,4],[2,4],[3,6],[4,4]], queries=[2,3,4,5]
const INTERVALS = [[1,4],[2,4],[3,6],[4,4]];
const QUERIES = [2,3,4,5];
// For each query: find smallest interval containing query point
const computeAnswers = () => {
  return QUERIES.map(q => {
    let best = -1;
    for (const [l, r] of INTERVALS) {
      if (l <= q && q <= r) {
        const size = r - l + 1;
        if (best === -1 || size < best) best = size;
      }
    }
    return best;
  });
};
const ANSWERS = computeAnswers();

export default function MinIntervalQueryViz() {
  const [qi, setQi] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("For each query: find smallest interval containing that point.");
  const stateRef = useRef({ qi: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { qi: 0 };
    setQi(0); setDone(false); setPlaying(false);
    setMsg("For each query: find smallest interval containing that point.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { qi: q } = stateRef.current;
    if (q >= QUERIES.length) { setDone(true); setPlaying(false); setMsg(`Answers: [${ANSWERS.join(",")}]`); return; }
    const query = QUERIES[q];
    const ans = ANSWERS[q];
    stateRef.current = { qi: q + 1 };
    setQi(q + 1);
    setMsg(`Query=${query}: ${ans === -1 ? "No interval contains it → -1" : `Smallest containing interval has size=${ans}`}`);
    if (q + 1 >= QUERIES.length) { setDone(true); setPlaying(false); setMsg(`Done! Answers=[${ANSWERS.join(",")}]`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Min Interval to Include Each Query — Sweep + Heap</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Sort intervals and queries. Min heap by size. Remove expired intervals. Top = answer.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Timeline (1–6)</div>
        <svg width="400" height="140" viewBox="0 0 400 140" style={{ width: "100%", height: "auto" }} role="img" aria-label="Interval diagram with minimum-interval query highlighting">
          <line x1="20" y1="120" x2="380" y2="120" stroke="rgba(107,114,128,0.5)" strokeWidth="1" />
          {[1,2,3,4,5,6].map(n => (
            <g key={n}>
              <line x1={20+(n-1)*60} y1="115" x2={20+(n-1)*60} y2="125" stroke="rgba(107,114,128,0.5)" strokeWidth="1" />
              <text x={20+(n-1)*60} y="137" textAnchor="middle" fill="var(--text-muted)" fontSize="10">{n}</text>
            </g>
          ))}
          {INTERVALS.map(([l,r], i) => {
            const x1 = 20+(l-1)*60, x2 = 20+(r-1)*60+10, y = 15 + i * 22;
            return (
              <g key={i}>
                <rect x={x1} y={y} width={x2-x1} height={16} rx={3} fill={`rgba(79,142,247,${0.15+i*0.05})`} stroke="#4f8ef7" strokeWidth="1.5" />
                <text x={(x1+x2)/2} y={y+11} textAnchor="middle" fill="#4f8ef7" fontSize="9">[{l},{r}] sz={r-l+1}</text>
              </g>
            );
          })}
          {QUERIES.slice(0, qi).map((q, i) => (
            <line key={i} x1={20+(q-1)*60} y1="5" x2={20+(q-1)*60} y2="115" stroke={i === qi-1 ? "#f97316" : "rgba(249,115,22,0.3)"} strokeWidth={i === qi-1 ? 2 : 1} strokeDasharray={i < qi-1 ? "3" : undefined} />
          ))}
        </svg>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Query results</div>
        <div className="flex gap-3">
          {QUERIES.map((q, i) => (
            <div key={i} className="flex-1 text-center rounded-lg py-2" style={{ background: i < qi ? "rgba(34,197,94,0.12)" : i === qi ? "rgba(249,115,22,0.12)" : "var(--bg-hover)", border: i === qi - 1 ? "2px solid #f97316" : "1px solid var(--border)" }}>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>q={q}</div>
              <div className="text-xl font-bold" style={{ color: i < qi ? "#22c55e" : "var(--text-muted)" }}>{i < qi ? ANSWERS[i] : "?"}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
