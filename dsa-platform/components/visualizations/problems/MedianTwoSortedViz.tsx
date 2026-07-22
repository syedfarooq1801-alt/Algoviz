"use client";
import { useState, useEffect, useRef } from "react";

export default function MedianTwoSortedViz() {
  const [A, setA] = useState([1,3]);
  const [B, setB] = useState([2]);
  const [ai, setAi] = useState("1,3");
  const [bi, setBi] = useState("2");
  const [partition, setPartition] = useState(-1);
  const [L, setL] = useState(0);
  const [R, setR] = useState(2);
  const [result, setResult] = useState<number|null>(null);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [msg, setMsg] = useState("Press Play — binary search partition in smaller array A, derive partition in B");
  const stateRef = useRef({ l:0, r:2, a:[1,3], b:[2] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (a=A, b=B) => {
    const smaller = a.length <= b.length ? a : b;
    stateRef.current = { l:0, r:smaller.length, a:a.length<=b.length?a:b, b:a.length<=b.length?b:a };
    setL(0); setR(smaller.length); setPartition(-1); setResult(null); setDone(false); setPlaying(false);
    setMsg("Binary search on partition of smaller array"); if (iRef.current) clearInterval(iRef.current);
  };

  const NEG_INF = -Infinity, POS_INF = Infinity;

  const doStep = () => {
    const { l, r, a, b } = stateRef.current;
    if (l > r) { setDone(true); setPlaying(false); setMsg("Partition not found"); return; }
    const m = Math.floor((l+r)/2);
    const halfLen = Math.floor((a.length+b.length+1)/2);
    const j = halfLen - m;

    const aLeft = m > 0 ? a[m-1] : NEG_INF;
    const aRight = m < a.length ? a[m] : POS_INF;
    const bLeft = j > 0 ? b[j-1] : NEG_INF;
    const bRight = j < b.length ? b[j] : POS_INF;

    setPartition(m);

    if (aLeft <= bRight && bLeft <= aRight) {
      const total = a.length + b.length;
      const med = total%2===1
        ? Math.max(aLeft, bLeft)
        : (Math.max(aLeft,bLeft) + Math.min(aRight,bRight)) / 2;
      stateRef.current = { ...stateRef.current, l:l };
      setResult(med); setDone(true); setPlaying(false);
      setMsg(`aLeft(${aLeft<=NEG_INF?"-∞":aLeft})≤bRight(${bRight>=POS_INF?"+∞":bRight}) && bLeft(${bLeft<=NEG_INF?"-∞":bLeft})≤aRight(${aRight>=POS_INF?"+∞":aRight}) → median=${med}`);
    } else if (aLeft > bRight) {
      stateRef.current = { ...stateRef.current, r:m-1 };
      setR(m-1); setMsg(`aLeft(${aLeft})>bRight(${bRight<=NEG_INF?"-∞":bRight}) → too far right, R=${m-1}`);
    } else {
      stateRef.current = { ...stateRef.current, l:m+1 };
      setL(m+1); setMsg(`bLeft(${bLeft})>aRight(${aRight>=POS_INF?"+∞":aRight}) → too far left, L=${m+1}`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const a = ai.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)).sort((a,b)=>a-b);
    const b = bi.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)).sort((a,b)=>a-b);
    // Median of two empty arrays is undefined — without this guard the
    // partition math degenerates to (-Infinity + Infinity) / 2 = NaN and
    // "Median: NaN" renders instead of a sane message.
    if (a.length === 0 && b.length === 0) {
      setMsg("Enter at least one number in A or B.");
      return;
    }
    setA(a); setB(b); reset(a,b);
  };

  const smaller = A.length<=B.length?A:B;
  const larger = A.length<=B.length?B:A;
  const halfLen = Math.floor((A.length+B.length+1)/2);
  const j = partition >= 0 ? halfLen - partition : -1;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Median of Two Sorted Arrays — Binary Search O(log(min(m,n)))</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>A:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"120px" }} value={ai} onChange={e=>setAi(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>B:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"120px" }} value={bi} onChange={e=>setBi(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="300" max="2000" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Partition display */}
      {partition >= 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Partition (left half | right half) — combined median split</div>
          {[{arr:smaller,p:partition,label:"A (smaller)"},{ arr:larger, p:j>=0?j:-1, label:"B (larger)"}].map(({arr,p,label})=>(
            <div key={label} className="mb-3">
              <div className="text-[10px] mb-1" style={{ color:"var(--text-muted)" }}>{label}</div>
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  {p===0?<span className="text-xs" style={{ color:"var(--text-muted)" }}>[-∞]</span>:
                    arr.slice(0,p).map((v,i)=><span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background:"rgba(34,197,94,0.12)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>{v}</span>)}
                </div>
                <div className="mx-2 text-sm font-bold" style={{ color:"#4f8ef7" }}>|</div>
                <div className="flex gap-1">
                  {p>=arr.length?<span className="text-xs" style={{ color:"var(--text-muted)" }}>[+∞]</span>:
                    arr.slice(p).map((v,i)=><span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background:"rgba(249,115,22,0.12)", color:"#f97316", border:"1px solid rgba(249,115,22,0.3)" }}>{v}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {result !== null && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Median: {result}</div>
        </div>
      )}
    </div>
  );
}
