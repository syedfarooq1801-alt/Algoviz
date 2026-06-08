"use client";
import { useState, useRef, useEffect } from "react";

const BILLS = [5, 5, 5, 10, 20];

export default function LemonadeChangeViz() {
  const [idx, setIdx] = useState(0);
  const [fives, setFives] = useState(0);
  const [tens, setTens] = useState(0);
  const [done, setDone] = useState(false);
  const [valid, setValid] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("Lemonade costs $5. Give change for $10 and $20 greedily (prefer $10 for $20).");
  const stateRef = useRef({ idx: 0, fives: 0, tens: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, fives: 0, tens: 0 };
    setIdx(0); setFives(0); setTens(0); setDone(false); setValid(true); setPlaying(false);
    setMsg("Lemonade costs $5. Give change for $10 and $20 greedily (prefer $10 for $20).");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, fives: f, tens: t } = stateRef.current;
    if (i >= BILLS.length) { setDone(true); setPlaying(false); setMsg(`All customers served! Valid = true`); return; }
    const bill = BILLS[i];
    let newF = f, newT = t, action = "";
    if (bill === 5) {
      newF = f + 1; action = `$5 bill → collect. fives=${newF}`;
    } else if (bill === 10) {
      if (f < 1) { setDone(true); setValid(false); setPlaying(false); setMsg(`$10 bill: need $5 change but none! FAIL`); return; }
      newF = f - 1; newT = t + 1; action = `$10 bill → give $5 change. fives=${newF}, tens=${newT}`;
    } else { // 20
      if (t >= 1 && f >= 1) { newT = t - 1; newF = f - 1; action = `$20 bill → give $10+$5 change. fives=${newF}, tens=${newT}`; }
      else if (f >= 3) { newF = f - 3; action = `$20 bill → give $5×3 change. fives=${newF}`; }
      else { setDone(true); setValid(false); setPlaying(false); setMsg(`$20 bill: can't make $15 change! FAIL`); return; }
    }
    stateRef.current = { idx: i + 1, fives: newF, tens: newT };
    setIdx(i + 1); setFives(newF); setTens(newT); setMsg(action);
    if (i + 1 >= BILLS.length) { setDone(true); setPlaying(false); setMsg(`All served successfully! TRUE ✓`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Lemonade Change — Greedy</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>For $20 prefer $10+$5 (saves $5 bills). $5 bills are most versatile — preserve them.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Customer bills</div>
        <div className="flex gap-3 mb-4">
          {BILLS.map((b, i) => (
            <div key={i} className="flex-1 py-3 rounded-lg text-center text-sm font-bold transition-all" style={{
              background: i === idx - 1 ? "rgba(249,115,22,0.3)" : i < idx ? "rgba(107,114,128,0.12)" : "var(--bg-hover)",
              border: i === idx - 1 ? "2px solid #f97316" : i === idx ? "2px solid #4f8ef7" : "1px solid var(--border)",
              color: b === 5 ? "#22c55e" : b === 10 ? "#4f8ef7" : "#a855f7"
            }}>${b}</div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <div className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>💵 $5 bills</div>
            <div className="text-3xl font-bold" style={{ color: "#22c55e" }}>{fives}</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)" }}>
            <div className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>💵 $10 bills</div>
            <div className="text-3xl font-bold" style={{ color: "#4f8ef7" }}>{tens}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? (valid ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)") : "rgba(79,142,247,0.07)", color: done ? (valid ? "#22c55e" : "#ef4444") : "#4f8ef7", border: `1px solid ${done ? (valid ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
