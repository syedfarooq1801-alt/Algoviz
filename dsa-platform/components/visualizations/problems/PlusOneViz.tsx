"use client";
import { useState, useEffect, useRef } from "react";

const EXAMPLES = [
  { label: "[9,9,9] → [1,0,0,0]", digits: [9,9,9] },
  { label: "[1,2,3] → [1,2,4]", digits: [1,2,3] },
];

type Phase = "idle" | "running" | "done";

export default function PlusOneViz() {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [digits, setDigits] = useState<number[]>([...EXAMPLES[0].digits]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [carry, setCarry] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — add 1 from rightmost digit, propagate carry if needed");
  const [prepended, setPrepended] = useState(false);

  const stateRef = useRef<{
    digits: number[];
    idx: number;
    carry: boolean;
    done: boolean;
    prepended: boolean;
  }>({
    digits: [...EXAMPLES[0].digits],
    idx: EXAMPLES[0].digits.length - 1,
    carry: true, // we are "adding 1", so start with carry = true
    done: false,
    prepended: false,
  });

  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (exIdx = exampleIdx) => {
    const init = [...EXAMPLES[exIdx].digits];
    stateRef.current = {
      digits: [...init],
      idx: init.length - 1,
      carry: true,
      done: false,
      prepended: false,
    };
    setDigits([...init]);
    setActiveIdx(-1);
    setCarry(false);
    setPhase("idle");
    setPlaying(false);
    setPrepended(false);
    setMsg(`Start: [${init.join(", ")}] + 1 — processing from right`);
    if (iRef.current) clearInterval(iRef.current);
  };

  const selectExample = (idx: number) => {
    setExampleIdx(idx);
    reset(idx);
  };

  const doStep = () => {
    const st = stateRef.current;
    if (st.done) return;

    if (!st.carry) {
      // No carry left — we're done
      stateRef.current = { ...st, done: true };
      setPhase("done");
      setPlaying(false);
      setActiveIdx(-1);
      setCarry(false);
      setMsg(`Done! Result: [${st.digits.join(", ")}]`);
      return;
    }

    if (st.idx < 0) {
      // Carry overflowed past the leftmost digit — prepend 1
      const newDigits = [1, ...st.digits];
      stateRef.current = { ...st, digits: newDigits, carry: false, done: true, prepended: true };
      setDigits([...newDigits]);
      setCarry(false);
      setActiveIdx(0);
      setPrepended(true);
      setPhase("done");
      setPlaying(false);
      setMsg(`Carry overflowed! Prepended 1 → Result: [${newDigits.join(", ")}]`);
      return;
    }

    const idx = st.idx;
    const d = st.digits[idx];
    const newDigits = [...st.digits];

    if (d < 9) {
      newDigits[idx] = d + 1;
      stateRef.current = { ...st, digits: newDigits, idx: idx - 1, carry: false };
      setDigits([...newDigits]);
      setActiveIdx(idx);
      setCarry(false);
      setPhase("running");
      setMsg(`digits[${idx}] = ${d} < 9 → increment to ${d+1}, carry clears. Done!`);
    } else {
      // digit is 9 → set to 0, carry continues
      newDigits[idx] = 0;
      stateRef.current = { ...st, digits: newDigits, idx: idx - 1, carry: true };
      setDigits([...newDigits]);
      setActiveIdx(idx);
      setCarry(true);
      setPhase("running");
      setMsg(`digits[${idx}] = 9 → set to 0, carry propagates left`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>
          Plus One — Increment Digit Array (handle carry &amp; overflow)
        </h3>
        {/* Example selector */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => selectExample(i)}
              className="px-3 py-1 rounded text-xs"
              style={{
                background: exampleIdx === i ? "rgba(79,142,247,0.15)" : "var(--bg-hover)",
                color: exampleIdx === i ? "#4f8ef7" : "var(--text-secondary)",
                border: exampleIdx === i ? "1px solid rgba(79,142,247,0.4)" : "1px solid var(--border)",
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setPlaying(!playing)}
            disabled={phase === "done"}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={doStep}
            disabled={phase === "done"}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}
          >
            → Step
          </button>
          <button
            onClick={() => reset()}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}
          >
            ↺ Reset
          </button>
          <input
            type="range" min="200" max="1500" step="100" value={speed}
            onChange={e => setSpeed(+e.target.value)}
            style={{ width:"80px", accentColor:"#4f8ef7" }}
          />
          {carry && phase === "running" && (
            <span className="px-2 py-0.5 rounded text-xs" style={{ background:"rgba(249,115,22,0.15)", color:"#f97316", border:"1px solid rgba(249,115,22,0.3)" }}>
              carry = 1
            </span>
          )}
          {phase === "done" && (
            <span className="px-2 py-0.5 rounded text-xs" style={{ background:"rgba(34,197,94,0.15)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>
              Done
            </span>
          )}
        </div>
      </div>

      {/* Digit array */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color:"var(--text-secondary)" }}>Digit Array</p>
        <div className="flex gap-2 items-end justify-center flex-wrap">
          {/* carry overflow indicator */}
          {prepended && (
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex items-center justify-center rounded-lg text-lg font-bold font-mono transition-all duration-500"
                style={{ width:56, height:56, background:"rgba(168,85,247,0.2)", border:"2px solid #a855f7", color:"#a855f7", transform:"scale(1.15)" }}
              >
                1
              </div>
              <span className="text-xs" style={{ color:"#a855f7" }}>overflow</span>
            </div>
          )}
          {digits.map((d, i) => {
            // the prepended 1 at index 0 is handled above; skip it in the loop
            if (prepended && i === 0) return null;
            const displayIdx = prepended ? i : i;
            const isActive = activeIdx === displayIdx && !prepended;
            const isActivePost = prepended && i === activeIdx;
            const hl = isActive || isActivePost;
            let bg = "var(--bg-hover)";
            let border = "1px solid var(--border)";
            let color = "var(--text-primary)";
            let transform = "scale(1)";

            if (hl) {
              bg = d === 0 && stateRef.current.carry !== false ? "rgba(249,115,22,0.2)" : "rgba(79,142,247,0.2)";
              border = d === 0 && phase !== "done" ? "2px solid #f97316" : "2px solid #4f8ef7";
              color = d === 0 && phase !== "done" ? "#f97316" : "#4f8ef7";
              transform = "scale(1.12)";
            } else if (phase === "done" && d !== EXAMPLES[exampleIdx].digits[i]) {
              bg = "rgba(34,197,94,0.1)"; border = "1px solid rgba(34,197,94,0.4)"; color = "#22c55e";
            }

            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="flex items-center justify-center rounded-lg text-lg font-bold font-mono transition-all duration-300"
                  style={{ width:56, height:56, background:bg, border, color, transform }}
                >
                  {d}
                </div>
                <span className="text-xs" style={{ color:"var(--text-muted)" }}>[{prepended ? i-1 : i}]</span>
              </div>
            );
          })}

          {/* +1 indicator */}
          {phase === "idle" && (
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex items-center justify-center rounded-lg text-lg font-bold font-mono"
                style={{ width:56, height:56, background:"rgba(34,197,94,0.1)", border:"1px dashed rgba(34,197,94,0.5)", color:"#22c55e" }}
              >
                +1
              </div>
              <span className="text-xs" style={{ color:"var(--text-muted)" }}>add</span>
            </div>
          )}
        </div>
      </div>

      {/* Carry trail visualization */}
      {phase !== "idle" && (
        <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color:"var(--text-secondary)" }}>Processing Status</p>
          <div className="flex gap-2 flex-wrap text-xs font-mono">
            {EXAMPLES[exampleIdx].digits.map((orig, i) => {
              const cur = digits[prepended ? i+1 : i];
              const processed = prepended ? true : (i > activeIdx || (activeIdx === -1 && phase === "done"));
              return (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded"
                  style={{
                    background: processed && phase === "done" ? "rgba(34,197,94,0.1)" : i === activeIdx && !prepended ? "rgba(79,142,247,0.1)" : "var(--bg-hover)",
                    border: i === activeIdx && !prepended ? "1px solid rgba(79,142,247,0.4)" : "1px solid var(--border)",
                    color: processed && phase === "done" ? "#22c55e" : "var(--text-muted)",
                  }}
                >
                  [{i}]: {orig} → {cur ?? "?"}
                </div>
              );
            })}
            {prepended && (
              <div className="px-3 py-1.5 rounded" style={{ background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.4)", color:"#a855f7" }}>
                [pre]: 0 → 1 (overflow)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message */}
      <div
        className="rounded-lg px-4 py-2 text-xs font-mono"
        style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}
      >
        {msg}
      </div>

      {/* Algorithm */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color:"var(--text-secondary)" }}>Algorithm</p>
        <div className="text-xs font-mono space-y-1" style={{ color:"var(--text-muted)" }}>
          <div>for i from n-1 down to 0:</div>
          <div>&nbsp;&nbsp;if digits[i] &lt; 9 → digits[i]++ and return digits</div>
          <div>&nbsp;&nbsp;else → digits[i] = 0 (carry propagates)</div>
          <div>if loop ends → prepend 1 (all 9s case)</div>
        </div>
      </div>
    </div>
  );
}
