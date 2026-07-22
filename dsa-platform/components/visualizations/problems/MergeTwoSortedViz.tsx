"use client";
import { useState, useEffect, useRef } from "react";

export default function MergeTwoSortedViz() {
  const [list1, setList1] = useState([1,2,4]);
  const [list2, setList2] = useState([1,3,4]);
  const [i1, setI1] = useState("1,2,4");
  const [i2, setI2] = useState("1,3,4");
  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);
  const [merged, setMerged] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — compare heads of both lists, take smaller, advance pointer");
  const stateRef = useRef({ p1:0, p2:0, merged:[] as number[], list1:[1,2,4], list2:[1,3,4] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (l1=list1, l2=list2) => {
    stateRef.current = { p1:0, p2:0, merged:[], list1:l1, list2:l2 };
    setP1(0); setP2(0); setMerged([]); setDone(false); setPlaying(false);
    setMsg("p1=0, p2=0 — compare and merge"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const { p1: a, p2: b, list1: l1, list2: l2 } = st;
    if (a >= l1.length && b >= l2.length) { setDone(true); setPlaying(false); setMsg(`Done! merged=[${st.merged.join("→")}]`); return; }
    let nm = [...st.merged];
    if (a >= l1.length) {
      nm.push(l2[b]);
      stateRef.current = { ...st, p2:b+1, merged:nm };
      setP2(b+1); setMerged(nm); setMsg(`l1 exhausted → take l2[${b}]=${l2[b]}`);
    } else if (b >= l2.length) {
      nm.push(l1[a]);
      stateRef.current = { ...st, p1:a+1, merged:nm };
      setP1(a+1); setMerged(nm); setMsg(`l2 exhausted → take l1[${a}]=${l1[a]}`);
    } else if (l1[a] <= l2[b]) {
      nm.push(l1[a]);
      stateRef.current = { ...st, p1:a+1, merged:nm };
      setP1(a+1); setMerged(nm); setMsg(`l1[${a}]=${l1[a]} ≤ l2[${b}]=${l2[b]} → take l1, advance p1`);
    } else {
      nm.push(l2[b]);
      stateRef.current = { ...st, p2:b+1, merged:nm };
      setP2(b+1); setMerged(nm); setMsg(`l2[${b}]=${l2[b]} < l1[${a}]=${l1[a]} → take l2, advance p2`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const l1 = i1.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)).sort((a,b)=>a-b);
    const l2 = i2.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)).sort((a,b)=>a-b);
    setList1(l1); setList2(l2); reset(l1,l2);
  };

  const renderList = (arr: number[], ptr: number, color: string, label: string) => (
    <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
      <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>{label}</div>
      <div className="flex items-center gap-1">
        {arr.map((v,i) => {
          const isPtr = i === ptr;
          const isPast = i < ptr;
          return (
            <div key={i} className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                style={{ background:isPtr?`${color}25`:isPast?"rgba(255,255,255,0.04)":"var(--bg-hover)", border:isPtr?`2px solid ${color}`:`1px solid var(--border)`, color:isPtr?color:isPast?"var(--text-muted)":"var(--text-secondary)", transform:isPtr?"scale(1.15) translateY(-4px)":"scale(1)" }}>
                {v}
              </div>
              {i<arr.length-1&&<div style={{ width:16, height:2, background:isPast?"var(--border)":color, opacity:isPast?0.2:0.4, marginLeft:2, marginRight:2 }}></div>}
            </div>
          );
        })}
        {ptr >= arr.length && <span className="ml-2 text-xs" style={{ color:"var(--text-muted)" }}>null (done)</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Merge Two Sorted Lists — Two Pointer Merge</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>list1:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"120px" }} value={i1} onChange={e=>setI1(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>list2:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"120px" }} value={i2} onChange={e=>setI2(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {renderList(list1, p1, "#4f8ef7", "List 1")}
      {renderList(list2, p2, "#f97316", "List 2")}

      {merged.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"#22c55e" }}>Merged list</div>
          <div className="flex items-center gap-1 flex-wrap">
            {merged.map((v,i)=>(
              <div key={i} className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-mono" style={{ background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.4)", color:"#22c55e" }}>{v}</div>
                {i<merged.length-1&&<div style={{ width:16, height:2, background:"#22c55e", opacity:0.4, marginLeft:2, marginRight:2 }}></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
