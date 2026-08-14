"use client";
import { useState } from "react";

/**
 * Progressive disclosure for secondary material. Closed by default on
 * purpose: the main flow should read as one short narrative, and everything
 * that is reference-rather-than-narrative lives behind one of these so it
 * stops competing with the explanation for attention.
 */
export default function Collapsible({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left"
        style={{ background: open ? "var(--bg-secondary)" : "transparent", cursor: "pointer", border: "none" }}
      >
        <span
          className="text-xs"
          style={{
            color: "var(--text-muted)",
            transition: "transform 0.15s",
            transform: open ? "rotate(90deg)" : "none",
            display: "inline-block",
          }}
        >
          ▶
        </span>
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{title}</span>
        {subtitle && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{subtitle}</span>
        )}
      </button>
      {open && <div className="px-4 pt-1 pb-4 space-y-5">{children}</div>}
    </div>
  );
}

/**
 * A numbered step in the main explanation flow. The number is the point —
 * it makes the page read as a sequence you walk down, not a pile of
 * independent panels you have to triage.
 */
export function Beat({
  n,
  title,
  accent,
  children,
}: {
  n: number;
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  const color = accent ?? "var(--accent)";
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-2.5">
        <span
          className="flex items-center justify-center shrink-0 text-xs font-bold rounded-full"
          style={{ width: 20, height: 20, background: `${color}22`, color, fontFamily: "var(--font-mono)" }}
        >
          {n}
        </span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
      </div>
      <div className="pl-[30px]">{children}</div>
    </section>
  );
}
