"use client";
import { useState, useEffect, useRef } from "react";

export default function ProductExceptSelfViz() {
  const [nums, setNums] = useState([1,2,3,4]);
  const [input, setInput] = useState("1,2,3,4");
  const [prefix, setPrefix] = useState<number[]>([]);
  const [suffix, setSuffix] = useState<number[]>([]);
  const [output, setOutput] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle"|"prefix"|"suffix"|"done">("idle");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — build prefix products left→right, then suffix products right→left");
  const stateRef = useRef({ phase:"idle" as string, idx:-1, prefix:[] as number[], suffix:[] as number[], nums:[1,2,3,4] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums) => {
    const init = Array(n.length).fill(1);
    stateRef.current = { phase:"prefix", idx:-1, prefix:init, suffix:[...init], nums:n };
    setPrefix(init); setSuffix([...init]); setOutput([]); setPhase("prefix"); setActiveIdx(-1); setPlaying(false);
    setMsg("Step 1: scan left→right building prefix products");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.phase === "prefix") {
      const next = st.idx + 1;
      if (next >= st.nums.length) {
        stateRef.current = { ...st, phase:"suffix", idx:st.nums.length };
        setPhase("suffix"); setActiveIdx(st.nums.length); setMsg("Step 2: scan right→left multiplying suffix products"); return;
      }
      const np = [...st.prefix];
      np[next] = next === 0 ? 1 : np[next-1] * st.nums[next-1];
      stateRef.current = { ...st, idx:next, prefix:np };
      setPrefix([...np]); setActiveIdx(next);
      setMsg(`prefix[${next}] = ${next===0?1:`prefix[${next-1}](${np[next-1]}) × nums[${next-1}](${st.nums[next-1]})`} = ${np[next]}`);
    } else if (st.phase === "suffix") {
      const next = st.idx - 1;
      if (next < 0) {
        const out = st.prefix.map((p,i) => p * st.suffix[i]);
        stateRef.current = { ...st, phase:"done" };
        setOutput(out); setPhase("done"); setPlaying(false); setActiveIdx(-1);
        setMsg(`Result: [${out.join(",")}] = prefix[i] × suffix[i]`); return;
      }
      const ns = [...st.suffix];
      ns[next] = next === st.nums.length-1 ? 1 : ns[next+1] * st.nums[next+1];
      stateRef.current = { ...st, idx:next, suffix:ns };
      setSuffix([...ns]); setActiveIdx(next);
      setMsg(`suffix[${next}] = ${next===st.nums.length-1?1:`suffix[${next+1}](${ns[next+1]}) × nums[${next+1}](${st.nums[next+1]})`} = ${ns[next]}`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const n = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));
    if (n.length>0) { setNums(n); reset(n); }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Product Except Self — Prefix × Suffix (O(n), no division)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>nums:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"180px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span className="px-2 py-0.5 rounded text-xs" style={{ background:phase==="prefix"?"rgba(79,142,247,0.1)":phase==="suffix"?"rgba(249,115,22,0.1)":phase==="done"?"rgba(34,197,94,0.1)":"var(--bg-hover)", color:phase==="prefix"?"#4f8ef7":phase==="suffix"?"#f97316":"#22c55e", border:"1px solid var(--border)" }}>
            {phase==="prefix"?"→ Prefix pass":phase==="suffix"?"← Suffix pass":phase==="done"?"Done":"Ready"}
          </span>
        </div>
      </div>

      {/* Array table */}
      <div className="rounded-xl p-4 overflow-x-auto" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"4px" }}>
          <thead>
            <tr>
              <td style={{ width:"80px", color:"var(--text-muted)", fontSize:"11px", paddingRight:"8px" }}>index</td>
              {nums.map((_,i) => <td key={i} style={{ textAlign:"center", color:"var(--text-muted)", fontSize:"11px", minWidth:"52px" }}>[{i}]</td>)}
            </tr>
          </thead>
          <tbody>
            {[
              { label:"nums", data:nums, color:"#9090a8" },
              { label:"prefix[ ]", data:prefix, color:"#4f8ef7", active:phase==="prefix" },
              { label:"suffix[ ]", data:suffix, color:"#f97316", active:phase==="suffix" },
              ...(output.length>0?[{ label:"output", data:output, color:"#22c55e", active:false }]:[]),
            ].map(row => (
              <tr key={row.label}>
                <td style={{ color:"var(--text-muted)", fontSize:"11px", paddingRight:"8px", paddingTop:"4px" }}>{row.label}</td>
                {row.data.map((v,i) => {
                  const isActive = (row as { active?: boolean }).active && i === activeIdx;
                  return (
                    <td key={i} style={{ textAlign:"center", paddingTop:"4px" }}>
                      <div className="rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                        style={{ height:"36px", background:isActive?`${row.color}25`:output.length>0&&row.label==="output"?"rgba(34,197,94,0.1)":"var(--bg-hover)", border:isActive?`2px solid ${row.color}`:`1px solid var(--border)`, color:isActive?row.color:row.color, transform:isActive?"scale(1.1) translateY(-3px)":"scale(1)" }}>
                        {v}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
