"use client";
import { useState, useEffect, useRef } from "react";

export default function SlidingWindowMaxViz() {
  const [nums, setNums] = useState([1,3,-1,-3,5,3,6,7]);
  const [k, setK] = useState(3);
  const [input, setInput] = useState("1,3,-1,-3,5,3,6,7");
  const [ki, setKi] = useState("3");
  const [idx, setIdx] = useState(-1);
  const [deque, setDeque] = useState<number[]>([]);
  const [output, setOutput] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — monotonic deque: pop smaller elements from back, pop out-of-window from front");
  const stateRef = useRef({ idx:-1, deque:[] as number[], output:[] as number[], nums:[1,3,-1,-3,5,3,6,7], k:3 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (n=nums, kv=k) => {
    stateRef.current = { idx:-1, deque:[], output:[], nums:n, k:kv };
    setIdx(-1); setDeque([]); setOutput([]); setDone(false); setPlaying(false);
    setMsg("Monotonic deque (decreasing) — front always = window max");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const next = st.idx + 1;
    if (next >= st.nums.length) { setDone(true); setPlaying(false); setMsg(`Done! Output: [${st.output.join(",")}]`); return; }

    let dq = [...st.deque];
    // Remove out-of-window from front
    while (dq.length && dq[0] <= next - st.k) dq.shift();
    // Remove smaller elements from back (maintain decreasing order)
    while (dq.length && st.nums[dq[dq.length-1]] <= st.nums[next]) dq.pop();
    dq.push(next);

    const no = [...st.output];
    if (next >= st.k - 1) no.push(st.nums[dq[0]]);

    stateRef.current = { ...st, idx:next, deque:dq, output:no };
    setIdx(next); setDeque([...dq]); setOutput([...no]);
    setMsg(`i=${next}(${st.nums[next]}): remove outdated, pop smaller from back, push. deque=[${dq.map(i=>st.nums[i]).join(",")}] front=${st.nums[dq[0]]}${next>=st.k-1?` → output: ${st.nums[dq[0]]}`:"(window not full yet)"}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const n = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));
    const kv = Math.max(1,parseInt(ki)||3);
    setNums(n); setK(kv); reset(n,kv);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Sliding Window Maximum — Monotonic Deque</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>nums:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"200px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>k:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"50px" }} value={ki} onChange={e=>setKi(e.target.value)}/></div>
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

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Array (window size k={k})</div>
        <div className="flex gap-2 flex-wrap">
          {nums.map((n,i) => {
            const inWin = i <= idx && i > idx-k;
            const isCurr = i === idx;
            const isDequeMax = deque.length && deque[0] === i;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                  style={{ background:isCurr?"rgba(79,142,247,0.25)":isDequeMax?"rgba(34,197,94,0.2)":inWin?"rgba(79,142,247,0.1)":"var(--bg-hover)", border:isCurr?"2px solid #4f8ef7":isDequeMax?"2px solid #22c55e":inWin?"1px solid rgba(79,142,247,0.3)":"1px solid var(--border)", color:isCurr?"#4f8ef7":isDequeMax?"#22c55e":inWin?"var(--text-secondary)":"var(--text-muted)", transform:isCurr?"scale(1.1) translateY(-3px)":"scale(1)" }}>
                  {n}
                </div>
                <span style={{ fontSize:"9px", color:"var(--text-muted)" }}>[{i}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deque */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Deque (indices, decreasing values)</div>
          <div className="flex gap-2 flex-wrap items-center">
            {deque.length===0?<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</span>:
              deque.map((di,pos)=>(
                <div key={di} className="flex flex-col items-center gap-0.5">
                  <div className="px-2 py-1.5 rounded text-xs font-mono font-bold" style={{ background:pos===0?"rgba(34,197,94,0.15)":"rgba(79,142,247,0.1)", color:pos===0?"#22c55e":"#4f8ef7", border:pos===0?"1px solid rgba(34,197,94,0.4)":"1px solid rgba(79,142,247,0.3)" }}>
                    [{di}]={nums[di]}
                  </div>
                  {pos===0&&<span style={{ fontSize:"9px", color:"#22c55e" }}>max</span>}
                </div>
              ))
            }
          </div>
        </div>
        <div className="rounded-xl p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Output</div>
          <div className="flex gap-1 flex-wrap">
            {output.map((v,i)=>(
              <span key={i} className="px-2 py-1 rounded text-xs font-mono font-bold" style={{ background:"rgba(34,197,94,0.12)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>{v}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
