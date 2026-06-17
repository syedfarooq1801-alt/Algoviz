"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PATTERNS } from "@/data/problems";
import { getAllConcepts, getAllCaseStudyRefs } from "@/data/systemDesign";
import { SE_SUBJECTS } from "@/data/seBasics";

interface Item { id: string; label: string; group: string; href: string; hint?: string; }

function buildIndex(): Item[] {
  const items: Item[] = [];
  // top-level destinations
  items.push(
    { id: "home", label: "DSA Patterns", group: "Go to", href: "/" },
    { id: "sd", label: "System Design", group: "Go to", href: "/system-design" },
    { id: "se", label: "SE Basics", group: "Go to", href: "/se-basics" },
    { id: "roadmap", label: "Study Plan / Roadmap", group: "Go to", href: "/study-plan" },
    { id: "mock", label: "Mock Interview", group: "Go to", href: "/mock" },
    { id: "behavioral", label: "Behavioral Prep", group: "Go to", href: "/behavioral" },
    { id: "profile", label: "Your Progress", group: "Go to", href: "/profile" },
  );
  for (const p of PATTERNS) {
    items.push({ id: `pat-${p.id}`, label: p.title, group: "Patterns", href: `/patterns/${p.id}`, hint: `${p.problems.length} problems` });
    for (const prob of p.problems) {
      items.push({ id: `prob-${prob.id}`, label: prob.title, group: "Problems", href: prob.hasVisualization ? `/visualizations/${prob.id}` : `/problems/${prob.id}`, hint: `${p.title} · ${prob.difficulty}` });
    }
  }
  for (const c of getAllConcepts()) items.push({ id: `sd-${c.id}`, label: c.title, group: "SD Concepts", href: `/system-design/concept/${c.id}`, hint: c.difficulty });
  for (const cs of getAllCaseStudyRefs()) items.push({ id: `cs-${cs.id}`, label: cs.title, group: "Case Studies", href: `/system-design/case-study/${cs.id}`, hint: cs.difficulty });
  for (const s of SE_SUBJECTS) for (const ch of s.chapters) items.push({ id: `se-${s.id}-${ch.id}`, label: ch.title, group: `SE · ${s.title}`, href: `/se-basics/${s.id}#${ch.id}` });
  return items;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const index = useMemo(buildIndex, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { if (open) { setQ(""); setActive(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return index.filter((i) => i.group === "Go to" || i.group === "Patterns").slice(0, 12);
    const scored = index
      .map((i) => {
        const l = i.label.toLowerCase();
        let score = -1;
        if (l === query) score = 100;
        else if (l.startsWith(query)) score = 80;
        else if (l.includes(query)) score = 50;
        else if (query.split(" ").every((w) => l.includes(w))) score = 30;
        return { i, score };
      })
      .filter((x) => x.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .map((x) => x.i);
    return scored;
  }, [q, index]);

  useEffect(() => { setActive(0); }, [q]);

  const go = useCallback((item: Item) => { setOpen(false); router.push(item.href); }, [router]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  // group ordering
  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <span style={{ color: "var(--text-muted)" }}>⌕</span>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown}
            placeholder="Search problems, patterns, concepts, chapters…"
            className="flex-1 bg-transparent outline-none text-base" style={{ color: "var(--text-primary)" }} />
          <kbd>esc</kbd>
        </div>
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto py-2">
          {results.length === 0 && <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No matches for “{q}”</div>}
          {results.map((item, i) => {
            const showGroup = item.group !== lastGroup;
            lastGroup = item.group;
            return (
              <div key={item.id}>
                {showGroup && <div className="px-4 pt-3 pb-1 eyebrow">{item.group}</div>}
                <button data-idx={i} onMouseEnter={() => setActive(i)} onClick={() => go(item)}
                  className="w-full text-left px-4 py-2 flex items-center gap-3"
                  style={{ background: i === active ? "var(--accent-soft)" : "transparent" }}>
                  <span className="text-sm flex-1 truncate" style={{ color: i === active ? "var(--accent)" : "var(--text-primary)" }}>{item.label}</span>
                  {item.hint && <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{item.hint}</span>}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 px-4 py-2.5 text-xs" style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
          <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span className="ml-auto">AlgoVis Command</span>
        </div>
      </div>
    </div>
  );
}
