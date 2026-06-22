"use client";
import { useState, useEffect, useRef } from "react";

export default function TwoSumIIViz() {
  const [nums, setNums] = useState([2,7,11,15]);
  const [target, setTarget] = useState(9);
  const [input, setInput] = useState("2,7,11,15");
  const [ti, setTi] = useState("9");
  const [L, setL] = useState(-1);
  const [R, setR] = useState(-1);
  const [result, setResult] = useState<[number,number]|null>(null);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — two pointers on sorted array: if sum<target move L right, if sum>target move R left");
  const stateRef = useRef({ l:0, r:0, nums:[2,7,11,15], target:9 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums, t=target) => {
    stateRef.current = { l:0, r:n.length-1, nums:n, target:t };
    setL(0); setR(n.length-1); setResult(null); setDone(false); setPlaying(false);
    setMsg("L=0, R=last — compare sum to target");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { l, r, nums:n, target:t } = stateRef.current;
    if (l >= r) { setDone(true); setPlaying(false); setMsg("L ≥ R — no solution found"); return; }
    const sum = n[l] + n[r];
    if (sum === t) {
      setResult([l+1, r+1]); setDone(true); setPlaying(false);
      setMsg(`nums[${l}](${n[l]}) + nums[${r}](${n[r]}) = ${sum} = target → FOUND! [${l+1},${r+1}]`);
    } else if (sum < t) {
      stateRef.current = { ...stateRef.current, l:l+1 };
      setL(l+1); setMsg(`sum=${sum} < target=${t} → move L right (need larger sum)`);
    } else {
      stateRef.current = { ...stateRef.current, r:r-1 };
      setR(r-1); setMsg(`sum=${sum} > target=${t} → move R left (need smaller sum)`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const n = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)).sort((a,b)=>a-b);
    const t = parseInt(ti)||9;
    setNums(n); setTarget(t); reset(n,t);
  };

  const sum = L>=0 && R>=0 && L<R ? nums[L]+nums[R] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Two Sum II — Two Pointers (sorted input)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>nums (sorted):</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"160px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>target:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"60px" }} value={ti} onChange={e=>setTi(e.target.value)}/></div>
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
          {sum !== null && <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:sum===target?"rgba(34,197,94,0.12)":sum<target?"rgba(79,142,247,0.1)":"rgba(239,68,68,0.1)", color:sum===target?"#22c55e":sum<target?"#4f8ef7":"#ef4444", border:"1px solid var(--border)" }}>sum={sum} {sum<target?"< target":sum>target?"> target":"= target ✓"}</span>}
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Sorted array — target: {target}</div>
        <div className="flex gap-3 flex-wrap">
          {nums.map((n,i) => {
            const isL = i === L;
            const isR = i === R;
            const inResult = result && (i===result[0]-1||i===result[1]-1);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold font-mono transition-all duration-300"
                  style={{ background:inResult?"rgba(34,197,94,0.2)":isL||isR?"rgba(79,142,247,0.25)":"var(--bg-hover)", border:inResult?"2px solid #22c55e":isL||isR?"2px solid #4f8ef7":"1px solid var(--border)", color:inResult?"#22c55e":isL||isR?"#4f8ef7":"var(--text-secondary)", transform:isL||isR?"scale(1.12) translateY(-6px)":"scale(1)", boxShadow:isL||isR?"0 8px 20px rgba(79,142,247,0.25)":"none" }}>
                  {n}
                </div>
                <span style={{ fontSize:"10px", color:isL?"#4f8ef7":isR?"#4f8ef7":"var(--text-muted)" }}>{isL?"L":isR?"R":"·"}</span>
              </div>
            );
          })}
        </div>
        {L>=0&&R>=0&&L<R&&(
          <div className="mt-4 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background:"var(--border)" }}></div>
            <span className="text-xs font-mono px-3 py-1 rounded-full" style={{ background:"rgba(79,142,247,0.1)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>
              nums[{L}]+nums[{R}] = {nums[L]}+{nums[R]} = {nums[L]+nums[R]}
            </span>
            <div className="h-px flex-1" style={{ background:"var(--border)" }}></div>
          </div>
        )}
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {result && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Answer: [{result[0]}, {result[1]}] (1-indexed)</div>
        </div>
      )}
    </div>
  );
}
