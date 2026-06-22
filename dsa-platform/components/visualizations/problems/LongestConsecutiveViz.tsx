"use client";
import { useState, useEffect, useRef } from "react";

export default function LongestConsecutiveViz() {
  const [nums, setNums] = useState([100,4,200,1,3,2]);
  const [input, setInput] = useState("100,4,200,1,3,2");
  const [numSet, setNumSet] = useState<Set<number>>(new Set());
  const [activeStart, setActiveStart] = useState<number|null>(null);
  const [currentSeq, setCurrentSeq] = useState<number[]>([]);
  const [best, setBest] = useState<number[]>([]);
  const [checkedStarts, setCheckedStarts] = useState<number[]>([]);
  const [skipped, setSkipped] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle"|"build-set"|"find"|"done">("idle");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — add all to set, then find sequence starts (no n-1 in set), extend each");
  const stateRef = useRef({ phase:"idle" as string, step:0, numSet:new Set<number>(), bestSeq:[] as number[], checkedStarts:[] as number[], skipped:[] as number[], nums:[100,4,200,1,3,2] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums) => {
    stateRef.current = { phase:"build-set", step:0, numSet:new Set(), bestSeq:[], checkedStarts:[], skipped:[], nums:n };
    setNumSet(new Set()); setActiveStart(null); setCurrentSeq([]); setBest([]); setCheckedStarts([]); setSkipped([]);
    setPhase("build-set"); setPlaying(false); setMsg("Step 1: add all numbers to hash set");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.phase === "build-set") {
      const ns = new Set(st.numSet);
      st.nums.forEach(n => ns.add(n));
      stateRef.current = { ...st, phase:"find", step:0, numSet:ns };
      setNumSet(ns); setPhase("find"); setMsg("Step 2: for each number, check if it's a sequence start (n-1 NOT in set)"); return;
    }
    if (st.phase === "find") {
      const sortedNums = [...new Set(st.nums)].sort((a,b)=>a-b);
      const next = st.step;
      if (next >= sortedNums.length) {
        stateRef.current = { ...st, phase:"done" };
        setPhase("done"); setPlaying(false); setActiveStart(null); setCurrentSeq([]);
        setMsg(`Done! Longest consecutive sequence: [${st.bestSeq.join(",")}] length=${st.bestSeq.length}`); return;
      }
      const num = sortedNums[next];
      if (st.numSet.has(num-1)) {
        // Not a start — skip
        const ns = [...st.skipped, num];
        stateRef.current = { ...st, step:next+1, skipped:ns };
        setSkipped(ns); setActiveStart(null); setCurrentSeq([]);
        setMsg(`${num}-1=${num-1} is in set → NOT a sequence start, skip`);
      } else {
        // Is a start — extend
        const seq: number[] = [];
        let cur = num;
        while (st.numSet.has(cur)) { seq.push(cur); cur++; }
        const nc = [...st.checkedStarts, num];
        const nb = seq.length > st.bestSeq.length ? seq : st.bestSeq;
        stateRef.current = { ...st, step:next+1, checkedStarts:nc, bestSeq:nb };
        setCheckedStarts(nc); setBest(nb); setActiveStart(num); setCurrentSeq(seq);
        setMsg(`${num} is sequence start → extend: [${seq.join("→")}] length=${seq.length}`);
      }
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const n = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));
    setNums(n); reset(n);
  };

  const sortedDisplay = [...new Set(nums)].sort((a,b)=>a-b);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Longest Consecutive Sequence — Hash Set O(n)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>nums:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"220px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Sorted number line */}
      {numSet.size > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Numbers (sorted for display)</div>
          <div className="flex gap-2 flex-wrap">
            {sortedDisplay.map(n => {
              const inBest = phase==="done"&&best.includes(n);
              const inSeq = currentSeq.includes(n);
              const isStart = n === activeStart;
              const wasSkipped = skipped.includes(n);
              return (
                <div key={n} className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                  style={{ background:inBest?"rgba(34,197,94,0.2)":inSeq?"rgba(79,142,247,0.2)":isStart?"rgba(168,85,247,0.2)":wasSkipped?"rgba(255,255,255,0.03)":"var(--bg-hover)", border:inBest?"2px solid #22c55e":inSeq?"2px solid #4f8ef7":isStart?"2px solid #a855f7":"1px solid var(--border)", color:inBest?"#22c55e":inSeq?"#4f8ef7":isStart?"#a855f7":wasSkipped?"var(--text-muted)":"var(--text-secondary)", transform:inSeq&&!inBest?"scale(1.08) translateY(-3px)":"scale(1)" }}>
                  {n}
                  {isStart&&<div style={{ fontSize:"8px", color:"#a855f7" }}>start</div>}
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            <span className="text-[10px] flex items-center gap-1"><span style={{ display:"inline-block", width:8, height:8, background:"rgba(168,85,247,0.3)", borderRadius:2 }}></span><span style={{ color:"var(--text-muted)" }}>sequence start</span></span>
            <span className="text-[10px] flex items-center gap-1"><span style={{ display:"inline-block", width:8, height:8, background:"rgba(79,142,247,0.3)", borderRadius:2 }}></span><span style={{ color:"var(--text-muted)" }}>current sequence</span></span>
            <span className="text-[10px] flex items-center gap-1"><span style={{ display:"inline-block", width:8, height:8, background:"rgba(34,197,94,0.3)", borderRadius:2 }}></span><span style={{ color:"var(--text-muted)" }}>best sequence</span></span>
          </div>
        </div>
      )}

      {currentSeq.length > 0 && (
        <div className="rounded-xl p-3" style={{ background:"rgba(79,142,247,0.07)", border:"1px solid rgba(79,142,247,0.2)" }}>
          <div className="text-xs" style={{ color:"var(--text-muted)" }}>Current sequence:</div>
          <div className="flex gap-1 mt-1 flex-wrap">
            {currentSeq.map((n,i) => (
              <span key={i} className="flex items-center gap-0.5">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7" }}>{n}</span>
                {i<currentSeq.length-1&&<span style={{ color:"var(--text-muted)", fontSize:"10px" }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {phase==="done"&&best.length>0&&(
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Longest consecutive: [{best.join(" → ")}] — length {best.length}</div>
        </div>
      )}
    </div>
  );
}
