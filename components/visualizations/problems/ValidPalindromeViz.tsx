"use client";
import { useState, useEffect, useRef } from "react";

export default function ValidPalindromeViz() {
  const [str, setStr] = useState("A man, a plan, a canal: Panama");
  const [input, setInput] = useState("A man, a plan, a canal: Panama");
  const [cleaned, setCleaned] = useState<string[]>([]);
  const [L, setL] = useState(-1);
  const [R, setR] = useState(-1);
  const [phase, setPhase] = useState<"idle"|"clean"|"check"|"done">("idle");
  const [match, setMatch] = useState<boolean[]>([]);
  const [result, setResult] = useState<boolean|null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [msg, setMsg] = useState("Press Play — clean string (alphanumeric, lowercase), then two-pointer comparison");
  const stateRef = useRef({ phase:"idle" as string, l:-1, r:-1, cleaned:[] as string[], match:[] as boolean[], str:"" });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (s=str) => {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g,"").split("");
    stateRef.current = { phase:"clean", l:-1, r:clean.length, cleaned:clean, match:Array(clean.length).fill(null), str:s };
    setCleaned(clean); setL(-1); setR(clean.length); setMatch(Array(clean.length).fill(null));
    setPhase("clean"); setResult(null); setPlaying(false);
    setMsg(`Cleaned string: "${clean.join("")}" — now two pointers`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.phase === "clean") {
      stateRef.current = { ...st, phase:"check", l:0, r:st.cleaned.length-1 };
      setPhase("check"); setL(0); setR(st.cleaned.length-1); setMsg("Pointers set — compare L and R chars inward"); return;
    }
    if (st.phase === "check") {
      const { l, r, cleaned: c } = st;
      if (l >= r) {
        stateRef.current = { ...st, phase:"done" };
        setPhase("done"); setPlaying(false); setResult(true); setL(-1); setR(-1);
        setMsg("L ≥ R — all pairs matched → VALID PALINDROME"); return;
      }
      const nm = [...st.match];
      if (c[l] !== c[r]) {
        nm[l] = false; nm[r] = false;
        stateRef.current = { ...st, phase:"done", match:nm };
        setMatch(nm); setPhase("done"); setPlaying(false); setResult(false);
        setMsg(`c[${l}]='${c[l]}' ≠ c[${r}]='${c[r]}' → NOT a palindrome`);
      } else {
        nm[l] = true; nm[r] = true;
        stateRef.current = { ...st, l:l+1, r:r-1, match:nm };
        setMatch(nm); setL(l+1); setR(r-1);
        setMsg(`c[${l}]='${c[l]}' == c[${r}]='${c[r]}' ✓ → move pointers inward`);
      }
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => { setStr(input); reset(input); };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Valid Palindrome — Two Pointers</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>s:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"280px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1200" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {cleaned.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Cleaned: alphanumeric, lowercase only</div>
          <div className="flex gap-1 flex-wrap">
            {cleaned.map((c,i) => {
              const isL = i === L;
              const isR = i === R;
              const m = match[i];
              return (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                    style={{ background:isL||isR?"rgba(79,142,247,0.25)":m===true?"rgba(34,197,94,0.1)":m===false?"rgba(239,68,68,0.2)":"var(--bg-hover)", border:isL||isR?"2px solid #4f8ef7":m===true?"1px solid rgba(34,197,94,0.4)":m===false?"2px solid #ef4444":"1px solid var(--border)", color:isL||isR?"#4f8ef7":m===true?"#22c55e":m===false?"#ef4444":"var(--text-secondary)", transform:isL||isR?"scale(1.15) translateY(-4px)":"scale(1)" }}>
                    {c}
                  </div>
                  {isL&&<span style={{ fontSize:"8px", color:"#4f8ef7" }}>L</span>}
                  {isR&&<span style={{ fontSize:"8px", color:"#4f8ef7" }}>R</span>}
                  {!isL&&!isR&&<span style={{ fontSize:"8px", color:"transparent" }}>·</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {result !== null && (
        <div className="rounded-xl p-4 text-center" style={{ background:result?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", border:`1px solid ${result?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}` }}>
          <div className="font-semibold text-sm" style={{ color:result?"#22c55e":"#ef4444" }}>{result?"✓ Valid Palindrome":"✗ Not a Palindrome"}</div>
        </div>
      )}
    </div>
  );
}
