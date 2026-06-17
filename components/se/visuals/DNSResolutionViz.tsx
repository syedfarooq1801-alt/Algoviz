"use client";
import { useState, useEffect } from "react";

const HOPS = [
  { node: "Browser / OS cache", note: "First checks local + OS cache. Miss → ask the resolver." },
  { node: "Recursive Resolver", note: "Your ISP's resolver. It does the legwork on your behalf." },
  { node: "Root Server (.)", note: "\"I don't know example.com, but here's the .com TLD server.\"" },
  { node: "TLD Server (.com)", note: "\"Here's the authoritative name server for example.com.\"" },
  { node: "Authoritative NS", note: "\"example.com is at 93.184.216.34.\" Answer travels back, gets cached." },
];

export default function DNSResolutionViz() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (step >= HOPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [playing, step]);

  return (
    <div>
      <div className="space-y-1.5">
        {HOPS.map((h, i) => {
          const active = i === step;
          const passed = i < step;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
                style={{ background: active ? "var(--accent)" : passed ? "var(--accent-soft)" : "var(--bg-hover)", color: active ? "#fff" : passed ? "var(--accent)" : "var(--text-muted)", border: "1px solid var(--border)" }}>
                {passed ? "✓" : i + 1}
              </div>
              <div className="flex-1 rounded-lg px-3 py-2 transition-all"
                style={{ background: active ? "var(--accent-soft)" : "var(--bg-hover)", border: `1px solid ${active ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{h.node}</div>
                {active && <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{h.note}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => { setStep(0); setPlaying(true); }} className="btn-primary px-3 py-1.5 text-xs">▶ Resolve</button>
        <button onClick={() => setStep((s) => Math.min(HOPS.length - 1, s + 1))} className="btn-ghost px-3 py-1.5 text-xs">Step</button>
        <button onClick={() => { setStep(0); setPlaying(false); }} className="btn-ghost px-3 py-1.5 text-xs">Reset</button>
      </div>
    </div>
  );
}
