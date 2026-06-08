"use client";
import { useState } from "react";

const STREAM = [1,2,3,4,5,6,7];

function median(lo: number[], hi: number[]): number {
  if (lo.length === hi.length) return (lo[lo.length-1] + hi[0]) / 2;
  if (lo.length > hi.length) return lo[lo.length-1];
  return hi[0];
}

export default function FindMedianStreamViz() {
  // lo = max-heap (stored sorted asc, use last element as max)
  // hi = min-heap (stored sorted asc, use first element as min)
  const [lo, setLo] = useState<number[]>([]);
  const [hi, setHi] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [medians, setMedians] = useState<number[]>([]);

  const addNum = () => {
    if (idx >= STREAM.length) return;
    const val = STREAM[idx];
    let nl = [...lo], nh = [...hi];

    if (!nl.length || val <= nl[nl.length-1]) { nl.push(val); nl.sort((a,b)=>a-b); }
    else { nh.push(val); nh.sort((a,b)=>a-b); }

    // Balance
    if (nl.length > nh.length + 1) { nh.unshift(nl.pop()!); nh.sort((a,b)=>a-b); }
    else if (nh.length > nl.length) { nl.push(nh.shift()!); nl.sort((a,b)=>a-b); }

    setLo(nl); setHi(nh);
    setMedians(prev => [...prev, median(nl,nh)]);
    setIdx(idx+1);
  };

  const reset = () => { setLo([]); setHi([]); setIdx(0); setMedians([]); };
  const done = idx >= STREAM.length;
  const currentMedian = lo.length || hi.length ? median(lo,hi) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Find Median from Data Stream — Two Heaps</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>Max-heap (lo) holds smaller half, min-heap (hi) holds larger half. Median = tops.</div>
        <div className="flex gap-2">
          <button onClick={addNum} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:"rgba(34,197,94,0.15)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>+ Add {idx<STREAM.length?STREAM[idx]:""}</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"#22c55e" }}>lo (max-heap: smaller half)</div>
          <div className="flex flex-col-reverse gap-1">
            {lo.map((v,i)=>(
              <div key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-center transition-all"
                style={{ background:i===lo.length-1?"rgba(34,197,94,0.2)":"rgba(34,197,94,0.06)", border:i===lo.length-1?"1px solid rgba(34,197,94,0.5)":"1px solid var(--border)", color:i===lo.length-1?"#22c55e":"var(--text-muted)" }}>
                {v}{i===lo.length-1&&<span style={{ fontSize:"8px" }}> ← max</span>}
              </div>
            ))}
            {lo.length===0&&<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</span>}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"#f97316" }}>hi (min-heap: larger half)</div>
          <div className="flex flex-col gap-1">
            {hi.map((v,i)=>(
              <div key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-center"
                style={{ background:i===0?"rgba(249,115,22,0.2)":"rgba(249,115,22,0.06)", border:i===0?"1px solid rgba(249,115,22,0.5)":"1px solid var(--border)", color:i===0?"#f97316":"var(--text-muted)" }}>
                {v}{i===0&&<span style={{ fontSize:"8px" }}> ← min</span>}
              </div>
            ))}
            {hi.length===0&&<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</span>}
          </div>
        </div>
      </div>

      {currentMedian !== null && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.3)" }}>
          <div className="text-xs" style={{ color:"var(--text-muted)" }}>Current median</div>
          <div className="text-3xl font-bold font-mono mt-1" style={{ color:"#a855f7" }}>{currentMedian}</div>
          <div className="text-xs mt-1" style={{ color:"var(--text-muted)" }}>
            {lo.length===hi.length?`(${lo[lo.length-1]}+${hi[0]})/2`:`lo.max=${lo[lo.length-1]}`}
          </div>
        </div>
      )}

      {medians.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Medians over time</div>
          <div className="flex gap-2 flex-wrap">
            {medians.map((m,i)=>(
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono" style={{ background:"rgba(168,85,247,0.1)", color:"#a855f7", border:"1px solid rgba(168,85,247,0.3)" }}>{m}</div>
                <span style={{ fontSize:"8px", color:"var(--text-muted)" }}>+{STREAM[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
