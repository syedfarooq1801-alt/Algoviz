"use client";
import { useState, useRef, useEffect } from "react";

// words=["wrt","wrf","er","ett","rftt"]
// Derived order: t<f, w<e, r<t, e<r → "wertf"
const WORDS = ["wrt","wrf","er","ett","rftt"];
const EDGES: [string,string][] = [["t","f"],["w","e"],["r","t"],["e","r"]];
const TOPO = ["w","e","r","t","f"];

const STEPS = [
  { compared: [] as [string,string][], edges: [] as [string,string][], msg: "Compare adjacent words to find character ordering." },
  { compared: [["wrt","wrf"]], edges: [["t","f"]], msg: "wrt vs wrf: first diff at pos 2 → t < f" },
  { compared: [["wrt","wrf"],["wrf","er"]], edges: [["t","f"],["w","e"]], msg: "wrf vs er: first diff at pos 0 → w < e" },
  { compared: [["wrt","wrf"],["wrf","er"],["er","ett"]], edges: [["t","f"],["w","e"],["r","t"]], msg: "er vs ett: first diff at pos 1 → r < t" },
  { compared: EDGES.slice(), edges: [...EDGES], msg: "ett vs rftt: first diff at pos 0 → e < r. Graph built!" },
  { compared: EDGES.slice(), edges: [...EDGES], topo: TOPO, msg: "Topological sort (Kahn's BFS): w→e→r→t→f" },
];

export default function AlienDictionaryViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState(`Compare adjacent words → extract char order → topological sort.`);
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Compare adjacent words → extract char order → topological sort.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Alien alphabet order: "${TOPO.join("")}"`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Alien order = "${TOPO.join("")}"`); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];
  const topoStep = (cur as any).topo;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Alien Dictionary — Topological Sort</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Extract ordering from word pairs → build DAG → topological sort (Kahn's).</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Word List</div>
          <div className="space-y-1">
            {WORDS.map((w, i) => (
              <div key={i} className="font-mono text-sm px-2 py-1 rounded" style={{ background: i < cur.compared.length ? "rgba(34,197,94,0.1)" : "var(--bg-hover)", color: "var(--text-secondary)" }}>{w}</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Derived Edges</div>
          <div className="space-y-1">
            {cur.edges.map(([a,b], i) => (
              <div key={i} className="text-xs font-mono px-2 py-1 rounded flex items-center gap-2" style={{ background: "rgba(79,142,247,0.1)", color: "#4f8ef7" }}>
                <span className="font-bold">{a}</span>
                <span>→</span>
                <span className="font-bold">{b}</span>
                <span style={{ color: "var(--text-muted)" }}>(comes before)</span>
              </div>
            ))}
            {cur.edges.length === 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>}
          </div>
        </div>
      </div>
      {topoStep && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "#22c55e" }}>Topological Order</div>
          <div className="flex items-center gap-2">
            {TOPO.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold font-mono" style={{ background: "rgba(34,197,94,0.25)", border: "2px solid #22c55e", color: "#22c55e" }}>{c}</div>
                {i < TOPO.length - 1 && <span style={{ color: "#22c55e" }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
