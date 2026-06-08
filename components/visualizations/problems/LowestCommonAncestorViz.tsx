"use client";
import { useState, useEffect, useRef } from "react";

interface TNode { val:number; left:number|null; right:number|null; }
const TREE: TNode[] = [
  { val:6, left:1, right:2 },
  { val:2, left:3, right:4 },
  { val:8, left:5, right:6 },
  { val:0, left:null, right:null },
  { val:4, left:7, right:8 },
  { val:7, left:null, right:null },
  { val:9, left:null, right:null },
  { val:3, left:null, right:null },
  { val:5, left:null, right:null },
];
const POS = [
  { x:200, y:30 }, { x:100, y:100 }, { x:300, y:100 },
  { x:55, y:170 }, { x:150, y:170 }, { x:250, y:170 }, { x:350, y:170 },
  { x:120, y:240 }, { x:180, y:240 },
];

export default function LowestCommonAncestorViz() {
  const [p] = useState(4); // index of val=2
  const [q] = useState(8); // index of val=8 (val=5)
  const [visited, setVisited] = useState<number[]>([]);
  const [current, setCurrent] = useState<number|null>(null);
  const [found, setFound] = useState<number[]>([]);
  const [lca, setLca] = useState<number|null>(null);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — DFS: if node=p or q, return node. LCA is where left and right both return non-null");
  const stateRef = useRef({ stack:[[0,"down"]] as [number,string][], visited:[] as number[], found:[] as number[], resultMap:{} as Record<number,boolean>, lca:-1 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => { reset(); }, []);

  const reset = () => {
    stateRef.current = { stack:[[0,"down"]], visited:[], found:[], resultMap:{}, lca:-1 };
    setVisited([]); setCurrent(null); setFound([]); setLca(null); setDone(false); setPlaying(false);
    setMsg(`Find LCA of p=${TREE[p].val} and q=${TREE[q].val}`); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (!st.stack.length) { setDone(true); setPlaying(false); setCurrent(null); setMsg(`Done! LCA = ${st.lca>=0?TREE[st.lca].val:"?"}`); return; }
    const [idx, dir] = st.stack[st.stack.length-1];
    const node = TREE[idx];
    if (dir === "down") {
      st.stack[st.stack.length-1] = [idx, "up"];
      setCurrent(idx);
      if (idx === p || idx === q) { st.found.push(idx); setFound([...st.found]); setMsg(`Found target: ${node.val}`); return; }
      setMsg(`Visit ${node.val} — search children`);
      if (node.right !== null) st.stack.push([node.right, "down"]);
      if (node.left !== null) st.stack.push([node.left, "down"]);
    } else {
      st.stack.pop();
      const hasLeft = node.left !== null && st.found.includes(node.left);
      const hasRight = node.right !== null && st.found.includes(node.right);
      const isSelf = idx === p || idx === q;
      const nv = [...st.visited, idx];
      st.visited = nv; setVisited(nv); setCurrent(null);
      if ((hasLeft && hasRight) || (isSelf && (hasLeft || hasRight))) {
        if (st.lca === -1) { st.lca = idx; setLca(idx); setMsg(`LCA found! Node ${node.val} — both targets in subtrees`); }
        if (!st.found.includes(idx)) { st.found.push(idx); setFound([...st.found]); }
      } else if (isSelf || hasLeft || hasRight) {
        if (!st.found.includes(idx)) { st.found.push(idx); setFound([...st.found]); }
        setMsg(`${node.val} found or contains target — propagate up`);
      } else { setMsg(`${node.val}: target not in subtree`); }
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
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Lowest Common Ancestor — DFS Propagation</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>p={TREE[p].val} (blue), q={TREE[q].val} (orange)</div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-2" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <svg width="420" height="270" style={{ display:"block", margin:"0 auto" }}>
          {TREE.map((n,i) => {
            const edges = [];
            if (n.left!==null) { const pa=POS[i],c=POS[n.left]; edges.push(<line key={`l${i}`} x1={pa.x} y1={pa.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.25)" strokeWidth={1.5}/>); }
            if (n.right!==null) { const pa=POS[i],c=POS[n.right]; edges.push(<line key={`r${i}`} x1={pa.x} y1={pa.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.25)" strokeWidth={1.5}/>); }
            return edges;
          })}
          {TREE.map((n,i) => {
            const { x, y } = POS[i];
            const isCurr = i === current;
            const isP = i === p;
            const isQ = i === q;
            const isLca = i === lca;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={17} fill={isLca?"rgba(34,197,94,0.35)":isP?"rgba(79,142,247,0.3)":isQ?"rgba(249,115,22,0.3)":isCurr?"rgba(249,115,22,0.15)":visited.includes(i)?"rgba(79,142,247,0.08)":"rgba(79,142,247,0.05)"} stroke={isLca?"#22c55e":isP?"#4f8ef7":isQ?"#f97316":isCurr?"#f97316":"rgba(79,142,247,0.35)"} strokeWidth={isLca||isP||isQ?2.5:1.5}/>
                <text x={x} y={y+5} textAnchor="middle" fill={isLca?"#22c55e":isP?"#4f8ef7":isQ?"#f97316":"#e8e8f0"} fontSize={11} fontFamily="monospace" fontWeight="bold">{n.val}</text>
                {isP&&<text x={x} y={y-22} textAnchor="middle" fill="#4f8ef7" fontSize={9}>p</text>}
                {isQ&&<text x={x} y={y-22} textAnchor="middle" fill="#f97316" fontSize={9}>q</text>}
                {isLca&&<text x={x} y={y-22} textAnchor="middle" fill="#22c55e" fontSize={9}>LCA</text>}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {lca !== null && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>LCA of {TREE[p].val} and {TREE[q].val} = {TREE[lca].val}</div>
        </div>
      )}
    </div>
  );
}
