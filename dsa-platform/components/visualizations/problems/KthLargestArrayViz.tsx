"use client";
import { useState, useRef, useEffect } from "react";

const NUMS = [3, 2, 1, 5, 6, 4];
const K = 2;

export default function KthLargestArrayViz() {
  const [idx, setIdx] = useState(0);
  const [heap, setHeap] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState(`Min-heap of size k=${K}. Top = kth largest. Process each number.`);
  const stateRef = useRef({ idx: 0, heap: [] as number[] });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pushHeap = (h: number[], v: number): number[] => {
    const newH = [...h, v].sort((a, b) => a - b);
    if (newH.length > K) newH.shift(); // remove smallest (min-heap behavior)
    return newH;
  };

  const reset = () => {
    stateRef.current = { idx: 0, heap: [] };
    setIdx(0); setHeap([]); setDone(false); setPlaying(false);
    setMsg(`Min-heap of size k=${K}. Top = kth largest. Process each number.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, heap: h } = stateRef.current;
    if (i >= NUMS.length) {
      setDone(true); setPlaying(false);
      setMsg(`Heap top = ${h[0]} = ${K}th largest!`); return;
    }
    const v = NUMS[i];
    const newH = pushHeap(h, v);
    let action = "";
    if (h.length < K) action = `heap size<${K}, push ${v}`;
    else if (v > h[0]) action = `${v} > heap top ${h[0]}, replace → pop ${h[0]}, push ${v}`;
    else action = `${v} ≤ heap top ${h[0]}, discard ${v}`;
    stateRef.current = { idx: i + 1, heap: newH };
    setIdx(i + 1); setHeap(newH); setMsg(action);
    if (i + 1 >= NUMS.length) { setDone(true); setPlaying(false); setMsg(`Heap = [${newH.join(", ")}] → ${K}th largest = ${newH[0]}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Kth Largest Element — Min Heap of Size K</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Keep only k largest elements. Top of min-heap = kth largest.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Input array (k={K})</div>
        <div className="flex gap-2">
          {NUMS.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full py-2.5 rounded-lg text-center text-sm font-bold" style={{
                background: i === idx - 1 ? "rgba(249,115,22,0.25)" : i < idx ? "rgba(107,114,128,0.12)" : "var(--bg-hover)",
                border: i === idx ? "2px solid #4f8ef7" : "1px solid var(--border)",
                color: i < idx ? "var(--text-muted)" : "var(--text-secondary)"
              }}>{v}</div>
              {i === idx && <div className="text-xs" style={{ color: "#4f8ef7" }}>next</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Min-heap (size ≤ k={K})</div>
        <div className="flex gap-3">
          {heap.map((v, i) => (
            <div key={i} className="px-4 py-3 rounded-lg text-sm font-bold text-center" style={{
              background: i === 0 ? "rgba(249,115,22,0.2)" : "rgba(79,142,247,0.15)",
              border: i === 0 ? "2px solid #f97316" : "1px solid rgba(79,142,247,0.4)",
              color: i === 0 ? "#f97316" : "#4f8ef7"
            }}>
              {v}{i === 0 ? <div className="text-xs font-normal mt-0.5">min/top</div> : null}
            </div>
          ))}
          {heap.length === 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>empty</span>}
        </div>
        {done && (
          <div className="mt-3 p-3 rounded-lg text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{K}th largest</div>
            <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{heap[0]}</div>
          </div>
        )}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
