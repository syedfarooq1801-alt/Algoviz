"use client";
import { useState, useEffect, useRef } from "react";

export default function ValidAnagramViz() {
  const [s, setS] = useState("anagram");
  const [t, setT] = useState("nagaram");
  const [si, setSi] = useState("anagram");
  const [ti, setTi] = useState("nagaram");
  const [counts, setCounts] = useState<number[]>(Array(26).fill(0));
  const [phase, setPhase] = useState<"idle"|"inc"|"dec"|"check"|"done">("idle");
  const [charIdx, setCharIdx] = useState(-1);
  const [result, setResult] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(350);
  const [msg, setMsg] = useState("Press Play — increment for s, decrement for t, check all zeros");
  const stateRef = useRef({ phase: "idle" as string, idx: -1, counts: Array(26).fill(0), s: "anagram", t: "nagaram" });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = (ns = s, nt = t) => {
    stateRef.current = { phase: "inc", idx: -1, counts: Array(26).fill(0), s: ns, t: nt };
    setCounts(Array(26).fill(0)); setPhase("inc"); setCharIdx(-1); setResult(null);
    setMsg("Step 1: scan s, increment count for each char"); setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.phase === "inc") {
      const next = st.idx + 1;
      if (next >= st.s.length) {
        stateRef.current = { ...st, phase: "dec", idx: -1 };
        setPhase("dec"); setCharIdx(-1); setMsg("Step 2: scan t, decrement count for each char"); return;
      }
      const nc = [...st.counts]; nc[st.s.charCodeAt(next) - 97]++;
      stateRef.current = { ...st, idx: next, counts: nc };
      setCounts(nc); setCharIdx(next); setMsg(`s[${next}]='${st.s[next]}' → count['${st.s[next]}']++ = ${nc[st.s.charCodeAt(next)-97]}`);
    } else if (st.phase === "dec") {
      const next = st.idx + 1;
      if (next >= st.t.length) {
        stateRef.current = { ...st, phase: "check", idx: -1 };
        setPhase("check"); setCharIdx(-1); setMsg("Step 3: check all counts = 0"); return;
      }
      const nc = [...st.counts]; nc[st.t.charCodeAt(next) - 97]--;
      stateRef.current = { ...st, idx: next, counts: nc };
      setCounts(nc); setCharIdx(next); setMsg(`t[${next}]='${st.t[next]}' → count['${st.t[next]}']-- = ${nc[st.t.charCodeAt(next)-97]}`);
    } else if (st.phase === "check") {
      const allZero = st.counts.every(v => v === 0);
      stateRef.current = { ...st, phase: "done" };
      setPhase("done"); setResult(allZero); setPlaying(false);
      setMsg(allZero ? "All counts = 0 → VALID ANAGRAM ✓" : "Some count ≠ 0 → NOT an anagram ✗");
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => { stateRef.current.s = si; stateRef.current.t = ti; setS(si); setT(ti); reset(si, ti); };

  const usedLetters = Array.from(new Set([...s,...t].filter(c => /[a-z]/.test(c)))).sort();

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Valid Anagram — Frequency Array (O(n) time, O(1) space)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color: "var(--text-muted)" }}>s:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "110px" }} value={si} onChange={e => setSi(e.target.value)} /></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color: "var(--text-muted)" }}>t:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "110px" }} value={ti} onChange={e => setTi(e.target.value)} /></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color: playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={phase==="done"} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={() => reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1000" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: phase==="inc"?"rgba(34,197,94,0.1)":phase==="dec"?"rgba(249,115,22,0.1)":phase==="check"||phase==="done"?"rgba(168,85,247,0.1)":"var(--bg-hover)", color: phase==="inc"?"#22c55e":phase==="dec"?"#f97316":"#a855f7", border:"1px solid var(--border)" }}>
            {phase==="inc"?"Incrementing s":phase==="dec"?"Decrementing t":phase==="check"||phase==="done"?"Checking":"Ready"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[["s", s, "inc", "#22c55e"], ["t", t, "dec", "#f97316"]] .map(([label, str, ph, col]) => (
          <div key={label as string} className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:`1px solid ${phase===ph?"rgba(79,142,247,0.4)":"var(--border)"}` }}>
            <div className="text-xs mb-2 font-semibold" style={{ color: phase===ph?(col as string):"var(--text-muted)" }}>
              {label} = "{str}"  {phase===ph?(label==="s"?"← incrementing":"← decrementing"):""}
            </div>
            <div className="flex gap-1 flex-wrap">
              {(str as string).split("").map((c,i) => (
                <div key={i} className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                  style={{
                    background: phase===ph&&i===charIdx?"rgba(79,142,247,0.25)":phase===ph&&i<charIdx?"rgba(255,255,255,0.04)":"var(--bg-hover)",
                    border: phase===ph&&i===charIdx?"2px solid #4f8ef7":"1px solid var(--border)",
                    color: phase===ph&&i===charIdx?"#4f8ef7":phase===ph&&i<charIdx?"var(--text-muted)":"var(--text-secondary)",
                    transform: phase===ph&&i===charIdx?"scale(1.15) translateY(-3px)":"scale(1)",
                  }}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Frequency display */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>count[] — +1 for each char in s, -1 for each char in t</div>
        <div className="flex gap-3 flex-wrap">
          {usedLetters.map(c => {
            const ci = c.charCodeAt(0) - 97;
            const val = counts[ci];
            return (
              <div key={c} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                  style={{
                    background: val>0?"rgba(34,197,94,0.15)":val<0?"rgba(239,68,68,0.15)":phase==="done"?"rgba(168,85,247,0.1)":"var(--bg-hover)",
                    border: val>0?"1px solid rgba(34,197,94,0.4)":val<0?"1px solid rgba(239,68,68,0.4)":phase==="done"?"1px solid rgba(168,85,247,0.4)":"1px solid var(--border)",
                    color: val>0?"#22c55e":val<0?"#ef4444":phase==="done"?"#a855f7":"var(--text-muted)",
                  }}>
                  {val>0?`+${val}`:val}
                </div>
                <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>{c}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {result !== null && (
        <div className="rounded-xl p-4 text-center" style={{ background:result?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", border:`1px solid ${result?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}` }}>
          <div className="font-semibold text-sm" style={{ color:result?"#22c55e":"#ef4444" }}>{result?"✓ Valid Anagram — all frequencies balanced":"✗ Not an Anagram — unbalanced frequencies"}</div>
        </div>
      )}
    </div>
  );
}
