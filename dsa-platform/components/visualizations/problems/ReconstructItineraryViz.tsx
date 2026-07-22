"use client";
import { useState, useRef, useEffect } from "react";

// tickets=[["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
// Answer: JFK→MUC→LHR→SFO→SJC (Hierholzer's algorithm)
const TICKETS = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]];
const ANSWER = ["JFK","MUC","LHR","SFO","SJC"];

const STEPS = [
  { stack: ["JFK"], result: [] as string[], visited: [] as string[], msg: "Start at JFK. Sort adjacency lists lexicographically. DFS." },
  { stack: ["JFK","MUC"], result: [], visited: ["JFK→MUC"], msg: "JFK→MUC (only neighbor). Push MUC." },
  { stack: ["JFK","MUC","LHR"], result: [], visited: ["JFK→MUC","MUC→LHR"], msg: "MUC→LHR (only neighbor). Push LHR." },
  { stack: ["JFK","MUC","LHR","SFO"], result: [], visited: ["JFK→MUC","MUC→LHR","LHR→SFO"], msg: "LHR→SFO (only neighbor). Push SFO." },
  { stack: ["JFK","MUC","LHR","SFO","SJC"], result: [], visited: ["JFK→MUC","MUC→LHR","LHR→SFO","SFO→SJC"], msg: "SFO→SJC. SJC has no more neighbors → pop to result." },
  { stack: ["JFK","MUC","LHR","SFO"], result: ["SJC"], visited: [] as string[], msg: "Pop SFO→result. Continue backtracking." },
  { stack: [] as string[], result: ["SJC","SFO","LHR","MUC","JFK"], visited: [], msg: "All popped. Reverse result = JFK→MUC→LHR→SFO→SJC ✓" },
];

export default function ReconstructItineraryViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Hierholzer's: DFS from JFK. Post-order add to result. Reverse at end.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Hierholzer's: DFS from JFK. Post-order add to result. Reverse at end.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Itinerary: ${ANSWER.join("→")}`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Result: ${ANSWER.join("→")}`); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Reconstruct Itinerary — Hierholzer's DFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Eulerian path. DFS, post-order append. Reverse result. Sorted adj list for lex order.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "#4f8ef7" }}>DFS Stack</div>
          <div className="flex flex-col gap-1">
            {[...cur.stack].reverse().map((a, i) => (
              <div key={i} className="px-2 py-1.5 rounded text-sm font-mono font-bold text-center" style={{ background: i === 0 ? "rgba(249,115,22,0.25)" : "rgba(79,142,247,0.1)", border: i === 0 ? "2px solid #f97316" : "1px solid rgba(79,142,247,0.3)", color: i === 0 ? "#f97316" : "#4f8ef7" }}>{a}</div>
            ))}
            {cur.stack.length === 0 && <div className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>empty</div>}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "#22c55e" }}>Result (post-order)</div>
          <div className="flex flex-col gap-1">
            {cur.result.map((a, i) => (
              <div key={i} className="px-2 py-1.5 rounded text-sm font-mono font-bold text-center" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}>{a}</div>
            ))}
            {cur.result.length === 0 && <div className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>empty</div>}
          </div>
        </div>
      </div>
      {done && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "#22c55e" }}>Final Itinerary (reversed)</div>
          <div className="flex items-center flex-wrap gap-1">
            {ANSWER.map((a,i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="px-2 py-1 rounded font-mono font-bold text-sm" style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e" }}>{a}</span>
                {i < ANSWER.length - 1 && <span style={{ color: "#22c55e" }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
