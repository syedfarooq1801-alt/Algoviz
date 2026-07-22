"use client";
import { useEffect, useState } from "react";

const VALS = [1, 2, 3, 4, 5];

export default function PatternVizLinkedList() {
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [currIdx, setCurrIdx] = useState<number | null>(0);
  const [reversedUpTo, setReversedUpTo] = useState(-1);
  const [msg, setMsg] = useState("prev=null, curr=head(1)");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const frames: { prev: number | null; curr: number | null; rev: number; msg: string; done: boolean }[] = [
      { prev: null, curr: 0, rev: -1, msg: "Initial: prev=null, curr=1", done: false },
    ];
    let p: number | null = null, c: number | null = 0;
    while (c !== null) {
      const nxt: number | null = c + 1 < VALS.length ? c + 1 : null;
      frames.push({ prev: p, curr: c, rev: p ?? -1, msg: `Save next(${nxt !== null ? VALS[nxt] : "null"}), flip ${VALS[c]}→prev`, done: false });
      const newP = c;
      p = newP;
      c = nxt;
      frames.push({ prev: p, curr: c, rev: p, msg: `Advance: prev=${VALS[p]}, curr=${c !== null ? VALS[c] : "null"}`, done: c === null });
    }
    frames.push({ prev: p, curr: null, rev: VALS.length - 1, msg: `Done! New head = ${VALS[VALS.length - 1]}`, done: true });
    for (let i = 0; i < 3; i++) frames.push(frames[frames.length - 1]);
    // reset
    frames.push({ prev: null, curr: 0, rev: -1, msg: "Initial: prev=null, curr=1", done: false });

    let fi = 0;
    const id = setInterval(() => {
      const f = frames[fi % frames.length];
      setPrevIdx(f.prev); setCurrIdx(f.curr); setReversedUpTo(f.rev); setMsg(f.msg); setDone(f.done);
      fi++;
      if (fi >= frames.length) fi = 0;
    }, 750);
    return () => clearInterval(id);
  }, []);

  const W = 340, nodeW = 44, nodeH = 36, gap = 24, startX = 18, y = 60;

  return (
    <div className="space-y-3">
      <svg width={W} height={110} style={{ overflow: "visible", width: "100%", maxWidth: W }} role="img" aria-label="Linked list pattern diagram">
        {/* Forward arrows (not yet reversed) */}
        {VALS.map((_, i) => {
          if (i >= VALS.length - 1) return null;
          const x1 = startX + i * (nodeW + gap) + nodeW;
          const x2 = startX + (i + 1) * (nodeW + gap);
          const isReversed = i <= reversedUpTo;
          return (
            <g key={`arrow-${i}`}>
              <defs>
                <marker id={`ah-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={isReversed ? "#22c55e" : "#4f8ef7"} />
                </marker>
              </defs>
              <line
                x1={isReversed ? x2 + nodeW : x1} y1={y + nodeH / 2}
                x2={isReversed ? x1 : x2} y2={y + nodeH / 2}
                stroke={isReversed ? "#22c55e" : "#4f8ef7"}
                strokeWidth="1.5"
                strokeDasharray={isReversed ? "none" : "none"}
                markerEnd={`url(#ah-${i})`}
                style={{ transition: "all 0.4s ease" }}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {VALS.map((v, i) => {
          const x = startX + i * (nodeW + gap);
          const isPrev = prevIdx === i;
          const isCurr = currIdx === i;
          const isRev = i <= reversedUpTo;
          return (
            <g key={i}>
              <rect x={x} y={y} width={nodeW} height={nodeH} rx="8"
                fill={isPrev ? "rgba(34,197,94,0.2)" : isCurr ? "rgba(79,142,247,0.2)" : isRev ? "rgba(34,197,94,0.08)" : "var(--bg-hover)"}
                stroke={isPrev ? "#22c55e" : isCurr ? "#4f8ef7" : isRev ? "rgba(34,197,94,0.4)" : "var(--border)"}
                strokeWidth={isPrev || isCurr ? 2 : 1}
                style={{ transition: "all 0.3s ease" }}
              />
              <text x={x + nodeW / 2} y={y + nodeH / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                fill={isPrev ? "#22c55e" : isCurr ? "#4f8ef7" : "var(--text-primary)"}
                fontSize="13" fontWeight="700" fontFamily="monospace">
                {v}
              </text>
              {isPrev && <text x={x + nodeW / 2} y={y + nodeH + 13} textAnchor="middle" fill="#22c55e" fontSize="10">prev</text>}
              {isCurr && <text x={x + nodeW / 2} y={y + nodeH + 13} textAnchor="middle" fill="#4f8ef7" fontSize="10">curr</text>}
            </g>
          );
        })}

        {/* null at right */}
        <text x={startX + VALS.length * (nodeW + gap) - gap + 4} y={y + nodeH / 2 + 1} fill="var(--text-muted)" fontSize="11" dominantBaseline="middle">null</text>
      </svg>

      <div className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
        style={{
          background: done ? "rgba(34,197,94,0.1)" : "rgba(79,142,247,0.07)",
          color: done ? "#22c55e" : "#4f8ef7",
          border: `1px solid ${done ? "rgba(34,197,94,0.25)" : "rgba(79,142,247,0.18)"}`,
        }}>
        {msg}
      </div>
    </div>
  );
}
