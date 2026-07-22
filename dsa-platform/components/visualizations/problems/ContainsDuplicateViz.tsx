"use client";
import { useState, useEffect, useRef } from "react";

const NUMS = [1, 2, 3, 1, 4, 2];

export default function ContainsDuplicateViz() {
  const [idx, setIdx] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [found, setFound] = useState<number|null>(null);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — add each number to hash set, stop if already seen");
  const stateRef = useRef({ idx:0, seen:new Set<number>(), found:null as number|null });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = () => {
    stateRef.current={idx:0,seen:new Set(),found:null};
    setIdx(0); setSeen(new Set()); setFound(null); setDone(false); setPlaying(false);
    setMsg("Press Play — add each number to hash set, stop if already seen");
    if(iRef.current)clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx:i, seen:s, found:f } = stateRef.current;
    if (i>=NUMS.length||f!==null) { setDone(true); setPlaying(false);
      setMsg(stateRef.current.found!==null?"Duplicate found → true":"No duplicates → false"); return; }
    const v=NUMS[i];
    if (s.has(v)) {
      stateRef.current={idx:i+1,seen:new Set(s),found:v};
      setIdx(i+1); setSeen(new Set(s)); setFound(v); setDone(true); setPlaying(false);
      setMsg(`${v} already in set → return true! Contains duplicate.`);
    } else {
      const ns=new Set(s); ns.add(v);
      stateRef.current={idx:i+1,seen:ns,found:null};
      setIdx(i+1); setSeen(new Set(ns));
      setMsg(`${v} not seen yet → add to hash set`);
      if (i+1>=NUMS.length) { setDone(true); setPlaying(false); setMsg("All elements unique → return false"); }
    }
  };

  useEffect(() => {
    if (playing) { iRef.current=setInterval(doStep,speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current=null; }
    return () => { if(iRef.current)clearInterval(iRef.current); };
  }, [playing,speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color:"var(--text-primary)" }}>Contains Duplicate — Hash Set</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>Insert each element into set. If element already exists → duplicate found.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="2000" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Input array</div>
        <div className="flex gap-2">
          {NUMS.map((v,i)=>{
            const isDup = found===v && i<idx;
            const isCur = i===idx-1&&found===null;
            const wasSeen = i<idx&&found===null&&!isDup;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{ background:isDup?"rgba(239,68,68,0.3)":isCur?"rgba(79,142,247,0.3)":wasSeen?"rgba(168,85,247,0.1)":"var(--bg-hover)", border:isDup?"2px solid #ef4444":isCur?"2px solid #4f8ef7":wasSeen?"1px solid rgba(168,85,247,0.3)":"1px solid var(--border)", color:isDup?"#ef4444":isCur?"#4f8ef7":"var(--text-secondary)", transform:(isCur||isDup)?"scale(1.1)":"scale(1)" }}>
                  {v}
                </div>
                {isDup&&<span style={{ fontSize:"8px", color:"#ef4444" }}>DUP!</span>}
                {isCur&&<span style={{ fontSize:"8px", color:"#4f8ef7" }}>cur</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Hash Set (seen)</div>
        <div className="flex gap-2 flex-wrap min-h-10">
          {Array.from(seen).sort((a,b)=>a-b).map(v=>(
            <div key={v} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background:found===v?"rgba(239,68,68,0.2)":"rgba(34,197,94,0.12)", border:found===v?"1px solid rgba(239,68,68,0.4)":"1px solid rgba(34,197,94,0.3)", color:found===v?"#ef4444":"#22c55e" }}>
              {v}
            </div>
          ))}
          {seen.size===0&&<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>{ }</span>}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:found!==null?"rgba(239,68,68,0.08)":done?"rgba(34,197,94,0.08)":"rgba(79,142,247,0.07)", color:found!==null?"#ef4444":done?"#22c55e":"#4f8ef7", border:`1px solid ${found!==null?"rgba(239,68,68,0.3)":done?"rgba(34,197,94,0.3)":"rgba(79,142,247,0.18)"}` }}>
        {msg}
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:found!==null?"rgba(239,68,68,0.08)":"rgba(34,197,94,0.08)", border:`1px solid ${found!==null?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
          <div className="font-semibold text-sm" style={{ color:found!==null?"#ef4444":"#22c55e" }}>
            {found!==null?`true — duplicate found: ${found}`:"false — no duplicates"}
          </div>
        </div>
      )}
    </div>
  );
}
