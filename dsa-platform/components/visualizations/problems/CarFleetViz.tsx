"use client";
import { useState, useEffect, useRef } from "react";

const TARGET = 12;
const CARS_DATA = [
  { pos: 10, speed: 2 },
  { pos: 8, speed: 4 },
  { pos: 0, speed: 1 },
  { pos: 5, speed: 1 },
  { pos: 3, speed: 3 },
];

export default function CarFleetViz() {
  const [step, setStep] = useState(-1);
  const [fleets, setFleets] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [done, setDone] = useState(false);
  const [stack, setStack] = useState<number[]>([]);
  const [msg, setMsg] = useState("Sort cars by position desc. Use stack: if car arrives before/equal to top, same fleet.");
  const stateRef = useRef({ step: -1, stack: [] as number[], fleets: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sorted = [...CARS_DATA].sort((a, b) => b.pos - a.pos);
  const times = sorted.map(c => (TARGET - c.pos) / c.speed);

  const reset = () => {
    stateRef.current = { step: -1, stack: [], fleets: 0 };
    setStep(-1); setStack([]); setFleets(0); setDone(false); setPlaying(false);
    setMsg("Sort cars by position desc. Use stack: if car arrives before/equal to top, same fleet.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s, stack: st } = stateRef.current;
    const nextStep = s + 1;
    if (nextStep >= sorted.length) {
      setDone(true); setPlaying(false);
      setMsg(`${st.length} fleet(s) reach target`);
      stateRef.current = { ...stateRef.current, fleets: st.length };
      setFleets(st.length); return;
    }
    const t = times[nextStep];
    let newStack = [...st];
    let newMsg = "";
    if (newStack.length === 0 || t > newStack[newStack.length - 1]) {
      newStack.push(t);
      newMsg = `Car at pos=${sorted[nextStep].pos}: time=${t.toFixed(2)} > stack top → NEW fleet`;
    } else {
      newMsg = `Car at pos=${sorted[nextStep].pos}: time=${t.toFixed(2)} ≤ stack top (${newStack[newStack.length - 1].toFixed(2)}) → joins existing fleet`;
    }
    stateRef.current = { step: nextStep, stack: newStack, fleets: newStack.length };
    setStep(nextStep); setStack(newStack); setFleets(newStack.length); setMsg(newMsg);
    if (nextStep + 1 >= sorted.length) {
      setTimeout(() => {
        setDone(true); setPlaying(false);
        setMsg(`Total fleets = ${newStack.length}`);
      }, 200);
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Car Fleet — Monotonic Stack</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Sort by position desc. Time = (target - pos) / speed. Faster car behind slower = same fleet.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="300" max="2000" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Road (target={TARGET})</div>
        <div className="relative h-12 rounded-lg mb-3" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "#22c55e" }}>🏁 {TARGET}</div>
          {sorted.map((car, i) => (
            <div key={i} className="absolute top-1/2 -translate-y-1/2 text-base transition-all"
              style={{ left: `${(car.pos / TARGET) * 85}%`, opacity: i <= step ? 1 : 0.3, filter: i === step ? "brightness(1.5)" : "none" }}>
              🚗
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {sorted.map((car, i) => (
            <div key={i} className="flex items-center gap-3 text-xs px-3 py-1.5 rounded" style={{ background: i === step ? "rgba(79,142,247,0.15)" : i < step ? "rgba(107,114,128,0.1)" : "transparent", border: i === step ? "1px solid rgba(79,142,247,0.3)" : "1px solid transparent" }}>
              <span style={{ color: i <= step ? "var(--text-primary)" : "var(--text-muted)" }}>pos={car.pos}, spd={car.speed}</span>
              <span style={{ color: "var(--text-muted)" }}>→</span>
              <span style={{ color: "#f97316" }}>time={times[i].toFixed(2)}</span>
              {i === step && <span style={{ color: "#4f8ef7" }}>← processing</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Stack (arrival times)</div>
          <div className="flex flex-col-reverse gap-1">
            {stack.map((t, i) => (
              <div key={i} className="px-3 py-1.5 rounded text-xs text-center font-mono" style={{ background: i === stack.length - 1 ? "rgba(79,142,247,0.2)" : "var(--bg-hover)", border: i === stack.length - 1 ? "1px solid #4f8ef7" : "1px solid var(--border)", color: i === stack.length - 1 ? "#4f8ef7" : "var(--text-secondary)" }}>
                {t.toFixed(2)}s {i === stack.length - 1 ? "← top" : ""}
              </div>
            ))}
            {stack.length === 0 && <div className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>empty</div>}
          </div>
        </div>
        <div className="rounded-xl p-4 flex flex-col items-center justify-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Fleets</div>
          <div className="text-4xl font-bold" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>{stack.length}</div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
