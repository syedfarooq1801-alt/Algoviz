"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { getChapterById, SD_CHAPTERS } from "@/data/systemDesign";
import { useSDStore } from "@/lib/sdStore";
import Header from "@/components/Header";
import Link from "next/link";

interface Props { params: Promise<{ chapterId: string }> }

const difficultyColor: Record<string, string> = { Fundamental: "#2FBF71", Intermediate: "#F5A524", Advanced: "#ef4444" };
const levelColor: Record<string, string> = { Junior: "#2FBF71", Mid: "#4F8CFF", Senior: "#F5A524", Staff: "#ef4444" };

export default function ChapterPage({ params }: Props) {
  const { chapterId } = use(params);
  const chapter = getChapterById(chapterId);
  if (!chapter) notFound();

  const { mastered, toggleMastered } = useSDStore();
  const allIds = [...chapter.concepts.map((c) => c.id), ...(chapter.caseStudies ?? []).map((cs) => cs.id)];
  const masteredCount = allIds.filter((id) => mastered.has(id)).length;
  const total = allIds.length;
  const pct = total > 0 ? Math.round((masteredCount / total) * 100) : 0;

  const chapterIndex = SD_CHAPTERS.findIndex((ch) => ch.id === chapterId);
  const prev = chapterIndex > 0 ? SD_CHAPTERS[chapterIndex - 1] : null;
  const next = chapterIndex < SD_CHAPTERS.length - 1 ? SD_CHAPTERS[chapterIndex + 1] : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />
      <main className="max-w-4xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/system-design" className="hover:text-white transition-colors">System Design</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>{chapter.title}</span>
        </div>

        {/* Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{chapter.icon}</span>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{chapter.title}</h1>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{chapter.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: "var(--text-muted)" }}>Progress:</span>
            <div className="flex-1 max-w-48 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div className="h-full progress-bar" style={{ width: `${pct}%` }} />
            </div>
            <span style={{ color: "var(--text-secondary)" }}>{masteredCount}/{total} ({pct}%)</span>
          </div>
        </div>

        {/* Concepts */}
        {chapter.concepts.length > 0 && (
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 border-b flex items-center justify-between"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Concepts — {chapter.concepts.length}
              </h2>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium"
              style={{ color: "var(--text-muted)", background: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="w-7 shrink-0" />
              <div className="flex-1">Concept</div>
              <div className="shrink-0 w-24">Difficulty</div>
              <div className="shrink-0 w-8 text-center">Viz</div>
              <div className="shrink-0 w-6">✓</div>
            </div>
            {chapter.concepts.map((concept, i) => {
              const isMastered = mastered.has(concept.id);
              return (
                <div key={concept.id}
                  className="flex items-center gap-3 px-4 py-3 border-b text-sm"
                  style={{ borderColor: "var(--border-subtle)", opacity: 0, animation: `fadeInUp 0.3s ease-out ${i * 0.02}s forwards` }}>
                  <button
                    onClick={() => toggleMastered(concept.id)}
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{
                      border: isMastered ? "1.5px solid #16a34a" : "1.5px solid var(--text-muted)",
                      background: isMastered ? "#16a34a" : "transparent",
                    }}>
                    {isMastered ? (
                      <svg width="14" height="12" viewBox="0 0 16 14" fill="none">
                        <path d="M2 7.5L6 11.5L14 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="w-3 h-3 rounded-full" style={{ background: "var(--text-muted)", opacity: 0.65 }} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <Link href={`/system-design/concept/${concept.id}`}
                      className="font-medium hover:text-purple-400 transition-colors truncate block"
                      style={{ color: isMastered ? "var(--text-muted)" : "var(--text-primary)", textDecoration: isMastered ? "line-through" : "none", opacity: isMastered ? 0.6 : 1 }}>
                      {concept.title}
                    </Link>
                    <p className="text-xs truncate hidden sm:block" style={{ color: "var(--text-muted)" }}>{concept.summary}</p>
                  </div>
                  <span className="shrink-0 w-24 flex items-center justify-center text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ color: difficultyColor[concept.difficulty], background: `${difficultyColor[concept.difficulty]}18` }}>
                    {concept.difficulty}
                  </span>
                  <div className="shrink-0 w-8 flex justify-center">
                    {concept.hasVisualization
                      ? <Link href={`/system-design/concept/${concept.id}`}><span style={{ color: "#4F8CFF" }}>▶</span></Link>
                      : <span style={{ color: "var(--border)" }}>▶</span>}
                  </div>
                  <div className="shrink-0 w-6 flex justify-center">
                    <span style={{ color: isMastered ? "#2FBF71" : "var(--border)", fontSize: 14 }}>✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Case Studies */}
        {(chapter.caseStudies?.length ?? 0) > 0 && (
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 border-b" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Case Studies — {chapter.caseStudies!.length}
              </h2>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium"
              style={{ color: "var(--text-muted)", background: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="w-7 shrink-0" />
              <div className="flex-1">System</div>
              <div className="shrink-0 w-20">Level</div>
              <div className="shrink-0 w-24 hidden sm:block">Companies</div>
              <div className="shrink-0 w-6">✓</div>
            </div>
            {chapter.caseStudies!.map((cs, i) => {
              const isMastered = mastered.has(cs.id);
              return (
                <div key={cs.id}
                  className="flex items-center gap-3 px-4 py-3 border-b text-sm"
                  style={{ borderColor: "var(--border-subtle)", opacity: 0, animation: `fadeInUp 0.3s ease-out ${i * 0.02}s forwards` }}>
                  <button
                    onClick={() => toggleMastered(cs.id)}
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{ border: isMastered ? "1.5px solid #16a34a" : "1.5px solid var(--text-muted)", background: isMastered ? "#16a34a" : "transparent" }}>
                    {isMastered ? (
                      <svg width="14" height="12" viewBox="0 0 16 14" fill="none">
                        <path d="M2 7.5L6 11.5L14 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : <span className="w-3 h-3 rounded-full" style={{ background: "var(--text-muted)", opacity: 0.65 }} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <Link href={`/system-design/case-study/${cs.id}`}
                      className="font-medium hover:text-purple-400 transition-colors truncate block"
                      style={{ color: isMastered ? "var(--text-muted)" : "var(--text-primary)" }}>
                      {cs.title}
                    </Link>
                  </div>
                  <span className="shrink-0 w-20 flex items-center justify-center text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ color: levelColor[cs.difficulty], background: `${levelColor[cs.difficulty]}18` }}>
                    {cs.difficulty}
                  </span>
                  <div className="shrink-0 w-24 hidden sm:flex gap-1 flex-wrap">
                    {cs.companies.slice(0, 2).map((c) => (
                      <span key={c} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>{c}</span>
                    ))}
                  </div>
                  <div className="shrink-0 w-6 flex justify-center">
                    <span style={{ color: isMastered ? "#2FBF71" : "var(--border)", fontSize: 14 }}>✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Chapter nav */}
        <div className="flex items-center justify-between mt-8 text-sm">
          {prev ? (
            <Link href={`/system-design/${prev.id}`} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              ← {prev.title}
            </Link>
          ) : <div />}
          <Link href="/system-design" className="text-xs px-3 py-1.5 rounded-lg"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            All Chapters
          </Link>
          {next ? (
            <Link href={`/system-design/${next.id}`} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              {next.title} →
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}
