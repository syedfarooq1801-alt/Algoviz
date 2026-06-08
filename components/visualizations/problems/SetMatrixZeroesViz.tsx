"use client";
import { useState, useEffect, useRef } from "react";

const MATRIX_INIT = [[1,1,1],[1,0,1],[1,1,1]];
const ROWS = MATRIX_INIT.length;
const COLS = MATRIX_INIT[0].length;

type Phase = "idle" | "scan" | "zero" | "done";

function cloneMatrix(m: number[][]): number[][] {
  return m.map(r => [...r]);
}

export default function SetMatrixZeroesViz() {
  const [matrix, setMatrix] = useState<number[][]>(cloneMatrix(MATRIX_INIT));
  const [zeroPositions, setZeroPositions] = useState<[number,number][]>([]);
  const [highlighted, setHighlighted] = useState<[number,number][]>([]);
  const [scanPos, setScanPos] = useState<[number,number]|null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — Phase 1: scan for zeros, Phase 2: zero out rows and columns");

  const stateRef = useRef<{
    phase: Phase;
    matrix: number[][];
    scanR: number;
    scanC: number;
    zeroPositions: [number,number][];
    zeroIdx: number;
    zeroStep: "row" | "col";
    zeroCellIdx: number;
  }>({
    phase: "idle",
    matrix: cloneMatrix(MATRIX_INIT),
    scanR: 0, scanC: 0,
    zeroPositions: [],
    zeroIdx: 0,
    zeroStep: "row",
    zeroCellIdx: 0,
  });

  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = () => {
    stateRef.current = {
      phase: "scan",
      matrix: cloneMatrix(MATRIX_INIT),
      scanR: 0, scanC: 0,
      zeroPositions: [],
      zeroIdx: 0,
      zeroStep: "row",
      zeroCellIdx: 0,
    };
    setMatrix(cloneMatrix(MATRIX_INIT));
    setZeroPositions([]);
    setHighlighted([]);
    setScanPos(null);
    setPhase("scan");
    setPlaying(false);
    setMsg("Phase 1: Scanning matrix for zero positions...");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;

    if (st.phase === "scan") {
      const { scanR, scanC } = st;
      if (scanR >= ROWS) {
        // Done scanning, transition to zeroing phase
        const msg_ = st.zeroPositions.length === 0
          ? "No zeros found — matrix unchanged."
          : `Found zeros at: [${st.zeroPositions.map(([r,c])=>`(${r},${c})`).join(", ")}]. Starting Phase 2.`;
        if (st.zeroPositions.length === 0) {
          stateRef.current = { ...st, phase: "done" };
          setPhase("done");
          setPlaying(false);
          setScanPos(null);
        } else {
          stateRef.current = { ...st, phase: "zero", zeroIdx: 0, zeroStep: "row", zeroCellIdx: 0 };
          setPhase("zero");
        }
        setScanPos(null);
        setHighlighted([]);
        setMsg(msg_);
        return;
      }

      const val = st.matrix[scanR][scanC];
      setScanPos([scanR, scanC]);

      let newZeros = st.zeroPositions;
      if (val === 0) {
        newZeros = [...st.zeroPositions, [scanR, scanC] as [number,number]];
        stateRef.current = { ...st, scanC: scanC+1 >= COLS ? 0 : scanC+1, scanR: scanC+1 >= COLS ? scanR+1 : scanR, zeroPositions: newZeros };
        setZeroPositions([...newZeros]);
        setHighlighted([[scanR, scanC]]);
        setMsg(`Found zero at [${scanR}][${scanC}] — recording position`);
      } else {
        stateRef.current = { ...st, scanC: scanC+1 >= COLS ? 0 : scanC+1, scanR: scanC+1 >= COLS ? scanR+1 : scanR };
        setHighlighted([]);
        setMsg(`Scanning [${scanR}][${scanC}] = ${val} — not zero`);
      }
      return;
    }

    if (st.phase === "zero") {
      const { zeroIdx, zeroStep, zeroCellIdx, matrix: m } = st;
      if (zeroIdx >= st.zeroPositions.length) {
        stateRef.current = { ...st, phase: "done" };
        setPhase("done");
        setPlaying(false);
        setHighlighted([]);
        setMsg("Done! All rows and columns containing zeros have been zeroed out.");
        return;
      }

      const [zr, zc] = st.zeroPositions[zeroIdx];
      const newMatrix = cloneMatrix(m);

      if (zeroStep === "row") {
        if (zeroCellIdx >= COLS) {
          stateRef.current = { ...st, zeroStep: "col", zeroCellIdx: 0 };
          setMsg(`Row ${zr} zeroed — now zeroing column ${zc}`);
          return;
        }
        newMatrix[zr][zeroCellIdx] = 0;
        stateRef.current = { ...st, matrix: newMatrix, zeroCellIdx: zeroCellIdx + 1 };
        setMatrix(cloneMatrix(newMatrix));
        setHighlighted([[zr, zeroCellIdx]]);
        setMsg(`Zero row ${zr}: setting [${zr}][${zeroCellIdx}] = 0`);
        return;
      }

      if (zeroStep === "col") {
        if (zeroCellIdx >= ROWS) {
          stateRef.current = { ...st, matrix: newMatrix, zeroIdx: zeroIdx + 1, zeroStep: "row", zeroCellIdx: 0 };
          setHighlighted([]);
          setMsg(`Column ${zc} zeroed — moving to next zero position (${zeroIdx + 1}/${st.zeroPositions.length})`);
          return;
        }
        newMatrix[zeroCellIdx][zc] = 0;
        stateRef.current = { ...st, matrix: newMatrix, zeroCellIdx: zeroCellIdx + 1 };
        setMatrix(cloneMatrix(newMatrix));
        setHighlighted([[zeroCellIdx, zc]]);
        setMsg(`Zero col ${zc}: setting [${zeroCellIdx}][${zc}] = 0`);
        return;
      }
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const isScanPos = (r: number, c: number) => scanPos?.[0] === r && scanPos?.[1] === c;
  const isHighlighted = (r: number, c: number) => highlighted.some(([hr, hc]) => hr === r && hc === c);
  const isZeroSource = (r: number, c: number) => zeroPositions.some(([zr, zc]) => zr === r && zc === c);

  const phaseColor = phase === "scan" ? "#4f8ef7" : phase === "zero" ? "#ef4444" : "#22c55e";
  const phaseLabel = phase === "idle" ? "Ready" : phase === "scan" ? "Phase 1: Scan" : phase === "zero" ? "Phase 2: Zero Out" : "Done";

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>
          Set Matrix Zeroes — Zero Entire Row & Column for Each Zero Found
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
          <span className="px-2 py-0.5 rounded text-xs" style={{ background:`${phaseColor}18`, color:phaseColor, border:`1px solid ${phaseColor}44` }}>
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
                const sp = isScanPos(r, c);
                const zs = isZeroSource(r, c);
                let bg = "var(--bg-hover)";
                let border = "1px solid var(--border)";
                let color = "var(--text-primary)";
                let transform = "scale(1)";
                if (hl && phase === "zero") {
                  bg = "rgba(239,68,68,0.2)"; border = "2px solid #ef4444"; color = "#ef4444"; transform = "scale(1.1)";
                } else if (sp) {
                  bg = "rgba(79,142,247,0.2)"; border = "2px solid #4f8ef7"; color = "#4f8ef7"; transform = "scale(1.1)";
                } else if (zs) {
                  bg = "rgba(239,68,68,0.15)"; border = "1px solid rgba(239,68,68,0.5)"; color = "#ef4444";
                } else if (val === 0) {
                  bg = "rgba(239,68,68,0.08)"; border = "1px solid rgba(239,68,68,0.3)"; color = "#ef4444";
                }
                return (
                  <div
                    key={c}
                    className="flex items-center justify-center rounded-lg text-sm font-bold font-mono transition-all duration-300"
                    style={{ width:56, height:56, background:bg, border, color, transform }}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center mt-3 text-xs" style={{ color:"var(--text-muted)" }}>
          <span><span style={{ color:"#4f8ef7" }}>■</span> Scanning</span>
          <span><span style={{ color:"#ef4444" }}>■</span> Zero source / being zeroed</span>
        </div>
      </div>

      {/* Found zeros */}
      {zeroPositions.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color:"var(--text-secondary)" }}>Recorded Zero Positions</p>
          <div className="flex gap-2 flex-wrap">
            {zeroPositions.map(([r,c], i) => (
              <span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background:"rgba(239,68,68,0.1)", color:"#ef4444", border:"1px solid rgba(239,68,68,0.3)" }}>
                [{r}][{c}]
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      <div
        className="rounded-lg px-4 py-2 text-xs font-mono"
        style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}
      >
        {msg}
      </div>
    </div>
  );
}
