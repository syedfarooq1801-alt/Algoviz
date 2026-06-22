"use client";
import { useState, useEffect, useRef } from "react";

export default function HouseRobberViz() {
  const [nums, setNums] = useState([2,7,9,3,1]);
  const [input, setInput] = useState("2,7,9,3,1");
  const [dp, setDp] = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — dp[i] = max(dp[i-1], dp[i-2] + nums[i]) — skip or rob");
  const stateRef = useRef({ idx:0, dp:[] as number[], nums:[2,7,9,3,1] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums) => {
    stateRef.current = { idx:0, dp:[], nums:n };
    setDp([]); setActiveIdx(-1); setDone(false); setPlaying(false);
    setMsg("dp[i] = max money robbing houses 0..i without adjacent"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx, dp: d, nums: n } = stateRef.current;
    if (idx >= n.length) { setDone(true); setPlaying(false); setActiveIdx(-1); setMsg(`Done! Max rob = ${stateRef.current.dp[n.length-1]}`); return; }
    const prev2 = idx >= 2 ? d[idx-2] : 0;
    const prev1 = idx >= 1 ? d[idx-1] : 0;
    const rob = (idx >= 2 ? d[idx-2] : 0) + n[idx];
    const skip = idx >= 1 ? d[idx-1] : 0;
    const val = Math.max(rob, skip);
    const nd = [...d]; nd[idx] = val;
    stateRef.current = { ...stateRef.current, idx:idx+1, dp:nd };
    setDp([...nd]); setActiveIdx(idx);
    setMsg(`dp[${idx}]: rob=${prev2}+${n[idx]}=${rob}, skip=${prev1} → max=${val} ${rob>skip?"(rob house)":"(skip house)"}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const n = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)&&x>=0);
    setNums(n); reset(n);
  };

  const maxVal = Math.max(...nums,1);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>House Robber — 1D DP (rob or skip)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>houses:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"200px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
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

      {/* Houses */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex gap-2 items-end" style={{ height:"80px" }}>
          {nums.map((v,i)=>{
            const isActive = i === activeIdx;
            const isRobbed = done && dp[i] > (i>0?dp[i-1]:0) && (i<2||dp[i]>dp[i-1]);
            return (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="w-full rounded-t transition-all duration-200 flex items-end justify-center" style={{ height:`${(v/maxVal)*60}px`, background:isActive?"rgba(79,142,247,0.35)":"rgba(168,85,247,0.2)", border:isActive?"1px solid rgba(79,142,247,0.6)":"1px solid rgba(168,85,247,0.3)" }}></div>
                <span style={{ fontSize:"10px", color:isActive?"#4f8ef7":"var(--text-muted)", marginTop:"3px", fontWeight:"bold" }}>${v}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* DP table */}
      {dp.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>dp[i] = max money robbed from houses 0..i</div>
          <div className="flex gap-2 flex-wrap">
            {nums.map((_,i)=>(
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                  style={{ background:i===activeIdx?"rgba(79,142,247,0.25)":dp[i]!==undefined&&done&&i===nums.length-1?"rgba(34,197,94,0.2)":dp[i]!==undefined?"rgba(168,85,247,0.12)":"var(--bg-hover)", border:i===activeIdx?"2px solid #4f8ef7":dp[i]!==undefined&&done&&i===nums.length-1?"2px solid #22c55e":dp[i]!==undefined?"1px solid rgba(168,85,247,0.3)":"1px solid var(--border)", color:i===activeIdx?"#4f8ef7":dp[i]!==undefined&&done&&i===nums.length-1?"#22c55e":"#a855f7" }}>
                  {dp[i]??"-"}
                </div>
                <span style={{ fontSize:"9px", color:"var(--text-muted)" }}>h{i}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Max rob without adjacent houses: ${dp[nums.length-1]}</div>
        </div>
      )}
    </div>
  );
}
