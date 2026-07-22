"use client";
import { useState, useEffect, useRef } from "react";

interface TreeNode { val:number; left:number|null; right:number|null; }

const TREE: TreeNode[] = [
  { val:3, left:1, right:2 },
  { val:9, left:null, right:null },
  { val:20, left:3, right:4 },
  { val:15, left:null, right:null },
  { val:7, left:null, right:null },
];

function getDepth(idx: number|null, tree: TreeNode[]): number {
  if (idx === null) return 0;
  return 1 + Math.max(getDepth(tree[idx].left, tree), getDepth(tree[idx].right, tree));
}

export default function MaxDepthTreeViz() {
  const [visited, setVisited] = useState<number[]>([]);
  const [current, setCurrent] = useState<number|null>(null);
  const [depthMap, setDepthMap] = useState<Record<number,number>>({});
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — DFS postorder: depth = 1 + max(leftDepth, rightDepth)");
  const stateRef = useRef({ stack:[[0,"down"]] as [number,string][], visited:[] as number[], depthMap:{} as Record<number,number> });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => { reset(); }, []);

  const reset = () => {
    stateRef.current = { stack:[[0,"down"]], visited:[], depthMap:{} };
    setVisited([]); setCurrent(null); setDepthMap({}); setDone(false); setPlaying(false);
    setMsg("DFS from root — compute depth bottom up"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (!st.stack.length) { setDone(true); setPlaying(false); setCurrent(null); setMsg(`Done! Max depth = ${st.depthMap[0]}`); return; }
    const [idx, dir] = st.stack[st.stack.length-1];
    const node = TREE[idx];
    if (dir === "down") {
      st.stack[st.stack.length-1] = [idx, "up"];
      setCurrent(idx); setMsg(`Visit node ${node.val}, recurse into children`);
      if (node.right !== null) st.stack.push([node.right, "down"]);
      if (node.left !== null) st.stack.push([node.left, "down"]);
    } else {
      st.stack.pop();
      const ld = node.left !== null ? (st.depthMap[node.left]??0) : 0;
      const rd = node.right !== null ? (st.depthMap[node.right]??0) : 0;
      const d = 1 + Math.max(ld, rd);
      st.depthMap[idx] = d;
      const nv = [...st.visited, idx];
      stateRef.current = { ...st, visited:nv };
      setVisited([...nv]); setDepthMap({...st.depthMap}); setCurrent(null);
      setMsg(`node ${node.val}: depth = 1 + max(${ld},${rd}) = ${d}`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const nodePositions = [
    { x:200, y:40 },
    { x:100, y:110 },
    { x:300, y:110 },
    { x:220, y:180 },
    { x:380, y:180 },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Maximum Depth of Binary Tree — DFS Postorder</h3>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <svg width="480" height="220" style={{ display:"block", margin:"0 auto" }} role="img" aria-label="Binary tree maximum depth diagram">
          {TREE.map((node,i) => {
            if (node.left !== null) {
              const p = nodePositions[i], c = nodePositions[node.left];
              return <line key={`l${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.3)" strokeWidth={1.5}/>;
            } return null;
          })}
          {TREE.map((node,i) => {
            if (node.right !== null) {
              const p = nodePositions[i], c = nodePositions[node.right];
              return <line key={`r${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.3)" strokeWidth={1.5}/>;
            } return null;
          })}
          {TREE.map((node,i) => {
            const { x, y } = nodePositions[i];
            const isCurr = i === current;
            const isDone = visited.includes(i);
            const d = depthMap[i];
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={20} fill={isCurr?"rgba(249,115,22,0.35)":isDone?"rgba(34,197,94,0.25)":"rgba(79,142,247,0.1)"} stroke={isCurr?"#f97316":isDone?"#22c55e":"rgba(79,142,247,0.5)"} strokeWidth={2}/>
                <text x={x} y={y+5} textAnchor="middle" fill={isCurr?"#f97316":isDone?"#22c55e":"#e8e8f0"} fontSize={12} fontFamily="monospace" fontWeight="bold">{node.val}</text>
                {d !== undefined && <text x={x} y={y+35} textAnchor="middle" fill="#a855f7" fontSize={10}>d={d}</text>}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Max depth: {depthMap[0]}</div>
        </div>
      )}
    </div>
  );
}
