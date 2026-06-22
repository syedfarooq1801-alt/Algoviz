"use client";
import { useEffect, useState } from "react";

// Island grid BFS wave demo
const GRID = [
  [1,1,0,0],
  [1,0,0,1],
  [0,0,1,1],
  [0,1,0,0],
];
const R = GRID.length, C = GRID[0].length;

type CellState = "water" | "land" | "current" | "visited";

export default function PatternVizGraphBFS() {
  const [cellStates, setCellStates] = useState<CellState[][]>(
    GRID.map(row => row.map(v => v === 1 ? "land" : "water"))
  );
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState("Start: scan for unvisited land");

  useEffect(() => {
    const frames: { states: CellState[][]; count: number; msg: string }[] = [];

    const states: CellState[][] = GRID.map(row => row.map(v => v === 1 ? "land" : "water"));
    frames.push({ states: states.map(r => [...r]), count: 0, msg: "Scan grid for '1' (land)" });

    let islandCount = 0;
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (states[r][c] === "land") {
          islandCount++;
          // BFS
          const queue: [number,number][] = [[r,c]];
          states[r][c] = "current";
          frames.push({ states: states.map(row => [...row]), count: islandCount, msg: `Found island #${islandCount} at (${r},${c})! BFS flood-fill...` });

          while (queue.length > 0) {
            const [cr, cc] = queue.shift()!;
            states[cr][cc] = "visited";
            frames.push({ states: states.map(row => [...row]), count: islandCount, msg: `Visit (${cr},${cc}) — mark as explored` });
            for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
              const nr = cr + dr, nc = cc + dc;
              if (nr >= 0 && nr < R && nc >= 0 && nc < C && states[nr][nc] === "land") {
                states[nr][nc] = "current";
                queue.push([nr, nc]);
                frames.push({ states: states.map(row => [...row]), count: islandCount, msg: `Enqueue neighbor (${nr},${nc})` });
              }
            }
          }
        }
      }
    }
    frames.push({ states: states.map(r => [...r]), count: islandCount, msg: `Done! ${islandCount} islands found.` });
    for (let i = 0; i < 3; i++) frames.push(frames[frames.length - 1]);
    // reset
    frames.push({ states: GRID.map(row => row.map(v => v === 1 ? "land" : "water")), count: 0, msg: "Scan grid for '1' (land)" });

    let fi = 0;
    const id = setInterval(() => {
      const f = frames[fi % frames.length];
      setCellStates(f.states); setCount(f.count); setMsg(f.msg);
      fi++;
      if (fi >= frames.length) fi = 0;
    }, 380);
    return () => clearInterval(id);
  }, []);

  const COLOR: Record<CellState, { bg: string; border: string; text: string; label: string }> = {
    water:   { bg: "rgba(6,182,212,0.06)",    border: "rgba(6,182,212,0.15)",   text: "#164e63", label: "0" },
    land:    { bg: "rgba(79,142,247,0.15)",   border: "rgba(79,142,247,0.4)",   text: "#4f8ef7", label: "1" },
    current: { bg: "rgba(168,85,247,0.35)",   border: "#a855f7",                text: "#a855f7", label: "★" },
    visited: { bg: "rgba(34,197,94,0.2)",     border: "rgba(34,197,94,0.5)",    text: "#22c55e", label: "✓" },
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${C}, 1fr)` }}>
          {cellStates.map((row, r) =>
            row.map((state, c) => (
              <div key={`${r}-${c}`}
                className="w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold font-mono transition-all duration-250"
                style={{
                  background: COLOR[state].bg,
                  border: `2px solid ${COLOR[state].border}`,
                  color: COLOR[state].text,
                  transform: state === "current" ? "scale(1.1)" : "scale(1)",
                  boxShadow: state === "current" ? "0 0 12px rgba(168,85,247,0.4)" : "none",
                }}>
                {COLOR[state].label}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 justify-center text-xs" style={{ color: "var(--text-muted)" }}>
        {(["land","current","visited","water"] as CellState[]).map(s => (
          <div key={s} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: COLOR[s].bg, border: `1px solid ${COLOR[s].border}` }} />
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs py-1.5 px-3 rounded-lg font-mono flex-1 mr-2"
          style={{ background: "rgba(99,102,241,0.07)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)" }}>
          {msg}
        </div>
        <div className="text-center px-3 py-1.5 rounded-lg shrink-0"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <span className="text-lg font-bold" style={{ color: "#22c55e" }}>{count}</span>
          <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>islands</span>
        </div>
      </div>
    </div>
  );
}
