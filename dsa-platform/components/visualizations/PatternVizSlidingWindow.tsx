"use client";
import { useEffect, useState } from "react";

const STR = "a b c a b c b b".split(" ");

export default function PatternVizSlidingWindow() {
  const [l, setL] = useState(0);
  const [r, setR] = useState(0);
  const [best, setBest] = useState(0);
  const [bestRange, setBestRange] = useState<[number,number]>([0,0]);
  const [set, setSet] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const frames: { l: number; r: number; set: string[]; best: number; br: [number,number]; msg: string }[] = [];
    let fl = 0, fr = 0;
    const fs = new Set<string>();
    let fb = 0, fbr: [number,number] = [0,0];

    frames.push({ l: fl, r: -1, set: [], best: 0, br: [0,0], msg: "Start: empty window" });

    while (fr < STR.length) {
      const c = STR[fr];
      if (!fs.has(c)) {
        fs.add(c);
        const len = fr - fl + 1;
        if (len > fb) { fb = len; fbr = [fl, fr]; }
        frames.push({ l: fl, r: fr, set: Array.from(fs), best: fb, br: [...fbr] as [number,number], msg: `Expand → add '${c}'. Window="${STR.slice(fl,fr+1).join("")}" len=${len}` });
        fr++;
      } else {
        frames.push({ l: fl, r: fr, set: Array.from(fs), best: fb, br: [...fbr] as [number,number], msg: `Duplicate '${c}'! Shrink ← remove '${STR[fl]}'` });
        fs.delete(STR[fl]);
        fl++;
      }
    }
    frames.push({ l: fl, r: fr - 1, set: Array.from(fs), best: fb, br: [...fbr] as [number,number], msg: `Done! Best window: "${STR.slice(fbr[0], fbr[1]+1).join("")}" length=${fb}` });

    let idx = 0;
    const id = setInterval(() => {
      const f = frames[idx % frames.length];
      setL(f.l); setR(f.r); setSet(new Set(f.set)); setBest(f.best); setBestRange(f.br); setMsg(f.msg);
      idx++;
      if (idx >= frames.length + 2) idx = 0;
    }, 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 items-end justify-center flex-wrap">
        {STR.map((c, i) => {
          const inWin = r >= 0 && i >= l && i <= r;
          const isBest = i >= bestRange[0] && i <= bestRange[1] && !inWin;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="transition-all duration-300 w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold font-mono"
                style={{
                  background: inWin ? "rgba(79,142,247,0.22)" : isBest ? "rgba(34,197,94,0.12)" : "var(--bg-hover)",
                  border: inWin ? "2px solid #4f8ef7" : isBest ? "1px solid rgba(34,197,94,0.35)" : "2px solid var(--border)",
                  color: inWin ? "#4f8ef7" : isBest ? "#22c55e" : "var(--text-secondary)",
                  transform: inWin ? "scale(1.08)" : "scale(1)",
                }}>
                {c}
              </div>
              <span style={{ fontSize: "9px", color: i === l && r >= 0 ? "#4f8ef7" : i === r ? "#f97316" : "transparent" }}>
                {i === l && r >= 0 && i === r ? "L=R" : i === l && r >= 0 ? "L" : i === r ? "R" : "."}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {Array.from(set).map(c => (
          <span key={c} className="px-2 py-0.5 rounded-full text-xs font-mono"
            style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>
            {c}
          </span>
        ))}
        {set.size === 0 && <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>window empty</span>}
      </div>

      <div className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
        style={{ background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)" }}>
        {msg || "..."}
      </div>

      <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Best length so far: <strong style={{ color: "#22c55e", fontSize: "14px" }}>{best}</strong>
      </div>
    </div>
  );
}
