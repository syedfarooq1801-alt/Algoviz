"use client";
import { useState, useEffect, useRef } from "react";

interface TNode { val:number; left:number|null; right:number|null; }
const TREE: TNode[] = [
  { val:3, left:1, right:2 },
  { val:9, left:null, right:null },
  { val:20, left:3, right:4 },
  { val:15, left:null, right:null },
  { val:7, left:null, right:null },
];
const POS = [{ x:200, y:40 },{ x:100, y:110 },{ x:300, y:110 },{ x:220, y:180 },{ x:380, y:180 }];

export default function LevelOrderViz() {
  const [queue, setQueue] = useState<number[]>([0]);
  const [levels, setLevels] = useState<number[][]>([]);
  const [currentLevel, setCurrentLevel] = useState<number[]>([]);
  const [visited, setVisited] = useState<number[]>([]);
  const [current, setCurrent] = useState<number|null>(null);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — BFS level order: process all nodes at current level before next");
  const stateRef = useRef({ queue:[0], levels:[] as number[][], currentLevel:[] as number[], visited:[] as number[] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = () => {
    stateRef.current = { queue:[0], levels:[], currentLevel:[], visited:[] };
    setQueue([0]); setLevels([]); setCurrentLevel([]); setVisited([]); setCurrent(null); setDone(false); setPlaying(false);
    setMsg("queue=[root] — BFS"); if (iRef.current) clearInterval(iRef.current);
  };

  useEffect(() => { reset(); }, []);

  const doStep = () => {
    const st = stateRef.current;
    if (!st.queue.length) {
      setDone(true); setPlaying(false); setCurrent(null);
      setMsg(`Done! ${st.levels.length} levels: ${st.levels.map(l=>`[${l.map(i=>TREE[i].val).join(",")}]`).join(",")}); return;`);
      return;
    }

    const levelSize = st.queue.length;
    const levelNodes = st.queue.slice(0, levelSize);
    const nextQueue: number[] = [];

    for (const idx of levelNodes) {
      if (TREE[idx].left !== null) nextQueue.push(TREE[idx].left!);
      if (TREE[idx].right !== null) nextQueue.push(TREE[idx].right!);
    }

    const nl = [...st.levels, levelNodes];
    const nv = [...st.visited, ...levelNodes];
    stateRef.current = { queue:nextQueue, levels:nl, currentLevel:levelNodes, visited:nv };
    setQueue(nextQueue); setLevels(nl); setCurrentLevel(levelNodes); setVisited(nv);
    setCurrent(levelNodes[0]);
    setMsg(`Level ${nl.length}: [${levelNodes.map(i=>TREE[i].val).join(",")}] → next queue=[${nextQueue.map(i=>TREE[i].val).join(",")||"empty"}]`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const LEVEL_COLORS = ["#4f8ef7","#a855f7","#22c55e","#f97316","#ec4899"];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Binary Tree Level Order Traversal — BFS Queue</h3>
        <div className="flex gap-2">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <svg width="480" height="220" style={{ display:"block", margin:"0 auto" }}>
          {TREE.map((n,i) => {
            const edges = [];
            if (n.left!==null) { const p=POS[i],c=POS[n.left]; edges.push(<line key={`l${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.3)" strokeWidth={1.5}/>); }
            if (n.right!==null) { const p=POS[i],c=POS[n.right]; edges.push(<line key={`r${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.3)" strokeWidth={1.5}/>); }
            return edges;
          })}
          {TREE.map((n,i) => {
            const { x, y } = POS[i];
            const levelIdx = levels.findIndex(l=>l.includes(i));
            const col = levelIdx>=0 ? LEVEL_COLORS[levelIdx%LEVEL_COLORS.length] : "rgba(79,142,247,0.1)";
            const isQ = queue.includes(i);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={20} fill={levelIdx>=0?`${col}25`:isQ?"rgba(79,142,247,0.1)":"var(--bg-hover)"} stroke={levelIdx>=0?col:isQ?"rgba(79,142,247,0.5)":"rgba(79,142,247,0.2)"} strokeWidth={levelIdx>=0?2:1.5}/>
                <text x={x} y={y+5} textAnchor="middle" fill={levelIdx>=0?col:"#9090a8"} fontSize={12} fontFamily="monospace" fontWeight="bold">{n.val}</text>
                {levelIdx>=0&&<text x={x} y={y+35} textAnchor="middle" fill={col} fontSize={9}>L{levelIdx+1}</text>}
              </g>
            );
          })}
        </svg>
      </div>

      {levels.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Output</div>
          <div className="space-y-1">
            {levels.map((lv,li)=>(
              <div key={li} className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ color:LEVEL_COLORS[li%LEVEL_COLORS.length], background:`${LEVEL_COLORS[li%LEVEL_COLORS.length]}15`, border:`1px solid ${LEVEL_COLORS[li%LEVEL_COLORS.length]}30`, minWidth:"50px" }}>L{li+1}</span>
                <span className="text-xs font-mono" style={{ color:"var(--text-secondary)" }}>[{lv.map(i=>TREE[i].val).join(", ")}]</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
