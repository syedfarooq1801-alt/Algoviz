"use client";
import { useState, useMemo } from "react";

const REF = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
type Algo = "FIFO" | "LRU";

function simulate(algo: Algo, capacity: number) {
  const frames: number[] = [];
  const steps: { ref: number; frames: number[]; fault: boolean }[] = [];
  const lastUsed: Record<number, number> = {};
  let fifoPtr = 0;
  REF.forEach((r, t) => {
    let fault = false;
    if (!frames.includes(r)) {
      fault = true;
      if (frames.length < capacity) frames.push(r);
      else if (algo === "FIFO") { frames[fifoPtr] = r; fifoPtr = (fifoPtr + 1) % capacity; }
      else { // LRU evict least-recently-used
        let lru = frames[0];
        for (const f of frames) if ((lastUsed[f] ?? -1) < (lastUsed[lru] ?? -1)) lru = f;
        frames[frames.indexOf(lru)] = r;
      }
    }
    lastUsed[r] = t;
    steps.push({ ref: r, frames: [...frames], fault });
  });
  return steps;
}

export default function PageReplacementViz() {
  const [algo, setAlgo] = useState<Algo>("LRU");
  const [cap, setCap] = useState(3);
  const steps = useMemo(() => simulate(algo, cap), [algo, cap]);
  const faults = steps.filter((s) => s.fault).length;

  return (
    <div>
      <div className="flex gap-2 mb-3 items-center flex-wrap">
        {(["FIFO", "LRU"] as Algo[]).map((a) => (
          <button key={a} onClick={() => setAlgo(a)} className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ background: algo === a ? "var(--accent-soft)" : "var(--bg-hover)", color: algo === a ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${algo === a ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>{a}</button>
        ))}
        <label className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>Frames
          <select value={cap} onChange={(e) => setCap(+e.target.value)} className="ml-1 px-2 py-1 rounded" style={{ background: "var(--bg-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            {[3, 4].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <span className="text-xs ml-auto font-semibold" style={{ color: "var(--accent-red)" }}>{faults} page faults</span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-0.5" style={{ minWidth: 360 }}>
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center" style={{ minWidth: 26 }}>
              <div className="text-xs font-mono font-bold mb-1" style={{ color: "var(--text-primary)" }}>{s.ref}</div>
              {Array.from({ length: cap }, (_, f) => {
                const v = s.frames[f];
                const justLoaded = s.fault && v === s.ref;
                return (
                  <div key={f} className="text-xs font-mono w-6 h-6 flex items-center justify-center mb-0.5 rounded"
                    style={{ background: justLoaded ? "rgba(240,82,75,0.18)" : v !== undefined ? "var(--bg-hover)" : "transparent", color: justLoaded ? "var(--accent-red)" : "var(--text-secondary)", border: `1px solid ${v !== undefined ? "var(--border)" : "var(--border-subtle)"}` }}>
                    {v ?? ""}
                  </div>
                );
              })}
              <div className="text-xs" style={{ color: s.fault ? "var(--accent-red)" : "var(--accent-green)" }}>{s.fault ? "✗" : "✓"}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Reference string across the top. ✗ = page fault (red = page loaded into a frame). LRU evicts the least-recently-used page; FIFO evicts the oldest.</p>
    </div>
  );
}
