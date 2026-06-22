"use client";
import { useState, useEffect, useRef } from "react";

const INTERVALS_INIT: [number,number][] = [[1,3],[2,6],[8,10],[15,18]];

export default function MergeIntervalsViz() {
  const [sorted, setSorted] = useState<[number,number][]>([]);
  const [merged, setMerged] = useState<[number,number][]>([]);
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — sort by start, then merge overlapping intervals");
  const stateRef = useRef({ idx:0, sorted:[] as [number,number][], merged:[] as [number,number][] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = () => {
    const s = [...INTERVALS_INIT].sort((a,b)=>a[0]-b[0]) as [number,number][];
    stateRef.current = { idx:0, sorted:s, merged:[] };
    setSorted(s); setMerged([]); setActive(-1); setDone(false); setPlaying(false);
    setMsg(`Sorted by start: [${s.map(i=>`[${i}]`).join(",")}]`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx, sorted: s, merged: m } = stateRef.current;
    if (idx >= s.length) { setDone(true); setPlaying(false); setMsg(`Done! ${stateRef.current.merged.length} intervals after merge`); return; }
    const cur = s[idx];
    let nm = [...m];
    let action = "";
    if (!nm.length || nm[nm.length-1][1] < cur[0]) {
      nm.push([...cur] as [number,number]);
      action = `[${cur}] no overlap → add new`;
    } else {
      const prev = nm[nm.length-1];
      nm[nm.length-1] = [prev[0], Math.max(prev[1], cur[1])];
      action = `[${cur}] overlaps [${prev}] → merge to [${nm[nm.length-1]}]`;
    }
    stateRef.current = { ...stateRef.current, idx:idx+1, merged:nm };
    setMerged([...nm]); setActive(idx); setMsg(action);
  };

  useEffect(() => { reset(); }, []);

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const COLORS = ["#4f8ef7","#a855f7","#22c55e","#f97316","#ec4899"];
  const MAX_VAL = 20;

  const barStyle = (start:number, end:number, color:string, isActive=false) => ({
    left: `${(start/MAX_VAL)*100}%`,
    width: `${((end-start)/MAX_VAL)*100}%`,
    background: color,
    opacity: isActive?1:0.7,
    height:"24px", borderRadius:"4px",
    border: isActive?`2px solid white`:"none",
    transition:"all 0.3s",
    boxShadow: isActive?"0 0 8px rgba(255,255,255,0.3)":"none"
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Merge Intervals — Sort + Greedy Merge</h3>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Input intervals */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Sorted input intervals (timeline 0–{MAX_VAL})</div>
        <div style={{ position:"relative", height:`${sorted.length*32+8}px` }}>
          {sorted.map(([s,e],i)=>(
            <div key={i} style={{ position:"absolute", top:`${i*32}px`, left:0, right:0, height:"28px" }}>
              <div style={{ position:"absolute", ...barStyle(s,e,COLORS[i%COLORS.length],active===i) }} />
              <span style={{ position:"absolute", left:`${(s/MAX_VAL)*100}%`, top:"2px", fontSize:"10px", color:"white", paddingLeft:"4px" }}>[{s},{e}]</span>
            </div>
          ))}
        </div>
      </div>

      {/* Merged result */}
      {merged.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Merged result</div>
          <div style={{ position:"relative", height:"36px" }}>
            {merged.map(([s,e],i)=>(
              <div key={i} style={{ position:"absolute", top:0, left:`${(s/MAX_VAL)*100}%`, width:`${((e-s)/MAX_VAL)*100}%`, height:"28px", background:"rgba(34,197,94,0.7)", borderRadius:"4px", border:"1px solid #22c55e", display:"flex", alignItems:"center", paddingLeft:"4px" }}>
                <span style={{ fontSize:"10px", color:"white" }}>[{s},{e}]</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {merged.map((iv,i)=>(
              <span key={i} className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>[{iv[0]},{iv[1]}]</span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
