"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { getConceptById, SD_CHAPTERS } from "@/data/systemDesign";
import { SD_CONCEPT_CONTENT } from "@/data/systemDesignContent";
import { useSDStore } from "@/lib/sdStore";
import NextNav from "@/components/NextNav";
import Collapsible, { Beat } from "@/components/Collapsible";
import Link from "next/link";
import dynamic from "next/dynamic";

/** Small label for a block inside the collapsed "Go deeper" drawer. */
function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-xs font-semibold mb-2"
      style={{ color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}
    >
      {children}
    </div>
  );
}

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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="read-prose max-w-6xl mx-auto px-6 pb-8">
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
          <p className="lede">{concept.summary}</p>
        </section>

        {/* Visualization */}
        {VizComponent && (
          <section className="mb-9 reveal reveal-2">
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <p className="eyebrow mb-4" style={{ color: "var(--accent-purple)" }}>How it works — interactive</p>
              <div style={{ minHeight: 340 }}><VizComponent /></div>
            </div>
          </section>
        )}

        {content ? (
          /* Three beats carry the concept: why it exists, how it works, and
             what it costs you. Tradeoffs are the actual system-design skill,
             so they stay in the main flow. The cheat-sheet one-liner sits at
             the top as the thing to memorise; real-world examples, mistakes,
             memory tricks and related links are reference and collapse. */
          <div className="space-y-9">
            {content.cheatSheetLine && (
              <div
                className="rounded-lg px-4 py-2.5 text-sm font-mono"
                style={{ background: "rgba(47,191,113,0.08)", border: "1px solid rgba(47,191,113,0.22)", color: "var(--text-primary)" }}
              >
                {content.cheatSheetLine}
              </div>
            )}

            <div className="reveal reveal-3">
              <Beat n={1} title="Why it exists" accent="#F5A524">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.intuition}</p>
              </Beat>
            </div>

            <Beat n={2} title="How it works">
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.technicalDetail}</p>
            </Beat>

            {content.tradeoffs.length > 0 && (
              <Beat n={3} title="What it costs you" accent="#F5A524">
                <ul className="space-y-2.5">
                  {content.tradeoffs.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-orange)" }}>⚖</span>{t}
                    </li>
                  ))}
                </ul>
              </Beat>
            )}

            <Beat n={4} title="Say this in the interview" accent="#A78BFA">
              <p className="text-base font-medium mb-2" style={{ color: "var(--text-primary)" }}>{content.interviewQuestion}</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.modelAnswer}</p>
            </Beat>

            <Collapsible title="Go deeper" subtitle="real-world · pitfalls · memory trick · related">
              <div>
                <SubHead>In the real world</SubHead>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.realWorldExample}</p>
              </div>

              {content.commonMistakes.length > 0 && (
                <div>
                  <SubHead>Common mistakes</SubHead>
                  <ul className="space-y-2">
                    {content.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--accent-red)" }}>✗</span>{m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {content.memoryTrick && (
                <div>
                  <SubHead>Memory trick</SubHead>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{content.memoryTrick}</p>
                </div>
              )}

              {content.relatedConcepts.length > 0 && (
                <div>
                  <SubHead>Related concepts</SubHead>
                  <div className="flex flex-wrap gap-2">
                    {content.relatedConcepts.map((rel) => (
                      <Link key={rel} href={`/system-design/concept/${rel}`}
                        className="text-xs px-3 py-1.5 rounded-lg lift" style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                        {rel.replace(/-/g, " ")}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Collapsible>
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
        <NextNav currentHref={`/system-design/concept/${id}`} />
      </main>
    </div>
  );
}
