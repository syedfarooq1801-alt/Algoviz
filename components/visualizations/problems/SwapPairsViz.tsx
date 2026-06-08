"use client";
import { useState, useRef, useEffect } from "react";

// 1→2→3→4 becomes 2→1→4→3
const STEPS = [
  { list: [1,2,3,4], swapping: [0,1], result: [] as number[], msg: "Swap pair (1,2): prev→2, 2→1, 1→3." },
  { list: [2,1,3,4], swapping: [2,3], result: [2,1], msg: "Swap pair (3,4): 1→4, 4→3, 3→null." },
  { list: [2,1,4,3], swapping: [] as number[], result: [2,1,4,3], msg: "Done! 2→1→4→3" },
];

export default function SwapPairsViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Swap Nodes in Pairs: take pairs, swap pointers without modifying values.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Swap Nodes in Pairs: take pairs, swap pointers without modifying values.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Final: 2→1→4→3 ✓"); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Swapped! 2→1→4→3"); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Swap Nodes in Pairs — Iterative</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Use dummy head. For each pair: rewire 3 pointers. Move curr forward by 2.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Current state</div>
        <div className="flex items-center gap-2 mb-4">
          {cur.list.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: cur.swapping.includes(i) ? "rgba(249,115,22,0.3)" : "var(--bg-hover)", border: cur.swapping.includes(i) ? "2px solid #f97316" : "1px solid var(--border)", color: cur.swapping.includes(i) ? "#f97316" : "var(--text-secondary)" }}>{v}</div>
              {i < cur.list.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
            </div>
          ))}
        </div>
        {cur.swapping.length === 2 && (
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Swapping</span>
            <span className="px-2 py-0.5 rounded font-bold" style={{ background: "rgba(249,115,22,0.2)", color: "#f97316" }}>{cur.list[cur.swapping[0]]}</span>
            <span>⇄</span>
            <span className="px-2 py-0.5 rounded font-bold" style={{ background: "rgba(249,115,22,0.2)", color: "#f97316" }}>{cur.list[cur.swapping[1]]}</span>
          </div>
        )}
      </div>
      {done && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "#22c55e" }}>Result</div>
          <div className="flex items-center gap-2">
            {[2,1,4,3].map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "rgba(34,197,94,0.2)", border: "2px solid #22c55e", color: "#22c55e" }}>{v}</div>
                {i < 3 && <span style={{ color: "#22c55e" }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
