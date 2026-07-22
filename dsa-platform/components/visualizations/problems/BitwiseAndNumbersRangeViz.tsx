"use client";
import { useState, useRef, useEffect } from "react";

// [5,7]: 5=101, 6=110, 7=111. AND=5&6&7=100=4
const LEFT = 5, RIGHT = 7;
const NUMS = [5,6,7];

const STEPS = [
  { m: LEFT, n: RIGHT, shift: 0, msg: `Find common prefix of ${LEFT}(${LEFT.toString(2)}) and ${RIGHT}(${RIGHT.toString(2)}).` },
  { m: 2, n: 3, shift: 1, msg: `Shift right: 5>>1=2(${(2).toString(2)}), 7>>1=3(${(3).toString(2)}). Not equal yet.` },
  { m: 1, n: 1, shift: 2, msg: `Shift right again: 2>>1=1, 3>>1=1. Equal! Common prefix found.` },
  { m: 1, n: 1, shift: 2, final: 1<<2, msg: `Shift left by 2: 1<<2=4(100). Answer=4. AND of [5,6,7]=4.` },
];

export default function BitwiseAndNumbersRangeViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Bitwise AND of range [left,right]: Find common prefix by right-shifting until equal.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Bitwise AND of range [left,right]: Find common prefix by right-shifting until equal.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`[${LEFT},${RIGHT}] range AND = 4 (binary: 100)`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`rangeBitwiseAnd(${LEFT},${RIGHT}) = 4`); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];

  const toBin8 = (n: number) => n.toString(2).padStart(8, '0');

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Bitwise AND of Numbers Range — Common Prefix</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Shift left and right until equal. Shift count back left = result (common prefix bits).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Numbers in range (8-bit)</div>
        <div className="space-y-2">
          {NUMS.map((n, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-4 text-xs font-bold" style={{ color: "var(--text-muted)" }}>{n}</span>
              <div className="flex gap-0.5">
                {toBin8(n).split("").map((bit, bi) => (
                  <div key={bi} className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold font-mono" style={{ background: bit==="1" ? "rgba(79,142,247,0.25)" : "rgba(107,114,128,0.1)", color: bit==="1" ? "#4f8ef7" : "var(--text-muted)", border: `1px solid ${bit==="1" ? "rgba(79,142,247,0.3)" : "var(--border)"}` }}>{bit}</div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <span className="w-4 text-xs font-bold" style={{ color: "#22c55e" }}>AND</span>
            <div className="flex gap-0.5">
              {toBin8(LEFT&(LEFT+1)&RIGHT).split("").map((bit, bi) => (
                <div key={bi} className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold font-mono" style={{ background: done && bit==="1" ? "rgba(34,197,94,0.3)" : done ? "rgba(107,114,128,0.1)" : "transparent", color: done ? (bit==="1" ? "#22c55e" : "var(--text-muted)") : "transparent", border: done ? `1px solid ${bit==="1" ? "rgba(34,197,94,0.5)" : "var(--border)"}` : "1px dashed rgba(107,114,128,0.2)" }}>{done ? bit : "?"}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div><div style={{ color: "var(--text-muted)" }} className="text-xs">m (left)</div><div className="font-bold text-lg" style={{ color: "#4f8ef7" }}>{cur.m} ({cur.m.toString(2)})</div></div>
          <div><div style={{ color: "var(--text-muted)" }} className="text-xs">n (right)</div><div className="font-bold text-lg" style={{ color: "#4f8ef7" }}>{cur.n} ({cur.n.toString(2)})</div></div>
          <div><div style={{ color: "var(--text-muted)" }} className="text-xs">shifts</div><div className="font-bold text-lg" style={{ color: "#f97316" }}>{cur.shift}</div></div>
        </div>
        {(cur as any).final !== undefined && <div className="mt-2 text-center text-lg font-bold" style={{ color: "#22c55e" }}>Result = {(cur as any).final}</div>}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
