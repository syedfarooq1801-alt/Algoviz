"use client";
import { useState, useEffect, useRef } from "react";

const MATRIX_INIT = [[1,2,3],[4,5,6],[7,8,9]];

type Phase = "idle" | "transpose" | "reverse" | "done";

function cloneMatrix(m: number[][]): number[][] {
  return m.map(r => [...r]);
}

export default function RotateImageViz() {
  const [matrix, setMatrix] = useState<number[][]>(cloneMatrix(MATRIX_INIT));
  const [highlighted, setHighlighted] = useState<[number,number][]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — Phase 1: Transpose, then Phase 2: Reverse each row");

  // stateRef holds all mutable algo state
  const stateRef = useRef<{
    phase: Phase;
    matrix: number[][];
    i: number;
    j: number;
    row: number; // for reverse phase
  }>({
    phase: "idle",
    matrix: cloneMatrix(MATRIX_INIT),
    i: 0,
    j: 1,
    row: 0,
  });

  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = () => {
    const m = cloneMatrix(MATRIX_INIT);
    stateRef.current = { phase: "transpose", matrix: m, i: 0, j: 1, row: 0 };
    setMatrix(cloneMatrix(m));
    setHighlighted([]);
    setPhase("transpose");
    setPlaying(false);
    setMsg("Phase 1: Transpose — swapping [i][j] with [j][i]");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;

    if (st.phase === "transpose") {
      const n = st.matrix.length;
      if (st.i >= n - 1) {
        // Done transposing, move to reverse
        stateRef.current = { ...st, phase: "reverse", row: 0 };
        setPhase("reverse");
        setHighlighted([]);
        setMsg("Phase 2: Reverse Rows — reversing each row left↔right");
        return;
      }
      const m = cloneMatrix(st.matrix);
      const i = st.i;
      const j = st.j;
      // swap [i][j] and [j][i]
      const tmp = m[i][j];
      m[i][j] = m[j][i];
      m[j][i] = tmp;

      const nextJ = j + 1;
      const nextI = nextJ >= n ? i + 1 : i;
      const actualNextJ = nextJ >= n ? nextI + 1 : nextJ;

      stateRef.current = {
        ...st,
        matrix: m,
        i: actualNextJ >= n ? nextI + 1 : nextI,
        j: actualNextJ >= n ? (nextI + 2 < n ? nextI + 2 : nextI + 1) : actualNextJ,
      };
      setMatrix(cloneMatrix(m));
      setHighlighted([[i, j], [j, i]]);
      setMsg(`Transpose: swap [${i}][${j}](${tmp}) ↔ [${j}][${i}](${m[j][i]}) → both become swapped`);
      return;
    }

    if (st.phase === "reverse") {
      const n = st.matrix.length;
      if (st.row >= n) {
        stateRef.current = { ...st, phase: "done" };
        setPhase("done");
        setHighlighted([]);
        setPlaying(false);
        setMsg("Done! Matrix rotated 90° clockwise in-place.");
        return;
      }
      const m = cloneMatrix(st.matrix);
      const row = st.row;
      const rowHighlights: [number,number][] = [];
      for (let l = 0, r = n - 1; l < r; l++, r--) {
        const tmp = m[row][l];
        m[row][l] = m[row][r];
        m[row][r] = tmp;
        rowHighlights.push([row, l], [row, r]);
      }
      stateRef.current = { ...st, matrix: m, row: row + 1 };
      setMatrix(cloneMatrix(m));
      setHighlighted(rowHighlights);
      setMsg(`Reverse row ${row}: [${m[row].join(", ")}]`);
      return;
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const isHighlighted = (r: number, c: number) =>
    highlighted.some(([hr, hc]) => hr === r && hc === c);

  const phaseColor = phase === "transpose" ? "#4f8ef7" : phase === "reverse" ? "#f97316" : "#22c55e";
  const phaseLabel =
    phase === "idle" ? "Ready" :
    phase === "transpose" ? "Phase 1: Transpose" :
    phase === "reverse" ? "Phase 2: Reverse Rows" : "Done";

  return (
    <div className="space-y-4">
      {/* Controls card */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>
          Rotate Image — 90° Clockwise In-Place (Transpose + Reverse)
        </h3>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setPlaying(!playing)}
            disabled={phase === "done"}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={doStep}
            disabled={phase === "done"}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}
          >
            → Step
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}
          >
            ↺ Reset
          </button>
          <input
            type="range" min="200" max="1500" step="100" value={speed}
            onChange={e => setSpeed(+e.target.value)}
            style={{ width:"80px", accentColor:"#4f8ef7" }}
          />
          <span
            className="px-2 py-0.5 rounded text-xs"
            style={{ background:`${phaseColor}18`, color:phaseColor, border:`1px solid ${phaseColor}44` }}
          >
            {phaseLabel}
          </span>
        </div>
      </div>

      {/* Matrix grid */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex flex-col gap-1 items-center">
          {matrix.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((val, c) => {
                const hl = isHighlighted(r, c);
                return (
                  <div
                    key={c}
                    className="flex items-center justify-center rounded-lg text-sm font-bold font-mono transition-all duration-300"
                    style={{
                      width: 52,
                      height: 52,
                      background: hl ? "rgba(79,142,247,0.2)" : "var(--bg-hover)",
                      border: hl ? "2px solid #4f8ef7" : "1px solid var(--border)",
                      color: hl ? "#4f8ef7" : "var(--text-primary)",
                      transform: hl ? "scale(1.12)" : "scale(1)",
                    }}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-3" style={{ color:"var(--text-muted)" }}>
          Current matrix state
        </p>
      </div>

      {/* Message bar */}
      <div
        className="rounded-lg px-4 py-2 text-xs font-mono"
        style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}
      >
        {msg}
      </div>

      {/* Legend */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color:"var(--text-secondary)" }}>Algorithm</p>
        <div className="text-xs font-mono space-y-1" style={{ color:"var(--text-muted)" }}>
          <div>Step 1 — Transpose: for i in 0..n, j in i+1..n → swap(matrix[i][j], matrix[j][i])</div>
          <div>Step 2 — Reverse Rows: for each row → reverse(matrix[i])</div>
        </div>
      </div>
    </div>
  );
}
