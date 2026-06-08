"use client";
import { useState, useEffect, useRef } from "react";

export default function FindMinRotatedViz() {
  const [nums, setNums] = useState([3,4,5,1,2]);
  const [input, setInput] = useState("3,4,5,1,2");
  const [L, setL] = useState(0);
  const [R, setR] = useState(4);
  const [mid, setMid] = useState(-1);
  const [result, setResult] = useState<number|null>(null);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — if nums[mid] > nums[R], min is in right half, else left half");
  const stateRef = useRef({ l:0, r:4, nums:[3,4,5,1,2] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums) => {
    stateRef.current = { l:0, r:n.length-1, nums:n };
    setL(0); setR(n.length-1); setMid(-1); setResult(null); setDone(false); setPlaying(false);
    setMsg("L=0, R=last — find rotation point"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { l, r, nums: n } = stateRef.current;
    if (l >= r) {
      stateRef.current = { ...stateRef.current };
      setResult(n[l]); setDone(true); setPlaying(false); setMid(l);
      setMsg(`L=R=${l} → minimum = ${n[l]}`); return;
    }
    const m = Math.floor((l+r)/2);
    setMid(m);
    if (n[m] > n[r]) {
      stateRef.current = { ...stateRef.current, l:m+1 };
      setL(m+1); setMsg(`nums[${m}]=${n[m]} > nums[${r}]=${n[r]} → rotation in right half, L=${m+1}`);
    } else {
      stateRef.current = { ...stateRef.current, r:m };
      setR(m); setMsg(`nums[${m}]=${n[m]} ≤ nums[${r}]=${n[r]} → min in left half (including mid), R=${m}`);
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

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Find Minimum in Rotated Sorted Array — Binary Search</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>rotated array:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"180px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
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

      <div className="rounded-xl p-5" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex gap-2 flex-wrap">
          {nums.map((n,i) => {
            const isL = i === L;
            const isR = i === R;
            const isMid = i === mid;
            const eliminated = i < L || i > R;
            const isResult = done && i === mid;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                  style={{ background:isResult?"rgba(34,197,94,0.3)":isMid?"rgba(249,115,22,0.25)":isL||isR?"rgba(79,142,247,0.15)":eliminated?"rgba(255,255,255,0.03)":"var(--bg-hover)", border:isResult?"2px solid #22c55e":isMid?"2px solid #f97316":isL||isR?"2px solid #4f8ef7":"1px solid var(--border)", color:isResult?"#22c55e":isMid?"#f97316":isL||isR?"#4f8ef7":eliminated?"var(--text-muted)":"var(--text-secondary)", opacity:eliminated?0.35:1, transform:isMid&&!done?"scale(1.1) translateY(-4px)":"scale(1)" }}>
                  {n}
                </div>
                <span style={{ fontSize:"9px", color:isL?"#4f8ef7":isR?"#4f8ef7":isMid?"#f97316":"transparent" }}>{isL?"L":isR?"R":isMid?"M":"·"}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {result !== null && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Minimum value: {result}</div>
        </div>
      )}
    </div>
  );
}
