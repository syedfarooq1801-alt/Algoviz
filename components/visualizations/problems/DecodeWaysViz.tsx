"use client";
import { useState, useRef, useEffect } from "react";

const S = "226";
// dp[i] = number of ways to decode s[0..i-1]
// dp[0]=1, dp[1]=1 (if s[0]!='0')
// For each i: if s[i-1]!='0' → dp[i]+=dp[i-1]
//             if 10≤s[i-2..i-1]≤26 → dp[i]+=dp[i-2]
const buildDP = (s: string) => {
  const n = s.length;
  const dp = Array(n + 1).fill(0);
  dp[0] = 1; dp[1] = s[0] !== "0" ? 1 : 0;
  const steps: { i: number; oneDigit: boolean; twoDigit: boolean; dp: number[] }[] = [];
  for (let i = 2; i <= n; i++) {
    const oneDigit = s[i-1] !== "0";
    const twoVal = parseInt(s.substring(i-2, i));
    const twoDigit = twoVal >= 10 && twoVal <= 26;
    if (oneDigit) dp[i] += dp[i-1];
    if (twoDigit) dp[i] += dp[i-2];
    steps.push({ i, oneDigit, twoDigit, dp: [...dp] });
  }
  return { dp, steps };
};

const { dp: DP, steps: STEPS } = buildDP(S);

export default function DecodeWaysViz() {
  const [step, setStep] = useState(-1);
  const [dp, setDp] = useState([1, S[0] !== "0" ? 1 : 0, ...Array(S.length - 1).fill(0)]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Decode "${S}": count ways each character(s) can map to A-Z.`);
  const stateRef = useRef({ step: -1 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: -1 };
    setStep(-1); setDp([1, S[0] !== "0" ? 1 : 0, ...Array(S.length - 1).fill(0)]); setDone(false); setPlaying(false);
    setMsg(`Decode "${S}": count ways each character(s) can map to A-Z.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Total ways = dp[${S.length}] = ${DP[S.length]}`); return; }
    const st = STEPS[next];
    stateRef.current = { step: next };
    setStep(next); setDp([...st.dp]);
    const parts = [];
    if (st.oneDigit) parts.push(`'${S[st.i-1]}' (1-digit) adds dp[${st.i-1}]=${st.dp[st.i-1]}`);
    if (st.twoDigit) parts.push(`'${S.substring(st.i-2, st.i)}' (2-digit) adds dp[${st.i-2}]=${st.dp[st.i-2]}`);
    setMsg(`i=${st.i}: ${parts.join("; ")} → dp[${st.i}]=${st.dp[st.i]}`);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`dp[${S.length}]=${DP[S.length]} ways to decode "${S}"`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Decode Ways — 1D Dynamic Programming</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>dp[i] = ways to decode s[0..i-1]. Each pos: try 1-digit (1-9) or 2-digit (10-26).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>String: "{S}"</div>
        <div className="flex gap-4 items-end">
          <div>
            <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>chars</div>
            <div className="flex gap-1">
              {["", ...S.split("")].map((c, i) => (
                <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: i === 0 ? "transparent" : "rgba(79,142,247,0.15)", border: i === 0 ? "none" : "1px solid rgba(79,142,247,0.4)", color: "#4f8ef7" }}>{c}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>DP table</div>
          <div className="flex gap-1">
            {dp.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all" style={{
                  background: i === step + 2 ? "rgba(249,115,22,0.35)" : i < step + 2 ? "rgba(34,197,94,0.2)" : "var(--bg-hover)",
                  border: i === step + 2 ? "2px solid #f97316" : "1px solid var(--border)",
                  color: i === step + 2 ? "#f97316" : v > 0 ? "#22c55e" : "var(--text-muted)"
                }}>{v}</div>
                <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>dp[{i}]</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
