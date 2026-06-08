"use client";
import { useState, useEffect, useRef } from "react";

const MATRIX_INIT = [[1,2,3,4],[5,6,7,8],[9,10,11,12]];
const ROWS = MATRIX_INIT.length;
const COLS = MATRIX_INIT[0].length;

type Dir = "right" | "down" | "left" | "up";

function dirColor(d: Dir | "done") {
  if (d === "right") return "#4f8ef7";
  if (d === "down") return "#f97316";
  if (d === "left") return "#a855f7";
  if (d === "up") return "#22c55e";
  return "#22c55e";
}

export default function SpiralMatrixViz() {
  const [order, setOrder] = useState<number[]>([]);
  const [readSet, setReadSet] = useState<Set<string>>(new Set());
  const [currentCells, setCurrentCells] = useState<[number,number][]>([]);
  const [boundaries, setBoundaries] = useState({ top:0, bottom:ROWS-1, left:0, right:COLS-1 });
  const [curDir, setCurDir] = useState<Dir>("right");
  const [phase, setPhase] = useState<"idle"|"running"|"done">("idle");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — read spiral: right → down → left → up → shrink boundaries");

  const stateRef = useRef<{
    order: number[];
    readSet: Set<string>;
    top: number; bottom: number; left: number; right: number;
    dir: Dir;
    done: boolean;
  }>({
    order: [],
    readSet: new Set(),
    top: 0, bottom: ROWS-1, left: 0, right: COLS-1,
    dir: "right",
    done: false,
  });

  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = () => {
    stateRef.current = {
      order: [],
      readSet: new Set(),
      top: 0, bottom: ROWS-1, left: 0, right: COLS-1,
      dir: "right",
      done: false,
    };
    setOrder([]);
    setReadSet(new Set());
    setCurrentCells([]);
    setBoundaries({ top:0, bottom:ROWS-1, left:0, right:COLS-1 });
    setCurDir("right");
    setPhase("idle");
    setPlaying(false);
    setMsg("Press Play — read spiral: right → down → left → up → shrink boundaries");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.done) return;

    const { top, bottom, left, right, dir } = st;
    if (top > bottom || left > right) {
      stateRef.current = { ...st, done: true };
      setPhase("done");
      setPlaying(false);
      setCurrentCells([]);
      setMsg("Done! Full spiral order collected.");
      return;
    }

    const cells: [number,number][] = [];
    const newOrder = [...st.order];
    const newReadSet = new Set(st.readSet);

    let newTop = top, newBottom = bottom, newLeft = left, newRight = right;
    let nextDir: Dir = dir;

    if (dir === "right") {
      for (let c = left; c <= right; c++) {
        cells.push([top, c]);
        newOrder.push(MATRIX_INIT[top][c]);
        newReadSet.add(`${top},${c}`);
      }
      newTop = top + 1;
      nextDir = "down";
    } else if (dir === "down") {
      for (let r = top; r <= bottom; r++) {
        cells.push([r, right]);
        newOrder.push(MATRIX_INIT[r][right]);
        newReadSet.add(`${r},${right}`);
      }
      newRight = right - 1;
      nextDir = "left";
    } else if (dir === "left") {
      for (let c = right; c >= left; c--) {
        cells.push([bottom, c]);
        newOrder.push(MATRIX_INIT[bottom][c]);
        newReadSet.add(`${bottom},${c}`);
      }
      newBottom = bottom - 1;
      nextDir = "up";
    } else {
      for (let r = bottom; r >= top; r--) {
        cells.push([r, left]);
        newOrder.push(MATRIX_INIT[r][left]);
        newReadSet.add(`${r},${left}`);
      }
      newLeft = left + 1;
      nextDir = "right";
    }

    stateRef.current = {
      ...st,
      order: newOrder,
      readSet: newReadSet,
      top: newTop, bottom: newBottom, left: newLeft, right: newRight,
      dir: nextDir,
    };

    setOrder([...newOrder]);
    setReadSet(new Set(newReadSet));
    setCurrentCells(cells);
    setBoundaries({ top: newTop, bottom: newBottom, left: newLeft, right: newRight });
    setCurDir(nextDir);
    setPhase("running");
    setMsg(`Direction: ${dir.toUpperCase()} — read [${cells.map(([r,c])=>MATRIX_INIT[r][c]).join(", ")}] → order so far: [${newOrder.join(",")}]`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const isCurrent = (r: number, c: number) =>
    currentCells.some(([cr, cc]) => cr === r && cc === c);
  const isRead = (r: number, c: number) => readSet.has(`${r},${c}`);

  const dirLabel = phase === "done" ? "done" : curDir;
  const dc = dirColor(dirLabel as Dir | "done");

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>
          Spiral Matrix — Read 3×4 Matrix in Spiral Order
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
          <span className="px-2 py-0.5 rounded text-xs" style={{ background:`${dc}18`, color:dc, border:`1px solid ${dc}44` }}>
            {phase === "idle" ? "Ready" : phase === "done" ? "Done" : `→ ${curDir.toUpperCase()}`}
          </span>
        </div>
      </div>

      {/* Matrix + boundary overlay */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex flex-col gap-1 items-center">
          {MATRIX_INIT.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((val, c) => {
                const cur = isCurrent(r, c);
                const read = isRead(r, c) && !cur;
                const bg = cur ? "rgba(79,142,247,0.2)" : read ? "rgba(34,197,94,0.15)" : "var(--bg-hover)";
                const border = cur ? "2px solid #4f8ef7" : read ? "1px solid rgba(34,197,94,0.5)" : "1px solid var(--border)";
                const color = cur ? "#4f8ef7" : read ? "#22c55e" : "var(--text-primary)";
                return (
                  <div
                    key={c}
                    className="flex items-center justify-center rounded-lg text-sm font-bold font-mono transition-all duration-300"
                    style={{ width:52, height:52, background:bg, border, color, transform:cur?"scale(1.1)":"scale(1)" }}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center mt-3 text-xs" style={{ color:"var(--text-muted)" }}>
          <span><span style={{ color:"#4f8ef7" }}>■</span> Current sweep</span>
          <span><span style={{ color:"#22c55e" }}>■</span> Already read</span>
          <span><span style={{ color:"var(--text-muted)" }}>■</span> Unread</span>
        </div>
        {phase !== "idle" && (
          <div className="text-center text-xs mt-2" style={{ color:"var(--text-muted)" }}>
            Boundaries: top={boundaries.top} bottom={boundaries.bottom} left={boundaries.left} right={boundaries.right}
          </div>
        )}
      </div>

      {/* Order array */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color:"var(--text-secondary)" }}>
          Spiral Order — {order.length}/{ROWS*COLS} elements read
        </p>
        <div className="flex flex-wrap gap-1">
          {order.map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded text-xs font-bold font-mono"
              style={{ width:36, height:36, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", color:"#22c55e" }}
            >
              {v}
            </div>
          ))}
          {order.length === 0 && (
            <span className="text-xs" style={{ color:"var(--text-muted)" }}>[ ]</span>
          )}
        </div>
        {order.length === ROWS*COLS && (
          <p className="text-xs mt-2" style={{ color:"#22c55e" }}>
            Result: [{order.join(",")}]
          </p>
        )}
      </div>

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
