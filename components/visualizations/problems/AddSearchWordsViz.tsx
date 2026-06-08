"use client";
import { useState, useRef, useEffect } from "react";

// addWord: "bad","dad","mad" then search: "pad"→false, "bad"→true, ".ad"→true, "b.."→true
const OPERATIONS = [
  { op:"add", word:"bad", result:null as boolean|null, msg:"addWord('bad'): insert b→a→d in trie." },
  { op:"add", word:"dad", result:null, msg:"addWord('dad'): insert d→a→d in trie." },
  { op:"add", word:"mad", result:null, msg:"addWord('mad'): insert m→a→d in trie." },
  { op:"search", word:"pad", result:false, msg:"search('pad'): p not in trie root → false." },
  { op:"search", word:"bad", result:true, msg:"search('bad'): b→a→d all in trie + endOfWord → true." },
  { op:"search", word:".ad", result:true, msg:"search('.ad'): '.'=wildcard→try all children→a→d found → true." },
  { op:"search", word:"b..", result:true, msg:"search('b..'): b→wildcard→all→wildcard→all. Finds 'bad' → true." },
];

// Trie structure for visualization
const TRIE_NODES = [
  { id:"root", x:200, y:20, label:"root" },
  { id:"b", x:100, y:80, label:"b" },
  { id:"d", x:200, y:80, label:"d" },
  { id:"m", x:300, y:80, label:"m" },
  { id:"ba", x:100, y:140, label:"a" },
  { id:"da", x:200, y:140, label:"a" },
  { id:"ma", x:300, y:140, label:"a" },
  { id:"bad", x:100, y:200, label:"d*" },
  { id:"dad", x:200, y:200, label:"d*" },
  { id:"mad", x:300, y:200, label:"d*" },
];
const TRIE_EDGES = [["root","b"],["root","d"],["root","m"],["b","ba"],["d","da"],["m","ma"],["ba","bad"],["da","dad"],["ma","mad"]];

export default function AddSearchWordsViz() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [msg, setMsg] = useState("Add words to Trie. For search: '.' matches any single char (DFS all children).");
  const stateRef = useRef({ step: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { step: 0 };
    setStep(0); setDone(false); setPlaying(false);
    setMsg("Add words to Trie. For search: '.' matches any single char (DFS all children).");
    if (iRef.current) clearInterval(iRef.current);
  };
  const doStep = () => {
    const { step: s } = stateRef.current;
    const next = s + 1;
    if (next >= OPERATIONS.length) { setDone(true); setPlaying(false); setMsg("All operations done! Trie with wildcard search."); return; }
    stateRef.current = { step: next };
    setStep(next); setMsg(OPERATIONS[next].msg);
    if (next + 1 >= OPERATIONS.length) { setDone(true); setPlaying(false); setMsg("Design Add and Search Words — complete!"); }
  };
  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const cur = OPERATIONS[step];
  const addedWords = OPERATIONS.slice(0, step + 1).filter(o => o.op === "add").map(o => o.word);
  const nodeVisible = (id: string) => {
    if (id === "root") return true;
    const wordMap: Record<string, string[]> = {
      "b":["bad"],"d":["dad"],"m":["mad"],
      "ba":["bad"],"da":["dad"],"ma":["mad"],
      "bad":["bad"],"dad":["dad"],"mad":["mad"]
    };
    return (wordMap[id] || []).some(w => addedWords.includes(w));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Design Add and Search Words — Trie</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>addWord: O(len). search: '.' → DFS all children. Regular char → exact match.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Trie</div>
        <svg width="400" height="230" viewBox="0 0 400 230" style={{ width: "100%", height: "auto" }}>
          {TRIE_EDGES.map(([a,b],i) => {
            const na = TRIE_NODES.find(n => n.id===a)!;
            const nb = TRIE_NODES.find(n => n.id===b)!;
            if (!nodeVisible(b)) return null;
            return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="rgba(79,142,247,0.35)" strokeWidth="1.5" />;
          })}
          {TRIE_NODES.map(n => {
            if (!nodeVisible(n.id)) return null;
            const isEnd = n.label.endsWith("*");
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={16} fill={isEnd ? "rgba(34,197,94,0.3)" : n.id==="root" ? "rgba(79,142,247,0.2)" : "rgba(79,142,247,0.12)"} stroke={isEnd ? "#22c55e" : "#4f8ef7"} strokeWidth="1.5" />
                <text x={n.x} y={n.y+5} textAnchor="middle" fill={isEnd ? "#22c55e" : "#4f8ef7"} fontSize="11" fontWeight="bold">{n.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Operations</div>
        <div className="space-y-1">
          {OPERATIONS.map((op, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-1.5 rounded text-xs" style={{ background: i === step ? (op.op==="add" ? "rgba(79,142,247,0.15)" : "rgba(249,115,22,0.15)") : "transparent", border: i === step ? "1px solid rgba(79,142,247,0.3)" : "1px solid transparent" }}>
              <span className="font-mono" style={{ color: op.op==="add" ? "#4f8ef7" : "#f97316" }}>{op.op}("{op.word}")</span>
              {op.result !== null && i <= step && (
                <span className="font-bold" style={{ color: op.result ? "#22c55e" : "#ef4444" }}> → {op.result ? "true" : "false"}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: cur.op==="search" ? (cur.result===true ? "rgba(34,197,94,0.08)" : cur.result===false ? "rgba(239,68,68,0.08)" : "rgba(79,142,247,0.07)") : "rgba(79,142,247,0.07)", color: cur.op==="search" ? (cur.result===true ? "#22c55e" : cur.result===false ? "#ef4444" : "#4f8ef7") : "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
