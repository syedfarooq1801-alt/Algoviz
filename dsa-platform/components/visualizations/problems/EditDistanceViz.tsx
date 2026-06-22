"use client";
import { useState, useEffect, useRef } from "react";

export default function EditDistanceViz() {
  const [w1, setW1] = useState("horse");
  const [w2, setW2] = useState("ros");
  const [i1, setI1] = useState("horse");
  const [i2, setI2] = useState("ros");
  const [dp, setDp] = useState<number[][]>([]);
  const [activeR, setActiveR] = useState(-1);
  const [activeC, setActiveC] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [msg, setMsg] = useState("Press Play — if match: dp[i][j]=dp[i-1][j-1]. Else: 1+min(insert,delete,replace)");
  const stateRef = useRef({ r:1, c:1, dp:[] as number[][], w1:"horse", w2:"ros" });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (a=w1, b=w2) => {
    const m=a.length, n=b.length;
    const init = Array(m+1).fill(null).map((_,i)=>Array(n+1).fill(0).map((_,j)=>i===0?j:j===0?i:0));
    stateRef.current = { r:1, c:1, dp:init, w1:a, w2:b };
    setDp(init.map(r=>[...r])); setActiveR(-1); setActiveC(-1); setDone(false); setPlaying(false);
    setMsg("Init: dp[i][0]=i (delete i chars), dp[0][j]=j (insert j chars)"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { r, c, dp: d, w1: a, w2: b } = stateRef.current;
    if (r > a.length) { setDone(true); setPlaying(false); setActiveR(-1); setMsg(`Done! Edit distance = ${stateRef.current.dp[a.length][b.length]}`); return; }
    const nd = d.map(row=>[...row]);
    let ops = "";
    if (a[r-1]===b[c-1]) { nd[r][c]=d[r-1][c-1]; ops="match (copy)"; }
    else {
      const ins = d[r][c-1]+1, del = d[r-1][c]+1, rep = d[r-1][c-1]+1;
      nd[r][c] = Math.min(ins,del,rep);
      ops = `min(ins=${ins},del=${del},rep=${rep})=${nd[r][c]}`;
    }
    const nextC = c+1>b.length ? 1 : c+1;
    const nextR = c+1>b.length ? r+1 : r;
    stateRef.current = { ...stateRef.current, r:nextR, c:nextC, dp:nd };
    setDp(nd.map(row=>[...row])); setActiveR(r); setActiveC(c);
    setMsg(`[${r}][${c}] '${a[r-1]}'↔'${b[c-1]}': ${ops}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => { setW1(i1); setW2(i2); reset(i1,i2); };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Edit Distance (Levenshtein) — 2D DP</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>word1:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"100px" }} value={i1} onChange={e=>setI1(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>word2:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"100px" }} value={i2} onChange={e=>setI2(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1000" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4 overflow-x-auto" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <table style={{ borderCollapse:"separate", borderSpacing:"3px" }}>
          <thead>
            <tr>
              <td style={{ width:"28px" }}></td>
              <td style={{ textAlign:"center", fontSize:"10px", color:"var(--text-muted)", padding:"2px" }}>""</td>
              {w2.split("").map((c,j)=><td key={j} style={{ textAlign:"center", fontSize:"10px", color:"#4f8ef7", padding:"2px" }}>{c}</td>)}
            </tr>
          </thead>
          <tbody>
            {dp.map((row,r)=>(
              <tr key={r}>
                <td style={{ fontSize:"10px", color:r===0?"var(--text-muted)":"#f97316", padding:"2px", textAlign:"right" }}>{r===0?'""':w1[r-1]}</td>
                {row.map((v,c)=>{
                  const isActive = r===activeR&&c===activeC;
                  const isResult = done&&r===w1.length&&c===w2.length;
                  return (
                    <td key={c} style={{ padding:0 }}>
                      <div className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                        style={{ background:isResult?"rgba(34,197,94,0.3)":isActive?"rgba(79,142,247,0.3)":r===0||c===0?"rgba(255,255,255,0.04)":"rgba(168,85,247,0.08)", border:isResult?"2px solid #22c55e":isActive?"2px solid #4f8ef7":"1px solid var(--border)", color:isResult?"#22c55e":isActive?"#4f8ef7":"#a855f7", transform:isActive?"scale(1.1)":"scale(1)" }}>
                        {v}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && dp.length && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Edit distance: {dp[w1.length]?.[w2.length] ?? 0} operations</div>
        </div>
      )}
    </div>
  );
}
