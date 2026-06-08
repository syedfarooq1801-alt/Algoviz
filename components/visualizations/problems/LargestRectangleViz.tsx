"use client";
import { useState, useEffect, useRef } from "react";

export default function LargestRectangleViz() {
  const [heights, setHeights] = useState([2,1,5,6,2,3]);
  const [input, setInput] = useState("2,1,5,6,2,3");
  const [idx, setIdx] = useState(-1);
  const [stack, setStack] = useState<{idx:number,h:number}[]>([]);
  const [maxArea, setMaxArea] = useState(0);
  const [bestRect, setBestRect] = useState<{l:number,r:number,h:number}|null>(null);
  const [highlighted, setHighlighted] = useState<{l:number,r:number,h:number}|null>(null);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — monotonic increasing stack: when bar shorter than top, pop and compute area");
  const stateRef = useRef({ idx:-1, stack:[] as {idx:number,h:number}[], maxArea:0, bestRect:null as {l:number,r:number,h:number}|null, heights:[2,1,5,6,2,3] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (h=heights) => {
    stateRef.current = { idx:-1, stack:[], maxArea:0, bestRect:null, heights:h };
    setIdx(-1); setStack([]); setMaxArea(0); setBestRect(null); setHighlighted(null); setDone(false); setPlaying(false);
    setMsg("Monotonic increasing stack — extend rectangles rightward"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const next = st.idx + 1;
    const n = st.heights.length;
    const currH = next < n ? st.heights[next] : 0;
    let dq = [...st.stack];
    let maxA = st.maxArea;
    let bestR = st.bestRect;
    let startIdx = next;
    let msgs: string[] = [];

    while (dq.length && dq[dq.length-1].h > currH) {
      const popped = dq.pop()!;
      const width = next - popped.idx;
      const area = popped.h * width;
      msgs.push(`pop h=${popped.h}, width=${next}-${popped.idx}=${width}, area=${area}`);
      if (area > maxA) { maxA = area; bestR = { l:popped.idx, r:next-1, h:popped.h }; }
      startIdx = popped.idx;
    }

    if (next < n) dq.push({ idx:startIdx, h:currH });

    stateRef.current = { ...st, idx:next, stack:dq, maxArea:maxA, bestRect:bestR };
    setIdx(next); setStack([...dq]); setMaxArea(maxA); setBestRect(bestR);
    if (msgs.length) { setHighlighted(bestR); setMsg(`i=${next}(h=${currH}): ${msgs.join("; ")}`); }
    else if (next < n) { setHighlighted(null); setMsg(`i=${next}(h=${currH}): push {idx=${startIdx}, h=${currH}}`); }

    if (next >= n) {
      setDone(true); setPlaying(false); setHighlighted(bestR);
      setMsg(`Done! Max area = ${maxA}`);
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
  const barW = Math.max(32, Math.min(52, Math.floor(320/heights.length)));

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Largest Rectangle in Histogram — Monotonic Stack</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>heights:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"200px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
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
          <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>max={maxArea}</span>
        </div>
      </div>

      {/* Bars */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex items-end gap-1" style={{ height:"140px" }}>
          {heights.map((h,i) => {
            const isCurr = i === idx;
            const inBest = highlighted && i >= highlighted.l && i <= highlighted.r;
            const inStack = stack.some(s=>s.idx<=i && (stack.indexOf(s)===stack.length-1||stack[stack.indexOf(s)+1].idx>i));
            return (
              <div key={i} className="relative flex flex-col justify-end items-center" style={{ width:`${barW}px`, height:"100%" }}>
                {inBest && highlighted && (
                  <div className="absolute bottom-0 left-0 right-0 transition-all duration-300" style={{ height:`${(highlighted.h/maxH)*120}px`, background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.4)", borderBottom:"none" }}></div>
                )}
                <div className="relative transition-all duration-200 w-full" style={{ height:`${(h/maxH)*120}px`, background:isCurr?"rgba(79,142,247,0.4)":inStack?"rgba(249,115,22,0.3)":"rgba(168,85,247,0.2)", border:isCurr?"1px solid rgba(79,142,247,0.7)":inStack?"1px solid rgba(249,115,22,0.5)":"1px solid rgba(168,85,247,0.3)", borderRadius:"2px 2px 0 0" }}></div>
                <span style={{ fontSize:"9px", color:isCurr?"#4f8ef7":"var(--text-muted)", marginTop:"2px" }}>{h}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stack */}
      <div className="rounded-xl p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Stack (increasing heights)</div>
        <div className="flex gap-2 flex-wrap">
          {stack.length===0?<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</span>:
            [...stack].reverse().map((s,pos)=>(
              <span key={s.idx} className="px-2.5 py-1 rounded text-xs font-mono" style={{ background:pos===0?"rgba(249,115,22,0.15)":"rgba(249,115,22,0.06)", color:pos===0?"#f97316":"var(--text-muted)", border:`1px solid ${pos===0?"rgba(249,115,22,0.4)":"var(--border)"}` }}>
                (i={s.idx}, h={s.h})
              </span>
            ))
          }
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
