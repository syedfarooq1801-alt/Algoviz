"use client";
import { useState, useEffect, useRef } from "react";

export default function TopKFrequentViz() {
  const [nums, setNums] = useState([1,1,1,2,2,3]);
  const [k, setK] = useState(2);
  const [input, setInput] = useState("1,1,1,2,2,3");
  const [ki, setKi] = useState("2");
  const [phase, setPhase] = useState<"idle"|"count"|"bucket"|"collect"|"done">("idle");
  const [countIdx, setCountIdx] = useState(-1);
  const [freq, setFreq] = useState<Record<number,number>>({});
  const [buckets, setBuckets] = useState<number[][]>([]);
  const [result, setResult] = useState<number[]>([]);
  const [msg, setMsg] = useState("Press Play — count frequencies, bucket sort by count, collect top k");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const stateRef = useRef({ phase:"idle" as string, idx:-1, freq:{} as Record<number,number>, buckets:[] as number[][], result:[] as number[], nums:[1,1,1,2,2,3], k:2 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums, kv=k) => {
    stateRef.current = { phase:"count", idx:-1, freq:{}, buckets:[], result:[], nums:n, k:kv };
    setPhase("count"); setCountIdx(-1); setFreq({}); setBuckets([]); setResult([]); setPlaying(false);
    setMsg("Step 1: count frequency of each number");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.phase === "count") {
      const next = st.idx + 1;
      if (next >= st.nums.length) {
        stateRef.current = { ...st, phase:"bucket", idx:-1 };
        setPhase("bucket"); setCountIdx(-1); setMsg("Step 2: place each num in bucket[freq[num]]"); return;
      }
      const nf = { ...st.freq }; nf[st.nums[next]] = (nf[st.nums[next]]||0)+1;
      stateRef.current = { ...st, idx:next, freq:nf };
      setCountIdx(next); setFreq({...nf}); setMsg(`nums[${next}]=${st.nums[next]} → freq[${st.nums[next]}]=${nf[st.nums[next]]}`);
    } else if (st.phase === "bucket") {
      const entries = Object.entries(st.freq);
      const next = st.idx + 1;
      if (next >= entries.length) {
        stateRef.current = { ...st, phase:"collect", idx: st.nums.length };
        setPhase("collect"); setMsg("Step 3: collect from highest bucket until k elements"); return;
      }
      const [num, cnt] = entries[next];
      const nb = [...(st.buckets.length ? st.buckets : Array(st.nums.length+1).fill(null).map(()=>[]))];
      if (!nb[cnt as number]) nb[cnt as number] = [];
      nb[cnt as number] = [...nb[cnt as number], +num];
      stateRef.current = { ...st, idx:next, buckets:nb };
      setBuckets(nb.map(b => b||[])); setMsg(`freq[${num}]=${cnt} → bucket[${cnt}].push(${num})`);
    } else if (st.phase === "collect") {
      const res: number[] = [];
      for (let i = st.nums.length; i >= 1; i--) {
        if (st.buckets[i]) for (const n of st.buckets[i]) { res.push(n); if (res.length === st.k) break; }
        if (res.length === st.k) break;
      }
      stateRef.current = { ...st, phase:"done", result:res };
      setResult(res); setPhase("done"); setPlaying(false);
      setMsg(`Top ${st.k} frequent: [${res.join(", ")}]`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const n = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));
    const kv = Math.min(parseInt(ki)||2, n.length);
    setNums(n); setK(kv); reset(n,kv);
  };

  const maxBucket = nums.length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Top K Frequent — Bucket Sort (O(n) time)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>nums:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"180px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>k:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"50px" }} value={ki} onChange={e=>setKi(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1200" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Input array */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Input nums</div>
        <div className="flex gap-2 flex-wrap">
          {nums.map((n,i) => (
            <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
              style={{ background:phase==="count"&&i===countIdx?"rgba(79,142,247,0.25)":phase==="count"&&i<countIdx?"rgba(34,197,94,0.08)":"var(--bg-hover)", border:phase==="count"&&i===countIdx?"2px solid #4f8ef7":"1px solid var(--border)", color:phase==="count"&&i===countIdx?"#4f8ef7":"var(--text-secondary)", transform:phase==="count"&&i===countIdx?"scale(1.12) translateY(-4px)":"scale(1)" }}>
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Freq map */}
      {Object.keys(freq).length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Frequency map</div>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(freq).map(([n,c]) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <div className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold" style={{ background:"rgba(168,85,247,0.12)", color:"#a855f7", border:"1px solid rgba(168,85,247,0.3)" }}>{n}</div>
                <div className="text-[10px]" style={{ color:"var(--text-muted)" }}>×{c}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buckets */}
      {buckets.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Buckets (index = frequency) — collect from right</div>
          <div className="flex gap-2 items-end">
            {Array.from({length:maxBucket+1},(_,i)=>i).filter(i=>i>0).map(i => {
              const bucket = buckets[i] || [];
              const isTarget = phase==="collect"||phase==="done";
              const isInResult = bucket.some(n => result.includes(n));
              return (
                <div key={i} className="flex flex-col items-center gap-1 min-w-[44px]">
                  <div className="w-full rounded-lg p-1.5 min-h-8 flex flex-col gap-1 items-center transition-all duration-300"
                    style={{ background:isTarget&&isInResult?"rgba(34,197,94,0.1)":bucket.length?"rgba(79,142,247,0.08)":"var(--bg-hover)", border:isTarget&&isInResult?"1px solid rgba(34,197,94,0.4)":bucket.length?"1px solid rgba(79,142,247,0.25)":"1px solid var(--border)" }}>
                    {bucket.map((n,j) => (
                      <span key={j} className="text-xs font-mono font-bold px-1.5 py-0.5 rounded" style={{ background:isTarget&&result.includes(n)?"rgba(34,197,94,0.2)":"rgba(79,142,247,0.15)", color:isTarget&&result.includes(n)?"#22c55e":"#4f8ef7" }}>{n}</span>
                    ))}
                  </div>
                  <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>f={i}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {result.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-xs font-semibold" style={{ color:"#22c55e" }}>Top {k} frequent elements: [{result.join(", ")}]</div>
        </div>
      )}
    </div>
  );
}
