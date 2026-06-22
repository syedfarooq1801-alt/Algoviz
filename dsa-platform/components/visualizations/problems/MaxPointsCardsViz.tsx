"use client";
import { useState, useEffect, useRef } from "react";

const CARDS = [1, 2, 3, 4, 5, 6, 1];
const K = 3;

export default function MaxPointsCardsViz() {
  const [leftTake, setLeftTake] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState(`Take k=${K} cards from left/right ends to maximize sum`);
  const stateRef = useRef({ leftTake: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getScore = (lt: number) => {
    const rt = K - lt;
    let sum = 0;
    for (let i = 0; i < lt; i++) sum += CARDS[i];
    for (let i = 0; i < rt; i++) sum += CARDS[CARDS.length - 1 - i];
    return sum;
  };

  const scores = Array.from({ length: K + 1 }, (_, i) => ({ lt: i, rt: K - i, score: getScore(i) }));
  const maxScore = Math.max(...scores.map(s => s.score));

  const reset = () => {
    stateRef.current = { leftTake: 0 };
    setLeftTake(0); setDone(false); setPlaying(false);
    setMsg(`Take k=${K} cards from left/right ends to maximize sum`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { leftTake: lt } = stateRef.current;
    if (lt > K) { setDone(true); setPlaying(false); setMsg(`Best: ${maxScore} pts`); return; }
    const score = getScore(lt);
    setMsg(`Left=${lt}, Right=${K - lt}: score=${score}${score === maxScore ? " ← BEST!" : ""}`);
    stateRef.current = { leftTake: lt + 1 };
    setLeftTake(lt + 1);
    if (lt + 1 > K) { setDone(true); setPlaying(false); setMsg(`Max score = ${maxScore}`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const lt = Math.min(leftTake, K);
  const rt = K - lt;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Max Points From Cards — Sliding Window</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Try all splits: take 0..k from left, rest from right. Enumerate and find max.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>Cards: left={lt} taken, right={rt} taken</div>
        <div className="flex gap-2">
          {CARDS.map((v, i) => {
            const fromLeft = i < lt;
            const fromRight = i >= CARDS.length - rt && rt > 0;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{ background: fromLeft ? "rgba(79,142,247,0.3)" : fromRight ? "rgba(249,115,22,0.3)" : "var(--bg-hover)", border: fromLeft ? "2px solid #4f8ef7" : fromRight ? "2px solid #f97316" : "1px solid var(--border)", color: fromLeft ? "#4f8ef7" : fromRight ? "#f97316" : "var(--text-muted)" }}>
                  {v}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-4 text-xs">
          <span style={{ color: "#4f8ef7" }}>■ Left taken ({lt})</span>
          <span style={{ color: "#f97316" }}>■ Right taken ({rt})</span>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>All possible splits:</div>
        <div className="flex gap-2 flex-wrap">
          {scores.map(({ lt: l, rt: r, score }) => (
            <div key={l} className="text-center px-3 py-2 rounded-lg text-xs" style={{ background: score === maxScore ? "rgba(34,197,94,0.15)" : "var(--bg-hover)", border: score === maxScore ? "2px solid #22c55e" : "1px solid var(--border)", color: score === maxScore ? "#22c55e" : "var(--text-secondary)" }}>
              <div>L={l} R={r}</div>
              <div className="font-bold">{score}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)" }}>{msg}</div>
    </div>
  );
}
