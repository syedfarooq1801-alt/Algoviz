"use client";
import { useState, useEffect } from "react";

const STEPS = [
  { from: "client", label: "SYN", note: "Client picks a sequence number x, sends SYN(seq=x). \"I want to talk, my start is x.\"" },
  { from: "server", label: "SYN-ACK", note: "Server replies SYN(seq=y), ACK(x+1). \"Got it. My start is y, expecting x+1.\"" },
  { from: "client", label: "ACK", note: "Client sends ACK(y+1). Connection established — both sides synced." },
];

export default function TCPHandshakeViz() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep((s) => s + 1), 1300);
    return () => clearTimeout(t);
  }, [playing, step]);

  const established = step >= STEPS.length - 1;

  return (
    <div>
      <svg viewBox="0 0 420 200" width="100%" style={{ maxWidth: 440 }}>
        {/* lifelines */}
        <text x="60" y="20" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--accent)">Client</text>
        <text x="360" y="20" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--accent-green)">Server</text>
        <line x1="60" y1="30" x2="60" y2="185" stroke="var(--border)" strokeWidth="2" />
        <line x1="360" y1="30" x2="360" y2="185" stroke="var(--border)" strokeWidth="2" />
        {STEPS.map((s, i) => {
          const y = 60 + i * 42;
          const active = i === step;
          const shown = i <= step;
          const ltr = s.from === "client";
          const x1 = ltr ? 60 : 360, x2 = ltr ? 360 : 60;
          const color = active ? (ltr ? "var(--accent)" : "var(--accent-green)") : shown ? "var(--text-secondary)" : "var(--border)";
          return (
            <g key={i} opacity={shown ? 1 : 0.3}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={active ? 2.5 : 1.5} />
              <polygon points={ltr ? `${x2},${y} ${x2 - 8},${y - 4} ${x2 - 8},${y + 4}` : `${x2},${y} ${x2 + 8},${y - 4} ${x2 + 8},${y + 4}`} fill={color} />
              <rect x={210 - 34} y={y - 24} width="68" height="17" rx="4" fill={active ? color : "var(--bg-hover)"} />
              <text x="210" y={y - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill={active ? "#fff" : "var(--text-secondary)"}>{s.label}</text>
            </g>
          );
        })}
        {established && <text x="210" y="180" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--accent-green)">✓ ESTABLISHED</text>}
      </svg>

      <p className="text-sm mt-2 min-h-[40px]" style={{ color: "var(--text-secondary)" }}>
        {step >= 0 ? STEPS[step].note : "The three-way handshake establishes a reliable connection before any data flows."}
      </p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => { setStep(-1); setPlaying(true); }} className="btn-primary px-3 py-1.5 text-xs">▶ Play</button>
        <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="btn-ghost px-3 py-1.5 text-xs">Step</button>
        <button onClick={() => { setStep(-1); setPlaying(false); }} className="btn-ghost px-3 py-1.5 text-xs">Reset</button>
      </div>
    </div>
  );
}
