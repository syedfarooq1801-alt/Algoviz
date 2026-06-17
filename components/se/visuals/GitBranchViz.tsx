"use client";
import { useState } from "react";

// main: C1-C2-C3 ; feature branched at C2: F1-F2
export default function GitBranchViz() {
  const [mode, setMode] = useState<"branch" | "merge" | "rebase">("branch");

  const main = [
    { x: 60, label: "C1" }, { x: 130, label: "C2" }, { x: 200, label: "C3" },
  ];
  const feat = [{ x: 200, label: "F1" }, { x: 270, label: "F2" }];

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {(["branch", "merge", "rebase"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className="px-3 py-1.5 rounded-md text-xs font-medium capitalize"
            style={{ background: mode === m ? "var(--accent-soft)" : "var(--bg-hover)", color: mode === m ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${mode === m ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>
            {m === "branch" ? "Diverged" : m}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 420 160" width="100%" style={{ maxWidth: 460 }}>
        {/* main line */}
        <text x="20" y="64" fontSize="11" fill="var(--accent)" fontWeight="600">main</text>
        {/* merge mode adds a merge commit M at end of main */}
        {(() => {
          const mainY = 60;
          const mainNodes = mode === "merge" ? [...main, { x: 340, label: "M" }] : main;
          const featY = mode === "rebase" ? 60 : 110;
          // rebase: feature commits replay onto C3 along main line
          const featNodes = mode === "rebase"
            ? [{ x: 270, label: "F1'" }, { x: 340, label: "F2'" }]
            : feat;
          return (
            <>
              {/* edges main */}
              {mainNodes.map((c, i) => i > 0 && <line key={"me" + i} x1={mainNodes[i - 1].x} y1={mainY} x2={c.x} y2={mainY} stroke="var(--accent)" strokeWidth="2" />)}
              {/* branch connector */}
              {mode !== "rebase" && <line x1={130} y1={mainY} x2={feat[0].x} y2={110} stroke="var(--accent-purple)" strokeWidth="2" />}
              {/* feature edges */}
              {featNodes.map((c, i) => {
                const prevX = i === 0 ? (mode === "rebase" ? 200 : 130) : featNodes[i - 1].x;
                const prevY = i === 0 ? (mode === "rebase" ? 60 : 110) : featY;
                return <line key={"fe" + i} x1={prevX} y1={prevY} x2={c.x} y2={featY} stroke="var(--accent-purple)" strokeWidth="2" />;
              })}
              {/* merge connector into M */}
              {mode === "merge" && <line x1={feat[feat.length - 1].x} y1={110} x2={340} y2={mainY} stroke="var(--accent-green)" strokeWidth="2" />}
              {/* nodes */}
              {mainNodes.map((c) => (
                <g key={"mn" + c.label}>
                  <circle cx={c.x} cy={mainY} r="11" fill={c.label === "M" ? "var(--accent-green)" : "var(--accent)"} />
                  <text x={c.x} y={mainY + 4} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="600">{c.label}</text>
                </g>
              ))}
              {mode !== "rebase" && <text x="20" y="114" fontSize="11" fill="var(--accent-purple)" fontWeight="600">feature</text>}
              {featNodes.map((c) => (
                <g key={"fn" + c.label}>
                  <circle cx={c.x} cy={featY} r="11" fill="var(--accent-purple)" />
                  <text x={c.x} y={featY + 4} textAnchor="middle" fontSize="8" fill="#fff" fontWeight="600">{c.label}</text>
                </g>
              ))}
            </>
          );
        })()}
      </svg>

      <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
        {mode === "branch" && "feature diverged from main at C2. Both have new commits — history has two lines."}
        {mode === "merge" && "Merge creates a new commit M that ties both histories together. Non-destructive, but history shows the fork."}
        {mode === "rebase" && "Rebase replays F1, F2 on top of C3 as new commits (F1', F2'). Linear history — but rewrites commit hashes."}
      </p>
    </div>
  );
}
