"use client";
import { useState } from "react";

const STREAM = [4,5,8,2,9,1,7,3,6];
const K = 3;

export default function KthLargestStreamViz() {
  const [heap, setHeap] = useState<number[]>([]);
  const [streamIdx, setStreamIdx] = useState(0);
  const [results, setResults] = useState<(number|null)[]>([]);
  const [lastAdded, setLastAdded] = useState<number|null>(null);
  const [lastEvicted, setLastEvicted] = useState<number|null>(null);

  const addNum = () => {
    if (streamIdx >= STREAM.length) return;
    const val = STREAM[streamIdx];
    setLastAdded(val); setLastEvicted(null);
    let h = [...heap, val].sort((a,b)=>a-b);
    let evicted: number|null = null;
    if (h.length > K) { evicted = h[0]; h = h.slice(1); setLastEvicted(evicted); }
    setHeap(h);
    setResults(prev => [...prev, h.length >= K ? h[0] : null]);
    setStreamIdx(streamIdx+1);
  };

  const reset = () => { setHeap([]); setStreamIdx(0); setResults([]); setLastAdded(null); setLastEvicted(null); };
  const done = streamIdx >= STREAM.length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Kth Largest in Stream — Min-Heap of Size K (k={K})</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>Min-heap of size k: heap top = kth largest. Evict smallest if heap grows beyond k.</div>
        <div className="flex gap-2">
          <button onClick={addNum} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:"rgba(34,197,94,0.15)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>+ Add Next</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>

      {/* Stream */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Stream</div>
        <div className="flex gap-2 flex-wrap">
          {STREAM.map((v,i)=>(
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all"
                style={{ background:i===streamIdx-1?"rgba(79,142,247,0.25)":i<streamIdx?"rgba(34,197,94,0.08)":"var(--bg-hover)", border:i===streamIdx-1?"2px solid #4f8ef7":i===streamIdx?"1px dashed rgba(79,142,247,0.4)":"1px solid var(--border)", color:i===streamIdx-1?"#4f8ef7":i<streamIdx?"var(--text-muted)":"var(--text-secondary)" }}>
                {v}
              </div>
              {i===streamIdx&&<span style={{ fontSize:"8px", color:"#4f8ef7" }}>next</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Heap */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Min-heap (size≤k={K}) — front=minimum=kth largest</div>
        <div className="flex gap-2 items-center">
          {heap.map((v,i)=>(
            <div key={i} className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
              style={{ background:i===0?"rgba(239,68,68,0.15)":"rgba(168,85,247,0.12)", border:i===0?"1px solid rgba(239,68,68,0.4)":"1px solid rgba(168,85,247,0.3)", color:i===0?"#ef4444":"#a855f7" }}>
              {v}
              {i===0&&<span style={{ fontSize:"7px", display:"block", color:"#ef4444" }}>min</span>}
            </div>
          ))}
          {heap.length===0&&<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</span>}
        </div>
        {lastEvicted !== null && (
          <div className="mt-2 text-xs" style={{ color:"#ef4444" }}>← evicted {lastEvicted} (was smallest, below kth)</div>
        )}
        {heap.length >= K && (
          <div className="mt-2 text-xs font-mono" style={{ color:"#22c55e" }}>kth largest = heap top = {heap[0]}</div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Returns (kth largest after each add)</div>
          <div className="flex gap-2 flex-wrap">
            {results.map((r,i)=>(
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono" style={{ background:r!==null?"rgba(34,197,94,0.12)":"var(--bg-hover)", color:r!==null?"#22c55e":"var(--text-muted)", border:`1px solid ${r!==null?"rgba(34,197,94,0.3)":"var(--border)"}` }}>{r ?? "?"}</div>
                <span style={{ fontSize:"8px", color:"var(--text-muted)" }}>+{STREAM[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
