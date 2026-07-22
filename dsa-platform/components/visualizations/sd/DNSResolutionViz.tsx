"use client";
import { useEffect, useState } from "react";

const STEPS = [
  { from: "Browser", to: "Cache", label: "1. Check local cache", color: "#22c55e", result: "MISS" },
  { from: "Browser", to: "OS Cache", label: "2. Check OS /etc/hosts + cache", color: "#4f8ef7", result: "MISS" },
  { from: "Browser", to: "Recursive Resolver", label: "3. Ask ISP resolver", color: "#a855f7", result: "→" },
  { from: "Recursive Resolver", to: "Root Server", label: "4. Root server (.com?)", color: "#f97316", result: "→ TLD .com" },
  { from: "Recursive Resolver", to: ".com TLD", label: "5. TLD server (example.com?)", color: "#f59e0b", result: "→ NS record" },
  { from: "Recursive Resolver", to: "Authoritative NS", label: "6. Authoritative DNS (A record)", color: "#06b6d4", result: "93.184.216.34" },
  { from: "Browser", to: "Server", label: "7. TCP connect to IP", color: "#22c55e", result: "Connected!" },
];

const NODES = [
  { id: "Browser",              x: 20, y: 50,  icon: "🌐", color: "#22c55e" },
  { id: "Cache",                x: 20, y: 120, icon: "💾", color: "#f59e0b" },
  { id: "OS Cache",             x: 20, y: 190, icon: "🖥️", color: "#4f8ef7" },
  { id: "Recursive Resolver",   x: 130, y: 120, icon: "🔍", color: "#a855f7" },
  { id: "Root Server",          x: 240, y: 50,  icon: "🌍", color: "#f97316" },
  { id: ".com TLD",             x: 240, y: 120, icon: "📋", color: "#f59e0b" },
  { id: "Authoritative NS",     x: 240, y: 190, icon: "🗂️", color: "#06b6d4" },
  { id: "Server",               x: 130, y: 220, icon: "🖧",  color: "#22c55e" },
];

export default function DNSResolutionViz() {
  const [activeStep, setActiveStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [domain, setDomain] = useState("example.com");
  const [cached, setCached] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= STEPS.length - 1) {
          setDone(true);
          setCached(true);
          setTimeout(() => {
            setActiveStep(-1);
            setDone(false);
            setDomain(["google.com", "github.com", "example.com"][Math.floor(prev / 7) % 3]);
          }, 2000);
          return prev;
        }
        setDone(false);
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const step = STEPS[activeStep];
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="space-y-4">
      {/* Domain bar */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Resolving:</span>
        <span className="font-mono text-sm font-bold" style={{ color: "#4f8ef7" }}>{domain}</span>
        {cached && <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>✓ Cached (TTL 300s)</span>}
      </div>

      {/* Diagram */}
      <div className="relative rounded-xl overflow-hidden" style={{ height: 280, background: "rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}>
        <svg width="100%" height="100%" viewBox="0 0 300 260" role="img" aria-label="DNS resolution step diagram">
          {/* Static connection lines */}
          <line x1={130} y1={120} x2={240} y2={50} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={130} y1={120} x2={240} y2={120} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={130} y1={120} x2={240} y2={190} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />

          {/* Active step arrow */}
          {step && (() => {
            const from = nodeMap[step.from];
            const to = nodeMap[step.to];
            if (!from || !to) return null;
            return (
              <g>
                <line x1={from.x + 20} y1={from.y + 12} x2={to.x + 20} y2={to.y + 12}
                  stroke={step.color} strokeWidth={2} strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 4px ${step.color})` }} />
                <circle cx={(from.x + to.x) / 2 + 20} cy={(from.y + to.y) / 2 + 12} r={3} fill={step.color} />
              </g>
            );
          })()}

          {/* Nodes */}
          {NODES.map((n) => {
            const isActive = step && (step.from === n.id || step.to === n.id);
            return (
              <g key={n.id}>
                <rect x={n.x} y={n.y} width={60} height={36} rx={8}
                  fill={isActive ? `${n.color}20` : "rgba(0,0,0,0.2)"}
                  stroke={isActive ? n.color : "var(--border)"} strokeWidth={isActive ? 2 : 1}
                  style={{ filter: isActive ? `drop-shadow(0 0 8px ${n.color})` : "none" }} />
                <text x={n.x + 8} y={n.y + 14} fontSize={11}>{n.icon}</text>
                <text x={n.x + 30} y={n.y + 14} textAnchor="middle" fontSize={7} fill={isActive ? n.color : "var(--text-muted)"}>{n.id.split(" ")[0]}</text>
                <text x={n.x + 30} y={n.y + 26} textAnchor="middle" fontSize={7} fill={isActive ? n.color : "var(--text-muted)"}>{n.id.split(" ").slice(1).join(" ")}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step indicator */}
      <div className="rounded-lg px-4 py-2.5 text-xs transition-all" style={{ background: done ? "rgba(34,197,94,0.1)" : "rgba(0,0,0,0.15)", border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "var(--border-subtle)"}`, minHeight: 36 }}>
        {step ? (
          <span style={{ color: step.color }}><strong>Step {activeStep + 1}:</strong> {step.label} → <span style={{ color: "var(--text-secondary)" }}>{step.result}</span></span>
        ) : done ? (
          <span style={{ color: "#22c55e" }}>✓ Resolution complete. IP cached for TTL duration.</span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>Starting DNS resolution...</span>
        )}
      </div>
    </div>
  );
}
