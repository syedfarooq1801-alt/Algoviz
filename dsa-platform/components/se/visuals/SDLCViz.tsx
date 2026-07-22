"use client";
import { useState } from "react";

const WATERFALL = ["Requirements", "Design", "Implementation", "Testing", "Deployment", "Maintenance"];
const AGILE = ["Plan", "Design", "Build", "Test", "Review"];

export default function SDLCViz() {
  const [mode, setMode] = useState<"waterfall" | "agile">("agile");
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setMode("waterfall"); setActive(0); }} className="px-3 py-1.5 rounded-md text-xs font-medium" style={{ background: mode === "waterfall" ? "var(--accent-soft)" : "var(--bg-hover)", color: mode === "waterfall" ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${mode === "waterfall" ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>Waterfall</button>
        <button onClick={() => { setMode("agile"); setActive(0); }} className="px-3 py-1.5 rounded-md text-xs font-medium" style={{ background: mode === "agile" ? "rgba(45,212,160,0.14)" : "var(--bg-hover)", color: mode === "agile" ? "var(--accent-green)" : "var(--text-muted)", border: `1px solid ${mode === "agile" ? "rgba(45,212,160,0.4)" : "var(--border)"}` }}>Agile / Scrum</button>
      </div>

      {mode === "waterfall" ? (
        <div className="space-y-1">
          {WATERFALL.map((s, i) => (
            <div key={s} className="rounded-lg px-3 py-2 text-sm" style={{ marginLeft: i * 16, background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              {i + 1}. {s} {i < WATERFALL.length - 1 && <span style={{ color: "var(--text-muted)" }}>↓</span>}
            </div>
          ))}
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Linear &amp; sequential — each phase finishes before the next. Simple, but late feedback; costly to change requirements.</p>
        </div>
      ) : (
        <div>
          <svg viewBox="0 0 220 220" width="200" style={{ display: "block", margin: "0 auto" }}>
            {AGILE.map((s, i) => {
              const ang = (i / AGILE.length) * 2 * Math.PI - Math.PI / 2;
              const x = 110 + 80 * Math.cos(ang), y = 110 + 80 * Math.sin(ang);
              const on = i === active;
              return (
                <g
                  key={s}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActive(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select phase ${s}`}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); } }}
                >
                  <circle cx={x} cy={y} r="26" fill={on ? "rgba(45,212,160,0.18)" : "var(--bg-hover)"} stroke={on ? "var(--accent-green)" : "var(--border)"} strokeWidth="1.5" />
                  <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fontWeight="600" fill={on ? "var(--accent-green)" : "var(--text-secondary)"}>{s}</text>
                </g>
              );
            })}
            <text x="110" y="108" textAnchor="middle" fontSize="11" fill="var(--accent-green)" fontWeight="700">Sprint</text>
            <text x="110" y="122" textAnchor="middle" fontSize="9" fill="var(--text-muted)">1–4 weeks, repeat</text>
          </svg>
          <p className="text-xs mt-2 text-center" style={{ color: "var(--text-muted)" }}>Iterative loops — ship a working increment each sprint, get feedback, adapt. Click a phase.</p>
        </div>
      )}
    </div>
  );
}
