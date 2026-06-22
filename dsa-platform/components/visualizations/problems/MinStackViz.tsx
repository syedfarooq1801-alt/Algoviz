"use client";
import { useState } from "react";

type Op = { type: "push"|"pop"|"top"|"getMin"; arg?: number };
const OPS: Op[] = [
  {type:"push",arg:-2},{type:"push",arg:0},{type:"push",arg:-3},
  {type:"getMin"},{type:"pop"},{type:"top"},{type:"getMin"},
];

export default function MinStackViz() {
  const [stack, setStack] = useState<{val:number,min:number}[]>([]);
  const [minStack, setMinStack] = useState<number[]>([]);
  const [opIdx, setOpIdx] = useState(0);
  const [lastResult, setLastResult] = useState<string>("");
  const [log, setLog] = useState<{op:string,result:string}[]>([]);

  const doOp = () => {
    if (opIdx >= OPS.length) return;
    const op = OPS[opIdx];
    const ns = [...stack];
    const nm = [...minStack];
    let result = "";

    if (op.type === "push" && op.arg !== undefined) {
      const newMin = nm.length ? Math.min(nm[nm.length-1], op.arg) : op.arg;
      ns.push({val:op.arg, min:newMin});
      nm.push(newMin);
      result = `pushed ${op.arg}, running min=${newMin}`;
    } else if (op.type === "pop") {
      const popped = ns.pop();
      nm.pop();
      result = popped ? `popped ${popped.val}` : "empty";
    } else if (op.type === "top") {
      result = ns.length ? `${ns[ns.length-1].val}` : "empty";
    } else if (op.type === "getMin") {
      result = nm.length ? `${nm[nm.length-1]}` : "empty";
    }

    setStack(ns); setMinStack(nm);
    setLastResult(result);
    setLog(prev => [...prev, { op: op.type+(op.arg!==undefined?`(${op.arg})`:"()"), result }]);
    setOpIdx(opIdx+1);
  };

  const reset = () => { setStack([]); setMinStack([]); setOpIdx(0); setLastResult(""); setLog([]); };
  const done = opIdx >= OPS.length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Min Stack — O(1) getMin using auxiliary min stack</h3>
        <div className="flex gap-2">
          <button onClick={doOp} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:"rgba(34,197,94,0.15)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>→ Next Op</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>

      {/* Operation queue */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Operations</div>
        <div className="flex gap-2 flex-wrap">
          {OPS.map((op,i) => (
            <span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background:i===opIdx?"rgba(79,142,247,0.2)":i<opIdx?"rgba(34,197,94,0.08)":"var(--bg-hover)", border:i===opIdx?"1px solid rgba(79,142,247,0.5)":i<opIdx?"1px solid rgba(34,197,94,0.2)":"1px solid var(--border)", color:i===opIdx?"#4f8ef7":i<opIdx?"var(--text-muted)":"var(--text-secondary)" }}>
              {op.type}{op.arg!==undefined?`(${op.arg})`:op.type==="pop"||op.type==="top"||op.type==="getMin"?"()":""}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Main stack */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Stack (values)</div>
          <div className="flex flex-col-reverse gap-1 min-h-16">
            {stack.length===0?<div style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</div>:
              stack.map((item,i) => (
                <div key={i} className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-200 ${i===stack.length-1?"ring-1 ring-blue-400/40":""}`}
                  style={{ background:i===stack.length-1?"rgba(79,142,247,0.2)":"rgba(79,142,247,0.08)", color:i===stack.length-1?"#4f8ef7":"var(--text-secondary)", border:i===stack.length-1?"1px solid rgba(79,142,247,0.4)":"1px solid var(--border)" }}>
                  {item.val}
                  {i===stack.length-1&&<span style={{ color:"var(--text-muted)", fontSize:"9px" }}> ← top</span>}
                </div>
              ))
            }
          </div>
        </div>

        {/* Min stack */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"#22c55e" }}>minStack</div>
          <div className="flex flex-col-reverse gap-1 min-h-16">
            {minStack.length===0?<div style={{ color:"var(--text-muted)", fontSize:"11px" }}>empty</div>:
              minStack.map((m,i)=>(
                <div key={i} className="px-3 py-2 rounded-lg text-xs font-mono font-bold"
                  style={{ background:i===minStack.length-1?"rgba(34,197,94,0.15)":"rgba(34,197,94,0.06)", color:i===minStack.length-1?"#22c55e":"var(--text-muted)", border:i===minStack.length-1?"1px solid rgba(34,197,94,0.4)":"1px solid var(--border)" }}>
                  {m}{i===minStack.length-1&&<span style={{ fontSize:"9px" }}> ← min</span>}
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {lastResult && (
        <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{lastResult}</div>
      )}

      {log.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>History</div>
          <div className="space-y-1">
            {log.map((l,i) => (
              <div key={i} className="flex gap-3 text-xs font-mono">
                <span style={{ color:"var(--text-muted)", minWidth:"120px" }}>{l.op}</span>
                <span style={{ color:"var(--text-secondary)" }}>→ {l.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
