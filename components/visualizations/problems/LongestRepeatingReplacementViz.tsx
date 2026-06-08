"use client";
import { useState, useEffect, useRef } from "react";

export default function LongestRepeatingReplacementViz() {
  const [s, setS] = useState("AABABBA");
  const [k, setK] = useState(1);
  const [si, setSi] = useState("AABABBA");
  const [ki, setKi] = useState("1");
  const [L, setL] = useState(0);
  const [R, setR] = useState(-1);
  const [freq, setFreq] = useState<Record<string,number>>({});
  const [maxFreq, setMaxFreq] = useState(0);
  const [best, setBest] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [msg, setMsg] = useState("Press Play — expand R, if (window - maxFreq > k) shrink L");
  const stateRef = useRef({ l:0, r:-1, freq:{} as Record<string,number>, maxF:0, best:0, s:"AABABBA", k:1 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (str=s, kv=k) => {
    stateRef.current = { l:0, r:-1, freq:{}, maxF:0, best:0, s:str, k:kv };
    setL(0); setR(-1); setFreq({}); setMaxFreq(0); setBest(0); setDone(false); setPlaying(false);
    setMsg("L=0, R=-1 — expand window right");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const nextR = st.r + 1;
    if (nextR >= st.s.length) {
      setDone(true); setPlaying(false); setMsg(`Done! Longest window = ${st.best}`); return;
    }
    const nf = { ...st.freq };
    nf[st.s[nextR]] = (nf[st.s[nextR]]||0)+1;
    const newMaxF = Math.max(st.maxF, nf[st.s[nextR]]);
    const winSize = nextR - st.l + 1;
    let newL = st.l;
    if (winSize - newMaxF > st.k) {
      nf[st.s[st.l]] = (nf[st.s[st.l]]||0)-1;
      newL = st.l + 1;
    }
    const newBest = Math.max(st.best, nextR - newL + 1);
    stateRef.current = { ...st, r:nextR, l:newL, freq:nf, maxF:newMaxF, best:newBest };
    setR(nextR); setL(newL); setFreq({...nf}); setMaxFreq(newMaxF); setBest(newBest);
    const ws = nextR - newL + 1;
    setMsg(`R=${nextR}('${st.s[nextR]}'), window="${st.s.slice(newL,nextR+1)}", maxFreq=${newMaxF}, replacements=${ws-newMaxF}${ws-newMaxF>st.k?" → shrink L":""}, best=${newBest}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => { const str=si.toUpperCase(); const kv=parseInt(ki)||0; setS(str); setK(kv); reset(str,kv); };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Longest Repeating Character Replacement — Sliding Window</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>s:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"140px" }} value={si} onChange={e=>setSi(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>k:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"50px" }} value={ki} onChange={e=>setKi(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1200" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>best={best}</span>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>k={k} — window size - maxFreq ≤ k means we can fix the rest</div>
        <div className="flex gap-1 flex-wrap mb-2">
          {s.split("").map((c,i) => {
            const inWindow = i >= L && i <= R;
            const isL = i === L;
            const isR = i === R;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                  style={{ background:inWindow?"rgba(79,142,247,0.2)":"var(--bg-hover)", border:isL||isR?"2px solid #4f8ef7":inWindow?"1px solid rgba(79,142,247,0.4)":"1px solid var(--border)", color:inWindow?"#4f8ef7":"var(--text-muted)", transform:inWindow?"scale(1.05)":"scale(1)" }}>
                  {c}
                </div>
                <span style={{ fontSize:"8px", color:isL?"#4f8ef7":isR?"#4f8ef7":"transparent" }}>{isL?"L":isR?"R":"·"}</span>
              </div>
            );
          })}
        </div>
        {R >= L && R >= 0 && (
          <div className="text-xs font-mono px-3 py-1.5 rounded" style={{ background:"rgba(79,142,247,0.08)", color:"var(--text-secondary)", border:"1px solid rgba(79,142,247,0.15)" }}>
            window="{s.slice(L,R+1)}" | size={R-L+1} | maxFreq={maxFreq} | replacements needed={R-L+1-maxFreq} | k={k}
          </div>
        )}
      </div>

      {Object.keys(freq).length > 0 && (
        <div className="rounded-xl p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Frequency in window</div>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(freq).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).map(([c,v])=>(
              <div key={c} className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background:v===maxFreq?"rgba(34,197,94,0.2)":"rgba(168,85,247,0.12)", color:v===maxFreq?"#22c55e":"#a855f7", border:v===maxFreq?"1px solid rgba(34,197,94,0.4)":"1px solid rgba(168,85,247,0.3)" }}>{c}</div>
                <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>×{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
