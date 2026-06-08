"use client";
import { useState, useEffect, useRef } from "react";

const NUMS = [4,1,2,1,2];

export default function SingleNumberViz() {
  const [idx, setIdx] = useState(0);
  const [xorVal, setXorVal] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const stateRef = useRef({ idx:0, xorVal:0 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = () => { stateRef.current={idx:0,xorVal:0}; setIdx(0); setXorVal(0); setDone(false); setPlaying(false); if(iRef.current)clearInterval(iRef.current); };

  const doStep = () => {
    const { idx:i, xorVal:x } = stateRef.current;
    if (i>=NUMS.length) { setDone(true); setPlaying(false); return; }
    const nx = x ^ NUMS[i];
    stateRef.current={idx:i+1, xorVal:nx};
    setIdx(i+1); setXorVal(nx);
    if (i+1>=NUMS.length) { setDone(true); setPlaying(false); }
  };

  useEffect(() => {
    if (playing) { iRef.current=setInterval(doStep,speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current=null; }
    return () => { if(iRef.current)clearInterval(iRef.current); };
  }, [playing,speed]);

  const toBin = (n: number) => n.toString(2).padStart(4,"0");

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color:"var(--text-primary)" }}>Single Number — XOR Bit Trick</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>XOR all numbers. Pairs cancel (n⊕n=0), single survives (0⊕n=n).</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="2000" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Array */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Input array</div>
        <div className="flex gap-2">
          {NUMS.map((v,i)=>(
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                style={{ background:i===idx-1?"rgba(79,142,247,0.3)":i<idx?"rgba(168,85,247,0.12)":"var(--bg-hover)", border:i===idx-1?"2px solid #4f8ef7":i<idx?"1px solid rgba(168,85,247,0.3)":"1px solid var(--border)", color:i===idx-1?"#4f8ef7":"var(--text-secondary)" }}>
                {v}
              </div>
              <span style={{ fontSize:"8px", color:"var(--text-muted)", fontFamily:"monospace" }}>{toBin(v)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* XOR table */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>XOR accumulation (result = running XOR)</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span style={{ width:"40px", color:"var(--text-muted)" }}>start:</span>
            <span style={{ color:"var(--text-muted)" }}>0 = {toBin(0)}</span>
          </div>
          {NUMS.slice(0,idx).map((v,i)=>{
            const before = NUMS.slice(0,i).reduce((a,b)=>a^b,0);
            const after = before^v;
            return (
              <div key={i} className="flex items-center gap-2 text-xs font-mono px-2 py-1 rounded"
                style={{ background:i===idx-1?"rgba(79,142,247,0.1)":"rgba(255,255,255,0.02)", border:i===idx-1?"1px solid rgba(79,142,247,0.3)":"1px solid transparent" }}>
                <span style={{ width:"50px", color:"#f97316" }}>{toBin(before)}</span>
                <span style={{ color:"var(--text-muted)" }}>⊕</span>
                <span style={{ width:"50px", color:"#a855f7" }}>{toBin(v)}</span>
                <span style={{ color:"var(--text-muted)" }}>=</span>
                <span style={{ color:i===idx-1?"#4f8ef7":"var(--text-secondary)" }}>{toBin(after)}</span>
                <span style={{ color:"var(--text-muted)" }}>({after})</span>
                {NUMS.filter((x,j)=>j!==i&&x===v).length===0&&<span style={{ color:"#22c55e", fontSize:"8px" }}> ← single!</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-4 flex items-center justify-between" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div>
          <div className="text-xs" style={{ color:"var(--text-muted)" }}>XOR result</div>
          <div className="text-2xl font-bold font-mono mt-1" style={{ color:done?"#22c55e":"#4f8ef7" }}>{xorVal}</div>
          <div className="text-xs font-mono" style={{ color:"var(--text-muted)" }}>{toBin(xorVal)}</div>
        </div>
        {done&&<div className="text-sm font-semibold" style={{ color:"#22c55e" }}>Single number = {xorVal}</div>}
      </div>
    </div>
  );
}
