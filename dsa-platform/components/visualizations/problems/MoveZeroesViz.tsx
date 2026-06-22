"use client";
import { useState, useEffect, useRef } from "react";

const INIT_NUMS = [0, 1, 0, 3, 12];

export default function MoveZeroesViz() {
  const [nums, setNums] = useState<number[]>([...INIT_NUMS]);
  const [slow, setSlow] = useState(0);
  const [fast, setFast] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — slow=write position, fast=read position");
  const stateRef = useRef({ nums: [...INIT_NUMS], slow: 0, fast: 0 });
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    stateRef.current = { nums: [...INIT_NUMS], slow: 0, fast: 0 };
    setNums([...INIT_NUMS]);
    setSlow(0);
    setFast(0);
    setDone(false);
    setPlaying(false);
    setMsg("Press Play — slow=write position, fast=read position");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { nums: n, slow: s, fast: f } = stateRef.current;
    if (f >= n.length) {
      setDone(true);
      setPlaying(false);
      setMsg("Done! All non-zeroes moved to front, zeroes fill the tail.");
      return;
    }
    const newNums = [...n];
    let newSlow = s;
    let newFast = f + 1;
    let newMsg = "";
    if (n[f] !== 0) {
      // swap slow and fast
      const tmp = newNums[s];
      newNums[s] = newNums[f];
      newNums[f] = tmp;
      newMsg = `nums[${f}]=${n[f]} is non-zero → swap with slow pos [${s}], advance both`;
      newSlow = s + 1;
    } else {
      newMsg = `nums[${f}]=0 is zero → skip, advance fast only`;
    }
    stateRef.current = { nums: newNums, slow: newSlow, fast: newFast };
    setNums(newNums);
    setSlow(newSlow);
    setFast(newFast);
    setMsg(newMsg);
    if (newFast >= newNums.length) {
      setDone(true);
      setPlaying(false);
      setMsg("Done! All non-zeroes moved to front, zeroes fill the tail.");
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Move Zeroes — Two Pointers</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          slow = write position (blue). fast = read position (orange). When fast hits non-zero, swap with slow and advance both. Otherwise advance fast only.
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="2000" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-xl px-4 py-3 flex gap-4 flex-wrap" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {[
          { color: "#4f8ef7", label: "slow (write)" },
          { color: "#f97316", label: "fast (read)" },
          { color: "#22c55e", label: "placed non-zero" },
          { color: "#6b7280", label: "zero" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <div className="w-3 h-3 rounded" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Array */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Array (in-place transformation)</div>
        <div className="flex gap-2 flex-wrap">
          {nums.map((v, i) => {
            const isSlow = i === slow && !done;
            const isFast = i === fast && !done;
            const isPlaced = i < slow;
            const isZero = v === 0;
            let bg = "var(--bg-hover)";
            let border = "1px solid var(--border)";
            let color = "var(--text-secondary)";
            if (isSlow && isFast) {
              bg = "rgba(168,85,247,0.25)";
              border = "2px solid #a855f7";
              color = "#a855f7";
            } else if (isSlow) {
              bg = "rgba(79,142,247,0.25)";
              border = "2px solid #4f8ef7";
              color = "#4f8ef7";
            } else if (isFast) {
              bg = "rgba(249,115,22,0.25)";
              border = "2px solid #f97316";
              color = "#f97316";
            } else if (isPlaced && !isZero) {
              bg = "rgba(34,197,94,0.15)";
              border = "1px solid rgba(34,197,94,0.4)";
              color = "#22c55e";
            } else if (isZero && done) {
              bg = "rgba(107,114,128,0.15)";
              border = "1px solid rgba(107,114,128,0.3)";
              color = "#6b7280";
            } else if (isZero) {
              bg = "rgba(107,114,128,0.1)";
              border = "1px solid rgba(107,114,128,0.2)";
              color = "#6b7280";
            }
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{ background: bg, border, color, transform: (isSlow || isFast) ? "scale(1.1)" : "scale(1)" }}>
                  {v}
                </div>
                <div className="flex flex-col items-center" style={{ fontSize: "9px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                  <span>[{i}]</span>
                  {isSlow && isFast && <span style={{ color: "#a855f7" }}>s=f</span>}
                  {isSlow && !isFast && <span style={{ color: "#4f8ef7" }}>slow</span>}
                  {isFast && !isSlow && <span style={{ color: "#f97316" }}>fast</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pointer state */}
      <div className="rounded-xl p-4 grid grid-cols-2 gap-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>slow (write head)</div>
          <div className="text-2xl font-bold font-mono" style={{ color: "#4f8ef7" }}>{done ? slow : slow}</div>
        </div>
        <div>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>fast (read head)</div>
          <div className="text-2xl font-bold font-mono" style={{ color: "#f97316" }}>{fast}</div>
        </div>
      </div>

      {/* Message */}
      <div className="rounded-lg px-4 py-2 text-xs font-mono"
        style={{ background: done ? "rgba(34,197,94,0.08)" : "rgba(79,142,247,0.07)", color: done ? "#22c55e" : "#4f8ef7", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.18)"}` }}>
        {msg}
      </div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="text-sm font-semibold" style={{ color: "#22c55e" }}>
            Result: [{nums.join(", ")}]
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Non-zeroes at front, zeroes at tail — order preserved</div>
        </div>
      )}
    </div>
  );
}
