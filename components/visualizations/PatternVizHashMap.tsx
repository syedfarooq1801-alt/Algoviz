"use client";
import { useEffect, useState } from "react";

const DEMO = [2, 7, 11, 15];
const TARGET = 9;

export default function PatternVizHashMap() {
  const [step, setStep] = useState(0);
  const [map, setMap] = useState<Record<number, number>>({});
  const [activeIdx, setActiveIdx] = useState(-1);
  const [found, setFound] = useState<[number,number] | null>(null);

  const steps = (() => {
    const s: { map: Record<number,number>; idx: number; found: [number,number] | null }[] = [];
    const m: Record<number,number> = {};
    for (let i = 0; i < DEMO.length; i++) {
      const comp = TARGET - DEMO[i];
      if (m[comp] !== undefined) { s.push({ map: { ...m }, idx: i, found: [m[comp], i] }); break; }
      s.push({ map: { ...m }, idx: i, found: null });
      m[DEMO[i]] = i;
    }
    return s;
  })();

  useEffect(() => {
    const id = setInterval(() => {
      setStep((p) => {
        const next = (p + 1) % (steps.length + 2);
        if (next === 0) { setMap({}); setActiveIdx(-1); setFound(null); return 0; }
        const s = steps[Math.min(next - 1, steps.length - 1)];
        setMap(s.map); setActiveIdx(s.idx); setFound(s.found);
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end justify-center flex-wrap">
        {DEMO.map((n, i) => {
          const isActive = i === activeIdx;
          const isFound = found && (i === found[0] || i === found[1]);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="transition-all duration-400 w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
                style={{
                  background: isFound ? "rgba(34,197,94,0.25)" : isActive ? "rgba(79,142,247,0.25)" : "var(--bg-hover)",
                  border: isFound ? "2px solid #22c55e" : isActive ? "2px solid #4f8ef7" : "2px solid var(--border)",
                  color: isFound ? "#22c55e" : isActive ? "#4f8ef7" : "var(--text-primary)",
                  transform: isActive ? "translateY(-6px) scale(1.1)" : "scale(1)",
                  boxShadow: isFound ? "0 0 16px rgba(34,197,94,0.4)" : isActive ? "0 8px 20px rgba(79,142,247,0.35)" : "none",
                }}>
                {n}
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>[{i}]</span>
              {isActive && <span style={{ color: "#f97316", fontSize: "10px" }}>need {TARGET - n}</span>}
            </div>
          );
        })}
      </div>

      <div className="rounded-lg p-3" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
        <div className="text-xs mb-2 font-mono" style={{ color: "var(--text-muted)" }}>HashMap: val → index</div>
        <div className="flex gap-2 flex-wrap min-h-7">
          {Object.entries(map).map(([k, v]) => (
            <span key={k} className="px-2 py-0.5 rounded text-xs font-mono"
              style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)", animation: "fadeInUp 0.2s ease-out" }}>
              {k}→{v}
            </span>
          ))}
          {Object.keys(map).length === 0 && <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{ }</span>}
        </div>
      </div>

      {found && (
        <div className="text-center text-xs font-semibold py-1.5 rounded-lg"
          style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}>
          ✓ {DEMO[found[0]]} + {DEMO[found[1]]} = {TARGET} → [{found[0]}, {found[1]}]
        </div>
      )}
    </div>
  );
}
