"use client";
import { useEffect, useState } from "react";

const NUMS = [2, 3, 1, 4, 2];
const PREFIX = [0, 2, 5, 6, 10, 12]; // prefix[i] = sum of first i elements

type Phase = "build" | "query";

interface Frame {
  phase: Phase;
  buildIdx: number;  // how many prefix entries filled so far
  queryL?: number;
  queryR?: number;
  msg: string;
}

function buildFrames(): Frame[] {
  const frames: Frame[] = [];

  // Phase 1: build
  frames.push({ phase: "build", buildIdx: 0, msg: "prefix[0] = 0 (empty sum sentinel)" });
  for (let i = 0; i < NUMS.length; i++) {
    frames.push({
      phase: "build",
      buildIdx: i + 1,
      msg: `prefix[${i + 1}] = prefix[${i}] + nums[${i}] = ${PREFIX[i]} + ${NUMS[i]} = ${PREFIX[i + 1]}`,
    });
  }

  // Phase 2: range sum queries
  const queries: [number, number][] = [[1, 3], [0, 4], [2, 4]];
  for (const [l, r] of queries) {
    const sum = PREFIX[r + 1] - PREFIX[l];
    frames.push({
      phase: "query",
      buildIdx: PREFIX.length,
      queryL: l,
      queryR: r,
      msg: `sum(${l}..${r}) = prefix[${r + 1}] − prefix[${l}] = ${PREFIX[r + 1]} − ${PREFIX[l]} = ${sum}`,
    });
  }

  return frames;
}

const FRAMES = buildFrames();

export default function PatternVizPrefixSum() {
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrameIdx((p) => (p + 1) % (FRAMES.length + 1));
    }, 900);
    return () => clearInterval(id);
  }, []);

  const f = FRAMES[Math.min(frameIdx, FRAMES.length - 1)];

  return (
    <div className="space-y-4">
      {/* Original array */}
      <div>
        <div className="text-xs mb-1.5 font-mono" style={{ color: "var(--text-muted)" }}>
          nums[ ]
        </div>
        <div className="flex gap-1.5 justify-center">
          {NUMS.map((n, i) => {
            const inQuery = f.phase === "query" && f.queryL !== undefined && i >= f.queryL && i <= f.queryR!;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className="transition-all duration-300 w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold font-mono"
                  style={{
                    background: inQuery ? "rgba(34,197,94,0.2)" : "var(--bg-hover)",
                    border: inQuery ? "2px solid #22c55e" : "2px solid var(--border)",
                    color: inQuery ? "#22c55e" : "var(--text-primary)",
                    transform: inQuery ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {n}
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>[{i}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prefix array */}
      <div>
        <div className="text-xs mb-1.5 font-mono" style={{ color: "var(--text-muted)" }}>
          prefix[ ] — running cumulative sum
        </div>
        <div className="flex gap-1.5 justify-center">
          {PREFIX.map((p, i) => {
            const filled = i < f.buildIdx;
            const justFilled = i === f.buildIdx - 1 && f.phase === "build";
            const isQueryL = f.phase === "query" && i === f.queryL;
            const isQueryR1 = f.phase === "query" && i === f.queryR! + 1;

            let bg = "var(--bg-hover)";
            let border = "2px solid var(--border)";
            let color = "var(--text-muted)";
            let scale = "scale(1)";

            if (filled) {
              bg = "rgba(6,182,212,0.12)";
              border = "2px solid rgba(6,182,212,0.4)";
              color = "#06b6d4";
            }
            if (justFilled) {
              bg = "rgba(6,182,212,0.28)";
              border = "2px solid #06b6d4";
              scale = "scale(1.12) translateY(-4px)";
            }
            if (isQueryL) {
              bg = "rgba(168,85,247,0.2)";
              border = "2px solid #a855f7";
              color = "#a855f7";
              scale = "scale(1.1)";
            }
            if (isQueryR1) {
              bg = "rgba(249,115,22,0.2)";
              border = "2px solid #f97316";
              color = "#f97316";
              scale = "scale(1.1)";
            }

            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className="transition-all duration-350 w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold font-mono"
                  style={{ background: bg, border, color, transform: scale }}
                >
                  {filled ? p : "·"}
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>[{i}]</span>
                {isQueryL && (
                  <span style={{ color: "#a855f7", fontSize: "9px", fontWeight: 600 }}>−</span>
                )}
                {isQueryR1 && (
                  <span style={{ color: "#f97316", fontSize: "9px", fontWeight: 600 }}>use</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend for query phase */}
      {f.phase === "query" && (
        <div className="flex gap-3 justify-center flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)" }}>
            prefix[r+1]
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>−</span>
          <span className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>
            prefix[l]
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>=</span>
          <span className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
            range sum O(1)
          </span>
        </div>
      )}

      {/* Message */}
      <div
        className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
        style={{
          background: f.phase === "build" ? "rgba(6,182,212,0.07)" : "rgba(34,197,94,0.07)",
          color: f.phase === "build" ? "#06b6d4" : "#22c55e",
          border: f.phase === "build" ? "1px solid rgba(6,182,212,0.2)" : "1px solid rgba(34,197,94,0.2)",
        }}
      >
        {f.msg}
      </div>

      <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        {f.phase === "build" ? "Phase 1: Build prefix array" : "Phase 2: O(1) range queries"}
      </div>
    </div>
  );
}
