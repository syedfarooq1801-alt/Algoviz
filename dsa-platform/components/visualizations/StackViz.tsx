"use client";
import { useState, useEffect, useRef } from "react";

const BRACKET_PAIRS: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
const DEFAULT_INPUT = "({[]})";

export default function StackViz() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [str, setStr] = useState(DEFAULT_INPUT);
  const [stack, setStack] = useState<string[]>([]);
  const [charIdx, setCharIdx] = useState(-1);
  const [valid, setValid] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const stateRef = useRef({ stack: [] as string[], idx: -1 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = (s = str) => {
    stateRef.current = { stack: [], idx: -1 };
    setStack([]);
    setCharIdx(-1);
    setValid(null);
    setLog([]);
    setDone(false);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const doStep = () => {
    const { stack: st, idx } = stateRef.current;
    const next = idx + 1;
    if (next >= str.length) {
      const isValid = st.length === 0;
      setValid(isValid);
      setDone(true);
      setPlaying(false);
      setLog((p) => [...p.slice(-9), isValid ? "Stack empty → VALID ✓" : `Stack has ${st.length} unmatched open brackets → INVALID ✗`]);
      stateRef.current.idx = next;
      return;
    }
    const c = str[next];
    const newStack = [...st];
    let msg = "";
    if (c === "(" || c === "[" || c === "{") {
      newStack.push(c);
      msg = `'${c}' is opening bracket → PUSH onto stack`;
    } else {
      const expected = BRACKET_PAIRS[c];
      if (newStack.length === 0 || newStack[newStack.length - 1] !== expected) {
        setValid(false);
        setDone(true);
        setPlaying(false);
        setLog((p) => [...p.slice(-9), `'${c}' expected '${expected}' but stack top='${newStack[newStack.length - 1] ?? "empty"}' → INVALID ✗`]);
        stateRef.current = { stack: newStack, idx: next };
        setStack(newStack);
        setCharIdx(next);
        return;
      }
      newStack.pop();
      msg = `'${c}' matches '${expected}' on stack top → POP ✓`;
    }
    stateRef.current = { stack: newStack, idx: next };
    setStack(newStack);
    setCharIdx(next);
    setLog((p) => [...p.slice(-9), `[${next}] '${c}': ${msg}`]);
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (stateRef.current.idx + 1 >= str.length || done) {
          setPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (stateRef.current.idx + 1 >= str.length && !done) doStep();
          return;
        }
        doStep();
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, str, done]);

  const apply = () => { setStr(input); reset(input); };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Valid Parentheses — Stack Visualization
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Input:</label>
            <input className="px-2 py-1 rounded text-xs font-mono"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "180px" }}
              value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setPlaying(!playing)} disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={() => reset()} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <div className="flex items-center gap-2">
            <input type="range" min="200" max="2000" step="200" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "80px", accentColor: "#4f8ef7" }} />
          </div>
        </div>
      </div>

      {/* String chars */}
      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Input String</div>
        <div className="flex gap-2 flex-wrap">
          {str.split("").map((c, i) => {
            const isCurrent = i === charIdx;
            const isPast = i < charIdx;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold font-mono transition-all duration-200"
                  style={{
                    background: isCurrent ? "rgba(168,85,247,0.25)" : isPast ? "rgba(34,197,94,0.1)" : "var(--bg-hover)",
                    border: isCurrent ? "2px solid #a855f7" : isPast ? "1px solid rgba(34,197,94,0.3)" : "2px solid var(--border)",
                    color: isCurrent ? "#a855f7" : isPast ? "#22c55e" : "var(--text-primary)",
                    transform: isCurrent ? "scale(1.15) translateY(-4px)" : "scale(1)",
                  }}>
                  {c}
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "9px" }}>{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stack visualization */}
      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>
          Stack (LIFO) — top is rightmost
        </div>
        <div className="flex items-end gap-2 min-h-16 p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
          {stack.length === 0 ? (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Empty stack</span>
          ) : (
            stack.map((c, i) => {
              const isTop = i === stack.length - 1;
              return (
                <div key={i}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono transition-all duration-200"
                  style={{
                    background: isTop ? "rgba(249,115,22,0.2)" : "rgba(79,142,247,0.1)",
                    border: isTop ? "2px solid #f97316" : "1px solid rgba(79,142,247,0.3)",
                    color: isTop ? "#f97316" : "#4f8ef7",
                    transform: isTop ? "scale(1.1)" : "scale(1)",
                    animation: isTop ? "fadeInUp 0.2s ease-out" : "none",
                  }}>
                  {c}
                </div>
              );
            })
          )}
          {stack.length > 0 && (
            <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>← top</span>
          )}
        </div>
        <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Stack size: {stack.length}</div>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Log</h4>
          <div className="space-y-1 text-xs font-mono" style={{ maxHeight: "120px", overflowY: "auto" }}>
            {log.map((l, i) => (
              <div key={i} style={{ color: l.includes("VALID") ? "#22c55e" : l.includes("INVALID") ? "#ef4444" : l.includes("PUSH") ? "#4f8ef7" : l.includes("POP") ? "#22c55e" : "var(--text-secondary)" }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {valid !== null && (
        <div className="rounded-xl p-4 text-center" style={{
          background: valid ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${valid ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
        }}>
          <div className="font-semibold text-sm" style={{ color: valid ? "#22c55e" : "#ef4444" }}>
            {valid ? "✓ Valid Parentheses" : "✗ Invalid Parentheses"}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {valid ? "All brackets matched and closed properly." : "Mismatched or unclosed brackets found."}
          </div>
        </div>
      )}
    </div>
  );
}
