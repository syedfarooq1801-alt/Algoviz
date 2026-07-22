"use client";
import { useState, useEffect, useRef } from "react";

interface TNode { val:number; left:number|null; right:number|null; }
const TREE: TNode[] = [
  { val:1, left:1, right:2 },
  { val:2, left:3, right:4 },
  { val:3, left:null, right:null },
  { val:4, left:null, right:null },
  { val:5, left:null, right:null },
];
const POS = [{ x:200, y:40 },{ x:110, y:110 },{ x:290, y:110 },{ x:60, y:180 },{ x:160, y:180 }];

export default function DiameterTreeViz() {
  const [depthMap, setDepthMap] = useState<Record<number,number>>({});
  const [diaMap, setDiaMap] = useState<Record<number,number>>({});
  const [current, setCurrent] = useState<number|null>(null);
  const [maxDia, setMaxDia] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — DFS: diameter at each node = leftDepth + rightDepth, return max(leftDepth,rightDepth)+1");
  const stateRef = useRef({ stack:[[0,"down"]] as [number,string][], depthMap:{} as Record<number,number>, diaMap:{} as Record<number,number>, maxDia:0 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => { reset(); }, []);

  const reset = () => {
    stateRef.current = { stack:[[0,"down"]], depthMap:{}, diaMap:{}, maxDia:0 };
    setDepthMap({}); setDiaMap({}); setMaxDia(0); setCurrent(null); setDone(false); setPlaying(false);
    setMsg("DFS — postorder, compute depth and diameter at each node"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (!st.stack.length) { setDone(true); setPlaying(false); setCurrent(null); setMsg(`Done! Diameter = ${st.maxDia}`); return; }
    const [idx, dir] = st.stack[st.stack.length-1];
    const node = TREE[idx];
    if (dir === "down") {
      st.stack[st.stack.length-1] = [idx, "up"];
      setCurrent(idx); setMsg(`Visit ${node.val} — going down`);
      if (node.right !== null) st.stack.push([node.right, "down"]);
      if (node.left !== null) st.stack.push([node.left, "down"]);
    } else {
      st.stack.pop();
      const ld = node.left!==null ? (st.depthMap[node.left]??0) : 0;
      const rd = node.right!==null ? (st.depthMap[node.right]??0) : 0;
      const depth = 1 + Math.max(ld,rd);
      const dia = ld + rd;
      const newMax = Math.max(st.maxDia, dia);
      st.depthMap[idx] = depth; st.diaMap[idx] = dia; st.maxDia = newMax;
      setCurrent(null); setDepthMap({...st.depthMap}); setDiaMap({...st.diaMap}); setMaxDia(newMax);
      setMsg(`${node.val}: depth=${depth}, diameter through=${ld}+${rd}=${dia}${dia>st.maxDia-1?" NEW MAX!":""}`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Diameter of Binary Tree — DFS Postorder</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(168,85,247,0.1)", color:"#a855f7", border:"1px solid rgba(168,85,247,0.3)" }}>max dia={maxDia}</span>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <svg width="420" height="220" style={{ display:"block", margin:"0 auto" }} role="img" aria-label="Binary tree diameter path diagram">
          {TREE.map((n,i) => {
            const edges = [];
            if (n.left!==null) { const p=POS[i],c=POS[n.left]; edges.push(<line key={`l${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.3)" strokeWidth={1.5}/>); }
            if (n.right!==null) { const p=POS[i],c=POS[n.right]; edges.push(<line key={`r${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.3)" strokeWidth={1.5}/>); }
            return edges;
          })}
          {TREE.map((n,i) => {
            const { x, y } = POS[i];
            const isCurr = i === current;
            const d = depthMap[i];
            const dia = diaMap[i];
            const isBest = dia === maxDia && dia > 0;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={20} fill={isCurr?"rgba(249,115,22,0.3)":isBest?"rgba(168,85,247,0.25)":d!==undefined?"rgba(34,197,94,0.15)":"rgba(79,142,247,0.1)"} stroke={isCurr?"#f97316":isBest?"#a855f7":d!==undefined?"#22c55e":"rgba(79,142,247,0.4)"} strokeWidth={2}/>
                <text x={x} y={y+5} textAnchor="middle" fill={isCurr?"#f97316":isBest?"#a855f7":d!==undefined?"#22c55e":"#e8e8f0"} fontSize={12} fontFamily="monospace" fontWeight="bold">{n.val}</text>
                {d!==undefined&&<text x={x} y={y+35} textAnchor="middle" fill="#4f8ef7" fontSize={9}>h={d}</text>}
                {dia!==undefined&&dia>0&&<text x={x+24} y={y} textAnchor="start" fill="#a855f7" fontSize={9}>d={dia}</text>}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(168,85,247,0.08)", border:"1px solid rgba(168,85,247,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#a855f7" }}>Diameter: {maxDia} edges</div>
        </div>
      )}
    </div>
  );
}
