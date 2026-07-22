"use client";
import { useState, useEffect, useRef } from "react";

const GRID_INIT = [
  [0,0,1,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,1,1,0,1,0,0,0,0,0,0,0,0],
  [0,1,0,0,1,1,0,0,1,0,1,0,0],
  [0,1,0,0,1,1,0,0,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,1,1,0,0,0,0],
];

export default function MaxAreaIslandViz() {
  const [visited, setVisited] = useState<boolean[][]>(Array(GRID_INIT.length).fill(null).map(()=>Array(GRID_INIT[0].length).fill(false)));
  const [activeIsland, setActiveIsland] = useState<Set<string>>(new Set());
  const [maxArea, setMaxArea] = useState(0);
  const [bestIsland, setBestIsland] = useState<Set<string>>(new Set());
  const [curArea, setCurArea] = useState(0);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [msg, setMsg] = useState("Press Play — DFS flood fill from each unvisited land cell");
  const stateRef = useRef({
    visited:Array(GRID_INIT.length).fill(null).map(()=>Array(GRID_INIT[0].length).fill(false)),
    r:0, c:0, maxArea:0, bestIsland:new Set<string>()
  });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = () => {
    const v=Array(GRID_INIT.length).fill(null).map(()=>Array(GRID_INIT[0].length).fill(false));
    stateRef.current={visited:v,r:0,c:0,maxArea:0,bestIsland:new Set()};
    setVisited(v.map(r=>[...r])); setActiveIsland(new Set()); setMaxArea(0); setBestIsland(new Set()); setCurArea(0);
    setRow(0); setCol(0); setDone(false); setPlaying(false);
    setMsg("Press Play — DFS flood fill from each unvisited land cell");
    if(iRef.current)clearInterval(iRef.current);
  };

  const doStep = () => {
    const { visited:v, r, c, maxArea:mx, bestIsland:bi } = stateRef.current;
    const rows=GRID_INIT.length, cols=GRID_INIT[0].length;

    // Find next unvisited land cell
    let nr=r, nc=c;
    while (nr<rows && (v[nr][nc]||GRID_INIT[nr][nc]===0)) {
      nc++; if (nc>=cols) { nc=0; nr++; }
    }
    if (nr>=rows) { setDone(true); setPlaying(false); setMsg(`Done! Max area = ${mx}`); return; }

    // DFS to find whole island
    const island = new Set<string>();
    const stack: [number,number][] = [[nr,nc]];
    const nv = v.map(row=>[...row]);
    while (stack.length) {
      const [cr,cc]=stack.pop()!;
      if (cr<0||cr>=rows||cc<0||cc>=cols||nv[cr][cc]||GRID_INIT[cr][cc]===0) continue;
      nv[cr][cc]=true; island.add(`${cr},${cc}`);
      for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) stack.push([cr+dr,cc+dc]);
    }

    const nmx = Math.max(mx, island.size);
    const nbi = island.size>=mx ? island : bi;
    stateRef.current = { visited:nv, r:nr, c:nc+1<cols?nc+1:0, maxArea:nmx, bestIsland:nbi };
    if (nc+1>=cols) stateRef.current.r=nr+1;
    setVisited(nv.map(r=>[...r])); setActiveIsland(new Set(island)); setMaxArea(nmx);
    if (island.size>=mx) setBestIsland(new Set(island));
    setCurArea(island.size); setRow(nr); setCol(nc);
    setMsg(`Island at [${nr},${nc}]: area=${island.size}${island.size>mx?` → new max!`:""}`);
  };

  useEffect(() => { reset(); }, []);
  useEffect(() => {
    if (playing) { iRef.current=setInterval(doStep,speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current=null; }
    return () => { if(iRef.current)clearInterval(iRef.current); };
  }, [playing,speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Max Area of Island — DFS Flood Fill</h3>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>max={maxArea}</span>
          {curArea>0&&<span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(79,142,247,0.1)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>current={curArea}</span>}
        </div>
      </div>

      <div className="rounded-xl p-4 overflow-x-auto" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${GRID_INIT[0].length},1fr)`, gap:"2px", maxWidth:"420px" }}>
          {GRID_INIT.map((row,r)=>row.map((v,c)=>{
            const key=`${r},${c}`;
            const isBest=bestIsland.has(key);
            const isActive=activeIsland.has(key);
            const isVis=visited[r]?.[c];
            const isLand=v===1;
            let bg="var(--bg-hover)", border="var(--border)", color="var(--text-muted)";
            if (isLand) {
              if (isBest) { bg="rgba(34,197,94,0.35)"; border="rgba(34,197,94,0.6)"; color="#22c55e"; }
              else if (isActive) { bg="rgba(79,142,247,0.35)"; border="rgba(79,142,247,0.6)"; color="#4f8ef7"; }
              else if (isVis) { bg="rgba(168,85,247,0.15)"; border="rgba(168,85,247,0.3)"; color="#a855f7"; }
              else { bg="rgba(249,115,22,0.15)"; border="rgba(249,115,22,0.3)"; color="#f97316"; }
            }
            return (
              <div key={key} className="aspect-square rounded-sm flex items-center justify-center text-xs transition-all duration-200"
                style={{ background:bg, border:`1px solid ${border}`, color, fontSize:"8px", fontWeight:600 }}>
                {v===1?"▪":""}
              </div>
            );
          }))}
        </div>
        <div className="flex gap-3 mt-2 text-xs flex-wrap">
          <span style={{ color:"#f97316" }}>▪ unvisited</span>
          <span style={{ color:"#4f8ef7" }}>▪ active</span>
          <span style={{ color:"#a855f7" }}>▪ visited</span>
          <span style={{ color:"#22c55e" }}>▪ best</span>
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
