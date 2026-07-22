"use client";
import { useState, useEffect, useRef } from "react";

const CANDS = [2,3,6,7];
const TARGET = 7;

interface Step { path: number[]; idx: number; remaining: number; action: string; found?: boolean; }

function buildSteps(): Step[] {
  const steps: Step[] = [];
  function bt(start: number, path: number[], rem: number) {
    if (rem === 0) { steps.push({ path:[...path], idx:-1, remaining:0, action:`✓ Found combination [${path}]`, found:true }); return; }
    for (let i=start;i<CANDS.length;i++) {
      if (CANDS[i] > rem) { steps.push({ path:[...path], idx:i, remaining:rem, action:`${CANDS[i]} > ${rem} remaining → skip (prune)` }); break; }
      steps.push({ path:[...path], idx:i, remaining:rem, action:`Try ${CANDS[i]}: ${rem}-${CANDS[i]}=${rem-CANDS[i]} remaining` });
      path.push(CANDS[i]);
      bt(i, path, rem-CANDS[i]);
      path.pop();
      steps.push({ path:[...path], idx:i, remaining:rem, action:`Backtrack: remove ${CANDS[i]} from path` });
    }
  }
  bt(0,[],TARGET);
  return steps;
}

const ALL_STEPS = buildSteps();

export default function CombinationSumViz() {
  const [stepIdx, setStepIdx] = useState(0);
  const [found, setFound] = useState<number[][]>([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const stateRef = useRef({ stepIdx:0, found:[] as number[][] });

  const reset = () => {
    stateRef.current = { stepIdx:0, found:[] };
    setStepIdx(0); setFound([]); setPlaying(false);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { stepIdx: s, found: f } = stateRef.current;
    if (s >= ALL_STEPS.length) { setPlaying(false); return; }
    const step = ALL_STEPS[s];
    let nf = f;
    if (step.found) nf = [...f, [...step.path]];
    stateRef.current = { stepIdx:s+1, found:nf };
    setStepIdx(s+1); setFound([...nf]);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const done = stepIdx >= ALL_STEPS.length;
  const cur = stepIdx > 0 ? ALL_STEPS[stepIdx-1] : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color:"var(--text-primary)" }}>Combination Sum — Backtracking DFS</h3>
        <div className="text-xs mb-3" style={{ color:"var(--text-muted)" }}>candidates={JSON.stringify(CANDS)}, target={TARGET}. Reuse allowed, try each from current index onward.</div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
          <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>step {stepIdx}/{ALL_STEPS.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Current state */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Current path</div>
          <div className="flex gap-1 flex-wrap min-h-10">
            {(cur?.path||[]).map((v,i)=>(
              <div key={i} className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background:"rgba(79,142,247,0.2)", border:"1px solid rgba(79,142,247,0.4)", color:"#4f8ef7" }}>{v}</div>
            ))}
            {(!cur||!cur.path.length)&&<span style={{ color:"var(--text-muted)", fontSize:"11px" }}>[ ]</span>}
          </div>
          {cur&&<div className="mt-2 text-xs font-mono" style={{ color:"#f97316" }}>remaining = {cur.remaining}</div>}
          {cur&&cur.idx>=0&&<div className="mt-1 text-xs" style={{ color:"var(--text-muted)" }}>trying cand[{cur.idx}]={CANDS[cur.idx]}</div>}
        </div>

        {/* Candidates */}
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>Candidates</div>
          <div className="flex gap-2">
            {CANDS.map((c,i)=>(
              <div key={i} className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background:cur?.idx===i?"rgba(168,85,247,0.3)":"rgba(168,85,247,0.08)", border:cur?.idx===i?"2px solid #a855f7":"1px solid rgba(168,85,247,0.2)", color:"#a855f7" }}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Action log */}
      {cur && (
        <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:cur.found?"rgba(34,197,94,0.1)":"rgba(79,142,247,0.07)", color:cur.found?"#22c55e":"#4f8ef7", border:`1px solid ${cur.found?"rgba(34,197,94,0.3)":"rgba(79,142,247,0.18)"}` }}>
          {cur.action}
        </div>
      )}

      {/* Found combinations */}
      {found.length > 0 && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color:"#22c55e" }}>Found combinations ({found.length})</div>
          <div className="flex gap-2 flex-wrap">
            {found.map((combo,i)=>(
              <span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>[{combo.join(",")}]</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
