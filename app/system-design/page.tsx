"use client";
import { useState, useMemo } from "react";
import { SD_CHAPTERS, getAllConcepts, getAllCaseStudyRefs, getTotalSDConcepts, getTotalCaseStudies } from "@/data/systemDesign";
import { useSDStore } from "@/lib/sdStore";
import SDChapterSection from "@/components/sd/SDChapterSection";
import SDLearningPath from "@/components/sd/SDLearningPath";

const FILTERS = ["All", "Fundamental", "Intermediate", "Advanced", "Case Studies", "Has Viz"] as const;
type Filter = typeof FILTERS[number];

export default function SystemDesignPage() {
  const { mastered } = useSDStore();
  const [filter, setFilter] = useState<Filter>("All");
  const [expandAll, setExpandAll] = useState(false);

  const totalConcepts = getTotalSDConcepts();
  const totalCaseStudies = getTotalCaseStudies();
  const masteredCount = mastered.size;

  const filteredChapters = useMemo(() => {
    return SD_CHAPTERS.map((ch) => {
      const filteredConcepts = ch.concepts.filter((c) => {
        if (filter === "Fundamental") return c.difficulty === "Fundamental";
        if (filter === "Intermediate") return c.difficulty === "Intermediate";
        if (filter === "Advanced") return c.difficulty === "Advanced";
        if (filter === "Case Studies") return false;
        if (filter === "Has Viz") return c.hasVisualization;
        return true;
      });
      const filteredCaseStudies = (ch.caseStudies ?? []).filter(() => {
        if (filter === "Case Studies") return true;
        if (filter === "All") return true;
        return false;
      });
      return { ...ch, concepts: filteredConcepts, caseStudies: filteredCaseStudies };
    }).filter((ch) => ch.concepts.length > 0 || (ch.caseStudies?.length ?? 0) > 0);
  }, [filter]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="max-w-5xl mx-auto px-6 pb-8">
        {/* Hero — editorial */}
        <section className="pt-16 pb-4 reveal reveal-1">
          <p className="eyebrow mb-3">Track 02 · Systems thinking</p>
          <h1 className="title-1 mb-5" style={{ color: "var(--text-primary)" }}>System Design</h1>
          <p className="lede max-w-2xl">
            Foundations to distributed systems — taught as tradeoffs, not trivia. {totalConcepts} concepts and {totalCaseStudies} real-world
            case studies, each with an animated architecture you can explore.
          </p>
          <div className="flex items-center gap-2 mt-5 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>{masteredCount} of {totalConcepts + totalCaseStudies} mastered</span>
            <span className="w-32 h-1 rounded-full overflow-hidden inline-block" style={{ background: "var(--border)" }}>
              <span className="block h-full rounded-full" style={{ width: `${((masteredCount / (totalConcepts + totalCaseStudies)) * 100) || 0}%`, background: "var(--accent)" }} />
            </span>
          </div>
        </section>

        {/* Prerequisite learning path graph — the hero of this page */}
        <section className="section-gap reveal reveal-2">
          <SDLearningPath />
        </section>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-5 mt-16 flex-wrap">
          <div className="flex gap-1 p-1 rounded-xl flex-wrap" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: filter === f ? "rgba(79,140,255,0.18)" : "transparent",
                  color: filter === f ? "#4F8CFF" : "var(--text-muted)",
                  border: filter === f ? "1px solid rgba(79,140,255,0.35)" : "1px solid transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="ml-auto text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            {expandAll ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {/* Chapter list */}
        <div className="space-y-3">
          {filteredChapters.map((chapter, i) => (
            <SDChapterSection
              key={chapter.id}
              chapter={chapter}
              index={i}
              defaultOpen={expandAll || i === 0}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
