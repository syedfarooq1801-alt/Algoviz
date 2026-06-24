"use client";
import { useState, useEffect, useRef } from "react";

const GRID = [
  [0,0,0],
  [1,1,0],
  [0,0,0],
];
const K = 1;
const M = GRID.length, N_COL = GRID[0].length;

interface State { r: number; c: number; k: number; steps: number }
interface St { visited: boolean[][][]; queue: State[]; current: State | null; answer: number; msg: string }

function buildSteps(): St[] {
  const result: St[] = [];
  const vis: boolean[][][] = Array.from({length: M}, () => Array.from({length: N_COL}, () => new Array(K + 1).fill(false)));
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  const queue: State[] = [{ r: 0, c: 0, k: K, steps: 0 }];
  vis[0][0][K] = true;

  while (queue.length > 0) {
    const cur = queue.shift()!;
    result.push({ visited: vis.map(r => r.map(c => [...c])), queue: [...queue], current: cur, answer: -1, msg: `Process (${cur.r},${cur.c}) k=${cur.k} steps=${cur.steps}` });

    if (cur.r === M - 1 && cur.c === N_COL - 1) {
      result.push({ visited: vis.map(r => r.map(c => [...c])), queue: [], current: cur, answer: cur.steps, msg: `Reached destination! steps=${cur.steps}` });
      return result;
    }

    for (const [dr, dc] of dirs) {
      const nr = cur.r + dr, nc = cur.c + dc;
      if (nr < 0 || nr >= M || nc < 0 || nc >= N_COL) continue;
      const nk = cur.k - GRID[nr][nc];
      if (nk < 0) continue;
      if (vis[nr][nc][nk]) continue;
      vis[nr][nc][nk] = true;
      queue.push({ r: nr, c: nc, k: nk, steps: cur.steps + 1 });
    }
  }
  result.push({ visited: vis.map(r => r.map(c => [...c])), queue: [], current: null, answer: -1, msg: "No path found → return -1" });
  return result;
}

const STEPS = buildSteps();

export default function ShortestPathObstacleViz() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
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

  const visitedAny = (r: number, c: number) => cur.visited[r][c].some(Boolean);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Shortest Path with Obstacle Elimination</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          BFS state = (row, col, k_remaining). 3D visited prevents revisiting same (position, k). First arrival at dest = shortest.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={200} max={2000} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Grid (k={K} obstacle elimination)</div>
        <div className="space-y-1" style={{ maxWidth: 200, margin: "0 auto" }}>
          {GRID.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((cell, c) => {
                const isCurrent = cur.current?.r === r && cur.current?.c === c;
                const isStart = r === 0 && c === 0;
                const isEnd = r === M - 1 && c === N_COL - 1;
                const inQueue = cur.queue.some(q => q.r === r && q.c === c);
                const visited = visitedAny(r, c);
                return (
                  <div key={c} className="w-14 h-14 rounded-lg flex flex-col items-center justify-center text-xs font-bold gap-0.5"
                    style={{
                      background: isCurrent ? "rgba(79,142,247,0.3)" : isEnd && cur.answer >= 0 ? "rgba(34,197,94,0.3)" : isStart ? "rgba(168,85,247,0.2)" : cell === 1 ? "rgba(239,68,68,0.15)" : inQueue ? "rgba(249,115,22,0.12)" : visited ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
                      border: `2px solid ${isCurrent ? "#4f8ef7" : isEnd && cur.answer >= 0 ? "#22c55e" : isStart ? "#a855f7" : cell === 1 ? "rgba(239,68,68,0.5)" : inQueue ? "rgba(249,115,22,0.4)" : "var(--border)"}`,
                    }}>
                    <span style={{ color: isCurrent ? "#4f8ef7" : cell === 1 ? "#ef4444" : isStart ? "#a855f7" : isEnd ? "#22c55e" : "var(--text-secondary)" }}>
                      {isStart ? "S" : isEnd ? "E" : cell === 1 ? "■" : "□"}
                    </span>
                    <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "monospace" }}>{r},{c}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center mt-3 flex-wrap">
          <span className="text-xs flex items-center gap-1"><span style={{ width: 10, height: 10, background: "rgba(79,142,247,0.4)", display: "inline-block", borderRadius: 2 }} />current</span>
          <span className="text-xs flex items-center gap-1"><span style={{ width: 10, height: 10, background: "rgba(249,115,22,0.3)", display: "inline-block", borderRadius: 2 }} />in queue</span>
          <span className="text-xs flex items-center gap-1"><span style={{ width: 10, height: 10, background: "rgba(239,68,68,0.3)", display: "inline-block", borderRadius: 2 }} />obstacle</span>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>BFS Queue (next states)</div>
        {cur.queue.length === 0 ? <div className="text-xs" style={{ color: "var(--text-muted)" }}>empty</div> : (
          <div className="flex flex-wrap gap-2">
            {cur.queue.slice(0, 6).map((s, i) => (
              <div key={i} className="text-xs px-2 py-1 rounded font-mono" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#f97316" }}>
                ({s.r},{s.c}) k={s.k} d={s.steps}
              </div>
            ))}
            {cur.queue.length > 6 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>+{cur.queue.length - 6} more</span>}
          </div>
        )}
      </div>

      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: cur.answer >= 0 ? "#22c55e" : "var(--text-secondary)" }}>{cur.msg}</span>
      </div>

      {done && cur.answer >= 0 && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-lg font-bold" style={{ color: "#22c55e" }}>Shortest Path = {cur.answer} steps</div>
        </div>
      )}
    </div>
  );
}
