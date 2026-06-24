"use client";
import { useState, useEffect, useRef } from "react";

const INIT = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"],
];

interface St { board: string[][]; r: number; c: number; digit: string; action: "try" | "place" | "backtrack" | "done"; msg: string }

function buildSteps(): St[] {
  const steps: St[] = [];
  const board = INIT.map(r => [...r]);
  let count = 0;
  const MAX_STEPS = 80;

  function isValid(r: number, c: number, d: string) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === d) return false;
      if (board[i][c] === d) return false;
      if (board[3 * Math.floor(r / 3) + Math.floor(i / 3)][3 * Math.floor(c / 3) + i % 3] === d) return false;
    }
    return true;
  }

  function solve(): boolean {
    if (count >= MAX_STEPS) return true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === ".") {
          for (const d of "123456789") {
            if (isValid(r, c, d)) {
              board[r][c] = d;
              count++;
              steps.push({ board: board.map(row => [...row]), r, c, digit: d, action: "place", msg: `[${r}][${c}] = ${d} (valid, recurse)` });
              if (count < MAX_STEPS && solve()) return true;
              if (count >= MAX_STEPS) return true;
              board[r][c] = ".";
              count++;
              steps.push({ board: board.map(row => [...row]), r, c, digit: d, action: "backtrack", msg: `[${r}][${c}] = ${d} failed → backtrack` });
            }
          }
          return false;
        }
      }
    }
    steps.push({ board: board.map(row => [...row]), r: -1, c: -1, digit: "", action: "done", msg: "Solved!" });
    return true;
  }

  solve();
  return steps;
}

const STEPS = buildSteps();

export default function SudokuSolverViz() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
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

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Sudoku Solver — Backtracking</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Try digit 1-9 at each empty cell. If valid, recurse. If stuck, backtrack. Green = placed, Red = backtracked.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={100} max={1500} step={50} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{idx}/{STEPS.length}</span>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 2, maxWidth: 306, margin: "0 auto" }}>
          {cur.board.map((row, r) =>
            row.map((cell, c) => {
              const isActive = r === cur.r && c === cur.c;
              const isOriginal = INIT[r][c] !== ".";
              const borderR = (c + 1) % 3 === 0 && c < 8 ? "2px" : "1px";
              const borderB = (r + 1) % 3 === 0 && r < 8 ? "2px" : "1px";
              return (
                <div key={`${r}-${c}`}
                  style={{
                    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: isOriginal ? "bold" : "normal", fontFamily: "monospace",
                    background: isActive ? (cur.action === "backtrack" ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)") : isOriginal ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid var(--border)`,
                    borderRight: borderR + " solid var(--border)",
                    borderBottom: borderB + " solid var(--border)",
                    color: isActive ? (cur.action === "backtrack" ? "#ef4444" : "#22c55e") : isOriginal ? "var(--text-primary)" : "#4f8ef7",
                    transition: "all 0.1s",
                  }}>
                  {cell === "." ? "" : cell}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: cur.action === "backtrack" ? "#ef4444" : cur.action === "done" ? "#22c55e" : "var(--text-secondary)" }}>{cur.msg}</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: cur.action === "backtrack" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.12)", color: cur.action === "backtrack" ? "#ef4444" : "#22c55e" }}>{cur.action}</span>
      </div>
    </div>
  );
}
