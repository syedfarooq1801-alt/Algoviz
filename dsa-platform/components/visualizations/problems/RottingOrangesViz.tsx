"use client";
import { useState, useEffect, useRef } from "react";

const GRID_INIT = [[2,1,1],[1,1,0],[0,1,1]];

export default function RottingOrangesViz() {
  const [grid, setGrid] = useState<number[][]>(GRID_INIT.map(r=>[...r]));
  const [minute, setMinute] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<number|null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — multi-source BFS from all rotten oranges simultaneously");
  const stateRef = useRef({ grid:GRID_INIT.map(r=>[...r]), minute:0, queue:[] as [number,number][] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = () => {
    const g = GRID_INIT.map(r=>[...r]);
    const q: [number,number][] = [];
    for (let r=0;r<g.length;r++) for (let c=0;c<g[0].length;c++) if (g[r][c]===2) q.push([r,c]);
    stateRef.current = { grid:g, minute:0, queue:q };
    setGrid(g.map(r=>[...r])); setMinute(0); setDone(false); setResult(null); setPlaying(false);
    setMsg(`Multi-source BFS: ${q.length} rotten oranges in initial queue`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (!st.queue.length) {
      const fresh = st.grid.reduce((a,row)=>a+row.filter(v=>v===1).length,0);
      const res = fresh > 0 ? -1 : st.minute;
      stateRef.current = { ...st };
      setResult(res); setDone(true); setPlaying(false);
      setMsg(fresh>0?`${fresh} fresh oranges unreachable → -1`:`All oranges rotten in ${st.minute} minutes`); return;
    }
    const ng = st.grid.map(r=>[...r]);
    const nextQ: [number,number][] = [];
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    let spread = 0;
    for (const [r,c] of st.queue) {
      for (const [dr,dc] of dirs) {
        const nr=r+dr, nc=c+dc;
        if (nr>=0&&nr<ng.length&&nc>=0&&nc<ng[0].length&&ng[nr][nc]===1) {
          ng[nr][nc]=2; nextQ.push([nr,nc]); spread++;
        }
      }
    }
    const newMin = st.minute + (spread>0?1:0);
    stateRef.current = { grid:ng, minute:newMin, queue:nextQ };
    setGrid(ng.map(r=>[...r])); setMinute(newMin);
    if (spread>0) setMsg(`Minute ${newMin}: ${spread} new orange(s) rotted`);
    else { setResult(st.minute); setDone(true); setPlaying(false); setMsg(`No more fresh neighbors. Total = ${st.minute} minutes`); }
  };

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const CELL_COLORS: Record<number,{bg:string,border:string,color:string,label:string}> = {
    0: { bg:"var(--bg-hover)", border:"var(--border)", color:"var(--text-muted)", label:"empty" },
    1: { bg:"rgba(34,197,94,0.15)", border:"rgba(34,197,94,0.3)", color:"#22c55e", label:"fresh" },
    2: { bg:"rgba(239,68,68,0.2)", border:"rgba(239,68,68,0.4)", color:"#ef4444", label:"rotten" },
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Rotting Oranges — Multi-Source BFS</h3>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(249,115,22,0.1)", color:"#f97316", border:"1px solid rgba(249,115,22,0.3)" }}>minute={minute}</span>
        </div>
      </div>

      <div className="rounded-xl p-6" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="grid gap-2" style={{ display:"grid", gridTemplateColumns:`repeat(${grid[0]?.length??3},1fr)`, maxWidth:"220px", margin:"0 auto" }}>
          {grid.map((row,r)=>row.map((v,c)=>{
            const col = CELL_COLORS[v] || CELL_COLORS[0];
            return (
              <div key={`${r}${c}`} className="aspect-square rounded-lg flex items-center justify-center text-lg transition-all duration-300"
                style={{ background:col.bg, border:`2px solid ${col.border}`, color:col.color, fontSize:"20px" }}>
                {v===1?"🍊":v===2?"💀":""}
              </div>
            );
          }))}
        </div>
        <div className="flex gap-4 justify-center mt-3 text-xs">
          <span>🍊 fresh (1)</span>
          <span>💀 rotten (2)</span>
          <span style={{ color:"var(--text-muted)" }}>□ empty (0)</span>
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {result !== null && (
        <div className="rounded-xl p-4 text-center" style={{ background:result===-1?"rgba(239,68,68,0.1)":"rgba(34,197,94,0.08)", border:`1px solid ${result===-1?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
          <div className="font-semibold text-sm" style={{ color:result===-1?"#ef4444":"#22c55e" }}>{result===-1?"Some oranges can never rot → -1":`All oranges rotten in ${result} minutes`}</div>
        </div>
      )}
    </div>
  );
}
