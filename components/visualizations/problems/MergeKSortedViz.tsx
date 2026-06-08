"use client";
import { useState, useRef, useEffect } from "react";

// lists = [[1,4,5],[1,3,4],[2,6]]
const LISTS = [[1,4,5],[1,3,4],[2,6]];

const buildSteps = () => {
  const heap: {val:number, list:number, idx:number}[] = [];
  const result: number[] = [];
  const steps: {heap: typeof heap, extracted: number|null, result: number[], msg: string}[] = [];
  const ptrs = [0,0,0];
  // init
  for (let i = 0; i < LISTS.length; i++) {
    if (LISTS[i].length > 0) heap.push({val: LISTS[i][0], list: i, idx: 0});
  }
  heap.sort((a,b) => a.val-b.val);
  steps.push({heap:[...heap], extracted: null, result: [], msg: `Init heap with heads: [${heap.map(h=>h.val).join(",")}]`});
  while (heap.length) {
    heap.sort((a,b) => a.val-b.val);
    const min = heap.shift()!;
    result.push(min.val);
    const nextIdx = min.idx + 1;
    if (nextIdx < LISTS[min.list].length) {
      heap.push({val: LISTS[min.list][nextIdx], list: min.list, idx: nextIdx});
      heap.sort((a,b) => a.val-b.val);
    }
    steps.push({heap:[...heap], extracted: min.val, result:[...result], msg: `Extract ${min.val} from list ${min.list+1}. Push next${nextIdx<LISTS[min.list].length?(' ('+LISTS[min.list][nextIdx]+')'):' (none)'}.`});
  }
  return steps;
};
const STEPS = buildSteps();

export default function MergeKSortedViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("Min heap of size k. Always extract minimum. Push next from same list.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Min heap of size k. Always extract minimum. Push next from same list.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Merged: [${STEPS[STEPS.length-1].result.join(",")}]`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Done! Merged: [${STEPS[next].result.join(",")}]`); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];
  const COLORS = ["#4f8ef7","#f97316","#a855f7"];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Merge K Sorted Lists — Min Heap</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Push heads into min-heap. Extract min, push next element from that list. O(N log k).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Input Lists</div>
          <div className="space-y-2">
            {LISTS.map((list, li) => (
              <div key={li} className="flex items-center gap-1">
                <span className="text-xs w-5" style={{ color: COLORS[li] }}>L{li+1}</span>
                {list.map((v,i) => (
                  <div key={i} className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold" style={{ background: `${COLORS[li]}20`, border: `1px solid ${COLORS[li]}50`, color: COLORS[li] }}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Min Heap</div>
          <div className="flex flex-wrap gap-1">
            {cur.heap.map((h,i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: i===0 ? "rgba(249,115,22,0.3)" : "rgba(79,142,247,0.15)", border: i===0 ? "2px solid #f97316" : `1px solid ${COLORS[h.list]}40`, color: i===0 ? "#f97316" : COLORS[h.list] }}>{h.val}</div>
                <span className="text-xs" style={{ color: COLORS[h.list] }}>L{h.list+1}</span>
              </div>
            ))}
            {cur.heap.length === 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>empty</span>}
          </div>
          {cur.extracted !== null && (
            <div className="mt-2 text-xs" style={{ color: "#22c55e" }}>Extracted: {cur.extracted}</div>
          )}
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Result</div>
        <div className="flex flex-wrap gap-1">
          {cur.result.map((v,i) => (
            <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#22c55e" }}>{v}</div>
          ))}
          {cur.result.length === 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
