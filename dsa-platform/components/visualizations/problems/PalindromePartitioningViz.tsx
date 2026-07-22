"use client";
import { useState, useRef, useEffect } from "react";

const S = "aab";
// All valid partitions
const PARTITIONS = [["a","a","b"], ["aa","b"]];
const isPalin = (s: string) => s === s.split("").reverse().join("");

export default function PalindromePartitioningViz() {
  const [idx, setIdx] = useState(0);
  const [checkStr, setCheckStr] = useState("");
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [msg, setMsg] = useState(`Partition "${S}" so every substring is a palindrome.`);
  const stateRef = useRef({ idx: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const CHECKS = ["a","aa","aab","a","ab","b"];
  const CHECK_RESULTS = CHECKS.map(c => isPalin(c));

  const reset = () => {
    stateRef.current = { idx: 0 };
    setIdx(0); setCheckStr(""); setDone(false); setPlaying(false);
    setMsg(`Partition "${S}" so every substring is a palindrome.`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { idx: i } = stateRef.current;
    if (i >= CHECKS.length) { setDone(true); setPlaying(false); setMsg(`Found ${PARTITIONS.length} valid partitions!`); return; }
    stateRef.current = { idx: i + 1 };
    setIdx(i + 1); setCheckStr(CHECKS[i]);
    setMsg(`Check "${CHECKS[i]}": ${CHECK_RESULTS[i] ? "palindrome ✓ → can use as cut" : "not palindrome ✗ → skip"}`);
    if (i + 1 >= CHECKS.length) { setDone(true); setPlaying(false); setMsg(`Found ${PARTITIONS.length} valid partitions!`); }
  };

  useEffect(() => {
    if (playing) iRef.current = setInterval(doStep, speed);
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Palindrome Partitioning — Backtracking</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>At each position try every substring. If palindrome, recurse on remainder.</div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>String: "{S}"</div>
        <div className="flex gap-2 mb-4">
          {S.split("").map((c, i) => (
            <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.4)", color: "#4f8ef7" }}>{c}</div>
          ))}
        </div>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Palindrome checks:</div>
        <div className="flex flex-wrap gap-2">
          {CHECKS.map((c, i) => (
            <div key={i} className="px-3 py-1.5 rounded text-xs font-mono" style={{
              background: i < idx ? (CHECK_RESULTS[i] ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.1)") : "var(--bg-hover)",
              border: i === idx - 1 ? "2px solid " + (CHECK_RESULTS[i] ? "#22c55e" : "#ef4444") : "1px solid var(--border)",
              color: i < idx ? (CHECK_RESULTS[i] ? "#22c55e" : "#ef4444") : "var(--text-muted)"
            }}>
              "{c}" {i < idx ? (CHECK_RESULTS[i] ? "✓" : "✗") : ""}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Valid partitions</div>
        {PARTITIONS.map((parts, i) => (
          <div key={i} className="flex gap-2 mb-2">
            {parts.map((p, j) => (
              <div key={j} className="px-3 py-1.5 rounded text-xs font-mono" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}>"{p}"</div>
            ))}
          </div>
        ))}
      </div>
      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>{msg}</div>
    </div>
  );
}
