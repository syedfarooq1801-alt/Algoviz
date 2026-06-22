"use client";
import { useState, useEffect, useRef } from "react";

const NUMS = [1,2,3];

interface Step { arr: number[]; swapA?: number; swapB?: number; depth: number; action: string; found?: boolean; }

function buildSteps(): Step[] {
  const steps: Step[] = [];
  const arr = [...NUMS];
  function bt(start: number) {
    if (start === arr.length) { steps.push({ arr:[...arr], depth:start, action:`✓ Permutation [${arr}] complete`, found:true }); return; }
    for (let i=start;i<arr.length;i++) {
      steps.push({ arr:[...arr], swapA:start, swapB:i, depth:start, action:`Swap arr[${start}]=${arr[start]} ↔ arr[${i}]=${arr[i]}` });
      [arr[start],arr[i]]=[arr[i],arr[start]];
      bt(start+1);
      [arr[start],arr[i]]=[arr[i],arr[start]];
      steps.push({ arr:[...arr], swapA:start, swapB:i, depth:start, action:`Backtrack: restore arr[${start}] ↔ arr[${i}]` });
    }
  }
  bt(0);
  return steps;
}

const ALL_STEPS = buildSteps();

export default function PermutationsViz() {
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState<number[][]>([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const stateRef = useRef({ stepIdx:0, results:[] as number[][] });

  const reset = () => {
    stateRef.current = { stepIdx:0, results:[] };
    setStepIdx(0); setResults([]); setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { stepIdx: s, results: r } = stateRef.current;
    if (s >= ALL_STEPS.length) { setPlaying(false); return; }
    const step = ALL_STEPS[s];
    let nr = r;
    if (step.found) nr = [...r, [...step.arr]];
    stateRef.current = { stepIdx:s+1, results:nr };
    setStepIdx(s+1); setResults([...nr]);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const done = stepIdx >= ALL_STEPS.length;
  const cur = stepIdx > 0 ? ALL_STEPS[stepIdx-1] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color:"var(--text-primary)" }}>Permutations — Swap-Based Backtracking</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>nums={JSON.stringify(NUMS)}. Fix position start, swap each candidate in, recurse, swap back.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>step {stepIdx}/{ALL_STEPS.length}</span>
        </div>
      </div>

      {/* Array state */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Current array state</div>
        <div className="flex gap-2 items-end">
          {(cur?.arr||NUMS).map((v,i)=>{
            const isSwap = cur && (i===cur.swapA||i===cur.swapB);
            const isFixed = cur && i < cur.depth;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200"
                  style={{ background:isSwap?"rgba(249,115,22,0.3)":isFixed?"rgba(34,197,94,0.15)":"var(--bg-hover)", border:isSwap?"2px solid #f97316":isFixed?"1px solid rgba(34,197,94,0.3)":"1px solid var(--border)", color:isSwap?"#f97316":isFixed?"#22c55e":"var(--text-primary)", transform:isSwap?"scale(1.1)":"scale(1)" }}>
                  {v}
                </div>
                <span style={{ fontSize:"8px", color:"var(--text-muted)" }}>{i}</span>
                {isSwap&&<span style={{ fontSize:"7px", color:"#f97316" }}>swap</span>}
                {isFixed&&<span style={{ fontSize:"7px", color:"#22c55e" }}>fixed</span>}
              </div>
            );
          })}
        </div>
        {cur&&<div className="mt-2 text-xs" style={{ color:"var(--text-muted)" }}>depth={cur.depth} (positions 0..{cur.depth-1} fixed)</div>}
      </div>

      {cur && (
        <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:cur.found?"rgba(34,197,94,0.1)":"rgba(79,142,247,0.07)", color:cur.found?"#22c55e":"#4f8ef7", border:`1px solid ${cur.found?"rgba(34,197,94,0.3)":"rgba(79,142,247,0.18)"}` }}>
          {cur.action}
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"#22c55e" }}>Permutations found ({results.length}/{NUMS.length===3?6:24})</div>
          <div className="flex gap-2 flex-wrap">
            {results.map((p,i)=>(
              <span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background:"rgba(34,197,94,0.08)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.25)" }}>[{p.join(",")}]</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
