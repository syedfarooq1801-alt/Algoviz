"use client";
import { useState, useRef, useEffect } from "react";

// 5x5 grid
const GRID = [
  [1,2,2,3,5],
  [3,2,3,4,4],
  [2,4,5,3,1],
  [6,7,1,4,5],
  [5,1,1,2,4],
];
const R = GRID.length, C = GRID[0].length;

// Pre-computed BFS results
const PACIFIC = new Set(["0,0","0,1","0,2","0,3","0,4","1,0","2,0","3,0","4,0","1,1","2,1","3,1","2,2"]);
const ATLANTIC = new Set(["0,4","1,4","2,4","3,4","4,4","4,3","4,2","4,1","4,0","3,3","2,3","3,2","2,2"]);

const STEPS = [
  { pac: new Set<string>(), atl: new Set<string>(), msg: "BFS from Pacific edge (top+left). Mark reachable cells." },
  { pac: PACIFIC, atl: new Set<string>(), msg: "Pacific-reachable cells found (blue). Now BFS from Atlantic edge." },
  { pac: PACIFIC, atl: ATLANTIC, msg: "Atlantic-reachable cells found (orange). Intersection = answer!" },
];

export default function PacificAtlanticViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Two BFS: one from Pacific borders, one from Atlantic borders. Go UPHILL.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Two BFS: one from Pacific borders, one from Atlantic borders. Go UPHILL.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Cells reachable from both oceans found!"); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Intersection = cells where water can flow to both oceans."); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Pacific Atlantic Water Flow — Two BFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>BFS uphill from each ocean border. Intersection = cells that drain to both.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${C},1fr)` }}>
          {GRID.map((row, r) => (
            row.map((v, c) => {
              const key = `${r},${c}`;
              const pac = cur.pac.has(key);
              const atl = cur.atl.has(key);
              const both = pac && atl;
              return (
                <div key={key} className="aspect-square flex items-center justify-center rounded text-xs font-bold" style={{ background: both ? "rgba(34,197,94,0.5)" : pac && atl ? "rgba(168,85,247,0.3)" : pac ? "rgba(79,142,247,0.3)" : atl ? "rgba(249,115,22,0.3)" : "var(--bg-hover)", border: both ? "2px solid #22c55e" : pac ? "1px solid rgba(79,142,247,0.5)" : atl ? "1px solid rgba(249,115,22,0.5)" : "1px solid var(--border)", color: both ? "#22c55e" : pac ? "#4f8ef7" : atl ? "#f97316" : "var(--text-secondary)" }}>
                  {v}
                </div>
              );
            })
          ))}
        </div>
        <div className="flex gap-3 mt-2 text-xs flex-wrap">
          <span style={{ color: "#4f8ef7" }}>■ Pacific</span>
          <span style={{ color: "#f97316" }}>■ Atlantic</span>
          <span style={{ color: "#22c55e" }}>■ Both</span>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
