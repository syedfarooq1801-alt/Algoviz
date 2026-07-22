"use client";
import { useState, useEffect, useRef } from "react";

const DEFAULT_GRID = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"],
];

type Cell = "1" | "0" | "V" | "C"; // V=visited, C=current

export default function IslandsViz() {
  const [grid, setGrid] = useState<Cell[][]>(DEFAULT_GRID.map(r => [...r] as Cell[]));
  const [displayGrid, setDisplayGrid] = useState<Cell[][]>(DEFAULT_GRID.map(r => [...r] as Cell[]));
  const [islandCount, setIslandCount] = useState(0);
  const [currentCell, setCurrentCell] = useState<[number, number] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const stepsRef = useRef<{ grid: Cell[][]; cell: [number,number] | null; count: number; msg: string }[]>([]);
  const stepIdxRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function buildSteps(inputGrid: string[][]) {
    const g = inputGrid.map(r => [...r] as Cell[]);
    const steps: typeof stepsRef.current = [];
    let count = 0;

    function dfs(r: number, c: number) {
      if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] !== "1") return;
      g[r][c] = "V";
      steps.push({ grid: g.map(row => [...row] as Cell[]), cell: [r, c], count, msg: `DFS visiting (${r},${c}) — marked visited` });
      dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
    }

    for (let r = 0; r < g.length; r++) {
      for (let c = 0; c < g[0].length; c++) {
        if (g[r][c] === "1") {
          count++;
          steps.push({ grid: g.map(row => [...row] as Cell[]), cell: [r, c], count, msg: `Found unvisited land at (${r},${c}) — Island #${count} discovered! Starting DFS...` });
          dfs(r, c);
          steps.push({ grid: g.map(row => [...row] as Cell[]), cell: null, count, msg: `Island #${count} fully explored. Total: ${count}` });
        }
      }
    }
    return steps;
  }

  const reset = (g?: string[][]) => {
    const src = g ?? DEFAULT_GRID;
    const steps = buildSteps(src);
    stepsRef.current = steps;
    stepIdxRef.current = 0;
    setDisplayGrid(src.map(r => [...r] as Cell[]));
    setIslandCount(0);
    setCurrentCell(null);
    setDone(false);
    setLog([]);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => { reset(); }, []);

  const doStep = () => {
    const idx = stepIdxRef.current;
    if (idx >= stepsRef.current.length) { setDone(true); setPlaying(false); return; }
    const s = stepsRef.current[idx];
    setDisplayGrid(s.grid);
    setCurrentCell(s.cell);
    setIslandCount(s.count);
    setLog((p) => [...p.slice(-8), s.msg]);
    stepIdxRef.current = idx + 1;
    if (idx + 1 >= stepsRef.current.length) { setDone(true); setPlaying(false); }
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(doStep, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  const cellColor = (cell: Cell, r: number, c: number): { bg: string; border: string; text: string } => {
    if (currentCell && currentCell[0] === r && currentCell[1] === c)
      return { bg: "rgba(168,85,247,0.4)", border: "#a855f7", text: "#a855f7" };
    if (cell === "V") return { bg: "rgba(34,197,94,0.2)", border: "rgba(34,197,94,0.5)", text: "#22c55e" };
    if (cell === "1") return { bg: "rgba(79,142,247,0.15)", border: "rgba(79,142,247,0.4)", text: "#4f8ef7" };
    return { bg: "rgba(0,0,0,0.2)", border: "var(--border-subtle)", text: "var(--text-muted)" };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Number of Islands — BFS/DFS Flood Fill Visualization
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setPlaying(!playing)} disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={() => reset()} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Speed:</span>
            <input type="range" min="100" max="1000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "80px", accentColor: "#4f8ef7" }} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Grid */}
        <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Grid (1=land, 0=water)</div>
          <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${displayGrid[0]?.length ?? 5}, 1fr)` }}>
            {displayGrid.map((row, r) =>
              row.map((cell, c) => {
                const colors = cellColor(cell, r, c);
                return (
                  <div key={`${r}-${c}`}
                    className="w-10 h-10 rounded flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                    style={{ background: colors.bg, border: `2px solid ${colors.border}`, color: colors.text }}>
                    {cell === "V" ? "✓" : cell === "1" ? "1" : "0"}
                  </div>
                );
              })
            )}
          </div>

          {/* Legend */}
          <div className="flex gap-3 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: "rgba(79,142,247,0.2)", border: "1px solid rgba(79,142,247,0.4)" }} />Land (1)</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.5)" }} />Visited</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: "rgba(168,85,247,0.4)", border: "1px solid #a855f7" }} />Current</div>
          </div>
        </div>

        {/* Counter + Log */}
        <div className="space-y-3">
          <div className="rounded-xl p-5 text-center" style={{ background: done ? "rgba(34,197,94,0.1)" : "var(--bg-card)", border: done ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Islands Found</div>
            <div className="text-5xl font-bold transition-all" style={{ color: "#22c55e" }}>{islandCount}</div>
            {done && <div className="text-xs mt-2" style={{ color: "#22c55e" }}>Final Answer ✓</div>}
          </div>

          <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>DFS Log</div>
            <div className="space-y-1 text-xs font-mono" style={{ maxHeight: "140px", overflowY: "auto" }}>
              {log.map((l, i) => (
                <div key={i} style={{ color: l.includes("Island") && l.includes("discover") ? "#a855f7" : l.includes("fully") ? "#22c55e" : "var(--text-secondary)" }}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
