"use client";
import { useState, useEffect, useRef } from "react";

export default function TrappingRainWaterViz() {
  const [heights, setHeights] = useState([0,1,0,2,1,0,1,3,2,1,2,1]);
  const [input, setInput] = useState("0,1,0,2,1,0,1,3,2,1,2,1");
  const [L, setL] = useState(0);
  const [R, setR] = useState(11);
  const [maxL, setMaxL] = useState(0);
  const [maxR, setMaxR] = useState(0);
  const [total, setTotal] = useState(0);
  const [water, setWater] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [msg, setMsg] = useState("Press Play — two pointers, process smaller maxBound side, add trapped water");
  const stateRef = useRef({ l:0, r:11, maxL:0, maxR:0, total:0, water:[] as number[], heights:[0,1,0,2,1,0,1,3,2,1,2,1] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (h=heights) => {
    stateRef.current = { l:0, r:h.length-1, maxL:0, maxR:0, total:0, water:Array(h.length).fill(0), heights:h };
    setL(0); setR(h.length-1); setMaxL(0); setMaxR(0); setTotal(0); setWater(Array(h.length).fill(0)); setDone(false); setPlaying(false);
    setMsg("L=0, R=last, maxL=0, maxR=0"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { l, r, maxL: ml, maxR: mr, total, water: w, heights: h } = stateRef.current;
    if (l >= r) {
      setDone(true); setPlaying(false); setMsg(`Done! Total trapped = ${total}`); return;
    }
    const nw = [...w];
    if (ml <= mr) {
      const newML = Math.max(ml, h[l]);
      const trapped = newML - h[l];
      nw[l] = trapped;
      stateRef.current = { ...stateRef.current, l:l+1, maxL:newML, total:total+trapped, water:nw };
      setL(l+1); setMaxL(newML); setTotal(total+trapped); setWater([...nw]);
      setMsg(`maxL≤maxR: process L=${l}. maxL=max(${ml},${h[l]})=${newML}. trapped=${newML}-${h[l]}=${trapped}`);
    } else {
      const newMR = Math.max(mr, h[r]);
      const trapped = newMR - h[r];
      nw[r] = trapped;
      stateRef.current = { ...stateRef.current, r:r-1, maxR:newMR, total:total+trapped, water:nw };
      setR(r-1); setMaxR(newMR); setTotal(total+trapped); setWater([...nw]);
      setMsg(`maxL>maxR: process R=${r}. maxR=max(${mr},${h[r]})=${newMR}. trapped=${newMR}-${h[r]}=${trapped}`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const h = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)&&x>=0);
    setHeights(h); reset(h);
  };

  const maxH = Math.max(...heights, 1);
  const barW = Math.max(22, Math.min(36, Math.floor(300/heights.length)));

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Trapping Rain Water — Two Pointers O(n)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>heights:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"260px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1200" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(79,142,247,0.1)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>total={total}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[["maxL",maxL,"#22c55e"],["maxR",maxR,"#f97316"],["trapped",total,"#4f8ef7"]].map(([l,v,c])=>(
          <div key={l as string} className="rounded-lg p-3 text-center" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
            <div className="text-xs" style={{ color:"var(--text-muted)" }}>{l as string}</div>
            <div className="text-xl font-bold font-mono mt-1" style={{ color:c as string }}>{v as number}</div>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="rounded-xl p-4 overflow-x-auto" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex items-end gap-0.5" style={{ height:"150px", minWidth:`${heights.length*(barW+2)}px` }}>
          {heights.map((h,i) => {
            const isL = i === L;
            const isR = i === R;
            const w = water[i] || 0;
            const barH = (h/maxH)*130;
            const waterH = (w/maxH)*130;
            return (
              <div key={i} className="relative flex flex-col justify-end" style={{ width:`${barW}px`, height:"100%", flexShrink:0 }}>
                {/* Water on top */}
                {w > 0 && <div className="absolute transition-all duration-300" style={{ bottom:`${barH}px`, left:0, right:0, height:`${waterH}px`, background:"rgba(79,142,247,0.35)", borderTop:"1px solid rgba(79,142,247,0.7)" }}></div>}
                {/* Bar */}
                <div className="transition-all duration-200" style={{ height:`${barH}px`, background:isL?"rgba(34,197,94,0.45)":isR?"rgba(249,115,22,0.45)":"rgba(168,85,247,0.25)", border:isL?"1px solid rgba(34,197,94,0.7)":isR?"1px solid rgba(249,115,22,0.7)":"1px solid rgba(168,85,247,0.4)", borderRadius:"2px 2px 0 0" }}></div>
                <span style={{ fontSize:"8px", color:isL?"#22c55e":isR?"#f97316":"var(--text-muted)", textAlign:"center" }}>{isL?"L":isR?"R":h}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#4f8ef7" }}>Total trapped water: {total} units</div>
        </div>
      )}
    </div>
  );
}
