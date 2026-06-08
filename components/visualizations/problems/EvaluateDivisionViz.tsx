"use client";
import { useState, useRef, useEffect } from "react";

// equations=[["a","b"],["b","c"]], values=[2,3]
// queries=[["a","c"],["b","a"],["a","e"]]
// a/b=2, b/c=3 → a/c=6, b/a=1/2=0.5, a/e=-1(unknown)
const EQUATIONS = [["a","b"],["b","c"]];
const VALUES = [2,3];
const QUERIES = [["a","c"],["b","a"],["a","e"]];
const ANSWERS = [6, 0.5, -1];

const STEPS = [
  { active: null as null | number, msg: "Build weighted graph: a→b(2), b→a(0.5), b→c(3), c→b(0.33)." },
  { active: 0, msg: "Query a/c: DFS a→b(×2)→c(×3) = 6.0" },
  { active: 1, msg: "Query b/a: DFS b→a(×0.5) = 0.5" },
  { active: 2, msg: "Query a/e: DFS from a, 'e' not in graph → -1.0" },
];

export default function EvaluateDivisionViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Build weighted directed graph. DFS/BFS multiplies edge weights along path.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Build weighted directed graph. DFS/BFS multiplies edge weights along path.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Answers: [${ANSWERS.join(", ")}]`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Results: [6.0, 0.5, -1.0]`); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];
  const answeredSoFar = cur.active !== null ? cur.active + 1 : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Evaluate Division — Weighted Graph + DFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Edges: a→b=2.0, b→a=0.5. DFS multiplies weights. Unknown node → -1.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Graph (a/b=2, b/c=3)</div>
        <svg width="380" height="100" viewBox="0 0 380 100" style={{ width: "100%", height: "auto" }}>
          <defs>
            <marker id="arrd" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(79,142,247,0.7)" />
            </marker>
          </defs>
          {/* a→b */}
          <line x1="70" y1="45" x2="165" y2="45" stroke="rgba(79,142,247,0.6)" strokeWidth="2" markerEnd="url(#arrd)" />
          <text x="115" y="35" textAnchor="middle" fill="#4f8ef7" fontSize="11">2</text>
          {/* b→a */}
          <line x1="165" y1="60" x2="70" y2="60" stroke="rgba(249,115,22,0.6)" strokeWidth="2" markerEnd="url(#arrd)" />
          <text x="115" y="75" textAnchor="middle" fill="#f97316" fontSize="11">0.5</text>
          {/* b→c */}
          <line x1="200" y1="45" x2="295" y2="45" stroke="rgba(79,142,247,0.6)" strokeWidth="2" markerEnd="url(#arrd)" />
          <text x="247" y="35" textAnchor="middle" fill="#4f8ef7" fontSize="11">3</text>
          {/* c→b */}
          <line x1="295" y1="60" x2="200" y2="60" stroke="rgba(249,115,22,0.6)" strokeWidth="2" markerEnd="url(#arrd)" />
          <text x="247" y="75" textAnchor="middle" fill="#f97316" fontSize="11">0.33</text>
          {["a","b","c"].map((lbl,i) => (
            <g key={i}>
              <circle cx={[60,180,310][i]} cy={52} r={18} fill="rgba(79,142,247,0.2)" stroke="#4f8ef7" strokeWidth="2" />
              <text x={[60,180,310][i]} y={57} textAnchor="middle" fill="#4f8ef7" fontSize="14" fontWeight="bold">{lbl}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Queries</div>
        <div className="space-y-2">
          {QUERIES.map(([src,dst],i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded" style={{ background: i === cur.active ? "rgba(249,115,22,0.15)" : i < answeredSoFar ? "rgba(34,197,94,0.08)" : "var(--bg-hover)", border: i === cur.active ? "1px solid rgba(249,115,22,0.4)" : "1px solid var(--border)" }}>
              <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>{src}/{dst} = </span>
              <span className="font-bold" style={{ color: i < answeredSoFar ? (ANSWERS[i] === -1 ? "#ef4444" : "#22c55e") : "var(--text-muted)" }}>{i < answeredSoFar ? ANSWERS[i] : "?"}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
