"use client";
import { useState } from "react";

// Small 2x4 grid for clarity
const SEATS = [
  [".","#",".","."],
  [".",".","#","."],
];
const M = SEATS.length, N = SEATS[0].length;

// Precompute valid row masks and DP
function buildDP() {
  const rowMask: number[] = SEATS.map(row =>
    row.reduce((acc, c, j) => c === "." ? acc | (1 << j) : acc, 0)
  );

  const validMasks: number[] = [];
  for (let mask = 0; mask < (1 << N); mask++) {
    if ((mask & (mask >> 1)) === 0) validMasks.push(mask); // no adjacent
  }

  // dp[row][mask] = max students
  const dp: number[][] = Array.from({ length: M }, () => new Array(1 << N).fill(-1));

  const steps: { row: number; mask: number; prev: number; val: number; label: string }[] = [];

  for (const mask of validMasks) {
    if ((mask & rowMask[0]) !== mask) continue;
    dp[0][mask] = countBits(mask);
    steps.push({ row: 0, mask, prev: -1, val: dp[0][mask], label: `Row 0, mask=${mask.toString(2).padStart(N,"0")} → ${dp[0][mask]}` });
  }

  for (let r = 1; r < M; r++) {
    for (const mask of validMasks) {
      if ((mask & rowMask[r]) !== mask) continue;
      for (const prev of validMasks) {
        if (dp[r - 1][prev] < 0) continue;
        if (mask & (prev << 1)) continue;
        if (mask & (prev >> 1)) continue;
        const val = dp[r - 1][prev] + countBits(mask);
        if (val > dp[r][mask]) {
          dp[r][mask] = val;
          steps.push({ row: r, mask, prev, val, label: `Row ${r}: mask=${mask.toString(2).padStart(N,"0")}, prev=${prev.toString(2).padStart(N,"0")} → ${val}` });
        }
      }
    }
  }

  const ans = Math.max(...dp[M - 1]);
  return { dp, steps, ans, rowMask };
}

function countBits(x: number) { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; }

const { steps, ans } = buildDP();

export default function MaximumStudentsExamViz() {
  const [idx, setIdx] = useState(0);
  const done = idx >= steps.length;
  const cur = steps[Math.min(idx, steps.length - 1)];

  const doStep = () => setIdx(p => Math.min(p + 1, steps.length));
  const reset = () => setIdx(0);

  // Build grid from current best mask per row
  const rowBestMask: number[] = Array(M).fill(0);
  steps.slice(0, idx + 1).forEach(s => {
    if (s.val >= (rowBestMask[s.row] ? countBits(rowBestMask[s.row]) : -1)) {
      rowBestMask[s.row] = s.mask;
    }
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Maximum Students — Bitmask DP</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Each row = bitmask of student placements. No adjacent (same row). No diagonal (adjacent rows). DP over row × mask.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{idx}/{steps.length}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Seat layout (#=broken, S=student placed)</div>
        <div className="space-y-2">
          {SEATS.map((row, r) => {
            const mask = cur?.row === r ? cur.mask : rowBestMask[r] ?? 0;
            return (
              <div key={r} className="flex gap-2 items-center">
                <span className="text-xs w-12" style={{ color: "var(--text-muted)" }}>Row {r}:</span>
                <div className="flex gap-1">
                  {row.map((c, j) => {
                    const studentHere = (mask >> j) & 1;
                    const broken = c === "#";
                    return (
                      <div key={j} className="w-10 h-10 rounded flex items-center justify-center text-sm font-bold"
                        style={{
                          background: broken ? "rgba(239,68,68,0.1)" : studentHere ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.04)",
                          border: `2px solid ${broken ? "rgba(239,68,68,0.4)" : studentHere ? "#22c55e" : "var(--border)"}`,
                          color: broken ? "#ef4444" : studentHere ? "#22c55e" : "var(--text-muted)",
                        }}>{broken ? "#" : studentHere ? "S" : "."}</div>
                    );
                  })}
                </div>
                <span className="text-xs font-mono" style={{ color: "#a855f7" }}>{mask.toString(2).padStart(N, "0")}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* DP step log */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>DP transitions (last 5)</div>
        <div className="space-y-1">
          {steps.slice(Math.max(0, idx - 4), idx + 1).map((s, i, arr) => (
            <div key={i} className="text-xs font-mono px-2 py-1 rounded" style={{ background: i === arr.length - 1 ? "rgba(79,142,247,0.1)" : "transparent", color: i === arr.length - 1 ? "#4f8ef7" : "var(--text-muted)" }}>
              {s.label}
            </div>
          ))}
          {idx === 0 && <div className="text-xs" style={{ color: "var(--text-muted)" }}>Press Step to begin</div>}
        </div>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-lg font-bold" style={{ color: "#22c55e" }}>Maximum Students = {ans}</div>
        </div>
      )}
    </div>
  );
}
