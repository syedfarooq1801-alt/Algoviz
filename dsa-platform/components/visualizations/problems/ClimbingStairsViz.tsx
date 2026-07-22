"use client";
import { useState, useEffect, useRef } from "react";

export default function ClimbingStairsViz() {
  const [n, setN] = useState(6);
  const [ni, setNi] = useState("6");
  const [dp, setDp] = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — dp[i] = dp[i-1] + dp[i-2] (Fibonacci pattern)");
  const stateRef = useRef({ idx:2, dp:[1,1] as number[], n:6 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (nv=n) => {
    stateRef.current = { idx:2, dp:[1,1], n:nv };
    setDp([1,1]); setActiveIdx(-1); setDone(false); setPlaying(false);
    setMsg("dp[0]=1 (1 way to reach step 0), dp[1]=1 (1 way to reach step 1)");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx, dp: d, n: nv } = stateRef.current;
    if (idx > nv) { setDone(true); setPlaying(false); setActiveIdx(-1); setMsg(`Done! dp[${nv}]=${stateRef.current.dp[nv]} ways to climb ${nv} stairs`); return; }
    const val = d[idx-1] + d[idx-2];
    const nd = [...d]; nd[idx] = val;
    stateRef.current = { ...stateRef.current, idx:idx+1, dp:nd };
    setDp([...nd]); setActiveIdx(idx);
    setMsg(`dp[${idx}] = dp[${idx-1}](${d[idx-1]}) + dp[${idx-2}](${d[idx-2]}) = ${val}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => { const nv=Math.min(12,Math.max(1,parseInt(ni)||6)); setN(nv); reset(nv); };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Climbing Stairs — 1D DP (Fibonacci)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>n (1-12):</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"60px" }} value={ni} onChange={e=>setNi(e.target.value)}/></div>
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

      {/* Staircase */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>dp[i] = ways to reach step i</div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({length:n+1},(_,i)=>i).map(i => {
            const isActive = i === activeIdx;
            const isComputed = dp[i] !== undefined;
            const isDone = done && i === n;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                  style={{ background:isDone?"rgba(34,197,94,0.25)":isActive?"rgba(79,142,247,0.25)":isComputed?"rgba(168,85,247,0.1)":"var(--bg-hover)", border:isDone?"2px solid #22c55e":isActive?"2px solid #4f8ef7":isComputed?"1px solid rgba(168,85,247,0.3)":"1px solid var(--border)", color:isDone?"#22c55e":isActive?"#4f8ef7":isComputed?"#a855f7":"var(--text-muted)", transform:isActive?"scale(1.1) translateY(-4px)":"scale(1)" }}>
                  {dp[i] ?? "?"}
                </div>
                <span style={{ fontSize:"9px", color:"var(--text-muted)" }}>s{i}</span>
              </div>
            );
          })}
        </div>
        {activeIdx > 1 && (
          <div className="mt-3 flex items-center gap-2 text-xs font-mono" style={{ color:"var(--text-muted)" }}>
            <span className="px-2 py-1 rounded" style={{ background:"rgba(168,85,247,0.1)", color:"#a855f7", border:"1px solid rgba(168,85,247,0.3)" }}>dp[{activeIdx-2}]={dp[activeIdx-2]}</span>
            <span>+</span>
            <span className="px-2 py-1 rounded" style={{ background:"rgba(168,85,247,0.1)", color:"#a855f7", border:"1px solid rgba(168,85,247,0.3)" }}>dp[{activeIdx-1}]={dp[activeIdx-1]}</span>
            <span>=</span>
            <span className="px-2 py-1 rounded" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>dp[{activeIdx}]={dp[activeIdx]}</span>
          </div>
        )}
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>{dp[n]} distinct ways to climb {n} stairs</div>
        </div>
      )}
    </div>
  );
}
