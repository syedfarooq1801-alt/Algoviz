"use client";
import { useState, useEffect, useRef } from "react";

const WORDS = ["eat","tea","tan","ate","nat","bat"];

type Groups = Record<string, string[]>;

export default function GroupAnagramsViz() {
  const [words, setWords] = useState<string[]>(WORDS);
  const [input, setInput] = useState(WORDS.join(", "));
  const [idx, setIdx] = useState(-1);
  const [groups, setGroups] = useState<Groups>({});
  const [currentKey, setCurrentKey] = useState("");
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — sort each word to get its canonical key, group by key");
  const stateRef = useRef({ idx: -1, groups: {} as Groups, words: WORDS });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = (w = words) => {
    stateRef.current = { idx: -1, groups: {}, words: w };
    setIdx(-1); setGroups({}); setCurrentKey(""); setDone(false); setPlaying(false);
    setMsg("Press Play — sort each word to get its canonical key, group by key");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const next = st.idx + 1;
    if (next >= st.words.length) {
      stateRef.current = { ...st, idx: next };
      setIdx(next); setDone(true); setPlaying(false); setCurrentKey("");
      setMsg(`Done! Found ${Object.keys(st.groups).length} anagram groups`); return;
    }
    const w = st.words[next];
    const key = w.split("").sort().join("");
    const ng: Groups = { ...st.groups };
    if (!ng[key]) ng[key] = [];
    ng[key] = [...ng[key], w];
    stateRef.current = { ...st, idx: next, groups: ng };
    setIdx(next); setGroups(ng); setCurrentKey(key);
    setMsg(`"${w}" → sorted = "${key}" → add to group [${key}]`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const w = input.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    setWords(w); stateRef.current.words = w; reset(w);
  };

  const COLORS = ["#4f8ef7","#a855f7","#22c55e","#f97316","#ef4444","#ec4899"];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Group Anagrams — Sort Key Hash Map</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color:"var(--text-muted)" }}>Words:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"260px" }} value={input} onChange={e => setInput(e.target.value)} />
          </div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={() => reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Word chips */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Input words</div>
        <div className="flex gap-2 flex-wrap">
          {words.map((w, i) => {
            const isCurr = i === idx;
            const isPast = i < idx;
            const key = w.split("").sort().join("");
            const groupIdx = Object.keys(groups).indexOf(key);
            const col = groupIdx >= 0 ? COLORS[groupIdx % COLORS.length] : "var(--text-secondary)";
            return (
              <div key={i} className="px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-300"
                style={{
                  background: isCurr?"rgba(79,142,247,0.2)":isPast?`${col}18`:"var(--bg-hover)",
                  border: isCurr?"2px solid #4f8ef7":isPast?`1px solid ${col}40`:"1px solid var(--border)",
                  color: isCurr?"#4f8ef7":isPast?col:"var(--text-secondary)",
                  transform: isCurr?"scale(1.1) translateY(-4px)":"scale(1)",
                  boxShadow: isCurr?"0 6px 16px rgba(79,142,247,0.3)":"none",
                }}>
                {w}
                {isCurr && <div className="text-[10px] mt-0.5" style={{ color:"#a855f7" }}>→ "{key}"</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Groups */}
      {Object.keys(groups).length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>HashMap: sorted_key → [anagram group]</div>
          <div className="space-y-2">
            {Object.entries(groups).map(([key, ws], gi) => {
              const col = COLORS[gi % COLORS.length];
              const isNew = key === currentKey && !done;
              return (
                <div key={key} className="flex items-center gap-3 p-2 rounded-lg transition-all duration-300"
                  style={{ background:`${col}08`, border:`1px solid ${isNew?col:col+"30"}`, boxShadow:isNew?`0 0 12px ${col}20`:"none" }}>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background:`${col}18`, color:col, minWidth:"60px", textAlign:"center" }}>"{key}"</span>
                  <span className="text-xs" style={{ color:"var(--text-muted)" }}>→</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {ws.map((w,i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:`${col}15`, color:col, border:`1px solid ${col}30` }}>{w}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
