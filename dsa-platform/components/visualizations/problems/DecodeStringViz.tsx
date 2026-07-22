"use client";
import { useState, useEffect, useRef } from "react";

const INPUT = "3[a2[c]]";

export default function DecodeStringViz() {
  const [charIdx, setCharIdx] = useState(0);
  const [stack, setStack] = useState<Array<{ count: number; str: string }>>([]);
  const [current, setCurrent] = useState("");
  const [currentNum, setCurrentNum] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Decode "${INPUT}" using stack`);
  const stateRef = useRef({ charIdx: 0, stack: [] as Array<{ count: number; str: string }>, current: "", currentNum: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { charIdx: 0, stack: [], current: "", currentNum: 0 };
    setCharIdx(0); setStack([]); setCurrent(""); setCurrentNum(0); setDone(false); setPlaying(false);
    setMsg(`Decode "${INPUT}" using stack`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { charIdx: ci, stack: st, current: cur, currentNum: num } = stateRef.current;
    if (ci >= INPUT.length) {
      setDone(true); setPlaying(false); setMsg(`Result: "${cur}"`); return;
    }
    const ch = INPUT[ci];
    let newStack = [...st.map(s => ({ ...s }))];
    let newCur = cur, newNum = num, newMsg = "";
    if (ch >= "0" && ch <= "9") {
      newNum = num * 10 + parseInt(ch);
      newMsg = `digit '${ch}': currentNum = ${newNum}`;
    } else if (ch === "[") {
      newStack.push({ count: newNum, str: newCur });
      newMsg = `'[': push (count=${newNum}, str="${newCur}") onto stack`;
      newCur = ""; newNum = 0;
    } else if (ch === "]") {
      const top = newStack.pop()!;
      const repeated = newCur.repeat(top.count);
      newCur = top.str + repeated;
      newMsg = `']': pop (count=${top.count}, str="${top.str}"), repeat "${cur}" → "${newCur}"`;
    } else {
      newCur = newCur + ch;
      newMsg = `letter '${ch}': append to current → "${newCur}"`;
    }
    stateRef.current = { charIdx: ci + 1, stack: newStack, current: newCur, currentNum: newNum };
    setCharIdx(ci + 1); setStack(newStack); setCurrent(newCur); setCurrentNum(newNum); setMsg(newMsg);
    if (ci + 1 >= INPUT.length) { setDone(true); setPlaying(false); setMsg(`Result: "${newCur}"`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Decode String — Stack</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Stack stores (repeatCount, prevString) at each '['. On ']' pop and repeat current string.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="400" max="2000" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Input characters</div>
        <div className="flex gap-2 flex-wrap">
          {INPUT.split("").map((c, i) => (
            <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all" style={{
              background: i === charIdx ? "rgba(79,142,247,0.3)" : i < charIdx ? "rgba(107,114,128,0.15)" : "var(--bg-hover)",
              border: i === charIdx ? "2px solid #4f8ef7" : "1px solid var(--border)",
              color: i === charIdx ? "#4f8ef7" : c === "[" || c === "]" ? "#f97316" : /\d/.test(c) ? "#a855f7" : "var(--text-secondary)"
            }}>{c}</div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Stack (bottom→top)</div>
          <div className="flex flex-col-reverse gap-1">
            {stack.map((item, i) => (
              <div key={i} className="px-3 py-2 rounded text-xs font-mono" style={{ background: i === stack.length - 1 ? "rgba(249,115,22,0.15)" : "var(--bg-hover)", border: i === stack.length - 1 ? "1px solid #f97316" : "1px solid var(--border)", color: i === stack.length - 1 ? "#f97316" : "var(--text-secondary)" }}>
                {item.count}×"{item.str}"
              </div>
            ))}
            {stack.length === 0 && <div className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>empty</div>}
          </div>
        </div>
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>currentNum</div>
            <div className="text-2xl font-bold font-mono" style={{ color: "#a855f7" }}>{currentNum}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>current string</div>
            <div className="text-lg font-bold font-mono px-2 py-1 rounded" style={{ color: done ? "#22c55e" : "#4f8ef7", background: done ? "rgba(34,197,94,0.1)" : "rgba(79,142,247,0.1)" }}>"{current}"</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
