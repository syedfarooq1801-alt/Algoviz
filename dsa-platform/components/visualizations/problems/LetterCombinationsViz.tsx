"use client";
import { useState, useEffect, useRef } from "react";

const PHONE: Record<string,string[]> = {
  "2":["a","b","c"], "3":["d","e","f"], "4":["g","h","i"],
  "5":["j","k","l"], "6":["m","n","o"], "7":["p","q","r","s"],
  "8":["t","u","v"], "9":["w","x","y","z"]
};
const DIGITS = "23";

interface Step { path: string[]; digitIdx: number; action: string; found?: boolean; }

function buildSteps(digits: string): Step[] {
  const steps: Step[] = [];
  function bt(idx: number, path: string[]) {
    if (idx === digits.length) { steps.push({ path:[...path], digitIdx:idx, action:`✓ Combination "${path.join("")}"`, found:true }); return; }
    const letters = PHONE[digits[idx]]||[];
    for (const l of letters) {
      steps.push({ path:[...path], digitIdx:idx, action:`Digit '${digits[idx]}' → try letter '${l}'` });
      path.push(l); bt(idx+1, path); path.pop();
      steps.push({ path:[...path], digitIdx:idx, action:`Backtrack: remove '${l}'` });
    }
  }
  if (digits) bt(0,[]);
  return steps;
}

const ALL_STEPS = buildSteps(DIGITS);

export default function LetterCombinationsViz() {
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const stateRef = useRef({ stepIdx:0, results:[] as string[] });

  const reset = () => { stateRef.current={stepIdx:0,results:[]}; setStepIdx(0); setResults([]); setPlaying(false); if(iRef.current)clearInterval(iRef.current); };

  const doStep = () => {
    const { stepIdx:s, results:r } = stateRef.current;
    if (s>=ALL_STEPS.length) { setPlaying(false); return; }
    const step = ALL_STEPS[s];
    let nr=r;
    if (step.found) nr=[...r, step.path.join("")];
    stateRef.current={stepIdx:s+1,results:nr};
    setStepIdx(s+1); setResults([...nr]);
  };

  useEffect(() => {
    if (playing) { iRef.current=setInterval(doStep,speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current=null; }
    return () => { if(iRef.current)clearInterval(iRef.current); };
  }, [playing,speed]);

  const done=stepIdx>=ALL_STEPS.length;
  const cur=stepIdx>0?ALL_STEPS[stepIdx-1]:null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color:"var(--text-primary)" }}>Letter Combinations — Phone Keypad Backtracking</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>digits="{DIGITS}". For each digit, try each letter, recurse to next digit.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Phone keypad */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Phone mapping</div>
          {DIGITS.split("").map((d,di)=>(
            <div key={d} className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold"
                style={{ background:cur?.digitIdx===di?"rgba(79,142,247,0.3)":"rgba(79,142,247,0.1)", border:cur?.digitIdx===di?"1px solid #4f8ef7":"1px solid rgba(79,142,247,0.2)", color:"#4f8ef7" }}>{d}</div>
              <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>→</span>
              <div className="flex gap-1">
                {(PHONE[d]||[]).map(l=>(
                  <div key={l} className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold"
                    style={{ background:cur?.path[di]===l?"rgba(168,85,247,0.3)":"rgba(168,85,247,0.08)", border:cur?.path[di]===l?"1px solid #a855f7":"1px solid rgba(168,85,247,0.2)", color:"#a855f7" }}>{l}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current path */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Current path</div>
          <div className="flex gap-2">
            {(cur?.path||[]).map((l,i)=>(
              <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background:"rgba(79,142,247,0.2)", border:"1px solid rgba(79,142,247,0.4)", color:"#4f8ef7" }}>{l}</div>
            ))}
            {(!cur||!cur.path.length)&&<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>[ ]</span>}
          </div>
          {cur&&cur.found&&<div className="mt-2 text-xs font-mono" style={{ color:"#22c55e" }}>✓ "{cur.path.join("")}"</div>}
        </div>
      </div>

      {cur&&(
        <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:cur.found?"rgba(34,197,94,0.1)":"rgba(79,142,247,0.07)", color:cur.found?"#22c55e":"#4f8ef7", border:`1px solid ${cur.found?"rgba(34,197,94,0.3)":"rgba(79,142,247,0.18)"}` }}>
          {cur.action}
        </div>
      )}

      {results.length>0&&(
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"#22c55e" }}>Combinations ({results.length})</div>
          <div className="flex gap-2 flex-wrap">
            {results.map((r,i)=>(
              <span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background:"rgba(34,197,94,0.08)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.25)" }}>{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
