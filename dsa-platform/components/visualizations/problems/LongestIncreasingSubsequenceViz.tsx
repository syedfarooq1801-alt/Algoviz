"use client";
import { useState, useEffect, useRef } from "react";

export default function LongestIncreasingSubsequenceViz() {
  const [nums, setNums] = useState([10,9,2,5,3,7,101,18]);
  const [input, setInput] = useState("10,9,2,5,3,7,101,18");
  const [dp, setDp] = useState<number[]>([]);
  const [activeI, setActiveI] = useState(-1);
  const [activeJ, setActiveJ] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [msg, setMsg] = useState("Press Play — dp[i]=length of LIS ending at i. For each j<i, if nums[j]<nums[i]: dp[i]=max(dp[i],dp[j]+1)");
  const stateRef = useRef({ i:0, j:0, dp:[] as number[], nums:[10,9,2,5,3,7,101,18] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums) => {
    const init = Array(n.length).fill(1);
    stateRef.current = { i:0, j:-1, dp:init, nums:n };
    setDp([...init]); setActiveI(-1); setActiveJ(-1); setDone(false); setPlaying(false);
    setMsg("All dp[i]=1 (each element is LIS of length 1 by itself)"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { i, j, dp: d, nums: n } = stateRef.current;
    if (i >= n.length) { setDone(true); setPlaying(false); setActiveI(-1); setActiveJ(-1); setMsg(`Done! LIS length = ${Math.max(...stateRef.current.dp)}`); return; }
    const nextJ = j + 1;
    if (nextJ >= i) {
      stateRef.current = { ...stateRef.current, i:i+1, j:-1 };
      setActiveI(i+1); setActiveJ(-1); setMsg(`Finished checking all j<${i}. dp[${i}]=${d[i]}. Move to i=${i+1}`);
    } else {
      setActiveI(i); setActiveJ(nextJ);
      if (n[nextJ] < n[i] && d[nextJ]+1 > d[i]) {
        const nd = [...d]; nd[i] = d[nextJ]+1;
        stateRef.current = { ...stateRef.current, j:nextJ, dp:nd };
        setDp([...nd]); setMsg(`j=${nextJ}(${n[nextJ]}) < i=${i}(${n[i]}) and dp[${nextJ}]+1=${d[nextJ]+1} > dp[${i}]=${d[i]} → dp[${i}]=${d[nextJ]+1}`);
      } else {
        stateRef.current = { ...stateRef.current, j:nextJ };
        setMsg(`j=${nextJ}(${n[nextJ]}) ${n[nextJ]>=n[i]?"≥":"<"} i=${i}(${n[i]})${n[nextJ]<n[i]?" but dp[j]+1≤dp[i], skip":""}`);
      }
    }
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

  const maxDp = dp.length ? Math.max(...dp) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Longest Increasing Subsequence — DP O(n²)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>nums:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"240px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1200" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>nums</div>
            <div className="flex gap-1.5 flex-wrap">
              {nums.map((v,i)=>(
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                    style={{ background:i===activeI?"rgba(79,142,247,0.25)":i===activeJ?"rgba(249,115,22,0.2)":"var(--bg-hover)", border:i===activeI?"2px solid #4f8ef7":i===activeJ?"2px solid #f97316":"1px solid var(--border)", color:i===activeI?"#4f8ef7":i===activeJ?"#f97316":"var(--text-secondary)", transform:i===activeI?"scale(1.1) translateY(-3px)":"scale(1)" }}>
                    {v}
                  </div>
                  <span style={{ fontSize:"9px", color:i===activeI?"#4f8ef7":i===activeJ?"#f97316":"transparent" }}>{i===activeI?"i":i===activeJ?"j":"·"}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>dp[i] = LIS length ending at i</div>
            <div className="flex gap-1.5 flex-wrap">
              {dp.map((v,i)=>(
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                    style={{ background:v===maxDp&&done?"rgba(34,197,94,0.25)":i===activeI?"rgba(79,142,247,0.2)":"rgba(168,85,247,0.1)", border:v===maxDp&&done?"2px solid #22c55e":i===activeI?"2px solid #4f8ef7":"1px solid rgba(168,85,247,0.3)", color:v===maxDp&&done?"#22c55e":i===activeI?"#4f8ef7":"#a855f7" }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>LIS length: {maxDp}</div>
        </div>
      )}
    </div>
  );
}
