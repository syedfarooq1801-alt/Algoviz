"use client";
import { useState, useRef, useEffect } from "react";

// beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]
const PATH = ["hit","hot","dot","dog","cog"];
const ALL_WORDS = ["hit","hot","dot","dog","lot","log","cog"];

const STEPS = PATH.map((word, i) => ({
  current: i,
  visited: PATH.slice(0, i+1),
  msg: i === 0
    ? `Start: "${word}". BFS explores all 1-letter transformations.`
    : i < PATH.length - 1
    ? `${PATH[i-1]}→${word}: change 1 letter. Add unvisited 1-letter neighbors.`
    : `Reached "${word}" (endWord) in ${PATH.length - 1} steps!`
}));

export default function WordLadderViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`BFS on word graph. Each edge = 1-letter diff. Find shortest path "hit"→"cog".`);
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg(`BFS on word graph. Each edge = 1-letter diff. Find shortest path "hit"→"cog".`);
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Shortest transformation = ${PATH.length} words (${PATH.length - 1} steps).`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Answer = ${PATH.length} (hit→hot→dot→dog→cog). ${PATH.length-1} transformations.`); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = STEPS[step];

  const getDiff = (a: string, b: string) => {
    let diff = 0, pos = -1;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) { diff++; pos = i; }
    return { diff, pos };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Word Ladder — BFS</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>BFS level by level. Try all 26*len neighbors. Return level count when endWord found.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Transformation Path</div>
        <div className="flex items-center flex-wrap gap-2">
          {PATH.map((word, i) => {
            const isActive = i === cur.current;
            const visited = cur.visited.includes(word);
            const diff = i > 0 ? getDiff(PATH[i-1], word) : null;
            return (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <div className="text-center">
                    <div className="text-xs" style={{ color: "rgba(107,114,128,0.7)" }}>→</div>
                    {diff && <div className="text-xs" style={{ color: "#f97316" }}>pos{diff.pos}</div>}
                  </div>
                )}
                <div className="px-3 py-2 rounded-lg" style={{ background: isActive ? "rgba(249,115,22,0.3)" : visited ? (i === PATH.length-1 ? "rgba(34,197,94,0.25)" : "rgba(79,142,247,0.2)") : "var(--bg-hover)", border: isActive ? "2px solid #f97316" : visited ? (i === PATH.length-1 ? "2px solid #22c55e" : "1px solid rgba(79,142,247,0.4)") : "1px dashed rgba(107,114,128,0.3)" }}>
                  <div className="font-bold text-sm font-mono" style={{ color: isActive ? "#f97316" : visited ? (i === PATH.length-1 ? "#22c55e" : "#4f8ef7") : "rgba(107,114,128,0.4)" }}>{word}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>step {i}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {done && (
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>5</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>min transformations (word count)</div>
        </div>
      )}
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
