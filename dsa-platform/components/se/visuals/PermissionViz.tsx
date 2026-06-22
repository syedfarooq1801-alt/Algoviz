"use client";
import { useState } from "react";

type Bits = { r: boolean; w: boolean; x: boolean };
const blank = (): Bits => ({ r: false, w: false, x: false });

export default function PermissionViz() {
  const [perms, setPerms] = useState<{ user: Bits; group: Bits; other: Bits }>({
    user: { r: true, w: true, x: false },
    group: { r: true, w: false, x: false },
    other: { r: true, w: false, x: false },
  });

  const toggle = (who: "user" | "group" | "other", bit: keyof Bits) =>
    setPerms((p) => ({ ...p, [who]: { ...p[who], [bit]: !p[who][bit] } }));

  const octalDigit = (b: Bits) => (b.r ? 4 : 0) + (b.w ? 2 : 0) + (b.x ? 1 : 0);
  const sym = (b: Bits) => `${b.r ? "r" : "-"}${b.w ? "w" : "-"}${b.x ? "x" : "-"}`;
  const octal = `${octalDigit(perms.user)}${octalDigit(perms.group)}${octalDigit(perms.other)}`;
  const symbolic = `${sym(perms.user)}${sym(perms.group)}${sym(perms.other)}`;

  const groups: Array<["user" | "group" | "other", string]> = [["user", "Owner"], ["group", "Group"], ["other", "Other"]];

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {groups.map(([who, label]) => (
          <div key={who} className="rounded-lg p-3" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
            <div className="text-xs font-semibold mb-2 text-center" style={{ color: "var(--text-secondary)" }}>{label}</div>
            <div className="flex justify-center gap-1.5">
              {(["r", "w", "x"] as const).map((bit) => {
                const on = perms[who][bit];
                return (
                  <button key={bit} onClick={() => toggle(who, bit)}
                    className="w-9 h-9 rounded-md text-sm font-bold font-mono transition-all"
                    style={{ background: on ? "var(--accent-soft)" : "var(--bg-card)", color: on ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${on ? "rgba(91,140,255,0.4)" : "var(--border)"}` }}>
                    {bit}
                  </button>
                );
              })}
            </div>
            <div className="text-center text-xs mt-2 font-mono" style={{ color: "var(--text-muted)" }}>{octalDigit(perms[who])}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 rounded-lg py-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-center">
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>chmod</div>
          <div className="text-xl font-bold font-mono" style={{ color: "var(--accent)" }}>{octal}</div>
        </div>
        <div className="text-center">
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>symbolic</div>
          <div className="text-xl font-bold font-mono" style={{ color: "var(--accent-green)" }}>-{symbolic}</div>
        </div>
      </div>
      <p className="text-xs mt-2 text-center" style={{ color: "var(--text-muted)" }}>Click bits to toggle. r=4, w=2, x=1 — add them per column to get each octal digit.</p>
    </div>
  );
}
