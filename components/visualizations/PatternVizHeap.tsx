"use client";
import { useEffect, useState } from "react";

// Min-heap insert demo
const INSERT_SEQ = [5, 3, 8, 1, 9, 2];

function siftUp(heap: number[], i: number): number[] {
  const h = [...heap];
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    if (h[parent] > h[i]) { [h[parent], h[i]] = [h[i], h[parent]]; i = parent; }
    else break;
  }
  return h;
}

const heapPositions: { x: number; y: number }[] = [
  { x: 160, y: 20 },
  { x: 90,  y: 80 },  { x: 230, y: 80 },
  { x: 50,  y: 140 }, { x: 130, y: 140 }, { x: 195, y: 140 }, { x: 275, y: 140 },
];
const heapEdges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

export default function PatternVizHeap() {
  const [heap, setHeap] = useState<number[]>([]);
  const [active, setActive] = useState(-1);
  const [swapping, setSwapping] = useState<[number,number] | null>(null);
  const [msg, setMsg] = useState("Min-Heap insert animation");

  useEffect(() => {
    const frames: { heap: number[]; active: number; swap: [number,number] | null; msg: string }[] = [];
    frames.push({ heap: [], active: -1, swap: null, msg: "Empty heap. Start inserting..." });

    let h: number[] = [];
    for (const val of INSERT_SEQ) {
      h = [...h, val];
      frames.push({ heap: [...h], active: h.length - 1, swap: null, msg: `Insert ${val} at index ${h.length - 1}` });

      // sift up
      let i = h.length - 1;
      while (i > 0) {
        const p = Math.floor((i - 1) / 2);
        if (h[p] > h[i]) {
          frames.push({ heap: [...h], active: i, swap: [p, i], msg: `Sift up: ${h[i]} < parent ${h[p]} → SWAP` });
          [h[p], h[i]] = [h[i], h[p]];
          i = p;
          frames.push({ heap: [...h], active: i, swap: null, msg: `After swap. Min at root: ${h[0]}` });
        } else break;
      }
    }
    // Extract min demo
    for (let k = 0; k < 3 && h.length > 0; k++) {
      frames.push({ heap: [...h], active: 0, swap: null, msg: `Extract min: ${h[0]} (root)` });
      h[0] = h[h.length - 1];
      h.pop();
      frames.push({ heap: [...h], active: 0, swap: null, msg: `Move last to root, sift down...` });
      let i = 0;
      while (true) {
        const l = 2*i+1, r = 2*i+2;
        let smallest = i;
        if (l < h.length && h[l] < h[smallest]) smallest = l;
        if (r < h.length && h[r] < h[smallest]) smallest = r;
        if (smallest !== i) {
          frames.push({ heap: [...h], active: i, swap: [i, smallest], msg: `Sift down: ${h[i]} > child ${h[smallest]} → SWAP` });
          [h[i], h[smallest]] = [h[smallest], h[i]];
          i = smallest;
        } else break;
      }
      frames.push({ heap: [...h], active: -1, swap: null, msg: `Min extracted! New min: ${h[0] ?? "empty"}` });
    }
    for (let i = 0; i < 2; i++) frames.push(frames[frames.length-1]);
    frames.push({ heap: [], active: -1, swap: null, msg: "Empty heap. Start inserting..." });

    let fi = 0;
    const id = setInterval(() => {
      const f = frames[fi % frames.length];
      setHeap(f.heap); setActive(f.active); setSwapping(f.swap); setMsg(f.msg);
      fi++;
      if (fi >= frames.length) fi = 0;
    }, 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      <svg width={320} height={180} style={{ width: "100%", maxWidth: 320, overflow: "visible" }}>
        {heapEdges.map(([p, c]) => {
          if (p >= heap.length || c >= heap.length) return null;
          return (
            <line key={`${p}-${c}`}
              x1={heapPositions[p].x} y1={heapPositions[p].y}
              x2={heapPositions[c].x} y2={heapPositions[c].y}
              stroke={swapping && (swapping.includes(p) && swapping.includes(c)) ? "#f97316" : "var(--border)"}
              strokeWidth={1.5} style={{ transition: "stroke 0.3s" }}
            />
          );
        })}
        {heap.map((v, i) => {
          const pos = heapPositions[i];
          if (!pos) return null;
          const isActive = active === i;
          const isSwap = swapping && swapping.includes(i);
          return (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r={isActive || isSwap ? 20 : 17}
                fill={isSwap ? "rgba(249,115,22,0.3)" : isActive ? "rgba(239,68,68,0.2)" : i === 0 ? "rgba(34,197,94,0.2)" : "var(--bg-hover)"}
                stroke={isSwap ? "#f97316" : isActive ? "#ef4444" : i === 0 ? "#22c55e" : "var(--border)"}
                strokeWidth={isActive || isSwap ? 2.5 : 1.5}
                style={{ transition: "all 0.35s ease" }}
              />
              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={isSwap ? "#f97316" : isActive ? "#ef4444" : i === 0 ? "#22c55e" : "var(--text-primary)"}
                fontSize="13" fontWeight="700" fontFamily="monospace">
                {v}
              </text>
              {i === 0 && heap.length > 0 && (
                <text x={pos.x} y={pos.y - 25} textAnchor="middle" fill="#22c55e" fontSize="9">MIN</text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
        style={{
          background: swapping ? "rgba(249,115,22,0.08)" : "rgba(239,68,68,0.07)",
          color: swapping ? "#f97316" : "#ef4444",
          border: `1px solid ${swapping ? "rgba(249,115,22,0.2)" : "rgba(239,68,68,0.18)"}`,
        }}>
        {msg}
      </div>

      <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Array: [{heap.join(", ")}] | Min always at root
      </div>
    </div>
  );
}
