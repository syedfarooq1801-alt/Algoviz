"use client";
import { useState } from "react";
import { SDChapter, SDConcept, CaseStudyRef } from "@/data/systemDesign";
import { useSDStore } from "@/lib/sdStore";
import Link from "next/link";

const patternColors: Record<string, { ring: string; glow: string; text: string }> = {
  blue:    { ring: "#4F8CFF", glow: "rgba(79,140,255,0.08)",  text: "#4F8CFF" },
  green:   { ring: "#2FBF71", glow: "rgba(47,191,113,0.08)",   text: "#2FBF71" },
  purple:  { ring: "#4F8CFF", glow: "rgba(79,140,255,0.08)",  text: "#4F8CFF" },
  orange:  { ring: "#F5A524", glow: "rgba(245,165,36,0.08)",  text: "#F5A524" },
  cyan:    { ring: "#4F8CFF", glow: "rgba(79,140,255,0.08)",   text: "#4F8CFF" },
  yellow:  { ring: "#F5A524", glow: "rgba(245,165,36,0.08)",   text: "#F5A524" },
  red:     { ring: "#ef4444", glow: "rgba(239,68,68,0.08)",   text: "#ef4444" },
  violet:  { ring: "#8b5cf6", glow: "rgba(139,92,246,0.08)",  text: "#8b5cf6" },
  teal:    { ring: "#14b8a6", glow: "rgba(20,184,166,0.08)",  text: "#14b8a6" },
  amber:   { ring: "#F5A524", glow: "rgba(245,158,11,0.08)",  text: "#F5A524" },
};

const difficultyColor: Record<string, string> = {
  Fundamental: "#2FBF71",
  Intermediate: "#F5A524",
  Advanced: "#ef4444",
};

interface Props {
  chapter: SDChapter;
  index: number;
  defaultOpen?: boolean;
}

export default function SDChapterSection({ chapter, index, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const { mastered } = useSDStore();

  const colors = patternColors[chapter.color] ?? patternColors.blue;
  const allItems = [
    ...chapter.concepts.map((c) => c.id),
    ...(chapter.caseStudies ?? []).map((cs) => cs.id),
  ];
  const masteredCount = allItems.filter((id) => mastered.has(id)).length;
  const total = allItems.length;
  const pct = total > 0 ? Math.round((masteredCount / total) * 100) : 0;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: open ? `1px solid ${colors.ring}40` : "1px solid var(--border-subtle)",
        background: open ? colors.glow : "var(--bg-card)",
        opacity: 0,
        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div
          className="shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>

        <span className="text-lg shrink-0">{chapter.icon}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: open ? colors.text : "var(--text-primary)" }}>
              {chapter.title}
            </span>
            {(chapter.caseStudies?.length ?? 0) > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(79,140,255,0.1)", color: "#4F8CFF", border: "1px solid rgba(79,140,255,0.25)" }}>
                {chapter.caseStudies!.length} case studies
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5 hidden sm:block truncate" style={{ color: "var(--text-muted)" }}>
            {chapter.description}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:block">
            <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${colors.ring}, ${colors.ring}aa)` }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)", minWidth: "42px", textAlign: "right" }}>
            <span style={{ color: masteredCount > 0 ? colors.ring : "var(--text-muted)" }}>{masteredCount}</span>
            <span style={{ color: "var(--text-muted)" }}>/{total}</span>
          </span>
          <Link
            href={`/system-design/${chapter.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs px-2 py-1 rounded-md transition-all hidden md:block"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = colors.text; (e.currentTarget as HTMLElement).style.borderColor = `${colors.ring}50`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            Study Chapter →
          </Link>
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="animate-slide-down">
          {/* Concepts */}
          {chapter.concepts.length > 0 && (
            <>
              <div
                className="flex items-center gap-3 px-4 py-2 text-xs font-medium border-t border-b"
                style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)", background: "rgba(0,0,0,0.2)" }}
              >
                <div className="w-4 shrink-0" />
                <div className="flex-1">Concept</div>
                <div className="shrink-0 w-24">Difficulty</div>
                <div className="shrink-0 w-8 text-center">Viz</div>
                <div className="shrink-0 w-6">✓</div>
              </div>
              {chapter.concepts.map((concept, i) => (
                <ConceptRow key={concept.id} concept={concept} index={i} />
              ))}
            </>
          )}

          {/* Case Studies */}
          {(chapter.caseStudies?.length ?? 0) > 0 && (
            <>
              <div
                className="flex items-center gap-3 px-4 py-2 text-xs font-medium border-t border-b"
                style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)", background: "rgba(0,0,0,0.2)", marginTop: chapter.concepts.length > 0 ? 8 : 0 }}
              >
                <div className="w-4 shrink-0" />
                <div className="flex-1">Case Study</div>
                <div className="shrink-0 w-20">Level</div>
                <div className="shrink-0 w-24 hidden sm:block">Companies</div>
                <div className="shrink-0 w-8 text-center">Viz</div>
                <div className="shrink-0 w-6">✓</div>
              </div>
              {chapter.caseStudies!.map((cs, i) => (
                <CaseStudyRow key={cs.id} cs={cs} index={i} />
              ))}
            </>
          )}

          <div
            className="px-4 py-2 flex items-center justify-between text-xs"
            style={{ background: "rgba(0,0,0,0.15)", color: "var(--text-muted)", borderTop: "1px solid var(--border-subtle)" }}
          >
            <span>{masteredCount}/{total} mastered · {pct}%</span>
            <Link href={`/system-design/${chapter.id}`} className="hover:text-purple-400 transition-colors">
              Study full chapter →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ConceptRow({ concept, index }: { concept: SDConcept; index: number }) {
  const { mastered, toggleMastered } = useSDStore();
  const isMastered = mastered.has(concept.id);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 border-b text-sm"
      style={{ borderColor: "var(--border-subtle)", opacity: 0, animation: `fadeInUp 0.3s ease-out ${index * 0.02}s forwards` }}
    >
      <button
        type="button"
        onClick={() => toggleMastered(concept.id)}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
        style={{
          border: isMastered ? "1.5px solid #16a34a" : "1.5px solid var(--text-muted)",
          background: isMastered ? "#16a34a" : "transparent",
          boxShadow: isMastered ? "0 0 0 4px rgba(22,163,74,0.2)" : undefined,
        }}
      >
        {isMastered ? (
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M2 7.5L6 11.5L14 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="w-3 h-3 rounded-full" style={{ background: "var(--text-muted)", opacity: 0.65 }} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <Link
          href={`/system-design/concept/${concept.id}`}
          className="font-medium hover:text-purple-400 transition-colors truncate block"
          style={{ color: isMastered ? "var(--text-muted)" : "var(--text-primary)", textDecoration: isMastered ? "line-through" : "none", opacity: isMastered ? 0.6 : 1 }}
        >
          {concept.title}
        </Link>
        <p className="text-xs truncate hidden sm:block" style={{ color: "var(--text-muted)" }}>{concept.summary}</p>
      </div>

      <span
        className="shrink-0 w-24 flex items-center justify-center text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ color: difficultyColor[concept.difficulty], background: `${difficultyColor[concept.difficulty]}18` }}
      >
        {concept.difficulty}
      </span>

      <div className="shrink-0 w-8 flex justify-center">
        {concept.hasVisualization ? (
          <Link href={`/system-design/concept/${concept.id}`} title="Has animation" className="hover:scale-110 transition-transform">
            <span style={{ color: "#4F8CFF" }}>▶</span>
          </Link>
        ) : (
          <span style={{ color: "var(--border)" }}>▶</span>
        )}
      </div>

      <div className="shrink-0 w-6 flex justify-center">
        <span style={{ color: isMastered ? "#2FBF71" : "var(--border)", fontSize: 14 }}>✓</span>
      </div>
    </div>
  );
}

const levelColor: Record<string, string> = {
  Junior: "#2FBF71",
  Mid: "#4F8CFF",
  Senior: "#F5A524",
  Staff: "#ef4444",
};

function CaseStudyRow({ cs, index }: { cs: CaseStudyRef; index: number }) {
  const { mastered, toggleMastered } = useSDStore();
  const isMastered = mastered.has(cs.id);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 border-b text-sm"
      style={{ borderColor: "var(--border-subtle)", opacity: 0, animation: `fadeInUp 0.3s ease-out ${index * 0.02}s forwards` }}
    >
      <button
        type="button"
        onClick={() => toggleMastered(cs.id)}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
        style={{
          border: isMastered ? "1.5px solid #16a34a" : "1.5px solid var(--text-muted)",
          background: isMastered ? "#16a34a" : "transparent",
        }}
      >
        {isMastered ? (
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M2 7.5L6 11.5L14 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="w-3 h-3 rounded-full" style={{ background: "var(--text-muted)", opacity: 0.65 }} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <Link
          href={`/system-design/case-study/${cs.id}`}
          className="font-medium hover:text-purple-400 transition-colors truncate block"
          style={{ color: isMastered ? "var(--text-muted)" : "var(--text-primary)" }}
        >
          {cs.title}
        </Link>
      </div>

      <span
        className="shrink-0 w-20 flex items-center justify-center text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ color: levelColor[cs.difficulty], background: `${levelColor[cs.difficulty]}18` }}
      >
        {cs.difficulty}
      </span>

      <div className="shrink-0 w-24 hidden sm:flex gap-1 flex-wrap">
        {cs.companies.slice(0, 2).map((c) => (
          <span key={c} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>{c}</span>
        ))}
      </div>

      <div className="shrink-0 w-8 flex justify-center">
        {cs.hasVisualization ? (
          <span style={{ color: "#4F8CFF" }}>▶</span>
        ) : (
          <span style={{ color: "var(--border)" }}>▶</span>
        )}
      </div>

      <div className="shrink-0 w-6 flex justify-center">
        <span style={{ color: isMastered ? "#2FBF71" : "var(--border)", fontSize: 14 }}>✓</span>
      </div>
    </div>
  );
}
