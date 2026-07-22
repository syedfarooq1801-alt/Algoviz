"use client";
import { useState, useRef, useEffect } from "react";

const S = "ababcbacadefegdehijhklij";
// Compute last occurrence of each char
const lastOcc: Record<string, number> = {};
for (let i = 0; i < S.length; i++) lastOcc[S[i]] = i;
// Compute partitions
const PARTITIONS: { start: number; end: number }[] = [];
let start = 0, end = 0;
for (let i = 0; i < S.length; i++) {
  end = Math.max(end, lastOcc[S[i]]);
  if (i === end) { PARTITIONS.push({ start, end }); start = i + 1; }
}

export default function PartitionLabelsViz() {
  const [idx, setIdx] = useState(0);
  const [end, setEnd] = useState(0);
  const [parts, setParts] = useState<{ start: number; end: number }[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(150);
  const [msg, setMsg] = useState("Greedy: expand partition end to last occurrence of each char.");
  const stateRef = useRef({ idx: 0, end: 0, parts: [] as { start: number; end: number }[], start: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { idx: 0, end: 0, parts: [], start: 0 };
    setIdx(0); setEnd(0); setParts([]); setDone(false); setPlaying(false);
    setMsg("Greedy: expand partition end to last occurrence of each char.");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i, end: e, parts: p, start: st } = stateRef.current;
    if (i >= S.length) { setDone(true); setPlaying(false); setMsg(`${p.length} partitions: sizes [${p.map(x => x.end - x.start + 1).join(",")}]`); return; }
    const newE = Math.max(e, lastOcc[S[i]]);
    let newParts = [...p], newSt = st;
    let newMsg = `i=${i} '${S[i]}': end=max(${e},last['${S[i]}']=${lastOcc[S[i]]})=${newE}`;
    if (i === newE) {
      newParts = [...p, { start: st, end: i }];
      newSt = i + 1;
      newMsg += ` → i==end, PARTITION [${st}..${i}] (len ${i - st + 1})!`;
    }
    stateRef.current = { idx: i + 1, end: newE, parts: newParts, start: newSt };
    setIdx(i + 1); setEnd(newE); setParts(newParts); setMsg(newMsg);
    if (i + 1 >= S.length) { setDone(true); setPlaying(false); setMsg(`Done! ${newParts.length} partitions.`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const getPartIdx = (i: number) => parts.findIndex(p => i >= p.start && i <= p.end);
  const COLORS = ["#4f8ef7", "#22c55e", "#f97316", "#a855f7"];

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Partition Labels — Greedy</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Each letter appears in only one partition. Expand each partition to last occurrence of all chars seen.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="80" max="600" step="50" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>String (processed up to i={idx})</div>
        <div className="flex flex-wrap gap-0.5">
          {S.split("").map((c, i) => {
            const pi = getPartIdx(i);
            const isCurrent = i === idx - 1;
            const isEnd = i === end;
            return (
              <div key={i} className="w-7 h-7 rounded text-xs flex items-center justify-center font-bold transition-all" style={{
                background: pi >= 0 ? `${COLORS[pi % COLORS.length]}22` : isCurrent ? "rgba(249,115,22,0.3)" : i < idx ? "rgba(107,114,128,0.1)" : "var(--bg-hover)",
                border: isCurrent ? "1px solid #f97316" : isEnd && !done ? "1px solid #a855f7" : pi >= 0 ? `1px solid ${COLORS[pi % COLORS.length]}44` : "1px solid transparent",
                color: pi >= 0 ? COLORS[pi % COLORS.length] : isCurrent ? "#f97316" : "var(--text-muted)"
              }}>{c}</div>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Partitions found</div>
        <div className="flex gap-2 flex-wrap">
          {parts.map((p, i) => (
            <div key={i} className="px-3 py-1.5 rounded text-xs font-mono font-bold" style={{ background: `${COLORS[i % COLORS.length]}22`, border: `1px solid ${COLORS[i % COLORS.length]}44`, color: COLORS[i % COLORS.length] }}>
              [{p.start}..{p.end}] len={p.end - p.start + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
