"use client";
import { useState, useEffect, useRef } from "react";

export default function MaxSubarrayViz() {
  const [nums, setNums] = useState([-2,1,-3,4,-1,2,1,-5,4]);
  const [input, setInput] = useState("-2,1,-3,4,-1,2,1,-5,4");
  const [idx, setIdx] = useState(-1);
  const [currSum, setCurrSum] = useState(0);
  const [maxSum, setMaxSum] = useState(-Infinity);
  const [maxL, setMaxL] = useState(0);
  const [maxR, setMaxR] = useState(-1);
  const [winL, setWinL] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — Kadane's: if currSum < 0, reset to current element");
  const stateRef = useRef({ idx:-1, curr:0, max:-Infinity, maxL:0, maxR:-1, winL:0, nums:[-2,1,-3,4,-1,2,1,-5,4] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums) => {
    stateRef.current = { idx:-1, curr:0, max:-Infinity, maxL:0, maxR:-1, winL:0, nums:n };
    setIdx(-1); setCurrSum(0); setMaxSum(-Infinity); setMaxL(0); setMaxR(-1); setWinL(0); setDone(false); setPlaying(false);
    setMsg("currSum=0, maxSum=-∞"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const next = st.idx + 1;
    if (next >= st.nums.length) { setDone(true); setPlaying(false); setMsg(`Done! Max subarray sum = ${st.max}`); return; }
    const v = st.nums[next];
    let newCurr = st.curr + v;
    let newWinL = st.winL;
    if (newCurr < v) { newCurr = v; newWinL = next; }
    const newMax = Math.max(st.max, newCurr);
    const newMaxL = newMax > st.max ? newWinL : st.maxL;
    const newMaxR = newMax > st.max ? next : st.maxR;
    stateRef.current = { ...st, idx:next, curr:newCurr, max:newMax, maxL:newMaxL, maxR:newMaxR, winL:newWinL };
    setIdx(next); setCurrSum(newCurr); setMaxSum(newMax); setMaxL(newMaxL); setMaxR(newMaxR); setWinL(newWinL);
    setMsg(`nums[${next}]=${v}: currSum=${st.curr}+${v}=${newCurr}${newCurr===v&&st.curr+v<v?" (reset — prev was negative)":""}${newMax>st.max?" → NEW MAX!":""}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const n = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));
    setNums(n); reset(n);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Maximum Subarray — Kadane's Algorithm</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>nums:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"240px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs" style={{ color:"var(--text-muted)" }}>Current Sum</div>
          <div className="text-xl font-bold font-mono mt-1" style={{ color:currSum<0?"#ef4444":currSum===0?"var(--text-muted)":"#22c55e" }}>{idx>=0?currSum:"-"}</div>
        </div>
        <div className="rounded-lg p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs" style={{ color:"var(--text-muted)" }}>Max Sum</div>
          <div className="text-xl font-bold font-mono mt-1" style={{ color:"#f97316" }}>{maxSum===-Infinity?"-":maxSum}</div>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex gap-1.5 flex-wrap">
          {nums.map((v,i) => {
            const isCurr = i === idx;
            const inCurrWin = i >= winL && i <= idx;
            const inMaxWin = done && i >= maxL && i <= maxR;
            const inBestWin = !done && i >= maxL && i <= maxR;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                  style={{ background:inMaxWin?"rgba(34,197,94,0.25)":isCurr?"rgba(79,142,247,0.25)":inCurrWin?"rgba(79,142,247,0.1)":inBestWin?"rgba(34,197,94,0.12)":"var(--bg-hover)", border:inMaxWin?"2px solid #22c55e":isCurr?"2px solid #4f8ef7":inCurrWin?"1px solid rgba(79,142,247,0.4)":"1px solid var(--border)", color:inMaxWin?"#22c55e":isCurr?"#4f8ef7":inCurrWin?"var(--text-secondary)":"var(--text-muted)", transform:isCurr?"scale(1.1) translateY(-3px)":"scale(1)" }}>
                  {v}
                </div>
                <span style={{ fontSize:"9px", color:isCurr?"#4f8ef7":"transparent" }}>↑</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-2 text-[10px]">
          <span style={{ color:"rgba(79,142,247,0.8)" }}>■ current window</span>
          <span style={{ color:"rgba(34,197,94,0.8)" }}>■ best subarray</span>
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Max subarray: [{nums.slice(maxL,maxR+1).join(", ")}] = {maxSum}</div>
        </div>
      )}
    </div>
  );
}
