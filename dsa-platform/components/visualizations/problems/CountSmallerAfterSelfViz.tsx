"use client";
import { useState, useEffect, useRef } from "react";

const NUMS = [5, 2, 6, 1];
// Precomputed merge-sort steps for visualization
type MStep = { left: number[]; right: number[]; merged: number[]; rightMerged: number; leftIdx: number; countAdd: number[]; msg: string };

function computeSteps() {
  const counts = [0, 0, 0, 0];
  const arr = NUMS.map((v, i) => ({ v, i }));
  const steps: MStep[] = [];

  function merge(a: { v: number; i: number }[], l: number, m: number, r: number) {
    const left = a.slice(l, m);
    const right = a.slice(m, r);
    let i = 0, j = 0, k = l, rightCount = 0;
    const merged: number[] = [];
    while (i < left.length && j < right.length) {
      if (right[j].v < left[i].v) {
        merged.push(right[j].v);
        a[k++] = right[j++];
        rightCount++;
      } else {
        counts[left[i].i] += rightCount;
        steps.push({
          left: left.map(x => x.v), right: right.map(x => x.v),
          merged: [...merged, left[i].v], rightMerged: rightCount,
          leftIdx: i, countAdd: [...counts],
          msg: `left[${i}]=${left[i].v} placed — ${rightCount} right elements already merged before it → counts[${left[i].i}] += ${rightCount} = ${counts[left[i].i]}`
        });
        merged.push(left[i].v);
        a[k++] = left[i++];
      }
    }
    while (i < left.length) {
      counts[left[i].i] += rightCount;
      steps.push({
        left: left.map(x => x.v), right: right.map(x => x.v),
        merged: [...merged, left[i].v], rightMerged: rightCount,
        leftIdx: i, countAdd: [...counts],
        msg: `left[${i}]=${left[i].v} placed (right exhausted) — +${rightCount} → counts[${left[i].i}]=${counts[left[i].i]}`
      });
      merged.push(left[i].v);
      a[k++] = left[i++];
    }
    while (j < right.length) { merged.push(right[j].v); a[k++] = right[j++]; }
  }

  function mergeSort(a: { v: number; i: number }[], l: number, r: number) {
    if (r - l <= 1) return;
    const m = (l + r) >> 1;
    mergeSort(a, l, m);
    mergeSort(a, m, r);
    merge(a, l, m, r);
  }
  mergeSort(arr, 0, arr.length);
  return { steps, finalCounts: counts };
}

const { steps, finalCounts } = computeSteps();

export default function CountSmallerAfterSelfViz() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = idx >= steps.length;
  const cur = steps[Math.min(idx, steps.length - 1)];

  const doStep = () => setIdx(p => { const n = Math.min(p + 1, steps.length); if (n >= steps.length) setPlaying(false); return n; });
  const reset = () => { setIdx(0); setPlaying(false); };

  useEffect(() => {
    if (playing && !done) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed, done]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Count of Smaller — Merge Sort</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          When a left element merges, count of right elements already placed = smaller-after count.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={300} max={2000} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Input: nums = [{NUMS.join(", ")}]</div>
        <div className="flex gap-3">
          {NUMS.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.3)", color: "#4f8ef7" }}>{v}</div>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>[{i}]</span>
              <span className="text-xs font-bold" style={{ color: done ? "#22c55e" : "#f97316" }}>
                {done ? finalCounts[i] : (cur ? cur.countAdd[i] : 0)}
              </span>
            </div>
          ))}
        </div>
        <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Orange = running count, Green = final answer</div>
      </div>

      {cur && !done && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: "#a855f7" }}>Left half</div>
              <div className="flex gap-2">{cur.left.map((v, i) => <div key={i} className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold" style={{ background: i === cur.leftIdx ? "rgba(168,85,247,0.2)" : "rgba(168,85,247,0.08)", border: `1px solid ${i === cur.leftIdx ? "#a855f7" : "rgba(168,85,247,0.3)"}`, color: "#a855f7" }}>{v}</div>)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: "#f97316" }}>Right half</div>
              <div className="flex gap-2">{cur.right.map((v, i) => <div key={i} className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold" style={{ background: i < cur.rightMerged ? "rgba(34,197,94,0.12)" : "rgba(249,115,22,0.08)", border: `1px solid ${i < cur.rightMerged ? "rgba(34,197,94,0.4)" : "rgba(249,115,22,0.3)"}`, color: i < cur.rightMerged ? "#22c55e" : "#f97316" }}>{v}</div>)}</div>
            </div>
          </div>
          <div className="text-xs font-mono px-3 py-2 rounded" style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)", color: "var(--text-secondary)" }}>
            rightCount = {cur.rightMerged} (right elements already merged)
          </div>
          <div className="text-xs mt-2 font-mono" style={{ color: "var(--text-secondary)" }}>{cur.msg}</div>
        </div>
      )}

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>Result: [{finalCounts.join(", ")}]</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>For [5,2,6,1]: 5 has [2,1]=2 smaller, 2 has [1]=1, 6 has [1]=1, 1 has none=0</div>
        </div>
      )}
    </div>
  );
}
