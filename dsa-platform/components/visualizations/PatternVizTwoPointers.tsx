"use client";
import { useEffect, useState } from "react";

const ARR = [-2, -1, 0, 1, 2, 3, 4];
const TARGET = 3;

export default function PatternVizTwoPointers() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(ARR.length - 1);
  const [found, setFound] = useState(false);
  const [msg, setMsg] = useState("Two pointers start at opposite ends");

  useEffect(() => {
    let l = 0, r = ARR.length - 1;
    const frames: { l: number; r: number; msg: string; found: boolean }[] = [
      { l, r, msg: "Start: left=0, right=6", found: false },
    ];
    while (l < r) {
      const sum = ARR[l] + ARR[r];
      if (sum === TARGET) {
        frames.push({ l, r, msg: `${ARR[l]} + ${ARR[r]} = ${TARGET} ✓ FOUND!`, found: true });
        break;
      } else if (sum < TARGET) {
        frames.push({ l, r, msg: `${ARR[l]} + ${ARR[r]} = ${sum} < ${TARGET} → move left →`, found: false });
        l++;
      } else {
        frames.push({ l, r, msg: `${ARR[l]} + ${ARR[r]} = ${sum} > ${TARGET} → move right ←`, found: false });
        r--;
      }
    }
    frames.push(...frames.map(f => f)); // double for pause

    let idx = 0;
    const id = setInterval(() => {
      const f = frames[idx % frames.length];
      setLeft(f.l); setRight(f.r); setMsg(f.msg); setFound(f.found);
      idx++;
      if (idx >= frames.length) { idx = 0; }
    }, 950);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end justify-center flex-wrap">
        {ARR.map((n, i) => {
          const isLeft = i === left;
          const isRight = i === right;
          const inRange = i >= left && i <= right;
          const isHit = found && (isLeft || isRight);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="transition-all duration-350 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                style={{
                  background: isHit ? "rgba(34,197,94,0.25)" : isLeft ? "rgba(79,142,247,0.25)" : isRight ? "rgba(249,115,22,0.25)" : inRange ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.2)",
                  border: isHit ? "2px solid #22c55e" : isLeft ? "2px solid #4f8ef7" : isRight ? "2px solid #f97316" : inRange ? "1px solid var(--border)" : "1px solid var(--border-subtle)",
                  color: isHit ? "#22c55e" : isLeft ? "#4f8ef7" : isRight ? "#f97316" : inRange ? "var(--text-primary)" : "var(--text-muted)",
                  transform: (isLeft || isRight) ? "translateY(-5px) scale(1.1)" : "scale(1)",
                  opacity: inRange ? 1 : 0.35,
                  boxShadow: isHit ? "0 0 14px rgba(34,197,94,0.4)" : "none",
                }}>
                {n}
              </div>
              <span style={{ fontSize: "9px", color: isLeft ? "#4f8ef7" : isRight ? "#f97316" : "transparent", fontWeight: 700 }}>
                {isLeft && isRight ? "L=R" : isLeft ? "L" : isRight ? "R" : "."}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs py-2 px-3 rounded-lg font-mono transition-all"
        style={{ background: found ? "rgba(34,197,94,0.1)" : "rgba(79,142,247,0.08)", color: found ? "#22c55e" : "#4f8ef7", border: `1px solid ${found ? "rgba(34,197,94,0.25)" : "rgba(79,142,247,0.2)"}` }}>
        {msg}
      </div>

      <div className="flex justify-between text-xs px-1" style={{ color: "var(--text-muted)" }}>
        <span>Target: <strong style={{ color: "#f97316" }}>{TARGET}</strong></span>
        <span>Sum: <strong style={{ color: found ? "#22c55e" : "#4f8ef7" }}>{ARR[left] + ARR[right]}</strong></span>
        <span>Steps: O(n) not O(n²)</span>
      </div>
    </div>
  );
}
