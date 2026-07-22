"use client";
import { useState, useEffect, useRef } from "react";

export default function ThreeSumViz() {
  const [nums, setNums] = useState([-1,0,1,2,-1,-4]);
  const [input, setInput] = useState("-1,0,1,2,-1,-4");
  const [sorted, setSorted] = useState<number[]>([]);
  const [fixedIdx, setFixedIdx] = useState(-1);
  const [L, setL] = useState(-1);
  const [R, setR] = useState(-1);
  const [triplets, setTriplets] = useState<number[][]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — sort, fix each element, two pointers on remainder");
  const stateRef = useRef({ fixed:-1, l:-1, r:-1, sorted:[] as number[], triplets:[] as number[][] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums) => {
    const s = [...n].sort((a,b)=>a-b);
    stateRef.current = { fixed:0, l:1, r:s.length-1, sorted:s, triplets:[] };
    setSorted(s); setFixedIdx(0); setL(1); setR(s.length-1); setTriplets([]); setDone(false); setPlaying(false);
    setMsg(`Sorted: [${s.join(",")}] — fix nums[0]=${s[0]}, L=1, R=${s.length-1}`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const { fixed, l, r, sorted: s } = st;
    if (fixed >= s.length - 2) {
      stateRef.current = { ...st, fixed:s.length };
      setDone(true); setPlaying(false); setFixedIdx(-1); setL(-1); setR(-1);
      setMsg(`Done! Found ${st.triplets.length} unique triplet${st.triplets.length!==1?"s":""}`); return;
    }
    if (s[fixed] > 0) {
      stateRef.current = { ...st, fixed:s.length };
      setDone(true); setPlaying(false); setFixedIdx(-1);
      setMsg("nums[fixed]>0 → can't sum to 0 → done"); return;
    }
    if (fixed>0 && s[fixed]===s[fixed-1]) {
      stateRef.current = { ...st, fixed:fixed+1, l:fixed+2, r:s.length-1 };
      setFixedIdx(fixed+1); setL(fixed+2); setR(s.length-1);
      setMsg(`Skip duplicate fixed value ${s[fixed]}`); return;
    }
    if (l >= r) {
      stateRef.current = { ...st, fixed:fixed+1, l:fixed+2, r:s.length-1 };
      setFixedIdx(fixed+1); setL(fixed+2); setR(s.length-1);
      setMsg(`L≥R — move fixed to ${fixed+1}`); return;
    }
    const sum = s[fixed]+s[l]+s[r];
    if (sum === 0) {
      const nt = [...st.triplets];
      const last = nt[nt.length-1];
      if (!last || last[0]!==s[fixed]||last[1]!==s[l]||last[2]!==s[r]) nt.push([s[fixed],s[l],s[r]]);
      let nl = l+1, nr = r-1;
      while (nl<nr && s[nl]===s[nl-1]) nl++;
      while (nl<nr && s[nr]===s[nr+1]) nr--;
      stateRef.current = { ...st, l:nl, r:nr, triplets:nt };
      setL(nl); setR(nr); setTriplets([...nt]);
      setMsg(`[${s[fixed]},${s[l]},${s[r]}] = 0 ✓ → triplet found! Skip dupes`);
    } else if (sum < 0) {
      stateRef.current = { ...st, l:l+1 };
      setL(l+1); setMsg(`sum=${sum}<0 → move L right`);
    } else {
      stateRef.current = { ...st, r:r-1 };
      setR(r-1); setMsg(`sum=${sum}>0 → move R left`);
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
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>3Sum — Sort + Two Pointers O(n²)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>nums:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"220px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
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

      <div className="rounded-xl p-5" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Sorted array</div>
        <div className="flex gap-2 flex-wrap">
          {sorted.map((n,i) => {
            const isFixed = i === fixedIdx;
            const isL = i === L;
            const isR = i === R;
            const inTriplet = triplets.some(t => t.includes(n) && (
              (i===fixedIdx||i===L||i===R) || (done && t.includes(n))
            ));
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                  style={{ background:isFixed?"rgba(168,85,247,0.25)":isL||isR?"rgba(79,142,247,0.25)":"var(--bg-hover)", border:isFixed?"2px solid #a855f7":isL||isR?"2px solid #4f8ef7":"1px solid var(--border)", color:isFixed?"#a855f7":isL||isR?"#4f8ef7":"var(--text-secondary)", transform:isFixed||isL||isR?"scale(1.1) translateY(-5px)":"scale(1)" }}>
                  {n}
                </div>
                <span style={{ fontSize:"9px", color:isFixed?"#a855f7":isL||isR?"#4f8ef7":"transparent" }}>{isFixed?"fix":isL?"L":isR?"R":"·"}</span>
              </div>
            );
          })}
        </div>
        {fixedIdx>=0 && L>=0 && R>=0 && L<R && (
          <div className="mt-3 text-xs font-mono px-3 py-1.5 rounded" style={{ background:"rgba(79,142,247,0.08)", color:"var(--text-secondary)", border:"1px solid rgba(79,142,247,0.15)" }}>
            {sorted[fixedIdx]} + {sorted[L]} + {sorted[R]} = {sorted[fixedIdx]+sorted[L]+sorted[R]}
          </div>
        )}
      </div>

      {triplets.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Triplets found</div>
          <div className="flex gap-2 flex-wrap">
            {triplets.map((t,i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>[{t.join(",")}]</span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
