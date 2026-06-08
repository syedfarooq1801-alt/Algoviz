"use client";
import { useState, useEffect, useRef } from "react";

const ROMAN_INIT = "MCMXCIV";
const ROMAN_MAP: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
const MAP_ENTRIES = Object.entries(ROMAN_MAP);

export default function RomanToIntegerViz() {
  const [step, setStep] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [history, setHistory] = useState<{ char: string; curVal: number; nextVal: number | null; op: "add" | "sub"; amount: number; running: number }[]>([]);
  const stateRef = useRef({ step: 0, total: 0, history: [] as typeof history });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = ROMAN_INIT.length;

  const reset = () => {
    stateRef.current = { step: 0, total: 0, history: [] };
    setStep(0); setTotal(0); setDone(false); setPlaying(false); setHistory([]);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: i, total: t, history: h } = stateRef.current;
    if (i >= n) { setDone(true); setPlaying(false); return; }
    const char = ROMAN_INIT[i];
    const curVal = ROMAN_MAP[char];
    const nextChar = i + 1 < n ? ROMAN_INIT[i + 1] : null;
    const nextVal = nextChar ? ROMAN_MAP[nextChar] : null;
    const isSub = nextVal !== null && curVal < nextVal;
    const amount = isSub ? -curVal : curVal;
    const newTotal = t + amount;
    const entry = { char, curVal, nextVal, op: isSub ? "sub" as const : "add" as const, amount, running: newTotal };
    const newHistory = [...h, entry];
    stateRef.current = { step: i + 1, total: newTotal, history: newHistory };
    setStep(i + 1); setTotal(newTotal); setHistory(newHistory);
    if (i + 1 >= n) { setDone(true); setPlaying(false); }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Roman to Integer — "{ROMAN_INIT}" = 1994</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          If current symbol value &lt; next symbol value → subtract; otherwise add.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            → Step
          </button>
          <button onClick={reset}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            ↺ Reset
          </button>
          <input type="range" min="200" max="2000" step="100" value={speed}
            onChange={e => setSpeed(+e.target.value)}
            style={{ width: "80px", accentColor: "#4f8ef7" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{speed}ms</span>
        </div>
      </div>

      {/* Roman numeral map */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Roman Numeral Map</div>
        <div className="flex gap-2 flex-wrap">
          {MAP_ENTRIES.map(([sym, val]) => (
            <div key={sym} className="flex flex-col items-center px-3 py-2 rounded-lg"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
              <span className="text-base font-bold" style={{ color: "#a855f7" }}>{sym}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Character pointer */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Input: {ROMAN_INIT}</div>
        <div className="flex gap-2">
          {ROMAN_INIT.split("").map((ch, i) => {
            const isCurrent = i === step;
            const isNext = i === step + 1;
            const isPast = i < step;
            const lastEntry = history[history.length - 1];
            const wasSub = isPast && history[i]?.op === "sub";
            const wasAdd = isPast && history[i]?.op === "add";
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: isCurrent ? "rgba(79,142,247,0.25)" : isNext ? "rgba(249,115,22,0.15)" : wasSub ? "rgba(249,115,22,0.1)" : wasAdd ? "rgba(34,197,94,0.1)" : "var(--bg-hover)",
                    border: isCurrent ? "2px solid #4f8ef7" : isNext ? "2px solid #f97316" : wasSub ? "1px solid rgba(249,115,22,0.3)" : wasAdd ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border)",
                    color: isCurrent ? "#4f8ef7" : isNext ? "#f97316" : "var(--text-secondary)",
                    transform: isCurrent ? "scale(1.1)" : "scale(1)"
                  }}>
                  {ch}
                </div>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontFamily: "monospace" }}>{ROMAN_MAP[ch]}</span>
                {isCurrent && <span style={{ fontSize: "8px", color: "#4f8ef7" }}>cur</span>}
                {isNext && step < n - 1 && <span style={{ fontSize: "8px", color: "#f97316" }}>next</span>}
                {isPast && wasSub && <span style={{ fontSize: "8px", color: "#f97316" }}>-{ROMAN_MAP[ch]}</span>}
                {isPast && wasAdd && <span style={{ fontSize: "8px", color: "#22c55e" }}>+{ROMAN_MAP[ch]}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step log */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Step-by-step operations</div>
        <div className="space-y-1">
          {history.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 text-xs font-mono px-2 py-1.5 rounded"
              style={{
                background: i === history.length - 1 ? (entry.op === "add" ? "rgba(34,197,94,0.08)" : "rgba(249,115,22,0.08)") : "rgba(255,255,255,0.02)",
                border: i === history.length - 1 ? `1px solid ${entry.op === "add" ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.3)"}` : "1px solid transparent"
              }}>
              <span className="font-bold w-5 text-center" style={{ color: "#a855f7" }}>{entry.char}</span>
              <span style={{ color: "var(--text-muted)" }}>({entry.curVal})</span>
              {entry.nextVal !== null ? (
                <span style={{ color: "var(--text-muted)" }}>next={entry.nextVal}</span>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>last char</span>
              )}
              <span style={{ color: entry.op === "add" ? "#22c55e" : "#f97316", fontWeight: 700 }}>
                {entry.op === "add" ? `+${entry.curVal}` : `-${entry.curVal}`}
              </span>
              <span style={{ color: "var(--text-muted)" }}>=</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{entry.running}</span>
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded"
                style={{ background: entry.op === "add" ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)", color: entry.op === "add" ? "#22c55e" : "#f97316" }}>
                {entry.op === "add" ? "ADD" : "SUBTRACT"}
              </span>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Steps will appear here...</div>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Running total</div>
          <div className="text-3xl font-bold font-mono mt-1" style={{ color: done ? "#22c55e" : "#4f8ef7" }}>{total}</div>
        </div>
        {done && (
          <div className="text-right">
            <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>Result: {total}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>"{ROMAN_INIT}" = {total}</div>
          </div>
        )}
      </div>
    </div>
  );
}
