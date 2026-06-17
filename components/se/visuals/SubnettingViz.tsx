"use client";
import { useState } from "react";

export default function SubnettingViz() {
  const [prefix, setPrefix] = useState(24);
  const ip = [192, 168, 1, 130];
  const hostBits = 32 - prefix;
  const totalHosts = Math.pow(2, hostBits);
  const usable = hostBits >= 1 ? totalHosts - 2 : 0;

  // mask octets
  const maskBitsArr = Array.from({ length: 32 }, (_, i) => (i < prefix ? 1 : 0));
  const maskOctets = [0, 1, 2, 3].map((o) => maskBitsArr.slice(o * 8, o * 8 + 8).reduce((a: number, b: number) => a * 2 + b, 0));
  const ipBits = ip.flatMap((o) => Array.from({ length: 8 }, (_, i) => (o >> (7 - i)) & 1));
  const netBits = ipBits.map((b, i) => (i < prefix ? b : 0));
  const netOctets = [0, 1, 2, 3].map((o) => netBits.slice(o * 8, o * 8 + 8).reduce((a: number, b: number) => a * 2 + b, 0));
  const bcastBits = ipBits.map((b, i) => (i < prefix ? b : 1));
  const bcastOctets = [0, 1, 2, 3].map((o) => bcastBits.slice(o * 8, o * 8 + 8).reduce((a: number, b: number) => a * 2 + b, 0));

  return (
    <div>
      <div className="mb-3">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>IP 192.168.1.130 / <b style={{ color: "var(--accent)" }}>{prefix}</b></label>
        <input type="range" min={8} max={30} value={prefix} onChange={(e) => setPrefix(+e.target.value)} className="w-full" />
      </div>
      {/* bit ruler */}
      <div className="flex flex-wrap gap-0.5 mb-3 font-mono">
        {ipBits.map((b, i) => (
          <span key={i} className="text-xs px-0.5" style={{ color: i < prefix ? "var(--accent)" : "var(--text-muted)", borderBottom: `2px solid ${i < prefix ? "var(--accent)" : "var(--border)"}`, marginRight: (i + 1) % 8 === 0 ? 6 : 0 }}>{b}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          ["Subnet mask", maskOctets.join("."), "var(--text-secondary)"],
          ["Network", netOctets.join("."), "var(--accent)"],
          ["Broadcast", bcastOctets.join("."), "var(--accent-orange)"],
          ["Usable hosts", usable.toLocaleString(), "var(--accent-green)"],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-md px-3 py-2" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
            <div style={{ color: "var(--text-muted)" }}>{k}</div>
            <div className="font-mono font-semibold" style={{ color: c as string }}>{v}</div>
          </div>
        ))}
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>The /{prefix} prefix = {prefix} network bits (blue) + {hostBits} host bits. Network &amp; broadcast addresses aren't usable, hence −2.</p>
    </div>
  );
}
