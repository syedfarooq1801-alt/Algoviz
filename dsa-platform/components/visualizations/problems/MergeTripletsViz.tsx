"use client";
import { useState, useRef, useEffect } from "react";

const TRIPLETS = [[2,5,3],[1,8,4],[1,7,5]];
const TARGET = [2,7,5];

export default function MergeTripletsViz() {
  const [idx, setIdx] = useState(0);
  const [merged, setMerged] = useState([0,0,0]);
  const [selected, setSelected] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Find triplets to merge to get target [${TARGET.join(",")}]. Skip if any value exceeds target.`);
  const stateRef = useRef({ idx: 0, merged: [0,0,0], selected: [] as number[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, merged: [0,0,0], selected: [] };
    setIdx(0); setMerged([0,0,0]); setSelected([]); setDone(false); setPlaying(false);
    setMsg(`Find triplets to merge to get target [${TARGET.join(",")}]. Skip if any value exceeds target.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, merged: m, selected: s } = stateRef.current;
    if (i >= TRIPLETS.length) {
      const success = m[0]===TARGET[0]&&m[1]===TARGET[1]&&m[2]===TARGET[2];
      setDone(true); setPlaying(false);
      setMsg(`merged=[${m.join(",")}] ${success?"== target ✓":"≠ target ✗"}`); return;
    }
    const t = TRIPLETS[i];
    const exceeds = t.some((v, j) => v > TARGET[j]);
    let newM = [...m], newS = [...s];
    let action = "";
    if (exceeds) {
      action = `Triplet [${t.join(",")}]: exceeds target somewhere → SKIP`;
    } else {
      newM = m.map((v, j) => Math.max(v, t[j]));
      newS = [...s, i];
      action = `Triplet [${t.join(",")}]: all ≤ target → USE. Merged=[${newM.join(",")}]`;
    }
    stateRef.current = { idx: i+1, merged: newM, selected: newS };
    setIdx(i+1); setMerged(newM); setSelected(newS); setMsg(action);
    if (i+1>=TRIPLETS.length) {
      const success = newM[0]===TARGET[0]&&newM[1]===TARGET[1]&&newM[2]===TARGET[2];
      setDone(true); setPlaying(false);
      setMsg(`Result: [${newM.join(",")}] ${success?"== target → TRUE ✓":"≠ target → FALSE ✗"}`);
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const success = done && merged[0]===TARGET[0]&&merged[1]===TARGET[1]&&merged[2]===TARGET[2];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Merge Triplets to Form Target — Greedy</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Use triplet if no value exceeds target. Merge = element-wise max. Check if merged == target.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Triplets (target=[{TARGET.join(",")}])</div>
        <div className="space-y-2">
          {TRIPLETS.map((t, i) => {
            const exceeds = t.some((v, j) => v > TARGET[j]);
            const isActive = i === idx - 1;
            const isSelected = selected.includes(i);
            return (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded text-sm" style={{ background: isActive ? "rgba(249,115,22,0.12)" : isSelected ? "rgba(34,197,94,0.08)" : exceeds ? "rgba(239,68,68,0.05)" : "var(--bg-hover)", border: isActive ? "1px solid rgba(249,115,22,0.4)" : isSelected ? "1px solid rgba(34,197,94,0.3)" : exceeds ? "1px solid rgba(239,68,68,0.2)" : "1px solid var(--border)" }}>
                <div className="flex gap-2">
                  {t.map((v, j) => <span key={j} style={{ color: v > TARGET[j] ? "#ef4444" : "#22c55e", fontWeight: "bold" }}>{v}</span>)}
                </div>
                <span style={{ color: "var(--text-muted)" }}>→</span>
                <span style={{ color: isSelected ? "#22c55e" : exceeds ? "#ef4444" : "var(--text-muted)" }}>{isSelected ? "✓ selected" : exceeds ? "✗ exceeds target" : "pending"}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Merged (element-wise max)</div>
          <div className="flex gap-3">
            {merged.map((v, i) => (
              <div key={i} className="flex-1 py-2 rounded-lg text-center text-xl font-bold" style={{ background: done && v===TARGET[i] ? "rgba(34,197,94,0.2)" : "var(--bg-hover)", color: done && v===TARGET[i] ? "#22c55e" : "#4f8ef7" }}>{v}</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Target</div>
          <div className="flex gap-3">
            {TARGET.map((v, i) => (
              <div key={i} className="flex-1 py-2 rounded-lg text-center text-xl font-bold" style={{ background: "rgba(79,142,247,0.1)", color: "#4f8ef7" }}>{v}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? (success ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)") : "rgba(79,142,247,0.07)", color: done ? (success ? "#22c55e" : "#ef4444") : "#4f8ef7", border: `1px solid ${done ? (success ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
