"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { getConceptById, SD_CHAPTERS } from "@/data/systemDesign";
import { SD_CONCEPT_CONTENT } from "@/data/systemDesignContent";
import { useSDStore } from "@/lib/sdStore";
import Link from "next/link";
import dynamic from "next/dynamic";

const SD_VIZ: Record<string, React.ComponentType> = {
  "load-balancer": dynamic(() => import("@/components/visualizations/sd/LoadBalancerViz"), { ssr: false }),
  "cache":         dynamic(() => import("@/components/visualizations/sd/CacheViz"), { ssr: false }),
  "replication":   dynamic(() => import("@/components/visualizations/sd/ReplicationViz"), { ssr: false }),
  "consistent-hashing": dynamic(() => import("@/components/visualizations/sd/ConsistentHashingViz"), { ssr: false }),
  "cap-theorem":   dynamic(() => import("@/components/visualizations/sd/CAPTheoremViz"), { ssr: false }),
  "message-queue": dynamic(() => import("@/components/visualizations/sd/MessageQueueViz"), { ssr: false }),
  "rate-limiter":  dynamic(() => import("@/components/visualizations/sd/RateLimiterViz"), { ssr: false }),
  "dns":           dynamic(() => import("@/components/visualizations/sd/DNSResolutionViz"), { ssr: false }),
  "url-shortener": dynamic(() => import("@/components/visualizations/sd/URLShortenerViz"), { ssr: false }),
  "consensus":     dynamic(() => import("@/components/visualizations/sd/ConsensusViz"), { ssr: false }),
};

interface Props { params: Promise<{ id: string }> }

export default function ConceptPage({ params }: Props) {
  const { id } = use(params);
  const concept = getConceptById(id);
  if (!concept) notFound();

  const content = SD_CONCEPT_CONTENT[id];
  const { mastered, toggleMastered } = useSDStore();
  const isMastered = mastered.has(id);

  const chapter = SD_CHAPTERS.find((ch) => ch.id === concept.chapterId);
  const VizComponent = concept.hasVisualization ? SD_VIZ[concept.vizType] : undefined;

  const conceptsInChapter = chapter?.concepts ?? [];
  const myIndex = conceptsInChapter.findIndex((c) => c.id === id);
  const prev = myIndex > 0 ? conceptsInChapter[myIndex - 1] : null;
  const next = myIndex < conceptsInChapter.length - 1 ? conceptsInChapter[myIndex + 1] : null;

  const difficultyColor: Record<string, string> = { Fundamental: "#2FBF71", Intermediate: "#F5A524", Advanced: "#ef4444" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="max-w-4xl mx-auto px-6 pb-8">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/system-design" className="hover:text-white transition-colors">System Design</Link>
          <span className="mx-2">/</span>
          <Link href={`/system-design/${concept.chapterId}`} className="hover:text-white transition-colors">{chapter?.title}</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>{concept.title}</span>
        </div>

        {/* Header */}
        <section className="mt-6 mb-7 reveal reveal-1">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <div>
              <p className="eyebrow mb-2">{chapter?.title} · {concept.difficulty}</p>
              <h1 className="title-1" style={{ color: "var(--text-primary)" }}>{concept.title}</h1>
            </div>
            <button
              onClick={() => toggleMastered(id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0"
              style={{
                background: isMastered ? "var(--accent-soft)" : "var(--accent-purple)",
                color: isMastered ? "var(--accent-green)" : "#fff",
                border: `1px solid ${isMastered ? "rgba(45,212,160,0.4)" : "var(--accent-purple)"}`,
              }}>
              {isMastered ? "✓ Understood" : "Mark as Understood"}
            </button>
          </div>
          <p className="lede max-w-2xl">{concept.summary}</p>
        </section>

        {/* ── ARCHITECTURE / VISUALIZATION AS HERO ── */}
        {VizComponent && (
          <section className="mb-9 reveal reveal-2">
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <p className="eyebrow mb-4" style={{ color: "var(--accent-purple)" }}>How it works — interactive</p>
              <div style={{ minHeight: 340 }}><VizComponent /></div>
            </div>
          </section>
        )}

        {content ? (
          <div className="reading space-y-10">
            {/* What breaks without it — the framing question */}
            <section className="reveal reveal-3">
              <div className="rounded-xl px-5 py-4 mb-7" style={{ background: "var(--accent-soft)", borderLeft: "3px solid var(--accent)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>What breaks if this doesn&apos;t exist?</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.intuition}</p>
              </div>

              <p className="eyebrow mb-3">How it works</p>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.technicalDetail}</p>
            </section>

            {/* Tradeoffs */}
            {content.tradeoffs.length > 0 && (
              <section>
                <p className="eyebrow mb-3" style={{ color: "var(--accent-orange)" }}>The tradeoffs</p>
                <ul className="space-y-2.5">
                  {content.tradeoffs.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-orange)" }}>⚖</span>{t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Real world */}
            <section>
              <p className="eyebrow mb-3" style={{ color: "#4F8CFF" }}>In the real world</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.realWorldExample}</p>
            </section>

            {/* Interview */}
            <section>
              <p className="eyebrow mb-3" style={{ color: "var(--accent-purple)" }}>In the interview</p>
              <p className="text-base font-medium mb-2" style={{ color: "var(--text-primary)" }}>{content.interviewQuestion}</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.modelAnswer}</p>
            </section>

            {/* Mistakes */}
            {content.commonMistakes.length > 0 && (
              <section>
                <p className="eyebrow mb-3" style={{ color: "var(--accent-red)" }}>Common mistakes</p>
                <ul className="space-y-2">
                  {content.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-red)" }}>✗</span>{m}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Memory + cheat — minimal inline */}
            {(content.memoryTrick || content.cheatSheetLine) && (
              <section className="space-y-4">
                {content.memoryTrick && (
                  <div><span className="eyebrow" style={{ color: "var(--accent-orange)" }}>Memory trick</span>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>{content.memoryTrick}</p></div>
                )}
                {content.cheatSheetLine && (
                  <div><span className="eyebrow" style={{ color: "var(--accent-green)" }}>One-liner</span>
                    <p className="text-sm mt-1.5 font-mono" style={{ color: "var(--text-secondary)" }}>{content.cheatSheetLine}</p></div>
                )}
              </section>
            )}

            {/* Related */}
            {content.relatedConcepts.length > 0 && (
              <section>
                <p className="eyebrow mb-3">Related concepts</p>
                <div className="flex flex-wrap gap-2">
                  {content.relatedConcepts.map((rel) => (
                    <Link key={rel} href={`/system-design/concept/${rel}`}
                      className="text-xs px-3 py-1.5 rounded-lg lift" style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                      {rel.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="reading text-center py-12">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Detailed content coming soon for {concept.title}.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="reading flex items-center justify-between mt-14 pt-8 text-sm" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {prev ? (
            <Link href={`/system-design/concept/${prev.id}`} style={{ color: "var(--text-muted)" }}>← {prev.title}</Link>
          ) : <span />}
          {next ? (
            <Link href={`/system-design/concept/${next.id}`} style={{ color: "var(--accent)" }}>{next.title} →</Link>
          ) : <Link href={`/system-design/${concept.chapterId}`} style={{ color: "var(--text-muted)" }}>Back to chapter</Link>}
        </div>
      </main>
    </div>
  );
}
