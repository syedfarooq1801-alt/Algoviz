"use client";
import { useState, useEffect, useRef } from "react";

export default function DailyTemperaturesViz() {
  const [temps, setTemps] = useState([73,74,75,71,69,72,76,73]);
  const [input, setInput] = useState("73,74,75,71,69,72,76,73");
  const [idx, setIdx] = useState(-1);
  const [stack, setStack] = useState<number[]>([]);
  const [result, setResult] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — monotonic decreasing stack: pop when curr > stack top, answer = curr - popped index");
  const stateRef = useRef({ idx:-1, stack:[] as number[], result:[] as number[], temps:[73,74,75,71,69,72,76,73] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (t=temps) => {
    stateRef.current = { idx:-1, stack:[], result:Array(t.length).fill(0), temps:t };
    setIdx(-1); setStack([]); setResult(Array(t.length).fill(0)); setDone(false); setPlaying(false);
    setMsg("Stack stores indices — decreasing temps"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const next = st.idx + 1;
    if (next >= st.temps.length) { setDone(true); setPlaying(false); setMsg(`Done! result=[${st.result.join(",")}]`); return; }

    let dq = [...st.stack];
    const nr = [...st.result];
    let msg = `i=${next}(${st.temps[next]}): `;
    const popped: number[] = [];
    while (dq.length && st.temps[dq[dq.length-1]] < st.temps[next]) {
      const pi = dq.pop()!;
      nr[pi] = next - pi;
      popped.push(pi);
    }
    dq.push(next);
    stateRef.current = { ...st, idx:next, stack:dq, result:nr };
    setIdx(next); setStack([...dq]); setResult([...nr]);
    if (popped.length) msg += `popped [${popped.map(p=>`${p}(${st.temps[p]})`).join(",")}], answered by day ${next}`;
    else msg += `no smaller temps to pop, pushed onto stack`;
    setMsg(msg);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const t = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));
    setTemps(t); reset(t);
  };

  const maxTemp = Math.max(...temps, 1);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Daily Temperatures — Monotonic Stack</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>temps:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"220px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Temp bars */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex gap-1 items-end" style={{ height:"100px" }}>
          {temps.map((t,i) => {
            const isCurr = i === idx;
            const inStack = stack.includes(i);
            const answered = result[i] > 0;
            return (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="text-[9px] font-mono mb-0.5" style={{ color:isCurr?"#4f8ef7":answered?"#22c55e":inStack?"#f97316":"transparent" }}>{answered?result[i]:""}</div>
                <div className="w-full rounded-t transition-all duration-200" style={{ height:`${(t/maxTemp)*80}px`, background:isCurr?"rgba(79,142,247,0.4)":inStack?"rgba(249,115,22,0.3)":answered?"rgba(34,197,94,0.2)":"rgba(168,85,247,0.2)", border:isCurr?"1px solid rgba(79,142,247,0.7)":inStack?"1px solid rgba(249,115,22,0.5)":"1px solid rgba(168,85,247,0.3)" }}></div>
                <span style={{ fontSize:"9px", color:"var(--text-muted)" }}>{t}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stack */}
      <div className="rounded-xl p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Stack (decreasing temps, stores indices)</div>
        <div className="flex gap-2 flex-wrap">
          {stack.length===0?<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</span>:
            [...stack].reverse().map((i,pos)=>(
              <span key={i} className="px-2.5 py-1 rounded text-xs font-mono" style={{ background:pos===0?"rgba(249,115,22,0.15)":"rgba(249,115,22,0.06)", color:pos===0?"#f97316":"var(--text-muted)", border:`1px solid ${pos===0?"rgba(249,115,22,0.4)":"var(--border)"}` }}>
                [{i}]={temps[i]}
              </span>
            ))
          }
        </div>
      </div>

      {/* Result */}
      {idx >= 0 && (
        <div className="rounded-xl p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Result (days to wait)</div>
          <div className="flex gap-2 flex-wrap">
            {result.map((v,i)=>(
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold font-mono" style={{ background:v>0?"rgba(34,197,94,0.12)":i<=idx?"rgba(255,255,255,0.03)":"var(--bg-hover)", color:v>0?"#22c55e":"var(--text-muted)", border:"1px solid var(--border)" }}>{v}</div>
                <span style={{ fontSize:"8px", color:"var(--text-muted)" }}>[{i}]</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
