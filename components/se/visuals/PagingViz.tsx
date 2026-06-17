"use client";
import { useState } from "react";

// logical pages -> page table -> physical frames
const PAGE_TABLE = [2, 5, 0, 7]; // page i -> frame
const PAGES = PAGE_TABLE.length;
const FRAMES = 8;

export default function PagingViz() {
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(3);
  const PAGE_SIZE = 4;
  const frame = PAGE_TABLE[page];
  const physAddr = frame * PAGE_SIZE + offset;

  return (
    <div>
      <div className="flex gap-2 mb-3 items-end flex-wrap">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>Page
          <select value={page} onChange={(e) => setPage(+e.target.value)} className="ml-1 px-2 py-1 rounded" style={{ background: "var(--bg-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            {Array.from({ length: PAGES }, (_, i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>Offset
          <select value={offset} onChange={(e) => setOffset(+e.target.value)} className="ml-1 px-2 py-1 rounded" style={{ background: "var(--bg-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            {Array.from({ length: PAGE_SIZE }, (_, i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          logical (p={page}, d={offset}) → physical addr <b style={{ color: "var(--accent-green)" }}>{physAddr}</b> = frame {frame}×{PAGE_SIZE}+{offset}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* logical pages */}
        <div>
          <div className="text-xs mb-1 text-center" style={{ color: "var(--text-muted)" }}>Logical pages</div>
          {Array.from({ length: PAGES }, (_, i) => (
            <div key={i} className="text-xs text-center py-1.5 mb-1 rounded font-mono" style={{ background: i === page ? "var(--accent-soft)" : "var(--bg-hover)", color: i === page ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${i === page ? "rgba(91,140,255,0.4)" : "var(--border)"}` }}>P{i}</div>
          ))}
        </div>
        {/* page table */}
        <div>
          <div className="text-xs mb-1 text-center" style={{ color: "var(--text-muted)" }}>Page table</div>
          {PAGE_TABLE.map((f, i) => (
            <div key={i} className="text-xs text-center py-1.5 mb-1 rounded font-mono" style={{ background: i === page ? "rgba(245,166,35,0.12)" : "var(--bg-hover)", color: i === page ? "var(--accent-orange)" : "var(--text-muted)", border: `1px solid ${i === page ? "rgba(245,166,35,0.4)" : "var(--border)"}` }}>P{i}→F{f}</div>
          ))}
        </div>
        {/* physical frames */}
        <div>
          <div className="text-xs mb-1 text-center" style={{ color: "var(--text-muted)" }}>Physical frames</div>
          {Array.from({ length: FRAMES }, (_, i) => {
            const used = PAGE_TABLE.indexOf(i);
            const hit = i === frame;
            return (
              <div key={i} className="text-xs text-center py-1 mb-0.5 rounded font-mono" style={{ background: hit ? "rgba(45,212,160,0.14)" : used >= 0 ? "var(--bg-card)" : "transparent", color: hit ? "var(--accent-green)" : used >= 0 ? "var(--text-secondary)" : "var(--text-muted)", border: `1px solid ${hit ? "rgba(45,212,160,0.4)" : "var(--border-subtle)"}` }}>
                F{i}{used >= 0 ? ` ·P${used}` : ""}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>Paging splits the address into (page, offset). The page table maps each page to any frame — so memory need not be contiguous.</p>
    </div>
  );
}
