"use client";
import { useState, useRef, useEffect } from "react";

// 1→2→3→4→5, k=2 → 2→1→4→3→5
const STEPS = [
  { list: [1,2,3,4,5], group: [0,1], msg: "k=2. Take first group [1,2]. Reverse → [2,1]." },
  { list: [2,1,3,4,5], group: [2,3], msg: "Next group [3,4]. Reverse → [4,3]." },
  { list: [2,1,4,3,5], group: [4], msg: "Remaining [5] has length 1 < k=2. Keep as-is." },
  { list: [2,1,4,3,5], group: [], msg: "Done! 2→1→4→3→5" },
];

export default function ReverseKGroupViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState("Reverse Nodes in k-Group. Count k nodes, reverse, reconnect. Recurse on rest.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Reverse Nodes in k-Group. Count k nodes, reverse, reconnect. Recurse on rest.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Result: 2→1→4→3→5 ✓"); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Result: 2→1→4→3→5 ✓"); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Reverse Nodes in k-Group — k=2</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Count k nodes. If fewer than k remain, leave as-is. Reverse group, connect to rest.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          {cur.list.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{
                background: cur.group.includes(i) ? (cur.group.length < 2 ? "rgba(107,114,128,0.15)" : "rgba(249,115,22,0.3)") : i < step * 2 ? "rgba(34,197,94,0.2)" : "var(--bg-hover)",
                border: cur.group.includes(i) ? (cur.group.length < 2 ? "1px solid rgba(107,114,128,0.3)" : "2px solid #f97316") : i < step * 2 ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border)",
                color: cur.group.includes(i) ? "#f97316" : i < step * 2 ? "#22c55e" : "var(--text-secondary)"
              }}>{v}</div>
              {i < cur.list.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
            </div>
          ))}
        </div>
        {cur.group.length > 0 && cur.group.length >= 2 && (
          <div className="mt-2 text-xs" style={{ color: "#f97316" }}>Reversing group at positions [{cur.group.join(",")}]</div>
        )}
        {cur.group.length === 1 && (
          <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>Remaining 1 node &lt; k=2, leave as-is</div>
        )}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
