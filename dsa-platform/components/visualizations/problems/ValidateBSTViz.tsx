"use client";
import { useState, useEffect, useRef } from "react";

interface TNode { val:number; left:number|null; right:number|null; }
const VALID_TREE: TNode[] = [
  { val:5, left:1, right:2 },
  { val:3, left:3, right:4 },
  { val:7, left:null, right:null },
  { val:2, left:null, right:null },
  { val:4, left:null, right:null },
];
const POS = [{ x:200, y:40 },{ x:100, y:110 },{ x:300, y:110 },{ x:40, y:180 },{ x:160, y:180 }];

export default function ValidateBSTViz() {
  const [validMap, setValidMap] = useState<Record<number,boolean>>({});
  const [current, setCurrent] = useState<number|null>(null);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — DFS with (min, max) bounds: each node must be within (min, max)");
  const stateRef = useRef({ stack:[[0,-Infinity,Infinity]] as [number,number,number][], validMap:{} as Record<number,boolean> });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => { reset(); }, []);

  const reset = () => {
    stateRef.current = { stack:[[0,-Infinity,Infinity]], validMap:{} };
    setValidMap({}); setCurrent(null); setDone(false); setPlaying(false);
    setMsg("root: bounds=(-∞, +∞)"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (!st.stack.length) { setDone(true); setPlaying(false); setCurrent(null); setMsg("Done! All nodes valid — IS a valid BST"); return; }
    const [idx, min, max] = st.stack.pop()!;
    const node = VALID_TREE[idx];
    const valid = node.val > min && node.val < max;
    st.validMap[idx] = valid;
    setCurrent(idx); setValidMap({...st.validMap});

    if (!valid) {
      stateRef.current = { ...st, stack:[] };
      setDone(true); setPlaying(false); setCurrent(null);
      setMsg(`node ${node.val}: NOT in (${min===(-Infinity)?"-∞":min}, ${max===Infinity?"+∞":max}) → INVALID BST!`); return;
    }

    if (node.right !== null) st.stack.push([node.right, node.val, max]);
    if (node.left !== null) st.stack.push([node.left, min, node.val]);
    setMsg(`node ${node.val}: in (${min===(-Infinity)?"-∞":min}, ${max===Infinity?"+∞":max}) ✓ → left bounds update max=${node.val}, right bounds update min=${node.val}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const isValid = Object.keys(validMap).length === VALID_TREE.length && Object.values(validMap).every(Boolean);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Validate Binary Search Tree — DFS with Min/Max Bounds</h3>
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
        <svg width="420" height="220" style={{ display:"block", margin:"0 auto" }}>
          {VALID_TREE.map((n,i) => {
            const edges = [];
            if (n.left!==null) { const p=POS[i],c=POS[n.left]; edges.push(<line key={`l${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.3)" strokeWidth={1.5}/>); }
            if (n.right!==null) { const p=POS[i],c=POS[n.right]; edges.push(<line key={`r${i}`} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgba(79,142,247,0.3)" strokeWidth={1.5}/>); }
            return edges;
          })}
          {VALID_TREE.map((n,i) => {
            const { x, y } = POS[i];
            const isCurr = i === current;
            const v = validMap[i];
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={20} fill={isCurr?"rgba(249,115,22,0.3)":v===true?"rgba(34,197,94,0.2)":v===false?"rgba(239,68,68,0.2)":"rgba(79,142,247,0.1)"} stroke={isCurr?"#f97316":v===true?"#22c55e":v===false?"#ef4444":"rgba(79,142,247,0.4)"} strokeWidth={2}/>
                <text x={x} y={y+5} textAnchor="middle" fill={isCurr?"#f97316":v===true?"#22c55e":v===false?"#ef4444":"#e8e8f0"} fontSize={12} fontFamily="monospace" fontWeight="bold">{n.val}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:isValid?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${isValid?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}` }}>
          <div className="font-semibold text-sm" style={{ color:isValid?"#22c55e":"#ef4444" }}>{isValid?"✓ Valid BST":"✗ Not a valid BST"}</div>
        </div>
      )}
    </div>
  );
}
