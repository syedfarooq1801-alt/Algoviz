"use client";
import { useState } from "react";

interface Node { key: number; val: number; prev: number|null; next: number|null; }

type Op = { type: "get"|"put"; key: number; val?: number };
const OPS: Op[] = [
  {type:"put",key:1,val:1},{type:"put",key:2,val:2},{type:"get",key:1},
  {type:"put",key:3,val:3},{type:"get",key:2},{type:"put",key:4,val:4},
  {type:"get",key:1},{type:"get",key:3},{type:"get",key:4},
];

const CAPACITY = 2;

export default function LRUCacheViz() {
  const [cache, setCache] = useState<Map<number,{val:number,order:number}>>(new Map());
  const [order, setOrder] = useState(0);
  const [opIdx, setOpIdx] = useState(0);
  const [lastResult, setLastResult] = useState<string>("");
  const [log, setLog] = useState<{op:string,result:string,evicted?:number}[]>([]);

  const doOp = () => {
    if (opIdx >= OPS.length) return;
    const op = OPS[opIdx];
    const nc = new Map(cache);
    let result = "";
    let evicted: number|undefined;

    if (op.type === "get") {
      if (nc.has(op.key)) {
        const v = nc.get(op.key)!;
        nc.set(op.key, { ...v, order:order+1 });
        result = String(v.val);
      } else {
        result = "-1";
      }
    } else if (op.type === "put" && op.val !== undefined) {
      if (nc.size >= CAPACITY && !nc.has(op.key)) {
        let minOrd = Infinity, lruKey = -1;
        nc.forEach((v,k) => { if (v.order < minOrd) { minOrd = v.order; lruKey = k; } });
        if (lruKey !== -1) { nc.delete(lruKey); evicted = lruKey; }
      }
      nc.set(op.key, { val:op.val, order:order+1 });
      result = "void";
    }

    setCache(nc); setOrder(o=>o+1); setLastResult(result);
    setLog(prev => [...prev, { op:`${op.type}(${op.key}${op.val!==undefined?`,${op.val}`:")"})${op.val!==undefined?")":""}`, result, evicted }]);
    setOpIdx(opIdx+1);
  };

  const reset = () => { setCache(new Map()); setOrder(0); setOpIdx(0); setLastResult(""); setLog([]); };
  const done = opIdx >= OPS.length;

  const cacheArr = Array.from(cache.entries()).sort((a,b)=>b[1].order-a[1].order);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>LRU Cache — Doubly Linked List + Hash Map (capacity={CAPACITY})</h3>
        <div className="flex gap-2">
          <button onClick={doOp} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:"rgba(34,197,94,0.15)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>→ Next Op</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>

      {/* Op queue */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Operations</div>
        <div className="flex gap-1.5 flex-wrap">
          {OPS.map((op,i)=>(
            <span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background:i===opIdx?"rgba(79,142,247,0.2)":i<opIdx?"rgba(34,197,94,0.06)":"var(--bg-hover)", border:i===opIdx?"1px solid rgba(79,142,247,0.5)":i<opIdx?"1px solid rgba(34,197,94,0.2)":"1px solid var(--border)", color:i===opIdx?"#4f8ef7":i<opIdx?"var(--text-muted)":"var(--text-secondary)" }}>
              {op.type}({op.key}{op.val!==undefined?`,${op.val}`:")"}{op.val!==undefined?")":""}
            </span>
          ))}
        </div>
      </div>

      {/* Cache state — MRU to LRU */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Cache [{cache.size}/{CAPACITY}] — most recent first (left=MRU, right=LRU)</div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>MRU</span>
          <div className="flex items-center gap-1">
            {cacheArr.map(([k,{val}],i)=>(
              <div key={k} className="flex items-center gap-1">
                <div className="px-3 py-2 rounded-lg text-xs font-mono font-bold" style={{ background:i===0?"rgba(34,197,94,0.15)":"rgba(79,142,247,0.1)", border:i===0?"1px solid rgba(34,197,94,0.4)":"1px solid rgba(79,142,247,0.3)", color:i===0?"#22c55e":"#4f8ef7" }}>
                  k={k} v={val}
                </div>
                {i<cacheArr.length-1&&<span style={{ color:"var(--text-muted)", fontSize:"10px" }}>↔</span>}
              </div>
            ))}
          </div>
          <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>LRU</span>
          {cache.size === 0 && <span style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</span>}
        </div>
      </div>

      {lastResult && (
        <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:lastResult==="-1"?"#ef4444":"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>
          → {lastResult}{lastResult==="-1"?" (not found)":""}
        </div>
      )}

      {log.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>History</div>
          <div className="space-y-1 text-xs font-mono" style={{ maxHeight:"120px", overflowY:"auto" }}>
            {log.map((l,i)=>(
              <div key={i} className="flex gap-3">
                <span style={{ color:"var(--text-muted)", minWidth:"120px" }}>{l.op}</span>
                <span style={{ color:l.result==="-1"?"#ef4444":"var(--text-secondary)" }}>→ {l.result}</span>
                {l.evicted!==undefined&&<span style={{ color:"#ef4444" }}>evict k={l.evicted}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
