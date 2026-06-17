"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { COMPANY_VALUES, STAR_FRAMEWORK, COMMON_QUESTIONS } from "@/data/behavioral";

type Tab = "star" | "amazon" | "google" | "meta" | "microsoft" | "apple" | "netflix" | "common";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "star",      label: "STAR Method",  icon: "⭐" },
  { id: "amazon",    label: "Amazon",       icon: "📦" },
  { id: "google",    label: "Google",       icon: "🔍" },
  { id: "meta",      label: "Meta",         icon: "👥" },
  { id: "microsoft", label: "Microsoft",    icon: "🪟" },
  { id: "apple",     label: "Apple",        icon: "🍎" },
  { id: "netflix",   label: "Netflix",      icon: "🎬" },
  { id: "common",    label: "Common Qs",    icon: "💬" },
];

export default function BehavioralPage() {
  const [tab, setTab] = useState<Tab>("star");
  const [openQ, setOpenQ] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});

  const company = COMPANY_VALUES.find((c) => c.company.toLowerCase() === tab);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />
      <main className="max-w-4xl mx-auto px-4 pb-24">
        {/* Header */}
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>Behavioral Interview</span>
        </div>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Behavioral Interview Prep
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            STAR method, company leadership principles, and sample answers for MAANG interviews.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => {
            const co = COMPANY_VALUES.find((c) => c.company.toLowerCase() === t.id);
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: tab === t.id ? (co ? `${co.color}18` : "rgba(79,140,255,0.15)") : "var(--bg-card)",
                  color: tab === t.id ? (co?.color ?? "#4F8CFF") : "var(--text-muted)",
                  border: `1px solid ${tab === t.id ? (co?.color ?? "#4F8CFF") + "50" : "var(--border)"}`,
                }}
              >
                {t.icon} {t.label}
              </button>
            );
          })}
        </div>

        {/* STAR Method */}
        {tab === "star" && (
          <div className="space-y-4">
            <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h2 className="text-sm font-semibold mb-2" style={{ color: "#4F8CFF" }}>The STAR Framework</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Every behavioral answer should follow STAR. Interviewers score each component separately.
                Missing any component = losing points on the rubric.
              </p>
            </div>

            {STAR_FRAMEWORK.map((s) => (
              <div key={s.letter} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <div className="px-5 py-4 flex items-start gap-4" style={{ background: "var(--bg-card)" }}>
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black"
                    style={{ background: "rgba(79,140,255,0.15)", color: "#4F8CFF", border: "1px solid rgba(79,140,255,0.3)" }}>
                    {s.letter}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{s.full}</div>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{s.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.questions.map((q) => (
                        <span key={q} className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="p-4 border-r" style={{ background: "rgba(239,68,68,0.04)", borderColor: "var(--border-subtle)" }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: "#ef4444" }}>✗ Weak answer</div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.badExample}</p>
                  </div>
                  <div className="p-4" style={{ background: "rgba(47,191,113,0.04)" }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: "#2FBF71" }}>✓ Strong answer</div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.goodExample}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-xl p-5" style={{ background: "rgba(79,140,255,0.06)", border: "1px solid rgba(79,140,255,0.2)" }}>
              <div className="text-sm font-semibold mb-3" style={{ color: "#4F8CFF" }}>📋 Universal Tips</div>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {[
                  "Prepare 8-10 core stories. Each story can answer multiple questions with different emphasis.",
                  "Use 'I' not 'we' — interviewers score YOUR contribution, not the team.",
                  "Keep each answer under 2.5 minutes. Practice out loud with a timer.",
                  "Always end with a quantified result. 'It worked' is not a result.",
                  "Have a 'failure' story ready — every company asks about it.",
                  "Recency matters: use examples from the last 2 years when possible.",
                  "Never badmouth previous employers — it signals poor judgment.",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span style={{ color: "#4F8CFF", marginTop: 2 }}>→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Company tabs */}
        {company && (
          <div className="space-y-4">
            {/* Values grid */}
            <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: `1px solid ${company.color}25` }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{company.icon}</span>
                <h2 className="text-sm font-semibold" style={{ color: company.color }}>
                  {company.company} Leadership Principles / Values
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {company.values.map((v) => (
                  <span key={v} className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: `${company.color}12`, color: company.color, border: `1px solid ${company.color}30` }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Tipsheet */}
            <div className="rounded-xl p-5" style={{ background: "rgba(79,140,255,0.06)", border: "1px solid rgba(79,140,255,0.2)" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "#4F8CFF" }}>🎯 Interview Tipsheet</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{company.tipsheet}</p>
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {company.questions.map((q) => (
                <div key={q.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${openQ === q.id ? company.color + "40" : "var(--border)"}` }}>
                  <button
                    onClick={() => setOpenQ(openQ === q.id ? null : q.id)}
                    className="w-full flex items-start gap-4 px-5 py-4 text-left"
                    style={{ background: "var(--bg-card)" }}>
                    <div className="transition-transform duration-200 mt-0.5" style={{ transform: openQ === q.id ? "rotate(90deg)" : "rotate(0deg)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                        {q.question}
                      </div>
                      {q.principle && (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${company.color}12`, color: company.color, border: `1px solid ${company.color}25` }}>
                          {q.principle}
                        </span>
                      )}
                    </div>
                  </button>

                  {openQ === q.id && (
                    <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                      {/* STAR answer */}
                      <div className="mt-4 grid grid-cols-1 gap-3">
                        {(["situation", "task", "action", "result"] as const).map((part) => {
                          const labels = { situation: ["S", "Situation", "#2FBF71"], task: ["T", "Task", "#4F8CFF"], action: ["A", "Action", "#4F8CFF"], result: ["R", "Result", "#F5A524"] };
                          const [letter, full, color] = labels[part];
                          return (
                            <div key={part} className="flex gap-3">
                              <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black mt-0.5"
                                style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                                {letter}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-semibold mb-1" style={{ color: color as string }}>{full}</div>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                  {q.star[part]}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Anti-pattern */}
                      <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        <div className="text-xs font-semibold mb-1" style={{ color: "#ef4444" }}>⚠️ Don't say this</div>
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{q.antiPattern}</p>
                      </div>

                      {/* Follow-ups */}
                      <div>
                        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Common follow-up questions:</div>
                        <ul className="space-y-1">
                          {q.followUps.map((fu) => (
                            <li key={fu} className="text-xs flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                              <span style={{ color: company.color }}>→</span> {fu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Story bank prompt */}
            <div className="rounded-xl p-5" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                📒 Your Story Bank — Build 2 stories per principle
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {company.values.slice(0, 8).map((v) => (
                  <div key={v} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: company.color }} />
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Common Questions */}
        {tab === "common" && (
          <div className="space-y-3">
            <div className="rounded-xl p-4 mb-2" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                These questions appear in almost every MAANG behavioral round. Prepare a specific STAR story for each.
              </p>
            </div>
            {COMMON_QUESTIONS.map((q) => (
              <div key={q.question} className="flex items-start gap-4 px-5 py-4 rounded-xl"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <span className="shrink-0 text-xs px-2 py-1 rounded-md font-medium"
                  style={{ background: "rgba(79,140,255,0.1)", color: "#4F8CFF", border: "1px solid rgba(79,140,255,0.25)", minWidth: 90, textAlign: "center" }}>
                  {q.category}
                </span>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{q.question}</p>
                <button
                  onClick={() => setShowAnswer((p) => ({ ...p, [q.question]: !p[q.question] }))}
                  className="shrink-0 text-xs px-2 py-1 rounded-md transition-all"
                  style={{ background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                  Hint
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
