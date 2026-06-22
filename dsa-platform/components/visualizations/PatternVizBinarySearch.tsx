"use client";
import { useEffect, useState } from "react";

const ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const TARGET = 23;

export default function PatternVizBinarySearch() {
  const [l, setL] = useState(0);
  const [r, setR] = useState(ARR.length - 1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const frames: { l: number; r: number; mid: number; found: boolean; msg: string }[] = [];
    let fl = 0, fr = ARR.length - 1;
    frames.push({ l: fl, r: fr, mid: -1, found: false, msg: "Search entire array" });
    while (fl <= fr) {
      const fm = fl + Math.floor((fr - fl) / 2);
      if (ARR[fm] === TARGET) {
        frames.push({ l: fl, r: fr, mid: fm, found: true, msg: `mid=${fm}, val=${ARR[fm]} = ${TARGET} ✓ FOUND!` });
        break;
      } else if (ARR[fm] < TARGET) {
        frames.push({ l: fl, r: fr, mid: fm, found: false, msg: `${ARR[fm]} < ${TARGET} → eliminate left half` });
        fl = fm + 1;
      } else {
        frames.push({ l: fl, r: fr, mid: fm, found: false, msg: `${ARR[fm]} > ${TARGET} → eliminate right half` });
        fr = fm - 1;
      }
    }
    // pause on last frame then restart
    const last = frames[frames.length - 1];
    for (let i = 0; i < 3; i++) frames.push(last);
    frames.push({ l: 0, r: ARR.length - 1, mid: -1, found: false, msg: "Search entire array" });

    let fi = 0;
    const id = setInterval(() => {
      const f = frames[fi % frames.length];
      setL(f.l); setR(f.r); setMid(f.mid); setFound(f.found); setMsg(f.msg);
      fi++;
      if (fi >= frames.length) fi = 0;
    }, 850);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      <div className="text-xs text-center mb-1" style={{ color: "var(--text-muted)" }}>
        Target: <strong style={{ color: "#f97316" }}>{TARGET}</strong>
      </div>
      <div className="flex gap-1 justify-center flex-wrap">
        {ARR.map((n, i) => {
          const elim = i < l || i > r;
          const isMid = i === mid;
          const isFound = found && isMid;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="transition-all duration-350 w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold font-mono"
                style={{
                  background: isFound ? "rgba(34,197,94,0.3)" : isMid ? "rgba(168,85,247,0.3)" : elim ? "rgba(0,0,0,0.3)" : "var(--bg-hover)",
                  border: isFound ? "2px solid #22c55e" : isMid ? "2px solid #a855f7" : elim ? "1px solid #1a1a28" : "1px solid var(--border)",
                  color: isFound ? "#22c55e" : isMid ? "#a855f7" : elim ? "#2a2a3a" : "var(--text-primary)",
                  opacity: elim ? 0.25 : 1,
                  transform: isMid ? "scale(1.12) translateY(-4px)" : "scale(1)",
                  boxShadow: isFound ? "0 0 14px rgba(34,197,94,0.45)" : isMid ? "0 8px 18px rgba(168,85,247,0.35)" : "none",
                }}>
                {n}
              </div>
              <span style={{ fontSize: "8px", color: i === l ? "#4f8ef7" : i === r ? "#f97316" : isMid ? "#a855f7" : "transparent" }}>
                {i === l && i === r ? "L=R" : i === l ? "L" : i === r ? "R" : isMid ? "M" : "."}
              </span>
            </div>
          );
        })}
      </div>

      {/* Search space bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{
            marginLeft: `${(l / ARR.length) * 100}%`,
            width: `${((r - l + 1) / ARR.length) * 100}%`,
            background: found ? "#22c55e" : "linear-gradient(90deg, #4f8ef7, #a855f7)",
          }} />
      </div>

      <div className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
        style={{
          background: found ? "rgba(34,197,94,0.1)" : "rgba(168,85,247,0.07)",
          color: found ? "#22c55e" : "#a855f7",
          border: `1px solid ${found ? "rgba(34,197,94,0.25)" : "rgba(168,85,247,0.2)"}`,
        }}>
        {msg}
      </div>
    </div>
  );
}
