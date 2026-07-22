"use client";
import { useState, useEffect, useRef } from "react";

export default function MinWindowSubstringViz() {
  const [s, setS] = useState("ADOBECODEBANC");
  const [t, setT] = useState("ABC");
  const [si, setSi] = useState("ADOBECODEBANC");
  const [ti, setTi] = useState("ABC");
  const [L, setL] = useState(0);
  const [R, setR] = useState(-1);
  const [winFreq, setWinFreq] = useState<Record<string,number>>({});
  const [have, setHave] = useState(0);
  const [result, setResult] = useState("");
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [msg, setMsg] = useState("Press Play — expand R until valid, then shrink L to minimize");
  const stateRef = useRef({ l:0, r:-1, winFreq:{} as Record<string,number>, have:0, result:"", s:"ADOBECODEBANC", t:"ABC" });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const buildNeed = (t: string) => {
    const m: Record<string,number> = {};
    for (const c of t) m[c] = (m[c]||0)+1;
    return m;
  };

  const reset = (str=s, ts=t) => {
    stateRef.current = { l:0, r:-1, winFreq:{}, have:0, result:"", s:str, t:ts };
    setL(0); setR(-1); setWinFreq({}); setHave(0); setResult(""); setDone(false); setPlaying(false);
    setMsg(`need: {${Object.entries(buildNeed(ts)).map(([k,v])=>`${k}:${v}`).join(",")}} — expand R`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const need = buildNeed(st.t);
    const needCount = Object.keys(need).length;
    const nextR = st.r + 1;

    if (nextR >= st.s.length) {
      setDone(true); setPlaying(false);
      setMsg(st.result ? `Done! Min window = "${st.result}"` : "Done — no valid window found"); return;
    }

    const nf = { ...st.winFreq };
    const c = st.s[nextR];
    nf[c] = (nf[c]||0)+1;
    let nh = st.have;
    if (need[c] && nf[c] === need[c]) nh++;
    stateRef.current = { ...st, r:nextR, winFreq:nf, have:nh };
    setR(nextR); setWinFreq({...nf}); setHave(nh);

    if (nh === needCount) {
      let nl = st.l, nf2 = { ...nf }, nh2 = nh, best = st.result;
      while (nh2 === needCount) {
        const win = st.s.slice(nl, nextR+1);
        if (!best || win.length < best.length) best = win;
        const lc = st.s[nl];
        nf2[lc]--;
        if (need[lc] && nf2[lc] < need[lc]) nh2--;
        nl++;
      }
      stateRef.current = { ...st, r:nextR, l:nl, winFreq:nf2, have:nh2, result:best };
      setL(nl); setWinFreq({...nf2}); setHave(nh2); setResult(best);
      setMsg(`Valid window found — shrink L to "${best}"`);
    } else {
      setMsg(`R=${nextR}('${c}') have=${nh}/${needCount} — need more chars`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => { setSi(si); setTi(ti); setS(si); setT(ti); reset(si, ti); };
  const need = buildNeed(t);
  const needCount = Object.keys(need).length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Minimum Window Substring — Sliding Window</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>s:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"180px" }} value={si} onChange={e=>setSi(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>t:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"80px" }} value={ti} onChange={e=>setTi(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1000" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(168,85,247,0.1)", color:"#a855f7", border:"1px solid rgba(168,85,247,0.3)" }}>have={have}/{needCount}</span>
        </div>
      </div>

      {/* need */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Need</div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(need).map(([c,v])=>(
              <div key={c} className="flex flex-col items-center gap-0.5">
                <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ background:"rgba(249,115,22,0.15)", color:"#f97316", border:"1px solid rgba(249,115,22,0.3)" }}>{c}</div>
                <span style={{ fontSize:"9px", color:"var(--text-muted)" }}>×{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Window has</div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(winFreq).filter(([,v])=>v>0).map(([c,v])=>{
              const satisfied = need[c] && v >= need[c];
              return (
                <div key={c} className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ background:satisfied?"rgba(34,197,94,0.15)":"rgba(79,142,247,0.1)", color:satisfied?"#22c55e":"#4f8ef7", border:satisfied?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(79,142,247,0.3)" }}>{c}</div>
                  <span style={{ fontSize:"9px", color:satisfied?"#22c55e":"var(--text-muted)" }}>×{v}{satisfied?"✓":""}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* String */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex gap-1 flex-wrap">
          {s.split("").map((c,i) => {
            const inWin = i >= L && i <= R;
            const isL = i === L;
            const isR = i === R;
            const isNeeded = c in need;
            const inResult = result && i >= s.indexOf(result) && i < s.indexOf(result)+result.length && done;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                  style={{ background:inResult?"rgba(34,197,94,0.2)":inWin&&isNeeded?"rgba(79,142,247,0.25)":inWin?"rgba(79,142,247,0.1)":"var(--bg-hover)", border:isL||isR?"2px solid #4f8ef7":inWin&&isNeeded?"1px solid rgba(79,142,247,0.5)":inWin?"1px solid rgba(79,142,247,0.2)":"1px solid var(--border)", color:inResult?"#22c55e":inWin&&isNeeded?"#4f8ef7":inWin?"var(--text-secondary)":"var(--text-muted)" }}>
                  {c}
                </div>
                <span style={{ fontSize:"8px", color:isL?"#4f8ef7":isR?"#4f8ef7":"transparent" }}>{isL?"L":isR?"R":"·"}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {result && done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Minimum window: "{result}"</div>
        </div>
      )}
    </div>
  );
}
