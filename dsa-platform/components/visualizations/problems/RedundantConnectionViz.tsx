"use client";
import { useState, useRef, useEffect } from "react";

// edges = [[1,2],[1,3],[2,3]], redundant = [2,3]
const EDGES = [[1,2],[1,3],[2,3]];
const N = 3;

export default function RedundantConnectionViz() {
  const [step, setStep] = useState(-1);
  const [parent, setParent] = useState(Array.from({ length: N + 1 }, (_, i) => i));
  const [done, setDone] = useState(false);
  const [redundant, setRedundant] = useState<number[] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Union-Find: adding edges one by one. If both nodes same component = redundant.");
  const stateRef = useRef({ step: -1, parent: Array.from({ length: N + 1 }, (_, i) => i) });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const find = (p: number[], x: number): number => p[x] === x ? x : find(p, p[x]);
  const union = (p: number[], a: number, b: number): [boolean, number[]] => {
    const ra = find(p, a), rb = find(p, b);
    if (ra === rb) return [false, p];
    const np = [...p]; np[ra] = rb;
    return [true, np];
  };

  const reset = () => {
    const init = Array.from({ length: N + 1 }, (_, i) => i);
    stateRef.current = { step: -1, parent: init };
    setStep(-1); setParent(init); setDone(false); setRedundant(null); setPlaying(false);
    setMsg("Union-Find: adding edges one by one. If both nodes same component = redundant.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s, parent: p } = stateRef.current;
    const next = s + 1;
    if (next >= EDGES.length) { setDone(true); setPlaying(false); return; }
    const [a, b] = EDGES[next];
    const ra = find(p, a), rb = find(p, b);
    if (ra === rb) {
      stateRef.current = { step: next, parent: p };
      setStep(next); setRedundant([a, b]); setDone(true); setPlaying(false);
      setMsg(`Edge [${a},${b}]: find(${a})=${ra}, find(${b})=${rb}. SAME ROOT → REDUNDANT! Answer: [${a},${b}]`);
    } else {
      const [, newP] = union(p, a, b);
      stateRef.current = { step: next, parent: newP };
      setStep(next); setParent(newP);
      setMsg(`Edge [${a},${b}]: find(${a})=${ra}, find(${b})=${rb}. Different roots → UNION. parent[${ra}]=${rb}`);
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const NODE_POS = [{ x: 0, y: 0 }, { x: 150, y: 40 }, { x: 60, y: 150 }, { x: 240, y: 150 }];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Redundant Connection — Union-Find</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Add edges. If two nodes already connected (same root) → that edge is redundant.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <svg width="280" height="200" viewBox="0 0 280 200" style={{ width: "100%", height: "auto" }} role="img" aria-label="Graph with a redundant edge creating a cycle">
            {EDGES.map(([a, b], i) => {
              const isRedundant = redundant && redundant[0] === a && redundant[1] === b;
              const added = i <= step;
              return (
                <line key={i} x1={NODE_POS[a].x} y1={NODE_POS[a].y + 20} x2={NODE_POS[b].x} y2={NODE_POS[b].y + 20} stroke={isRedundant ? "#ef4444" : added ? "#22c55e" : "rgba(107,114,128,0.2)"} strokeWidth={added ? 2 : 1} strokeDasharray={!added ? "4" : undefined} />
              );
            })}
            {[1,2,3].map(n => (
              <g key={n}>
                <circle cx={NODE_POS[n].x} cy={NODE_POS[n].y + 20} r={20} fill={redundant && (n === redundant[0] || n === redundant[1]) ? "rgba(239,68,68,0.3)" : "rgba(79,142,247,0.15)"} stroke={redundant && (n === redundant[0] || n === redundant[1]) ? "#ef4444" : "#4f8ef7"} strokeWidth="2" />
                <text x={NODE_POS[n].x} y={NODE_POS[n].y + 25} textAnchor="middle" fill="#4f8ef7" fontSize="13" fontWeight="bold">{n}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Edges (Union-Find)</div>
          <div className="space-y-2">
            {EDGES.map(([a, b], i) => {
              const isRedundant = redundant && redundant[0] === a && redundant[1] === b;
              const added = i < step || (i === step && !isRedundant);
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded text-xs" style={{ background: isRedundant ? "rgba(239,68,68,0.15)" : added ? "rgba(34,197,94,0.1)" : "var(--bg-hover)", border: i === step ? "1px solid " + (isRedundant ? "#ef4444" : "#22c55e") : "1px solid transparent", color: isRedundant ? "#ef4444" : added ? "#22c55e" : "var(--text-muted)" }}>
                  [{a}—{b}] {isRedundant ? "✗ REDUNDANT" : added ? "✓ added" : "pending"}
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Parent array</div>
          <div className="flex gap-2 mt-1">
            {parent.slice(1).map((p, i) => (
              <div key={i} className="flex-1 text-center text-xs">
                <div style={{ color: "var(--text-muted)" }}>{i+1}</div>
                <div style={{ color: "#a855f7", fontWeight: "bold" }}>{p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? (redundant ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)") : "rgba(79,142,247,0.07)", color: done ? (redundant ? "#ef4444" : "#22c55e") : "#4f8ef7", border: `1px solid ${done ? (redundant ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)") : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
