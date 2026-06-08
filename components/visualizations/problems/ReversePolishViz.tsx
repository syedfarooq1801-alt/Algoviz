"use client";
import { useState, useEffect, useRef } from "react";

const TOKENS = ["2", "1", "+", "3", "*"];

export default function ReversePolishViz() {
  const [idx, setIdx] = useState(0);
  const [stack, setStack] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState('Evaluate RPN: ["2","1","+","3","*"]');
  const stateRef = useRef({ idx: 0, stack: [] as number[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, stack: [] };
    setIdx(0); setStack([]); setDone(false); setPlaying(false);
    setMsg('Evaluate RPN: ["2","1","+","3","*"]');
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, stack: st } = stateRef.current;
    if (i >= TOKENS.length) { setDone(true); setPlaying(false); setMsg(`Result = ${st[0]}`); return; }
    const token = TOKENS[i];
    let newStack = [...st];
    let newMsg = "";
    if (["+", "-", "*", "/"].includes(token)) {
      const b = newStack.pop()!, a = newStack.pop()!;
      let res = 0;
      if (token === "+") res = a + b;
      else if (token === "-") res = a - b;
      else if (token === "*") res = a * b;
      else res = Math.trunc(a / b);
      newStack.push(res);
      newMsg = `"${token}": pop ${a} and ${b}, compute ${a}${token}${b}=${res}, push ${res}`;
    } else {
      newStack.push(parseInt(token));
      newMsg = `"${token}": push ${token} onto stack`;
    }
    stateRef.current = { idx: i + 1, stack: newStack };
    setIdx(i + 1); setStack(newStack); setMsg(newMsg);
    if (i + 1 >= TOKENS.length) { setDone(true); setPlaying(false); setMsg(`Result = ${newStack[0]}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Evaluate Reverse Polish Notation — Stack</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Numbers: push to stack. Operator: pop two, compute, push result.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="300" max="2000" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Tokens</div>
          <div className="flex gap-2 flex-wrap">
            {TOKENS.map((t, i) => (
              <div key={i} className="px-3 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: i === idx ? "rgba(79,142,247,0.25)" : i < idx ? "rgba(107,114,128,0.15)" : "var(--bg-hover)", border: i === idx ? "2px solid #4f8ef7" : "1px solid var(--border)", color: i === idx ? "#4f8ef7" : ["+","-","*","/"].includes(t) ? "var(--accent-orange)" : "var(--text-secondary)" }}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Stack (bottom→top)</div>
          <div className="flex flex-col-reverse gap-2">
            {stack.map((v, i) => (
              <div key={i} className="px-4 py-2 rounded-lg text-center text-sm font-bold" style={{ background: i === stack.length - 1 ? "rgba(79,142,247,0.2)" : "var(--bg-hover)", border: i === stack.length - 1 ? "2px solid #4f8ef7" : "1px solid var(--border)", color: i === stack.length - 1 ? "#4f8ef7" : "var(--text-secondary)" }}>
                {v} {i === stack.length - 1 ? "← top" : ""}
              </div>
            ))}
            {stack.length === 0 && <div className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>empty</div>}
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
