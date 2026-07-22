"use client";
import { useState, useEffect, useRef } from "react";

const ASTEROIDS = [5, 10, -5, -10, 8];

export default function AsteroidCollisionViz() {
  const [idx, setIdx] = useState(0);
  const [stack, setStack] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Positive asteroids go right, negative go left. Collision when stack top>0 and current<0.");
  const stateRef = useRef({ idx: 0, stack: [] as number[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, stack: [] };
    setIdx(0); setStack([]); setDone(false); setPlaying(false);
    setMsg("Positive asteroids go right, negative go left. Collision when stack top>0 and current<0.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, stack: st } = stateRef.current;
    if (i >= ASTEROIDS.length) { setDone(true); setPlaying(false); setMsg(`Survivors: [${st.join(", ")}]`); return; }
    const ast = ASTEROIDS[i];
    let newStack = [...st];
    let newMsg = "";
    if (ast > 0) {
      newStack.push(ast);
      newMsg = `+${ast} (→): no collision, push onto stack`;
    } else {
      // negative: might collide with positive top
      let destroyed = false;
      while (newStack.length > 0 && newStack[newStack.length - 1] > 0) {
        const top = newStack[newStack.length - 1];
        if (top < Math.abs(ast)) {
          newStack.pop();
          newMsg = `${ast} (←) destroys +${top} (right), continues...`;
        } else if (top === Math.abs(ast)) {
          newStack.pop();
          newMsg = `${ast} (←) and +${top} (→) EQUAL — both destroyed!`;
          destroyed = true; break;
        } else {
          newMsg = `${ast} (←) hits +${top} (→) — ${ast} destroyed (top bigger)`;
          destroyed = true; break;
        }
      }
      if (!destroyed) {
        newStack.push(ast);
        if (!newMsg) newMsg = `${ast} (←): no collision (stack empty or left-facing top), push`;
        else newMsg += ` | ${ast} survives, push`;
      }
    }
    stateRef.current = { idx: i + 1, stack: newStack };
    setIdx(i + 1); setStack(newStack); setMsg(newMsg);
    if (i + 1 >= ASTEROIDS.length) { setDone(true); setPlaying(false); setMsg(`Survivors: [${newStack.join(", ")}]`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Asteroid Collision — Stack</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Collision only when positive asteroid (→) meets negative (←). Larger size survives.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="400" max="2000" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Input asteroids</div>
        <div className="flex gap-2 flex-wrap">
          {ASTEROIDS.map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="px-3 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: i === idx ? "rgba(249,115,22,0.25)" : i < idx ? "rgba(107,114,128,0.1)" : "var(--bg-hover)", border: i === idx ? "2px solid #f97316" : "1px solid var(--border)", color: a > 0 ? "#4f8ef7" : "#ef4444" }}>
                {a > 0 ? `+${a}→` : `${a}←`}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-4 text-xs">
          <span style={{ color: "#4f8ef7" }}>■ Moving right (+)</span>
          <span style={{ color: "#ef4444" }}>■ Moving left (−)</span>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Stack — survivors</div>
        <div className="flex gap-2 flex-wrap">
          {stack.map((a, i) => (
            <div key={i} className="px-3 py-2 rounded-lg text-sm font-bold" style={{ background: i === stack.length - 1 ? "rgba(34,197,94,0.2)" : "var(--bg-hover)", border: i === stack.length - 1 ? "2px solid #22c55e" : "1px solid var(--border)", color: a > 0 ? "#4f8ef7" : "#ef4444" }}>
              {a > 0 ? `+${a}` : a}
            </div>
          ))}
          {stack.length === 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>empty</span>}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
