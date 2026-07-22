"use client";
import { useState, useEffect, useRef } from "react";

export default function KokoBananasViz() {
  const [piles, setPiles] = useState([3,6,7,11]);
  const [h, setH] = useState(8);
  const [input, setInput] = useState("3,6,7,11");
  const [hi, setHi] = useState("8");
  const [L, setL] = useState(1);
  const [R, setR] = useState(11);
  const [mid, setMid] = useState(-1);
  const [result, setResult] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — binary search on speed k, check if k bananas/hr finishes in h hours");
  const stateRef = useRef({ l:1, r:11, piles:[3,6,7,11], h:8 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const canFinish = (p: number[], speed: number, hours: number) =>
    p.reduce((acc,pile) => acc + Math.ceil(pile/speed), 0) <= hours;

  const reset = (p=piles, hv=h) => {
    const maxP = Math.max(...p);
    stateRef.current = { l:1, r:maxP, piles:p, h:hv };
    setL(1); setR(maxP); setMid(-1); setResult(-1); setDone(false); setPlaying(false);
    setMsg(`L=1, R=${maxP} (max pile), binary search for min k`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { l, r, piles: p, h: hv } = stateRef.current;
    if (l > r) { setDone(true); setPlaying(false); setMsg(`Done! Min speed = ${stateRef.current.l-1>0?stateRef.current.l:result}`); return; }
    const m = Math.floor((l+r)/2);
    setMid(m);
    const hours = p.reduce((acc,pile)=>acc+Math.ceil(pile/m),0);
    if (canFinish(p, m, hv)) {
      stateRef.current = { ...stateRef.current, r:m-1 };
      setResult(m); setR(m-1);
      setMsg(`k=${m}: hours=${hours} ≤ h=${hv} ✓ → valid! Try smaller. R=${m-1}`);
    } else {
      stateRef.current = { ...stateRef.current, l:m+1 };
      setL(m+1);
      setMsg(`k=${m}: hours=${hours} > h=${hv} ✗ → too slow. L=${m+1}`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const p = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)&&x>0);
    const hv = parseInt(hi)||1;
    setPiles(p); setH(hv); reset(p,hv);
  };

  const maxPile = Math.max(...piles,1);
  const range = R - L + 1;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Koko Eating Bananas — Binary Search on Answer</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>piles:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"160px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>h:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"60px" }} value={hi} onChange={e=>setHi(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Piles */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Piles — h={h} hours available</div>
        <div className="flex gap-3 flex-wrap items-end" style={{ height:"80px" }}>
          {piles.map((p,i)=>(
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="rounded-t transition-all duration-200" style={{ width:"44px", height:`${(p/maxPile)*60}px`, background:"rgba(168,85,247,0.25)", border:"1px solid rgba(168,85,247,0.4)" }}></div>
              <span style={{ fontSize:"11px", color:"var(--text-secondary)", fontFamily:"monospace", fontWeight:"bold" }}>{p}</span>
              {mid>0&&<span style={{ fontSize:"9px", color:"var(--text-muted)" }}>⌈{p}/{mid}⌉={Math.ceil(p/mid)}</span>}
            </div>
          ))}
        </div>
        {mid>0&&(
          <div className="mt-2 text-xs font-mono" style={{ color:"var(--text-muted)" }}>
            hours at k={mid}: {piles.map(p=>`⌈${p}/${mid}⌉=${Math.ceil(p/mid)}`).join(" + ")} = {piles.reduce((a,p)=>a+Math.ceil(p/mid),0)} hours
          </div>
        )}
      </div>

      {/* Search range */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Search space [L={L}, R={R}] — {range} values remain</div>
        <div className="h-3 rounded-full relative" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)" }}>
          <div className="h-full rounded-full transition-all duration-300" style={{ background:"linear-gradient(90deg,#4f8ef7,#a855f7)", width:`${(range/maxPile)*100}%`, marginLeft:`${((L-1)/maxPile)*100}%` }}></div>
          {mid>0&&<div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white transition-all duration-300" style={{ left:`${((mid-1)/maxPile)*100}%`, background:"#f97316", boxShadow:"0 0 8px rgba(249,115,22,0.5)" }}></div>}
        </div>
        <div className="flex justify-between text-[10px] mt-1" style={{ color:"var(--text-muted)" }}>
          <span>1</span><span style={{ color:"#f97316" }}>{mid>0?`mid=${mid}`:""}</span><span>{maxPile}</span>
        </div>
        <div className="flex gap-3 mt-2 text-xs">
          <span style={{ color:"#22c55e" }}>L={L}</span>
          <span style={{ color:"#ef4444" }}>R={R}</span>
          {result>0&&<span style={{ color:"var(--text-muted)" }}>best so far={result}</span>}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && result > 0 && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Min eating speed: {result} bananas/hour</div>
        </div>
      )}
    </div>
  );
}
