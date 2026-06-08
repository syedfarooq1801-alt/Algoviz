"use client";
import { useState, useEffect, useRef } from "react";

// L1 = [2,4,3] → 342, L2 = [5,6,4] → 465, result = [7,0,8] → 807
const L1 = [2, 4, 3];
const L2 = [5, 6, 4];

interface AlgoState {
  i: number;
  carry: number;
  result: number[];
  done: boolean;
}

function buildInitial(): AlgoState {
  return { i: 0, carry: 0, result: [], done: false };
}

export default function AddTwoNumbersViz() {
  const [i, setI] = useState(0);
  const [carry, setCarry] = useState(0);
  const [result, setResult] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — add digits position by position, carry the overflow");
  const stateRef = useRef<AlgoState>(buildInitial());
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    const s = buildInitial();
    stateRef.current = s;
    setI(0); setCarry(0); setResult([]); setDone(false); setPlaying(false);
    setMsg("i=0, carry=0 — start adding from least significant digit");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.done) return;
    const maxLen = Math.max(L1.length, L2.length);
    if (st.i > maxLen) {
      stateRef.current = { ...st, done: true };
      setDone(true); setPlaying(false);
      setMsg(`Done! Result [${st.result.join(", ")}] → ${parseInt([...st.result].reverse().join(""))} = 342 + 465`);
      return;
    }
    if (st.i === maxLen && st.carry === 0) {
      stateRef.current = { ...st, done: true };
      setDone(true); setPlaying(false);
      setMsg(`Done! [${st.result.join(", ")}] represents ${parseInt([...st.result].reverse().join(""))}`);
      return;
    }
    const a = st.i < L1.length ? L1[st.i] : 0;
    const b = st.i < L2.length ? L2[st.i] : 0;
    const sum = a + b + st.carry;
    const digit = sum % 10;
    const newCarry = Math.floor(sum / 10);
    const newResult = [...st.result, digit];
    stateRef.current = { i: st.i + 1, carry: newCarry, result: newResult, done: false };
    setI(st.i + 1); setCarry(newCarry); setResult(newResult);
    setMsg(`pos ${st.i}: L1[${st.i}]=${a} + L2[${st.i}]=${b} + carry=${st.carry} = ${sum} → digit=${digit}, newCarry=${newCarry}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const renderList = (arr: number[], label: string, color: string, currentIdx: number) => (
    <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
        {label}
        <span className="ml-2 font-mono" style={{ color }}>
          = {[...arr].reverse().join("")}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {arr.map((v, idx) => {
          const isActive = idx === currentIdx;
          const isPast = idx < currentIdx;
          return (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold font-mono transition-all duration-200"
                  style={{
                    background: isActive ? `${color}25` : isPast ? "rgba(255,255,255,0.03)" : "var(--bg-hover)",
                    border: isActive ? `2px solid ${color}` : `1px solid var(--border)`,
                    color: isActive ? color : isPast ? "var(--text-muted)" : "var(--text-secondary)",
                    transform: isActive ? "scale(1.12) translateY(-3px)" : "scale(1)",
                  }}
                >
                  {v}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)", fontSize: "9px" }}>
                  {10 ** idx}s
                </div>
              </div>
              {idx < arr.length - 1 && (
                <div style={{ width: 20, height: 2, background: `${color}35`, margin: "0 2px 14px 2px" }} />
              )}
            </div>
          );
        })}
        <div className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>→ null</div>
      </div>
    </div>
  );

  const finalNum = done && result.length > 0
    ? parseInt([...result].reverse().join(""))
    : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Add Two Numbers — Digit-by-Digit with Carry
        </h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          L1 = [2→4→3] (represents 342) &nbsp;+&nbsp; L2 = [5→6→4] (represents 465) &nbsp;=&nbsp; 807
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setPlaying(!playing)}
            disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />

          {/* Carry indicator */}
          <div
            className="px-3 py-1 rounded-lg text-xs font-mono font-bold"
            style={{
              background: carry > 0 ? "rgba(239,68,68,0.15)" : "rgba(79,142,247,0.1)",
              border: `1px solid ${carry > 0 ? "rgba(239,68,68,0.4)" : "rgba(79,142,247,0.25)"}`,
              color: carry > 0 ? "#ef4444" : "#4f8ef7",
            }}
          >
            carry = {carry}
          </div>
        </div>
      </div>

      {renderList(L1, "L1", "#4f8ef7", i)}
      {renderList(L2, "L2", "#f97316", i)}

      {/* Result list */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#22c55e" }}>
          Result list (least-significant first)
          {result.length > 0 && (
            <span className="ml-2 font-mono">
              → {[...result].reverse().join("")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {result.length === 0 && (
            <div className="text-xs italic" style={{ color: "var(--text-muted)" }}>empty — nodes will appear here...</div>
          )}
          {result.map((v, idx) => (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
                  style={{
                    background: idx === result.length - 1 ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.1)",
                    border: idx === result.length - 1 ? "2px solid #22c55e" : "1px solid rgba(34,197,94,0.4)",
                    color: "#22c55e",
                  }}
                >
                  {v}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)", fontSize: "9px" }}>
                  {10 ** idx}s
                </div>
              </div>
              {idx < result.length - 1 && (
                <div style={{ width: 20, height: 2, background: "rgba(34,197,94,0.35)", margin: "0 2px 14px 2px" }} />
              )}
            </div>
          ))}
          {carry > 0 && (
            <div className="flex items-center">
              <div style={{ width: 20, height: 2, background: "rgba(239,68,68,0.35)", margin: "0 2px 14px 2px" }} />
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
                style={{ background: "rgba(239,68,68,0.15)", border: "2px dashed #ef4444", color: "#ef4444" }}
              >
                +{carry}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)" }}>
        {msg}
      </div>

      {done && finalNum !== null && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-bold text-base" style={{ color: "#22c55e" }}>342 + 465 = {finalNum}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Result node list: [{result.join(" → ")}] (stored least-significant digit first)
          </div>
        </div>
      )}
    </div>
  );
}
