"use client";
import { useState, useEffect, useRef } from "react";

// Graph: 4 nodes, edges: 0-1, 1-2, 2-0, 1-3. Bridge = 1-3
const N_NODES = 4;
const EDGES = [[0,1],[1,2],[2,0],[1,3]];
const ADJ: number[][] = Array.from({length: N_NODES}, () => []);
EDGES.forEach(([u,v]) => { ADJ[u].push(v); ADJ[v].push(u); });

const POS = [
  { x: 80,  y: 80  },
  { x: 200, y: 80  },
  { x: 140, y: 180 },
  { x: 300, y: 80  },
];

interface St { node: number; disc: number[]; low: number[]; parent: number; bridges: [number,number][]; msg: string }

function buildSteps(): St[] {
  const steps: St[] = [];
  const disc = new Array(N_NODES).fill(-1);
  const low = new Array(N_NODES).fill(0);
  let timer = 0;
  const bridges: [number,number][] = [];

  function dfs(u: number, parent: number) {
    disc[u] = low[u] = timer++;
    steps.push({ node: u, disc: [...disc], low: [...low], parent, bridges: [...bridges], msg: `Visit node ${u}: disc=${disc[u]}, low=${low[u]}` });
    for (const v of ADJ[u]) {
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        steps.push({ node: u, disc: [...disc], low: [...low], parent, bridges: [...bridges], msg: `Return to ${u} from ${v}: low[${u}]=min(${low[u]+1>low[v]?low[v]:low[u]+1},${low[v]})=${low[u]}` });
        if (low[v] > disc[u]) {
          bridges.push([u, v]);
          steps.push({ node: u, disc: [...disc], low: [...low], parent, bridges: [...bridges], msg: `BRIDGE found: (${u},${v}) — low[${v}]=${low[v]} > disc[${u}]=${disc[u]}` });
        }
      } else if (v !== parent) {
        low[u] = Math.min(low[u], disc[v]);
        steps.push({ node: u, disc: [...disc], low: [...low], parent, bridges: [...bridges], msg: `Back edge ${u}→${v}: low[${u}]=min(${low[u]},${disc[v]})=${low[u]}` });
      }
    }
  }
  dfs(0, -1);
  return steps;
}

const STEPS = buildSteps();

export default function CriticalConnectionsViz() {
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

  const bridgeSet = new Set(cur.bridges.map(([u,v]) => `${Math.min(u,v)}-${Math.max(u,v)}`));

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Critical Connections — Tarjan's Bridge Finding</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Bridge: low[v] {">"} disc[u]. v can't reach back to u or earlier without this edge.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={300} max={2500} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <svg width="340" height="220" style={{ display: "block", margin: "0 auto" }} role="img" aria-label="Network graph with critical connection (bridge) detection">
          {EDGES.map(([u, v], i) => {
            const key = `${Math.min(u,v)}-${Math.max(u,v)}`;
            const isBridge = bridgeSet.has(key);
            return (
              <line key={i} x1={POS[u].x} y1={POS[u].y} x2={POS[v].x} y2={POS[v].y}
                stroke={isBridge ? "#ef4444" : "var(--border)"} strokeWidth={isBridge ? 3 : 1.5}
                strokeDasharray={isBridge ? "6 3" : "none"} />
            );
          })}
          {Array.from({length: N_NODES}, (_, i) => {
            const isActive = i === cur.node;
            const visited = cur.disc[i] >= 0;
            return (
              <g key={i}>
                <circle cx={POS[i].x} cy={POS[i].y} r={20}
                  fill={isActive ? "rgba(79,142,247,0.25)" : visited ? "rgba(34,197,94,0.15)" : "var(--bg-hover)"}
                  stroke={isActive ? "#4f8ef7" : visited ? "#22c55e" : "var(--border)"} strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={POS[i].x} y={POS[i].y - 4} textAnchor="middle" fontSize={12} fontWeight="bold" fill={isActive ? "#4f8ef7" : visited ? "#22c55e" : "var(--text-muted)"}>{i}</text>
                {visited && (
                  <text x={POS[i].x} y={POS[i].y + 8} textAnchor="middle" fontSize={9} fill="var(--text-muted)"
                    fontFamily="monospace">d{cur.disc[i]}/l{cur.low[i]}</text>
                )}
              </g>
            );
          })}
          {cur.bridges.map(([u,v], i) => {
            const mx = (POS[u].x + POS[v].x) / 2;
            const my = (POS[u].y + POS[v].y) / 2;
            return <text key={i} x={mx + 10} y={my} fontSize={10} fill="#ef4444" fontWeight="bold">bridge!</text>;
          })}
        </svg>
        <div className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          d=disc time, l=low value — <span style={{ color: "#ef4444" }}>dashed red = bridge</span>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {Array.from({length: N_NODES}, (_, i) => (
            <div key={i} className="rounded p-2 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-bold" style={{ color: cur.disc[i] >= 0 ? "#4f8ef7" : "var(--text-muted)" }}>Node {i}</div>
              <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>disc: {cur.disc[i] >= 0 ? cur.disc[i] : "—"}</div>
              <div className="text-xs font-mono" style={{ color: "#a855f7" }}>low: {cur.disc[i] >= 0 ? cur.low[i] : "—"}</div>
            </div>
          ))}
        </div>
        <div className="text-xs font-mono" style={{ color: cur.msg.includes("BRIDGE") ? "#ef4444" : "var(--text-secondary)" }}>{cur.msg}</div>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>
            Bridges: {STEPS[STEPS.length-1].bridges.map(([u,v]) => `[${u},${v}]`).join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}
