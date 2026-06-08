"use client";
import { useState, useEffect, useRef } from "react";

export default function RemoveNthNodeViz() {
  const [list, setList] = useState([1,2,3,4,5]);
  const [n, setN] = useState(2);
  const [input, setInput] = useState("1,2,3,4,5");
  const [ni, setNi] = useState("2");
  const [fast, setFast] = useState(-1);
  const [slow, setSlow] = useState(-1);
  const [phase, setPhase] = useState<"idle"|"advance-fast"|"move-both"|"remove"|"done">("idle");
  const [removed, setRemoved] = useState<number>(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — advance fast n+1 steps, then move both until fast=null, slow.next is the target");
  const stateRef = useRef({ fast:0, slow:0, phase:"idle" as string, steps:0, n:2, list:[1,2,3,4,5] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (l=list, nv=n) => {
    stateRef.current = { fast:0, slow:0, phase:"advance-fast", steps:0, n:nv, list:l };
    setFast(0); setSlow(0); setPhase("advance-fast"); setRemoved(-1); setPlaying(false);
    setMsg(`fast starts at head. Advance fast ${nv+1} steps ahead of slow`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.phase === "advance-fast") {
      const ns = st.steps + 1;
      const nf = st.fast + 1;
      if (ns > st.n) {
        stateRef.current = { ...st, phase:"move-both", fast:nf, steps:ns };
        setPhase("move-both"); setFast(nf);
        setMsg(`fast advanced ${st.n+1} steps. Now move both until fast hits end`); return;
      }
      stateRef.current = { ...st, fast:nf, steps:ns };
      setFast(nf); setMsg(`advance fast: step ${ns}/${st.n+1}, fast=${nf}`);
    } else if (st.phase === "move-both") {
      if (st.fast >= st.list.length) {
        stateRef.current = { ...st, phase:"remove" };
        setPhase("remove"); setMsg(`fast=null → slow points to node BEFORE target. Remove slow.next=${st.list[st.slow+1]}`); return;
      }
      stateRef.current = { ...st, fast:st.fast+1, slow:st.slow+1 };
      setFast(st.fast+1); setSlow(st.slow+1);
      setMsg(`both move: slow=${st.slow+1}, fast=${st.fast+1}`);
    } else if (st.phase === "remove") {
      const target = st.slow + 1;
      stateRef.current = { ...st, phase:"done" };
      setRemoved(target); setPhase("done"); setPlaying(false);
      setMsg(`Removed node at index ${target} (value=${st.list[target]})`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const l = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));
    const nv = Math.min(parseInt(ni)||1, l.length);
    setList(l); setN(nv); reset(l,nv);
  };

  const done = phase === "done";

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Remove Nth Node from End — Two Pointer Gap</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>list:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"160px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>n:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"50px" }} value={ni} onChange={e=>setNi(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span className="px-2 py-0.5 rounded text-xs" style={{ background:phase==="advance-fast"?"rgba(249,115,22,0.1)":"rgba(79,142,247,0.1)", color:phase==="advance-fast"?"#f97316":"#4f8ef7", border:"1px solid var(--border)" }}>
            {phase==="advance-fast"?"Advance fast":phase==="move-both"?"Move both":phase==="remove"?"Removing":phase==="done"?"Done":"Ready"}
          </span>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex items-center gap-1 flex-wrap">
          {list.map((v,i)=>{
            const isFast = i === fast;
            const isSlow = i === slow && phase !== "advance-fast";
            const isRemoved = done && i === removed;
            const isTarget = phase==="remove" && i === slow+1;
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                    style={{ background:isRemoved?"rgba(239,68,68,0.2)":isTarget?"rgba(239,68,68,0.15)":isFast&&isSlow?"rgba(168,85,247,0.25)":isFast?"rgba(249,115,22,0.25)":isSlow?"rgba(34,197,94,0.2)":"var(--bg-hover)", border:isRemoved?"2px solid #ef4444":isTarget?"2px dashed #ef4444":isFast&&isSlow?"2px solid #a855f7":isFast?"2px solid #f97316":isSlow?"2px solid #22c55e":"1px solid var(--border)", color:isRemoved?"#ef4444":isTarget?"#ef4444":isFast&&isSlow?"#a855f7":isFast?"#f97316":isSlow?"#22c55e":"var(--text-secondary)", textDecoration:isRemoved?"line-through":"none", opacity:isRemoved?0.5:1 }}>
                    {v}
                  </div>
                  <div style={{ fontSize:"8px", color:isFast&&isSlow?"#a855f7":isFast?"#f97316":isSlow?"#22c55e":"transparent" }}>
                    {isFast&&isSlow?"F/S":isFast?"F":isSlow?"S":"·"}
                  </div>
                </div>
                {i<list.length-1&&<div style={{ width:20, height:2, background:"rgba(79,142,247,0.3)", margin:"0 2px 10px 2px" }}></div>}
              </div>
            );
          })}
          {fast >= list.length && <div className="flex flex-col items-center gap-0.5"><div className="w-11 h-11 rounded-lg flex items-center justify-center text-xs" style={{ background:"var(--bg-hover)", border:"1px dashed var(--border)", color:"var(--text-muted)" }}>null</div><div style={{ fontSize:"8px", color:"#f97316" }}>F</div></div>}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"#22c55e" }}>Result (removed index {removed})</div>
          <div className="flex items-center gap-1">
            {list.filter((_,i)=>i!==removed).map((v,i)=>(
              <div key={i} className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-mono" style={{ background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.4)", color:"#22c55e" }}>{v}</div>
                {i<list.length-2&&<div style={{ width:16, height:2, background:"#22c55e", opacity:0.3, margin:"0 2px" }}></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
