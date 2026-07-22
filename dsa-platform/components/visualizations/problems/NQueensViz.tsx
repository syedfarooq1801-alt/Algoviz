"use client";
import { useState, useEffect, useRef } from "react";

const N = 4;

interface Step { board: number[]; row: number; col: number; action: string; found?: boolean; }

function buildSteps(): Step[] {
  const steps: Step[] = [];
  const queens: number[] = []; // queens[row] = col

  function isSafe(row: number, col: number) {
    for (let r=0;r<row;r++) {
      if (queens[r]===col || Math.abs(queens[r]-col)===row-r) return false;
    }
    return true;
  }

  function bt(row: number) {
    if (row === N) { steps.push({ board:[...queens], row, col:-1, action:`✓ Solution found: [${queens}]`, found:true }); return; }
    for (let col=0;col<N;col++) {
      if (isSafe(row,col)) {
        queens[row]=col;
        steps.push({ board:[...queens], row, col, action:`Row ${row}: place queen at col ${col} — safe` });
        bt(row+1);
        queens[row]=-1;
        steps.push({ board:[...queens], row, col, action:`Row ${row}: backtrack, remove from col ${col}` });
      } else {
        steps.push({ board:[...queens], row, col, action:`Row ${row}, col ${col}: unsafe (conflict) → skip` });
      }
    }
  }
  bt(0);
  return steps;
}

const ALL_STEPS = buildSteps();

export default function NQueensViz() {
  const [stepIdx, setStepIdx] = useState(0);
  const [solutions, setSolutions] = useState<number[][]>([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const stateRef = useRef({ stepIdx:0, solutions:[] as number[][] });

  const reset = () => { stateRef.current={stepIdx:0,solutions:[]}; setStepIdx(0); setSolutions([]); setPlaying(false); if(iRef.current)clearInterval(iRef.current); };

  const doStep = () => {
    const { stepIdx:s, solutions:sol } = stateRef.current;
    if (s>=ALL_STEPS.length) { setPlaying(false); return; }
    const step = ALL_STEPS[s];
    let nsol=sol;
    if (step.found) nsol=[...sol,[...step.board]];
    stateRef.current={stepIdx:s+1,solutions:nsol};
    setStepIdx(s+1); setSolutions([...nsol]);
  };

  useEffect(() => {
    if (playing) { iRef.current=setInterval(doStep,speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current=null; }
    return () => { if(iRef.current)clearInterval(iRef.current); };
  }, [playing,speed]);

  const done=stepIdx>=ALL_STEPS.length;
  const cur=stepIdx>0?ALL_STEPS[stepIdx-1]:null;

  const cellColor = (r: number, c: number) => {
    if (!cur) return { bg:(r+c)%2===0?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.02)", color:"var(--text-muted)" };
    const queen = cur.board[r];
    if (queen===c) {
      if (cur.found) return { bg:"rgba(34,197,94,0.3)", color:"#22c55e" };
      if (r===cur.row) return { bg:"rgba(79,142,247,0.3)", color:"#4f8ef7" };
      return { bg:"rgba(168,85,247,0.2)", color:"#a855f7" };
    }
    if (r===cur.row&&c===cur.col&&!cur.found) return { bg:"rgba(239,68,68,0.2)", color:"#ef4444" };
    return { bg:(r+c)%2===0?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.02)", color:"var(--text-muted)" };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color:"var(--text-primary)" }}>N-Queens (N={N}) — Constraint Backtracking</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>Place queens row by row. Skip if any prior queen attacks current cell.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>step {stepIdx}/{ALL_STEPS.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Board */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Board ({N}×{N})</div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${N},1fr)`, gap:"3px", maxWidth:"160px" }}>
            {Array.from({length:N}).map((_,r)=>Array.from({length:N}).map((_,c)=>{
              const sc=cellColor(r,c);
              return (
                <div key={`${r}${c}`} className="aspect-square rounded flex items-center justify-center text-base transition-all duration-200"
                  style={{ background:sc.bg, color:sc.color, border:"1px solid rgba(255,255,255,0.06)" }}>
                  {cur?.board[r]===c?"♛":""}
                </div>
              );
            }))}
          </div>
          <div className="flex gap-2 mt-2 text-xs">
            <span style={{ color:"#a855f7" }}>♛ placed</span>
            <span style={{ color:"#4f8ef7" }}>♛ current</span>
            <span style={{ color:"#22c55e" }}>♛ solution</span>
          </div>
        </div>

        {/* Solutions */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Solutions found ({solutions.length})</div>
          <div className="space-y-2">
            {solutions.map((sol,si)=>(
              <div key={si} className="flex gap-1">
                {Array.from({length:N}).map((_,r)=>Array.from({length:N}).map((_,c)=>(
                  <div key={c} className="w-5 h-5 rounded text-xs flex items-center justify-center"
                    style={{ background:sol[r]===c?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.03)", border:`1px solid ${sol[r]===c?"rgba(34,197,94,0.4)":"rgba(255,255,255,0.06)"}`, color:"#22c55e", fontSize:"9px" }}>
                    {sol[r]===c?"♛":""}
                  </div>
                )))}
                <span style={{ fontSize:"9px", color:"var(--text-muted)", marginLeft:"4px", alignSelf:"center" }}>#{si+1}</span>
              </div>
            ))}
            {solutions.length===0&&<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>none yet</span>}
          </div>
        </div>
      </div>

      {cur&&(
        <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:cur.found?"rgba(34,197,94,0.1)":cur.action.includes("unsafe")?"rgba(239,68,68,0.07)":"rgba(79,142,247,0.07)", color:cur.found?"#22c55e":cur.action.includes("unsafe")?"#ef4444":"#4f8ef7", border:`1px solid ${cur.found?"rgba(34,197,94,0.3)":cur.action.includes("unsafe")?"rgba(239,68,68,0.2)":"rgba(79,142,247,0.18)"}` }}>
          {cur.action}
        </div>
      )}
    </div>
  );
}
