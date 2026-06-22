"use client";
import { useEffect, useState } from "react";

const INPUT = "({[]})";

export default function PatternVizStack() {
  const [stack, setStack] = useState<string[]>([]);
  const [idx, setIdx] = useState(-1);
  const [valid, setValid] = useState<boolean | null>(null);
  const [action, setAction] = useState("");
  const MATCH: Record<string,string> = { ")":"(", "]":"[", "}":"{" };

  useEffect(() => {
    const frames: { stack: string[]; idx: number; action: string; valid: boolean | null }[] = [];
    const st: string[] = [];
    for (let i = 0; i < INPUT.length; i++) {
      const c = INPUT[i];
      if ("([{".includes(c)) {
        st.push(c);
        frames.push({ stack: [...st], idx: i, action: `PUSH '${c}'`, valid: null });
      } else {
        if (st[st.length-1] === MATCH[c]) {
          st.pop();
          frames.push({ stack: [...st], idx: i, action: `POP '${MATCH[c]}' — matches '${c}' ✓`, valid: null });
        } else {
          frames.push({ stack: [...st], idx: i, action: `MISMATCH! ✗`, valid: false });
        }
      }
    }
    frames.push({ stack: [], idx: INPUT.length, action: "Stack empty → VALID ✓", valid: true });
    frames.push({ stack: [], idx: -1, action: "", valid: null }); // reset frame

    let fi = 0;
    const id = setInterval(() => {
      const f = frames[fi % frames.length];
      setStack(f.stack); setIdx(f.idx); setAction(f.action); setValid(f.valid);
      fi++;
      if (fi >= frames.length + 1) fi = 0;
    }, 750);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      {/* Input string */}
      <div className="flex gap-1.5 justify-center">
        {INPUT.split("").map((c, i) => (
          <div key={i} className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold font-mono transition-all duration-300"
            style={{
              background: i === idx ? "rgba(168,85,247,0.25)" : i < idx ? "rgba(34,197,94,0.1)" : "var(--bg-hover)",
              border: i === idx ? "2px solid #a855f7" : i < idx ? "1px solid rgba(34,197,94,0.3)" : "2px solid var(--border)",
              color: i === idx ? "#a855f7" : i < idx ? "#22c55e" : "var(--text-primary)",
              transform: i === idx ? "scale(1.12) translateY(-4px)" : "scale(1)",
            }}>
            {c}
          </div>
        ))}
      </div>

      {/* Stack */}
      <div className="rounded-lg p-3" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
        <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Stack (top →)</div>
        <div className="flex gap-2 items-center min-h-9">
          {stack.map((c, i) => (
            <div key={i} className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold font-mono transition-all duration-200"
              style={{
                background: i === stack.length - 1 ? "rgba(249,115,22,0.2)" : "rgba(79,142,247,0.12)",
                border: i === stack.length - 1 ? "2px solid #f97316" : "1px solid rgba(79,142,247,0.3)",
                color: i === stack.length - 1 ? "#f97316" : "#4f8ef7",
                animation: i === stack.length - 1 ? "fadeInUp 0.2s ease-out" : "none",
              }}>
              {c}
            </div>
          ))}
          {stack.length === 0 && <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>empty</span>}
        </div>
      </div>

      {action && (
        <div className="text-center text-xs py-1.5 px-3 rounded-lg font-mono"
          style={{
            background: valid === true ? "rgba(34,197,94,0.1)" : valid === false ? "rgba(239,68,68,0.1)" : "rgba(79,142,247,0.08)",
            color: valid === true ? "#22c55e" : valid === false ? "#ef4444" : "#4f8ef7",
            border: `1px solid ${valid === true ? "rgba(34,197,94,0.25)" : valid === false ? "rgba(239,68,68,0.25)" : "rgba(79,142,247,0.18)"}`,
          }}>
          {action}
        </div>
      )}
    </div>
  );
}
