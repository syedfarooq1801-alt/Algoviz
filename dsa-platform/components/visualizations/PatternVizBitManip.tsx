"use client";
import { useEffect, useState } from "react";

const NUMS = [4, 1, 2, 1, 2]; // single number = 4

export default function PatternVizBitManip() {
  const [idx, setIdx] = useState(-1);
  const [result, setResult] = useState(0);
  const [msg, setMsg] = useState("XOR: same bits cancel, unique survives");

  const toBin = (n: number) => (n >>> 0).toString(2).padStart(4, "0");

  useEffect(() => {
    const frames: { idx: number; result: number; msg: string }[] = [
      { idx: -1, result: 0, msg: "XOR: a⊕a=0, a⊕0=a. Pairs cancel out!" },
    ];
    let r = 0;
    for (let i = 0; i < NUMS.length; i++) {
      r ^= NUMS[i];
      frames.push({ idx: i, result: r, msg: `${i > 0 ? frames[i].result + " ⊕ " : "0 ⊕ "}${NUMS[i]} = ${r}  (${toBin(frames[i]?.result ?? 0)} ⊕ ${toBin(NUMS[i])} = ${toBin(r)})` });
    }
    frames.push({ idx: -1, result: r, msg: `Answer: ${r} — only unpaired number survives ✓` });
    for (let i = 0; i < 3; i++) frames.push(frames[frames.length - 1]);
    frames.push({ idx: -1, result: 0, msg: "XOR: a⊕a=0, a⊕0=a. Pairs cancel out!" });

    let fi = 0;
    const id = setInterval(() => {
      const f = frames[fi % frames.length];
      setIdx(f.idx); setResult(f.result); setMsg(f.msg);
      fi++;
      if (fi >= frames.length) fi = 0;
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-center items-center flex-wrap">
        {NUMS.map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono transition-all duration-300"
              style={{
                background: i === idx ? "rgba(148,163,184,0.25)" : "var(--bg-hover)",
                border: i === idx ? "2px solid #94a3b8" : "2px solid var(--border)",
                color: i === idx ? "#94a3b8" : "var(--text-secondary)",
                transform: i === idx ? "scale(1.1) translateY(-4px)" : "scale(1)",
              }}>
              {n}
            </div>
            <span className="font-mono" style={{ fontSize: "9px", color: "var(--text-muted)" }}>{toBin(n)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>XOR result:</span>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold font-mono transition-all duration-300"
            style={{
              background: result > 0 ? "rgba(148,163,184,0.2)" : "rgba(0,0,0,0.3)",
              border: result > 0 ? "2px solid #94a3b8" : "2px solid var(--border)",
              color: result > 0 ? "#94a3b8" : "var(--text-muted)",
            }}>
            {result}
          </div>
          <span className="font-mono mt-0.5" style={{ fontSize: "9px", color: "var(--text-muted)" }}>{toBin(result)}</span>
        </div>
      </div>

      <div className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
        style={{ background: "rgba(148,163,184,0.07)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.2)" }}>
        {msg}
      </div>
    </div>
  );
}
