"use client";
import { useState } from "react";

interface TrieNode { children: Record<string,TrieNode>; end: boolean; }
const mkNode = (): TrieNode => ({ children:{}, end:false });

const OPS_INIT = [
  { op:"insert", val:"apple" },
  { op:"insert", val:"app" },
  { op:"insert", val:"ap" },
  { op:"search", val:"apple" },
  { op:"search", val:"ap" },
  { op:"search", val:"apt" },
  { op:"startsWith", val:"app" },
  { op:"startsWith", val:"b" },
];

function cloneNode(n: TrieNode): TrieNode {
  const clone: TrieNode = { children:{}, end:n.end };
  for (const [k,v] of Object.entries(n.children)) clone.children[k]=cloneNode(v);
  return clone;
}

export default function ImplementTrieViz() {
  const [root, setRoot] = useState<TrieNode>(mkNode());
  const [opIdx, setOpIdx] = useState(0);
  const [log, setLog] = useState<{op:string,val:string,result?:boolean}[]>([]);
  const [activePath, setActivePath] = useState<string[]>([]);

  const done = opIdx >= OPS_INIT.length;

  const step = () => {
    if (done) return;
    const { op, val } = OPS_INIT[opIdx];
    const nr = cloneNode(root);
    let result: boolean|undefined;
    const path: string[] = [];

    if (op === "insert") {
      let cur = nr;
      for (const ch of val) {
        path.push(ch);
        if (!cur.children[ch]) cur.children[ch]=mkNode();
        cur=cur.children[ch];
      }
      cur.end=true;
      setRoot(nr);
    } else if (op === "search") {
      let cur: TrieNode|undefined = nr;
      for (const ch of val) { cur=cur?.children[ch]; path.push(ch); }
      result = !!(cur?.end);
    } else {
      let cur: TrieNode|undefined = nr;
      for (const ch of val) { cur=cur?.children[ch]; path.push(ch); }
      result = !!cur;
    }

    setActivePath(path);
    setLog(prev=>[...prev,{op,val,result}]);
    setOpIdx(opIdx+1);
  };

  const reset = () => { setRoot(mkNode()); setOpIdx(0); setLog([]); setActivePath([]); };

  // Render trie levels as a flat node list with indentation
  function collectNodes(node: TrieNode, prefix: string, depth: number): {prefix:string,ch:string,end:boolean,depth:number}[] {
    const items: {prefix:string,ch:string,end:boolean,depth:number}[] = [];
    for (const [ch,child] of Object.entries(node.children).sort()) {
      items.push({ prefix:prefix+ch, ch, end:child.end, depth });
      items.push(...collectNodes(child, prefix+ch, depth+1));
    }
    return items;
  }
  const nodes = collectNodes(root,"",0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color:"var(--text-primary)" }}>Implement Trie — Prefix Tree</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>Insert, search, startsWith. Each character = one trie node.</div>
        <div className="flex gap-2">
          <button onClick={step} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:"rgba(34,197,94,0.15)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>
            → {!done?`${OPS_INIT[opIdx].op}("${OPS_INIT[opIdx].val}")`:"Done"}
          </button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Trie visual */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Trie structure (root → leaves)</div>
          {nodes.length === 0 && <span style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</span>}
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {nodes.map((n,i)=>{
              const isActive = activePath.join("")===n.prefix || n.prefix.startsWith(activePath.join(""))&&activePath.length>0;
              return (
                <div key={i} className="flex items-center gap-1" style={{ paddingLeft:`${n.depth*12}px` }}>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold font-mono transition-all"
                    style={{ background:n.end?"rgba(34,197,94,0.2)":isActive?"rgba(79,142,247,0.2)":"rgba(168,85,247,0.08)", border:n.end?"1px solid rgba(34,197,94,0.4)":isActive?"1px solid rgba(79,142,247,0.4)":"1px solid rgba(168,85,247,0.2)", color:n.end?"#22c55e":isActive?"#4f8ef7":"#a855f7" }}>
                    {n.ch}
                  </div>
                  {n.end&&<span style={{ fontSize:"8px", color:"#22c55e" }}> *end</span>}
                  <span style={{ fontSize:"8px", color:"var(--text-muted)" }}>{n.prefix}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operations log */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Operations log</div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {log.map((l,i)=>(
              <div key={i} className="flex items-center gap-2 px-2 py-1 rounded text-xs"
                style={{ background:l.result===undefined?"rgba(79,142,247,0.07)":l.result?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.08)" }}>
                <span style={{ color:l.op==="insert"?"#4f8ef7":"#f97316", fontWeight:600 }}>{l.op}</span>
                <span style={{ color:"var(--text-primary)", fontFamily:"monospace" }}>"{l.val}"</span>
                {l.result!==undefined&&<span style={{ color:l.result?"#22c55e":"#ef4444", marginLeft:"auto" }}>{l.result?"true":"false"}</span>}
              </div>
            ))}
            {log.length===0&&<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>no operations yet</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
