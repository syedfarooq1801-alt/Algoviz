"use client";
import { useState, useEffect, useRef } from "react";

export default function IsSubsequenceViz() {
  const s = "ace", t = "abcde";
  const [si, setSi] = useState(0);
  const [ti, setTi] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState(`Check if "${s}" is subsequence of "${t}"`);
  const stateRef = useRef({ si: 0, ti: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { si: 0, ti: 0 };
    setSi(0); setTi(0); setDone(false); setResult(false); setPlaying(false);
    setMsg(`Check if "${s}" is subsequence of "${t}"`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { si: si_, ti: ti_ } = stateRef.current;
    if (si_ >= s.length) {
      setDone(true); setResult(true); setPlaying(false);
      setMsg(`✓ All chars of "${s}" matched! It IS a subsequence.`); return;
    }
    if (ti_ >= t.length) {
      setDone(true); setResult(false); setPlaying(false);
      setMsg(`✗ Ran out of "${t}" chars. NOT a subsequence.`); return;
    }
    const match = s[si_] === t[ti_];
    let newSi = si_, newTi = ti_ + 1;
    let newMsg = `t[${ti_}]='${t[ti_]}' vs s[${si_}]='${s[si_]}' → `;
    if (match) { newSi = si_ + 1; newMsg += `MATCH! advance both pointers`; }
    else newMsg += `no match — advance t only`;
    stateRef.current = { si: newSi, ti: newTi };
    setSi(newSi); setTi(newTi); setMsg(newMsg);
    if (newSi >= s.length) {
      setDone(true); setResult(true); setPlaying(false);
      setMsg(`✓ All chars of "${s}" matched! It IS a subsequence.`);
    } else if (newTi >= t.length) {
      setDone(true); setResult(false); setPlaying(false);
      setMsg(`✗ Exhausted "${t}". NOT a subsequence.`);
    }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Is Subsequence — Two Pointers</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>s-pointer advances only on match. t-pointer always advances.</div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="rounded-xl p-4 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--accent-blue)" }}>s = "{s}" (pattern)</div>
          <div className="flex gap-2">
            {s.split("").map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{ background: i < si ? "rgba(34,197,94,0.2)" : i === si ? "rgba(79,142,247,0.3)" : "var(--bg-hover)", border: i === si ? "2px solid #4f8ef7" : i < si ? "2px solid #22c55e" : "1px solid var(--border)", color: i < si ? "#22c55e" : i === si ? "#4f8ef7" : "var(--text-secondary)", transform: i === si ? "scale(1.15)" : "scale(1)" }}>
                  {c}
                </div>
                <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{i === si && !done ? "↑si" : ""}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--accent-orange)" }}>t = "{t}" (text)</div>
          <div className="flex gap-2">
            {t.split("").map((c, i) => {
              const isMatched = s.split("").some((sc, si_) => {
                let tidx = 0, sidx = 0;
                while (sidx < si_ && tidx < t.length) { if (t[tidx] === s[sidx]) sidx++; tidx++; }
                return tidx === i && sc === c && i < ti;
              });
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                    style={{ background: i < ti && s.split("").filter((sc, si_) => {
                      let cnt = 0; for (let k = 0; k < i; k++) if (t[k] === s[cnt]) cnt++; return false;
                    }).length >= 0 && i < ti ? (i < ti - 1 ? "rgba(107,114,128,0.1)" : "rgba(249,115,22,0.2)") : "var(--bg-hover)",
                    border: i === ti - 1 && !done ? "2px solid #f97316" : "1px solid var(--border)",
                    color: i === ti - 1 && !done ? "#f97316" : "var(--text-muted)" }}>
                    {c}
                  </div>
                  <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{i === ti && !done ? "↑ti" : ""}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="rounded-xl p-3 grid grid-cols-2 gap-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-center"><div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>s pointer</div><div className="text-2xl font-bold font-mono" style={{ color: "#4f8ef7" }}>{si}</div></div>
        <div className="text-center"><div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>t pointer</div><div className="text-2xl font-bold font-mono" style={{ color: "#f97316" }}>{ti}</div></div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? (result ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)") : "rgba(79,142,247,0.07)", color: done ? (result ? "#22c55e" : "#ef4444") : "#4f8ef7", border: `1px solid ${done ? (result ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") : "rgba(79,142,247,0.18)"}` }}>
        {msg}
      </div>
    </div>
  );
}
