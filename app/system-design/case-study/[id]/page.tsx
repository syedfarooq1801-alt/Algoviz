"use client";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { getCaseStudyRefById } from "@/data/systemDesign";
import { getCaseStudyById } from "@/data/caseStudies";
import { useSDStore } from "@/lib/sdStore";
import Header from "@/components/Header";
import Link from "next/link";
import ArchitectureDiagram from "@/components/sd/ArchitectureDiagram";

interface Props { params: Promise<{ id: string }> }

const levelColor: Record<string, string> = { Junior: "#2FBF71", Mid: "#4F8CFF", Senior: "#F5A524", Staff: "#ef4444" };

export default function CaseStudyPage({ params }: Props) {
  const { id } = use(params);
  const ref = getCaseStudyRefById(id);
  const cs = getCaseStudyById(id);
  if (!ref || !cs) notFound();

  const { mastered, toggleMastered } = useSDStore();
  const isMastered = mastered.has(id);

  const [openDeepDives, setOpenDeepDives] = useState<Record<number, boolean>>({});
  const toggleDeepDive = (i: number) => setOpenDeepDives((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />
      <main className="max-w-4xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/system-design" className="hover:text-white transition-colors">System Design</Link>
          <span className="mx-2">/</span>
          <Link href="/system-design/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>{cs.title}</span>
        </div>

        {/* Header */}
        <div className="mt-4 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{cs.title}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ color: levelColor[cs.difficulty], background: `${levelColor[cs.difficulty]}18`, border: `1px solid ${levelColor[cs.difficulty]}40` }}>
                  {cs.difficulty} Level
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cs.companies.map((c) => (
                  <span key={c} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => toggleMastered(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0"
              style={{
                background: isMastered ? "rgba(47,191,113,0.15)" : "var(--bg-card)",
                color: isMastered ? "#2FBF71" : "var(--text-secondary)",
                border: `1px solid ${isMastered ? "rgba(47,191,113,0.4)" : "var(--border)"}`,
              }}
            >
              {isMastered ? "✓ Mastered" : "Mark as Understood"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section icon="🎯" title="Functional Requirements" color="#4F8CFF">
              <ul className="space-y-1.5">
                {cs.functionalReqs.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "#4F8CFF", marginTop: 2 }}>→</span>{r}
                  </li>
                ))}
              </ul>
            </Section>
            <Section icon="⚡" title="Non-Functional Requirements" color="#4F8CFF">
              <ul className="space-y-1.5">
                {cs.nonFunctionalReqs.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "#4F8CFF", marginTop: 2 }}>→</span>{r}
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {/* Estimations */}
          <Section icon="📊" title="Back-of-Envelope Estimations" color="#F5A524">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cs.estimations.map((e, i) => (
                <div key={i} className="px-3 py-2 rounded-lg text-xs font-mono" style={{ background: "rgba(0,0,0,0.2)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}>
                  {e}
                </div>
              ))}
            </div>
          </Section>

          {/* API Design */}
          <Section icon="⚙️" title="API Design" color="#4F8CFF">
            <div className="space-y-1.5">
              {cs.apiDesign.map((api, i) => (
                <div key={i} className="px-3 py-2 rounded-lg text-xs font-mono" style={{ background: "rgba(0,0,0,0.2)", color: "#4F8CFF", border: "1px solid var(--border-subtle)" }}>
                  {api}
                </div>
              ))}
            </div>
          </Section>

          {/* Architecture */}
          <ArchitectureDiagram layers={cs.architecture} />

          {/* Deep Dives */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)" }}>
              <span>🔍</span>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Deep Dives</h3>
            </div>
            <div>
              {cs.deepDives.map((dd, i) => (
                <div key={i} className="border-b last:border-b-0" style={{ borderColor: "var(--border-subtle)" }}>
                  <button
                    onClick={() => toggleDeepDive(i)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    style={{ background: "var(--bg-card)" }}
                  >
                    <div className="transition-transform duration-200" style={{ transform: openDeepDives[i] ? "rotate(90deg)" : "rotate(0deg)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{dd.title}</span>
                  </button>
                  {openDeepDives[i] && (
                    <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                      <div className="pt-3">
                        <div className="text-xs font-semibold mb-1" style={{ color: "#ef4444" }}>❌ Problem</div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{dd.problem}</p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold mb-1" style={{ color: "#2FBF71" }}>✅ Solution</div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{dd.solution}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tradeoffs */}
          <Section icon="⚖️" title="Key Trade-offs" color="#F5A524">
            <ul className="space-y-2">
              {cs.tradeoffs.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span style={{ color: "#F5A524", marginTop: 2 }}>⚖</span>{t}
                </li>
              ))}
            </ul>
          </Section>

          {/* Follow-up + Red Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section icon="❓" title="Follow-up Questions" color="#4F8CFF">
              <ul className="space-y-1.5">
                {cs.followUpQuestions.map((q, i) => (
                  <li key={i} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "#4F8CFF" }}>{i + 1}. </span>{q}
                  </li>
                ))}
              </ul>
            </Section>
            <Section icon="🚩" title="Red Flags (Avoid These)" color="#ef4444">
              <ul className="space-y-1.5">
                {cs.redFlags.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "#ef4444" }}>✗</span>{r}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/system-design" className="text-xs px-4 py-2 rounded-lg" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            ← Back to System Design
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({ icon, title, color, children }: { icon: string; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span>{icon}</span>
        <h3 className="text-sm font-semibold" style={{ color }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
