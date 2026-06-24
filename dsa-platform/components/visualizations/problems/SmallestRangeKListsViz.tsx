"use client";
import { useState, useEffect, useRef } from "react";

const LISTS = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]];
const COLORS = ["#4f8ef7","#a855f7","#f97316"];
const LIST_LABELS = ["L0","L1","L2"];

interface HeapEntry { val: number; li: number; ei: number }
interface St { heap: HeapEntry[]; curMax: number; rangeL: number; rangeR: number; bestL: number; bestR: number; popped: HeapEntry | null; pushed: HeapEntry | null; msg: string }

function buildSteps(): St[] {
  const steps: St[] = [];
  const heap: HeapEntry[] = LISTS.map((l, li) => ({ val: l[0], li, ei: 0 }));
  heap.sort((a, b) => a.val - b.val);
  let curMax = Math.max(...heap.map(h => h.val));
  let bestL = heap[0].val, bestR = curMax;

  steps.push({ heap: [...heap], curMax, rangeL: heap[0].val, rangeR: curMax, bestL, bestR, popped: null, pushed: null, msg: `Init: one from each list, curMax=${curMax}, range=[${heap[0].val},${curMax}]` });

  while (heap.length === LISTS.length) {
    const min = heap.shift()!;
    const newRange = curMax - min.val;
    const best = bestR - bestL;
    if (curMax - min.val < best) { bestL = min.val; bestR = curMax; }

    if (min.ei + 1 >= LISTS[min.li].length) {
      steps.push({ heap: [...heap], curMax, rangeL: min.val, rangeR: curMax, bestL, bestR, popped: min, pushed: null, msg: `Pop ${min.val} from L${min.li}. List exhausted → done!` });
      break;
    }

    const next: HeapEntry = { val: LISTS[min.li][min.ei + 1], li: min.li, ei: min.ei + 1 };
    heap.push(next);
    heap.sort((a, b) => a.val - b.val);
    curMax = Math.max(curMax, next.val);

    steps.push({ heap: [...heap], curMax, rangeL: heap[0].val, rangeR: curMax, bestL, bestR, popped: min, pushed: next, msg: `Pop ${min.val}→push ${next.val}(L${next.li}). curMax=${curMax}, range=[${heap[0].val},${curMax}] len=${curMax - heap[0].val}${bestL === heap[0].val && bestR === curMax ? " ← new best!" : ""}` });
  }
  return steps;
}

const STEPS = buildSteps();

export default function SmallestRangeKListsViz() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = idx >= STEPS.length;
  const cur = STEPS[Math.min(idx, STEPS.length - 1)];

  const doStep = () => setIdx(p => { const n = Math.min(p + 1, STEPS.length); if (n >= STEPS.length) setPlaying(false); return n; });
  const reset = () => { setIdx(0); setPlaying(false); };

  useEffect(() => {
    if (playing && !done) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed, done]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Smallest Range Covering K Lists</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Min-heap of size k. Pop min, push next from same list, track curMax. Range = [min, curMax].</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min={300} max={2500} step={100} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: "#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>K sorted lists</div>
        {LISTS.map((list, li) => {
          const inHeap = cur.heap.find(h => h.li === li);
          return (
            <div key={li} className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono w-8" style={{ color: COLORS[li] }}>{LIST_LABELS[li]}</span>
              <div className="flex gap-1">
                {list.map((v, ei) => (
                  <div key={ei} className="w-9 h-8 rounded flex items-center justify-center text-xs font-bold"
                    style={{
                      background: inHeap?.ei === ei ? `${COLORS[li]}33` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${inHeap?.ei === ei ? COLORS[li] : "var(--border)"}`,
                      color: inHeap?.ei === ei ? COLORS[li] : "var(--text-muted)",
                    }}>{v}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Min-heap (sorted by val)</div>
        <div className="flex gap-2">
          {cur.heap.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: `${COLORS[h.li]}22`, border: `2px solid ${COLORS[h.li]}`, color: COLORS[h.li] }}>{h.val}</div>
              <span className="text-xs" style={{ color: COLORS[h.li] }}>{LIST_LABELS[h.li]}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Range: <span style={{ color: "#f97316", fontWeight: "bold" }}>[{cur.rangeL}, {cur.rangeR}]</span> = {cur.rangeR - cur.rangeL}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Best: <span style={{ color: "#22c55e", fontWeight: "bold" }}>[{cur.bestL}, {cur.bestR}]</span> = {cur.bestR - cur.bestL}</div>
        </div>
      </div>

      <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{cur.msg}</span>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>Smallest Range: [{STEPS[STEPS.length - 1].bestL}, {STEPS[STEPS.length - 1].bestR}]</div>
        </div>
      )}
    </div>
  );
}
