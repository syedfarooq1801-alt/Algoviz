"use client";
import { useState, useEffect, useRef } from "react";

const BOARD = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"]
];
const WORD = "ABCCED";

interface Step { visited: Set<string>; path: [number,number][]; row:number; col:number; idx:number; action:string; found?:boolean; failed?:boolean; }

function buildSteps(): Step[] {
  const steps: Step[] = [];
  const rows=BOARD.length, cols=BOARD[0].length;
  const visited = new Set<string>();
  let found = false;

  function bt(r: number, c: number, idx: number, path: [number,number][]) {
    if (found) return;
    if (idx === WORD.length) { found=true; steps.push({ visited:new Set(visited), path:[...path], row:r, col:c, idx, action:`✓ Found "${WORD}"!`, found:true }); return; }
    if (r<0||r>=rows||c<0||c>=cols||visited.has(`${r},${c}`)||BOARD[r][c]!==WORD[idx]) {
      steps.push({ visited:new Set(visited), path:[...path], row:r, col:c, idx, action:`[${r},${c}]="${BOARD[r]?.[c]??'?'}" ≠ '${WORD[idx]}' or out of bounds → prune`, failed:true }); return;
    }
    visited.add(`${r},${c}`); path.push([r,c]);
    steps.push({ visited:new Set(visited), path:[...path], row:r, col:c, idx, action:`Match [${r},${c}]="${WORD[idx]}", matched ${idx+1}/${WORD.length} chars` });
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) bt(r+dr,c+dc,idx+1,[...path]);
    if (!found) { visited.delete(`${r},${c}`); path.pop(); steps.push({ visited:new Set(visited), path:[...path], row:r, col:c, idx, action:`Backtrack from [${r},${c}], try other directions` }); }
  }

  for (let r=0;r<rows&&!found;r++) for (let c=0;c<cols&&!found;c++) {
    steps.push({ visited:new Set(), path:[], row:r, col:c, idx:0, action:`Start DFS from [${r},${c}]="${BOARD[r][c]}"` });
    bt(r,c,0,[]);
  }
  return steps;
}

const ALL_STEPS = buildSteps();

export default function WordSearchViz() {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const stateRef = useRef({ stepIdx:0 });

  const reset = () => { stateRef.current={stepIdx:0}; setStepIdx(0); setPlaying(false); if(iRef.current)clearInterval(iRef.current); };

  const doStep = () => {
    const s = stateRef.current.stepIdx;
    if (s >= ALL_STEPS.length) { setPlaying(false); return; }
    stateRef.current.stepIdx = s+1;
    setStepIdx(s+1);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const done = stepIdx >= ALL_STEPS.length;
  const cur = stepIdx > 0 ? ALL_STEPS[stepIdx-1] : null;

  const cellStyle = (r: number, c: number) => {
    if (!cur) return { bg:"var(--bg-hover)", border:"var(--border)", color:"var(--text-secondary)" };
    const key = `${r},${c}`;
    const pathIdx = cur.path.findIndex(([pr,pc])=>pr===r&&pc===c);
    if (cur.found && pathIdx>=0) return { bg:"rgba(34,197,94,0.35)", border:"#22c55e", color:"#22c55e" };
    if (cur.row===r && cur.col===c) return { bg:"rgba(79,142,247,0.3)", border:"#4f8ef7", color:"#4f8ef7" };
    if (cur.visited.has(key)) return { bg:"rgba(168,85,247,0.2)", border:"rgba(168,85,247,0.4)", color:"#a855f7" };
    return { bg:"var(--bg-hover)", border:"var(--border)", color:"var(--text-secondary)" };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color:"var(--text-primary)" }}>Word Search — Grid DFS Backtracking</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>Search "{WORD}" in board. DFS with visited set, backtrack on mismatch/visited.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="50" max="1000" step="50" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>step {stepIdx}/{ALL_STEPS.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Board */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Board</div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${BOARD[0].length},1fr)`, gap:"4px", maxWidth:"180px" }}>
            {BOARD.map((row,r)=>row.map((ch,c)=>{
              const s=cellStyle(r,c);
              return (
                <div key={`${r}${c}`} className="aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200"
                  style={{ background:s.bg, border:`2px solid ${s.border}`, color:s.color }}>
                  {ch}
                </div>
              );
            }))}
          </div>
          <div className="flex gap-2 mt-2 text-xs flex-wrap">
            <span style={{ color:"#4f8ef7" }}>■ current</span>
            <span style={{ color:"#a855f7" }}>■ visited</span>
            <span style={{ color:"#22c55e" }}>■ found</span>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Matching "{WORD}"</div>
          <div className="flex gap-1">
            {WORD.split("").map((ch,i)=>{
              const matched = cur && i < cur.idx;
              return (
                <div key={i} className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ background:matched?"rgba(34,197,94,0.2)":"var(--bg-hover)", border:`1px solid ${matched?"rgba(34,197,94,0.4)":"var(--border)"}`, color:matched?"#22c55e":"var(--text-muted)" }}>{ch}</div>
              );
            })}
          </div>
          {cur && <div className="mt-2 text-xs font-mono" style={{ color:"var(--text-muted)" }}>matched {cur.idx}/{WORD.length}</div>}
          {cur && cur.path.length>0 && (
            <div className="mt-2 text-xs" style={{ color:"var(--text-muted)" }}>path: {cur.path.map(([r,c])=>`[${r},${c}]`).join("→")}</div>
          )}
        </div>
      </div>

      {cur && (
        <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:cur.found?"rgba(34,197,94,0.1)":cur.failed?"rgba(239,68,68,0.07)":"rgba(79,142,247,0.07)", color:cur.found?"#22c55e":cur.failed?"#ef4444":"#4f8ef7", border:`1px solid ${cur.found?"rgba(34,197,94,0.3)":cur.failed?"rgba(239,68,68,0.2)":"rgba(79,142,247,0.18)"}` }}>
          {cur.action}
        </div>
      )}
    </div>
  );
}
