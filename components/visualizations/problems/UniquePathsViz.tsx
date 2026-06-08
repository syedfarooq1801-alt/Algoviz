"use client";
import { useState, useEffect, useRef } from "react";

export default function UniquePathsViz() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [ri, setRi] = useState("3");
  const [ci, setCi] = useState("4");
  const [dp, setDp] = useState<number[][]>([]);
  const [activeR, setActiveR] = useState(-1);
  const [activeC, setActiveC] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [msg, setMsg] = useState("Press Play — dp[r][c] = dp[r-1][c] + dp[r][c-1] (from top + from left)");
  const stateRef = useRef({ r:0, c:0, dp:[] as number[][], rows:3, cols:4 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (rv=rows, cv=cols) => {
    const init = Array(rv).fill(null).map(()=>Array(cv).fill(0));
    for (let r=0;r<rv;r++) init[r][0] = 1;
    for (let c=0;c<cv;c++) init[0][c] = 1;
    stateRef.current = { r:1, c:1, dp:init, rows:rv, cols:cv };
    setDp(init.map(r=>[...r])); setActiveR(-1); setActiveC(-1); setDone(false); setPlaying(false);
    setMsg("Init: first row and column = 1 (only one path). Now fill dp[1][1].."); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { r, c, dp: d, rows: rv, cols: cv } = stateRef.current;
    if (r >= rv) { setDone(true); setPlaying(false); setActiveR(-1); setActiveC(-1); setMsg(`Done! Unique paths = ${stateRef.current.dp[rv-1][cv-1]}`); return; }
    const val = d[r-1][c] + d[r][c-1];
    const nd = d.map(row=>[...row]); nd[r][c] = val;
    const nextC = c+1>=cv ? 1 : c+1;
    const nextR = c+1>=cv ? r+1 : r;
    stateRef.current = { ...stateRef.current, r:nextR, c:nextC, dp:nd };
    setDp(nd.map(row=>[...row])); setActiveR(r); setActiveC(c);
    setMsg(`dp[${r}][${c}] = dp[${r-1}][${c}](${d[r-1][c]}) + dp[${r}][${c-1}](${d[r][c-1]}) = ${val}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const rv=Math.min(6,Math.max(2,parseInt(ri)||3));
    const cv=Math.min(8,Math.max(2,parseInt(ci)||4));
    setRows(rv); setCols(cv); reset(rv,cv);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Unique Paths — 2D DP Grid</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>rows:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"60px" }} value={ri} onChange={e=>setRi(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>cols:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"60px" }} value={ci} onChange={e=>setCi(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1200" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4 overflow-x-auto" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <table style={{ borderCollapse:"separate", borderSpacing:"4px" }}>
          <tbody>
            {dp.map((row,r) => (
              <tr key={r}>
                {row.map((v,c) => {
                  const isActive = r===activeR&&c===activeC;
                  const isStart = r===0&&c===0;
                  const isEnd = done&&r===rows-1&&c===cols-1;
                  const isEdge = r===0||c===0;
                  return (
                    <td key={c} style={{ padding:0 }}>
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all duration-300"
                        style={{ background:isEnd?"rgba(34,197,94,0.3)":isActive?"rgba(79,142,247,0.3)":isStart?"rgba(168,85,247,0.2)":isEdge?"rgba(249,115,22,0.1)":v>0?"rgba(79,142,247,0.08)":"var(--bg-hover)", border:isEnd?"2px solid #22c55e":isActive?"2px solid #4f8ef7":isStart?"1px solid rgba(168,85,247,0.4)":isEdge?"1px solid rgba(249,115,22,0.3)":v>0?"1px solid rgba(79,142,247,0.2)":"1px solid var(--border)", color:isEnd?"#22c55e":isActive?"#4f8ef7":isEdge?"#f97316":v>0?"var(--text-secondary)":"var(--text-muted)", transform:isActive?"scale(1.1)":"scale(1)" }}>
                        {v}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-3 mt-2 text-[10px]">
          <span style={{ color:"#f97316" }}>■ edge=1</span>
          <span style={{ color:"#4f8ef7" }}>■ top+left</span>
          <span style={{ color:"#22c55e" }}>■ destination</span>
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && dp.length && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Unique paths from top-left to bottom-right: {dp[rows-1][cols-1]}</div>
        </div>
      )}
    </div>
  );
}
