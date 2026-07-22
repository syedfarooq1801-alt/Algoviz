"use client";
import { useState, useEffect, useRef } from "react";

export default function SearchRotatedViz() {
  const [nums, setNums] = useState([4,5,6,7,0,1,2]);
  const [target, setTarget] = useState(0);
  const [input, setInput] = useState("4,5,6,7,0,1,2");
  const [ti, setTi] = useState("0");
  const [L, setL] = useState(0);
  const [R, setR] = useState(6);
  const [mid, setMid] = useState(-1);
  const [result, setResult] = useState<number|null>(null);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — determine which half is sorted, check if target in that half");
  const stateRef = useRef({ l:0, r:6, nums:[4,5,6,7,0,1,2], target:0 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums, t=target) => {
    stateRef.current = { l:0, r:n.length-1, nums:n, target:t };
    setL(0); setR(n.length-1); setMid(-1); setResult(null); setDone(false); setPlaying(false);
    setMsg(`Search for ${t} in rotated array`); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { l, r, nums: n, target: t } = stateRef.current;
    if (l > r) {
      setResult(-1); setDone(true); setPlaying(false); setMsg(`Target ${t} not found → return -1`); return;
    }
    const m = Math.floor((l+r)/2);
    setMid(m);
    if (n[m] === t) {
      setResult(m); setDone(true); setPlaying(false); setMsg(`Found! nums[${m}]=${t} → return ${m}`); return;
    }
    if (n[l] <= n[m]) {
      if (n[l] <= t && t < n[m]) {
        stateRef.current = { ...stateRef.current, r:m-1 };
        setR(m-1); setMsg(`Left half sorted [${n[l]},${n[m]}]. ${t} in range → R=${m-1}`);
      } else {
        stateRef.current = { ...stateRef.current, l:m+1 };
        setL(m+1); setMsg(`Left half sorted [${n[l]},${n[m]}]. ${t} NOT in range → L=${m+1}`);
      }
    } else {
      if (n[m] < t && t <= n[r]) {
        stateRef.current = { ...stateRef.current, l:m+1 };
        setL(m+1); setMsg(`Right half sorted [${n[m]},${n[r]}]. ${t} in range → L=${m+1}`);
      } else {
        stateRef.current = { ...stateRef.current, r:m-1 };
        setR(m-1); setMsg(`Right half sorted [${n[m]},${n[r]}]. ${t} NOT in range → R=${m-1}`);
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
    const t = parseInt(ti)||0; setNums(n); setTarget(t); reset(n,t);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Search in Rotated Sorted Array — Binary Search</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>nums:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"180px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>target:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"60px" }} value={ti} onChange={e=>setTi(e.target.value)}/></div>
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
          <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(249,115,22,0.1)", color:"#f97316", border:"1px solid rgba(249,115,22,0.3)" }}>target={target}</span>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex gap-2 flex-wrap">
          {nums.map((n,i) => {
            const isL = i === L; const isR = i === R; const isMid = i === mid;
            const eliminated = i < L || i > R;
            const found = result === i;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                  style={{ background:found?"rgba(34,197,94,0.3)":isMid?"rgba(249,115,22,0.25)":isL||isR?"rgba(79,142,247,0.15)":eliminated?"rgba(255,255,255,0.03)":"var(--bg-hover)", border:found?"2px solid #22c55e":isMid?"2px solid #f97316":isL||isR?"2px solid #4f8ef7":"1px solid var(--border)", color:found?"#22c55e":isMid?"#f97316":isL||isR?"#4f8ef7":eliminated?"var(--text-muted)":"var(--text-secondary)", opacity:eliminated?0.3:1, transform:isMid&&!done?"scale(1.1) translateY(-4px)":"scale(1)" }}>
                  {n}
                </div>
                <span style={{ fontSize:"9px", color:isL?"#4f8ef7":isR?"#4f8ef7":isMid?"#f97316":"transparent" }}>{isL?"L":isR?"R":isMid?"M":"·"}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:result!==-1?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${result!==-1?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}` }}>
          <div className="font-semibold text-sm" style={{ color:result!==-1?"#22c55e":"#ef4444" }}>{result!==-1?`Found at index ${result}`:"Target not found → -1"}</div>
        </div>
      )}
    </div>
  );
}
