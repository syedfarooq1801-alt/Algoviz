"use client";
import { useState, useEffect } from "react";

const STAGES = [
  { t: "URL parse", d: "Browser splits scheme, host, path from https://example.com/page." },
  { t: "DNS lookup", d: "Resolve example.com → IP via cache → resolver → root → TLD → authoritative." },
  { t: "TCP handshake", d: "SYN / SYN-ACK / ACK to open a reliable connection to the server's IP:443." },
  { t: "TLS handshake", d: "Negotiate cipher, verify cert, exchange keys → encrypted channel." },
  { t: "HTTP request", d: "Send GET /page with headers (Host, cookies, Accept)." },
  { t: "Server + DB", d: "Server routes the request, queries DB/cache, renders the response." },
  { t: "HTTP response", d: "Status 200 + HTML body travels back over the encrypted connection." },
  { t: "Render", d: "Browser parses HTML, builds DOM/CSSOM, fetches assets, paints pixels." },
];

export default function URLJourneyViz() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (step >= STAGES.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep((s) => s + 1), 1000);
    return () => clearTimeout(t);
  }, [playing, step]);

  return (
    <div>
      <div className="space-y-1">
        {STAGES.map((s, i) => {
          const active = i === step, done = i < step;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
                style={{ background: active ? "var(--accent)" : done ? "var(--accent-soft)" : "var(--bg-hover)", color: active ? "#fff" : done ? "var(--accent)" : "var(--text-muted)", border: "1px solid var(--border)" }}>{done ? "✓" : i + 1}</div>
              <div className="flex-1 rounded-lg px-3 py-1.5 transition-all" style={{ background: active ? "var(--accent-soft)" : "transparent", border: `1px solid ${active ? "rgba(91,140,255,0.3)" : "transparent"}` }}>
                <div className="text-sm font-medium" style={{ color: active || done ? "var(--text-primary)" : "var(--text-secondary)" }}>{s.t}</div>
                {active && <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.d}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => { setStep(0); setPlaying(true); }} className="btn-primary px-3 py-1.5 text-xs">▶ Type &amp; Enter</button>
        <button onClick={() => setStep((s) => Math.min(STAGES.length - 1, s + 1))} className="btn-ghost px-3 py-1.5 text-xs">Step</button>
        <button onClick={() => { setStep(-1); setPlaying(false); }} className="btn-ghost px-3 py-1.5 text-xs">Reset</button>
      </div>
    </div>
  );
}
