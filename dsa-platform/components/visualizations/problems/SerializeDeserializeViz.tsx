"use client";
import { useState, useRef, useEffect } from "react";

// Tree: [1,2,3,null,null,4,5]
const NODES = [
  { id:0, x:200, y:30, v:1 },
  { id:1, x:110, y:95, v:2 },
  { id:2, x:290, y:95, v:3 },
  { id:3, x:245, y:160, v:4 },
  { id:4, x:335, y:160, v:5 },
];
const EDGES = [[0,1],[0,2],[2,3],[2,4]];
const SERIAL = "1,2,null,null,3,4,null,null,5,null,null";

const STEPS = [
  { phase: "S", tokens: [] as string[], rebuiltTo: -1, msg: "Serialize: BFS level-order. Null children = 'null' marker." },
  { phase: "S", tokens: ["1"], rebuiltTo: -1, msg: "Visit 1 → emit '1'. Queue children 2,3." },
  { phase: "S", tokens: ["1","2","3"], rebuiltTo: -1, msg: "Visit 2→'2', 3→'3'. 2's children null,null." },
  { phase: "S", tokens: ["1","2","3","null","null","4","5"], rebuiltTo: -1, msg: "Emit 2's nulls. Visit 4→'4', 5→'5'. Done." },
  { phase: "D", tokens: SERIAL.split(","), rebuiltTo: 0, msg: "Deserialize: parse tokens. First='1'→root." },
  { phase: "D", tokens: SERIAL.split(","), rebuiltTo: 2, msg: "Pop '2'→left child. Pop '3'→right child." },
  { phase: "D", tokens: SERIAL.split(","), rebuiltTo: 4, msg: "Pop 'null'→no children for 2. Pop '4','5'→children of 3. Done!" },
];

export default function SerializeDeserializeViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Serialize: BFS with null markers. Deserialize: queue-based reconstruction.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Serialize: BFS with null markers. Deserialize: queue-based reconstruction.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Tree serialized and deserialized correctly!"); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg("Serialize/Deserialize complete! Tree perfectly reconstructed."); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Serialize and Deserialize Binary Tree — BFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>BFS level-order with null markers. Queue-driven reconstruction.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: cur.phase === "S" ? "#4f8ef7" : "#22c55e" }}>{cur.phase === "S" ? "▶ Serializing" : "▶ Deserializing"}</div>
        <svg width="400" height="190" viewBox="0 0 400 190" style={{ width: "100%", height: "auto" }}>
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" />
          ))}
          {NODES.map(n => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={18} fill={cur.phase === "D" && n.id <= cur.rebuiltTo ? "rgba(34,197,94,0.25)" : "rgba(79,142,247,0.15)"} stroke={cur.phase === "D" && n.id <= cur.rebuiltTo ? "#22c55e" : "#4f8ef7"} strokeWidth="2" />
              <text x={n.x} y={n.y+5} textAnchor="middle" fill={cur.phase === "D" && n.id <= cur.rebuiltTo ? "#22c55e" : "#4f8ef7"} fontSize="13" fontWeight="bold">{n.v}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Serialized string</div>
        <div className="flex flex-wrap gap-1">
          {SERIAL.split(",").map((t, i) => (
            <span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background: cur.tokens.includes(t) ? "rgba(79,142,247,0.15)" : "var(--bg-hover)", color: cur.tokens.includes(t) ? "#4f8ef7" : "var(--text-muted)", border: `1px solid ${cur.tokens.includes(t) ? "rgba(79,142,247,0.3)" : "var(--border)"}` }}>{t}</span>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
