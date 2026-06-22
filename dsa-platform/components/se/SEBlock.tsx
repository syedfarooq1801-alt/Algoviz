"use client";
import { useState } from "react";
import type { Block } from "@/data/seBasics";

const CALLOUT: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  analogy: { label: "Analogy", icon: "A", color: "var(--accent-green)", bg: "rgba(45,212,160,0.045)" },
  "memory-trick": { label: "Memory Trick", icon: "M", color: "var(--accent-orange)", bg: "rgba(245,166,35,0.045)" },
  example: { label: "Example", icon: "E", color: "var(--accent)", bg: "rgba(91,140,255,0.04)" },
  "common-mistake": { label: "Common Mistake", icon: "!", color: "var(--accent-red)", bg: "rgba(240,82,75,0.045)" },
  placement: { label: "Placement Perspective", icon: "P", color: "var(--accent)", bg: "rgba(79,140,255,0.04)" },
};

export default function SEBlock({ block }: { block: Block }) {
  if (block.type === "para") {
    return <p className="mb-5 text-[15px] leading-8" style={{ color: "var(--text-secondary)" }}>{block.text}</p>;
  }

  if (block.type === "heading") {
    return <h3 className="mb-4 mt-12 text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{block.text}</h3>;
  }

  if (block.type === "pre") {
    return (
      <pre className="my-7 overflow-x-auto text-xs" style={{ lineHeight: 1.6 }}>
        <code>{block.text}</code>
      </pre>
    );
  }

  if (block.type === "interview") {
    return <InterviewBlock qas={block.qas ?? []} />;
  }

  const callout = CALLOUT[block.type];
  if (!callout) return <p className="mb-5 text-[15px] leading-8" style={{ color: "var(--text-secondary)" }}>{block.text}</p>;

  return (
    <aside className="my-7 px-4 py-3" style={{ maxWidth: "var(--measure, 68ch)", background: callout.bg, borderLeft: `2px solid ${callout.color}` }}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-flex h-4 w-4 items-center justify-center rounded-sm text-[10px] font-semibold"
          style={{ background: "rgba(255,255,255,0.06)", color: callout.color }}
          aria-hidden="true"
        >
          {callout.icon}
        </span>
        <div className="text-[11px] font-medium" style={{ color: callout.color }}>{callout.label}</div>
      </div>
      <p className="text-[14px] leading-7" style={{ color: "var(--text-secondary)" }}>{block.text}</p>
    </aside>
  );
}

function InterviewBlock({ qas }: { qas: { q: string; a: string }[] }) {
  return (
    <section className="my-9 px-4 py-3" style={{ maxWidth: "var(--measure, 68ch)", background: "rgba(245,166,35,0.04)", borderLeft: "2px solid var(--accent-orange)" }}>
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex h-4 w-4 items-center justify-center rounded-sm text-[10px] font-semibold"
          style={{ background: "rgba(255,255,255,0.06)", color: "var(--accent-orange)" }}
          aria-hidden="true"
        >
          Q
        </span>
        <div className="text-[11px] font-medium" style={{ color: "var(--accent-orange)" }}>
          Interview Questions / {qas.length}
        </div>
      </div>
      <div>
        {qas.map((qa, i) => <QA key={i} qa={qa} />)}
      </div>
    </section>
  );
}

function QA({ qa }: { qa: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex w-full items-start gap-2 py-2 text-left transition-colors">
        <span className="mt-[3px] text-[10px]" style={{ color: "var(--accent-orange)" }}>{open ? "v" : ">"}</span>
        <span className="text-[14px] font-medium leading-6" style={{ color: "var(--text-primary)" }}>{qa.q}</span>
      </button>
      {open && qa.a && (
        <p className="pb-3 pl-5 text-[14px] leading-7" style={{ color: "var(--text-secondary)" }}>{qa.a}</p>
      )}
    </div>
  );
}
