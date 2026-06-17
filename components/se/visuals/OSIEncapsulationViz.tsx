"use client";
import { useState } from "react";

const LAYERS = [
  { n: 7, name: "Application", pdu: "Data", header: "—", color: "var(--accent)" },
  { n: 6, name: "Presentation", pdu: "Data", header: "—", color: "var(--accent)" },
  { n: 5, name: "Session", pdu: "Data", header: "—", color: "var(--accent)" },
  { n: 4, name: "Transport", pdu: "Segment", header: "TCP/UDP hdr", color: "var(--accent-green)" },
  { n: 3, name: "Network", pdu: "Packet", header: "IP hdr", color: "var(--accent-orange)" },
  { n: 2, name: "Data Link", pdu: "Frame", header: "MAC hdr + trailer", color: "var(--accent-purple)" },
  { n: 1, name: "Physical", pdu: "Bits", header: "—", color: "var(--text-secondary)" },
];

export default function OSIEncapsulationViz() {
  const [dir, setDir] = useState<"down" | "up">("down");
  const list = dir === "down" ? LAYERS : [...LAYERS].reverse();

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setDir("down")} className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ background: dir === "down" ? "var(--accent-soft)" : "var(--bg-hover)", color: dir === "down" ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${dir === "down" ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>
          ↓ Encapsulation (send)
        </button>
        <button onClick={() => setDir("up")} className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ background: dir === "up" ? "var(--accent-soft)" : "var(--bg-hover)", color: dir === "up" ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${dir === "up" ? "rgba(91,140,255,0.35)" : "var(--border)"}` }}>
          ↑ Decapsulation (receive)
        </button>
      </div>
      <div className="space-y-1.5">
        {list.map((l, i) => (
          <div key={l.n} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
            <span className="text-xs font-mono w-5 text-center shrink-0" style={{ color: l.color }}>{l.n}</span>
            <span className="text-sm font-medium w-24 shrink-0" style={{ color: "var(--text-primary)" }}>{l.name}</span>
            {/* nested encapsulation bar: deeper layers wrap more headers */}
            <div className="flex-1 flex items-center gap-0.5 overflow-hidden">
              {Array.from({ length: dir === "down" ? i : (LAYERS.length - 1 - i) }).map((_, k) => (
                <span key={k} className="text-[10px] px-1 py-0.5 rounded" style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>H</span>
              ))}
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${l.color}22`, color: l.color }}>{l.pdu}</span>
            </div>
            <span className="text-xs shrink-0 hidden sm:block" style={{ color: "var(--text-muted)" }}>{l.header}</span>
          </div>
        ))}
      </div>
      <p className="text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
        {dir === "down"
          ? "Sending: each layer wraps the data in its own header (H). By the wire it's a fully-framed bitstream."
          : "Receiving: each layer strips its header back off until the app sees the original data."}
      </p>
    </div>
  );
}
