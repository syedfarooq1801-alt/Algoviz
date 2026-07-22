"use client";
import { useState, useRef, useEffect } from "react";

// board=4x4, words=["oath","pea","eat","rain"]
const BOARD = [
  ['o','a','a','n'],
  ['e','t','a','e'],
  ['i','h','k','r'],
  ['i','f','l','v'],
];
const WORDS = ["oath","pea","eat","rain"];
const FOUND_WORDS = ["oath","eat"]; // Actually found in board
const PATHS: Record<string,[number,number][]> = {
  "oath": [[0,0],[1,1],[2,1],[1,0]], // o→a→t→h - needs check
  "eat": [[1,0],[0,0],[1,1]], // rough path for visualization
};

// Corrected paths - just for display
const WORD_PATHS: Record<string, [number,number][]> = {
  "oath": [[0,0],[0,1],[1,1],[2,1]],
  "eat": [[1,0],[0,1],[1,1]],
};

const STEPS = [
  { word: "", highlightCells: [] as [number,number][], found: [] as string[], msg: "Build Trie from words. DFS from each cell, prune using Trie." },
  { word: "oath", highlightCells: [[0,0],[0,1],[1,1],[2,1]], found: ["oath"], msg: "Found 'oath': o(0,0)→a(0,1)→t(1,1)→h(2,1). Trie match!" },
  { word: "eat", highlightCells: [[1,0],[0,1],[1,1]], found: ["oath","eat"], msg: "Found 'eat': e(1,0)→a(0,1)→t(1,1). Both words found!" },
];

export default function WordSearchIIViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Trie + DFS backtracking. Prune DFS branches not matching Trie prefix.");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Trie + DFS backtracking. Prune DFS branches not matching Trie prefix.");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Found: [${FOUND_WORDS.join(", ")}]`); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(STEPS[next].msg);
    if (next + 1 >= STEPS.length) { setDone(true); setPlaying(false); setMsg(`Result: ["oath","eat"]`); }
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
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Word Search II — Trie + DFS Backtracking</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Build Trie of all words. DFS from each cell. If no Trie child matches, prune. Mark visited.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Board</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {BOARD.map((row, r) => row.map((c, ci) => {
              const isHighlight = cur.highlightCells.some(([hr,hc]) => hr===r && hc===ci);
              return (
                <div key={`${r}-${ci}`} className="aspect-square flex items-center justify-center rounded text-lg font-bold uppercase" style={{ background: isHighlight ? "rgba(249,115,22,0.3)" : "var(--bg-hover)", border: isHighlight ? "2px solid #f97316" : "1px solid var(--border)", color: isHighlight ? "#f97316" : "var(--text-secondary)" }}>
                  {c}
                </div>
              );
            }))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Search words</div>
          <div className="space-y-2">
            {WORDS.map((w, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm font-mono" style={{ background: cur.found.includes(w) ? "rgba(34,197,94,0.15)" : "var(--bg-hover)", border: cur.word===w ? "2px solid #f97316" : cur.found.includes(w) ? "1px solid rgba(34,197,94,0.4)" : "1px solid var(--border)", color: cur.found.includes(w) ? "#22c55e" : "var(--text-secondary)" }}>
                {w}
                {cur.found.includes(w) && <span style={{ color: "#22c55e" }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
