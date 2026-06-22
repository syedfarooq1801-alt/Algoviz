"use client";
import { useState, useEffect } from "react";

// Two threads incrementing a shared counter. With/without a lock around the critical section.
export default function MutexViz() {
  const [locked, setLocked] = useState(true);
  const [running, setRunning] = useState(false);
  const [counter, setCounter] = useState(0);
  const [holder, setHolder] = useState<null | "A" | "B">(null);
  const [log, setLog] = useState<string[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (tick >= 8) { setRunning(false); setHolder(null); return; }
    const t = setTimeout(() => {
      const who: "A" | "B" = tick % 2 === 0 ? "A" : "B";
      if (locked) {
        setHolder(who);
        setCounter((c) => c + 1);
        setLog((l) => [`T${tick}: ${who} locks → reads, +1, unlocks`, ...l].slice(0, 6));
      } else {
        // race: both read same value, lost update sometimes
        const lost = tick % 3 === 0;
        setCounter((c) => c + (lost ? 0 : 1));
        setLog((l) => [`T${tick}: ${who} reads & writes${lost ? " — LOST UPDATE!" : ""}`, ...l].slice(0, 6));
      }
      setTick((t) => t + 1);
    }, 600);
    return () => clearTimeout(t);
  }, [running, tick, locked]);

  const start = () => { setCounter(0); setTick(0); setLog([]); setRunning(true); };

  return (
    <div>
      <div className="flex gap-2 mb-3 items-center">
        <button onClick={() => setLocked(true)} className="px-3 py-1.5 rounded-md text-xs font-medium" style={{ background: locked ? "var(--accent-soft)" : "var(--bg-hover)", color: locked ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${locked ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>With mutex</button>
        <button onClick={() => setLocked(false)} className="px-3 py-1.5 rounded-md text-xs font-medium" style={{ background: !locked ? "rgba(240,82,75,0.12)" : "var(--bg-hover)", color: !locked ? "var(--accent-red)" : "var(--text-muted)", border: `1px solid ${!locked ? "rgba(240,82,75,0.4)" : "var(--border)"}` }}>No lock (race)</button>
        <button onClick={start} disabled={running} className="btn-primary px-3 py-1.5 text-xs ml-auto" style={{ opacity: running ? 0.6 : 1 }}>▶ Run 8 ops</button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        {(["A", "B"] as const).map((th) => (
          <div key={th} className="flex-1 rounded-lg px-3 py-2 text-center" style={{ background: holder === th ? "var(--accent-soft)" : "var(--bg-hover)", border: `1px solid ${holder === th ? "rgba(91,140,255,0.4)" : "var(--border)"}` }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Thread {th}</div>
            <div className="text-sm font-medium" style={{ color: holder === th ? "var(--accent)" : "var(--text-secondary)" }}>{holder === th ? "🔒 in critical section" : "idle"}</div>
          </div>
        ))}
        <div className="rounded-lg px-4 py-2 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>counter</div>
          <div className="text-xl font-bold font-mono" style={{ color: locked ? "var(--accent-green)" : "var(--accent-red)" }}>{counter}</div>
        </div>
      </div>

      <div className="text-xs font-mono space-y-0.5" style={{ color: "var(--text-muted)", minHeight: 60 }}>
        {log.map((l, i) => <div key={i} style={{ color: l.includes("LOST") ? "var(--accent-red)" : "var(--text-muted)" }}>{l}</div>)}
      </div>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Expected after 8 ops = 8. Without a lock, interleaved read-modify-write causes <b style={{ color: "var(--accent-red)" }}>lost updates</b> — the race condition a mutex prevents.</p>
    </div>
  );
}
