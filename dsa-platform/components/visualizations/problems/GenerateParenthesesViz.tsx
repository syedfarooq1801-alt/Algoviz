"use client";
import { useState, useEffect, useRef } from "react";

interface TreeNode { path: string; open: number; close: number; children: TreeNode[]; }

function buildTree(n: number): TreeNode {
  const root: TreeNode = { path:"", open:0, close:0, children:[] };
  function dfs(node: TreeNode) {
    if (node.path.length === 2*n) return;
    if (node.open < n) {
      const child: TreeNode = { path:node.path+"(", open:node.open+1, close:node.close, children:[] };
      node.children.push(child); dfs(child);
    }
    if (node.close < node.open) {
      const child: TreeNode = { path:node.path+")", open:node.open, close:node.close+1, children:[] };
      node.children.push(child); dfs(child);
    }
  }
  dfs(root); return root;
}

function flattenTree(node: TreeNode, results: string[] = []): string[] {
  if (node.path.length > 0) results.push(node.path);
  for (const c of node.children) flattenTree(c, results);
  return results;
}

export default function GenerateParenthesesViz() {
  const [n, setN] = useState(3);
  const [ni, setNi] = useState("3");
  const [step, setStep] = useState(0);
  const [paths, setPaths] = useState<string[]>([]);
  const [result, setResult] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [done, setDone] = useState(false);
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const init = (nv=n) => {
    const allPaths = flattenTree(buildTree(nv));
    setPaths(allPaths); setStep(0); setResult([]); setDone(false); setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  useEffect(() => { init(); }, []);

  const doStep = () => {
    if (step >= paths.length) { setDone(true); setPlaying(false); return; }
    const p = paths[step];
    if (p.length === 2*n) setResult(prev => [...prev, p]);
    setStep(prev => prev+1);
    if (step+1 >= paths.length) { setDone(true); setPlaying(false); }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed, step]);

  const apply = () => { const nv=Math.min(4,Math.max(1,parseInt(ni)||3)); setN(nv); init(nv); };
  const currentPath = paths[step-1] || "";
  const openCount = (currentPath.match(/\(/g)||[]).length;
  const closeCount = (currentPath.match(/\)/g)||[]).length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Generate Parentheses — Backtracking DFS</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>n (1-4):</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"50px" }} value={ni} onChange={e=>setNi(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>init()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="50" max="800" step="50" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Current path */}
      {currentPath && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Current DFS path</div>
          <div className="flex gap-1 flex-wrap items-center">
            {currentPath.split("").map((c,i)=>(
              <span key={i} className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold font-mono"
                style={{ background:c==="("?"rgba(79,142,247,0.2)":"rgba(249,115,22,0.2)", color:c==="("?"#4f8ef7":"#f97316", border:`1px solid ${c==="("?"rgba(79,142,247,0.4)":"rgba(249,115,22,0.4)"}` }}>
                {c}
              </span>
            ))}
            {currentPath.length < 2*n && <span style={{ color:"var(--text-muted)", fontSize:"11px" }}>...</span>}
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            <span style={{ color:"#4f8ef7" }}>open={openCount}/{n}</span>
            <span style={{ color:"#f97316" }}>close={closeCount}/{n}</span>
            {currentPath.length===2*n&&<span style={{ color:"#22c55e" }}>✓ complete</span>}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Valid combinations found: {result.length}</div>
        <div className="flex gap-2 flex-wrap">
          {result.map((r,i)=>(
            <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono animate-fade-in-up" style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>{r}</span>
          ))}
        </div>
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>{result.length} valid parentheses combinations for n={n}</div>
        </div>
      )}
    </div>
  );
}
