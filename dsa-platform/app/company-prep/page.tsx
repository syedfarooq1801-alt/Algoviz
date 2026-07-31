"use client";
import { useState } from "react";
import { COMPANIES } from "@/data/companyPrep";

const DIFF_COLOR = {
  "Very Common": "#ef4444",
  Common: "#f59e0b",
  Occasional: "#22c55e",
};

const WEIGHT_COLOR = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#6b7280",
};

export default function CompanyPrepPage() {
  const [active, setActive] = useState(COMPANIES[0].id);
  const company = COMPANIES.find((c) => c.id === active)!;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="mx-auto max-w-[1280px] px-6 pb-12">
        <section className="pb-10 pt-14">
          <div className="mb-4 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Interview Prep / Company-Specific
          </div>
          <h1
            className="mb-4 text-5xl font-semibold leading-tight tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Company Prep
          </h1>
          <p className="max-w-[700px] text-[17px] leading-8" style={{ color: "var(--text-secondary)" }}>
            Differentiated prep paths for IBM, Google, Meta, Amazon, Microsoft, and Indian unicorns. Know what each company values, what rounds look like, and which problems are asked most. Live campus drives also get a dated, day-by-day plan.
          </p>
        </section>

        {/* Company tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {COMPANIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
              style={{
                background: active === c.id ? `${c.color}20` : "var(--bg-card)",
                border: `2px solid ${active === c.id ? c.color : "var(--border)"}`,
                color: active === c.id ? c.color : "var(--text-secondary)",
              }}
            >
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ background: c.color, color: "#fff" }}
              >
                {c.logo}
              </span>
              {c.name}
            </button>
          ))}
        </div>

        {/* Company detail */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Header */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ background: company.color, color: "#fff" }}
                >
                  {company.logo}
                </div>
                <div>
                  <h2
                    className="text-2xl font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {company.name}
                  </h2>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {company.packageRange}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                {company.tagline}
              </p>
            </div>

            {/* Hard logistics for a live drive — these disqualify you if missed,
                so they sit above the study material, not buried under it. */}
            {company.deadlines && company.deadlines.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: "var(--bg-card)", border: "1px solid rgba(239,68,68,0.35)" }}
              >
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Do not lose it on a technicality
                </h3>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  Every one of these can disqualify you before a single line of your code is read.
                </p>
                <div className="space-y-3">
                  {company.deadlines.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-3"
                      style={{
                        background: d.critical ? "rgba(239,68,68,0.07)" : "var(--bg-secondary)",
                        border: `1px solid ${d.critical ? "rgba(239,68,68,0.25)" : "var(--border-subtle)"}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {d.critical && <span style={{ color: "#EF4444", fontSize: 11 }}>●</span>}
                        <span className="text-xs font-semibold" style={{ color: d.critical ? "#EF4444" : "var(--text-primary)" }}>
                          {d.label}
                        </span>
                      </div>
                      <p className="text-xs leading-5" style={{ color: "var(--text-secondary)" }}>{d.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dated countdown plan — only present for a live announced drive */}
            {company.prepPlan && company.prepPlan.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  {company.prepPlan.length}-Day Prep Plan
                </h3>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  Built for this exact drive — dated to the assessment, weighted to what IBM actually tests.
                </p>
                <div className="space-y-6">
                  {company.prepPlan.map((d) => (
                    <div
                      key={d.day}
                      className="rounded-xl p-4"
                      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
                    >
                      <div className="flex items-baseline gap-3 flex-wrap mb-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded font-bold"
                          style={{ background: company.color, color: "#fff" }}
                        >
                          DAY {d.day}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {d.theme}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {d.date} · {d.weekday}
                        </span>
                      </div>
                      <p className="text-xs leading-5 mb-4" style={{ color: "var(--text-secondary)" }}>
                        {d.goal}
                      </p>
                      <div className="space-y-4">
                        {d.blocks.map((b, bi) => (
                          <div key={bi}>
                            <div className="flex items-baseline gap-2 mb-1.5">
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold shrink-0"
                                style={{ background: "var(--bg-hover)", color: company.color, border: "1px solid var(--border-subtle)" }}
                              >
                                {b.time}
                              </span>
                              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                                {b.title}
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {b.items.map((it, ii) => (
                                <li key={ii} className="flex gap-2 text-xs leading-5" style={{ color: "var(--text-muted)" }}>
                                  <span style={{ color: company.color }}>→</span>
                                  <span>{it}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interview Rounds */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h3
                className="text-base font-semibold mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                Interview Rounds
              </h3>
              <div className="space-y-5">
                {company.rounds.map((r, i) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {r.name}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {r.duration}
                      </span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
                      {r.format}
                    </p>
                    <ul className="space-y-1">
                      {r.tips.map((t, j) => (
                        <li key={j} className="flex gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                          <span style={{ color: company.color }}>→</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Focus */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h3
                className="text-base font-semibold mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                Topic Focus
              </h3>
              <div className="space-y-3">
                {company.focus.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-20">
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{
                          background: `${WEIGHT_COLOR[f.weight]}18`,
                          color: WEIGHT_COLOR[f.weight],
                        }}
                      >
                        {f.weight}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>
                        {f.topic}
                      </div>
                      <div className="text-xs leading-5" style={{ color: "var(--text-muted)" }}>
                        {f.notes}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h3
                className="text-base font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Behavioral / LP Questions
              </h3>
              <ul className="space-y-2">
                {company.behavioralFocus.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="shrink-0" style={{ color: company.color }}>
                      ◆
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Insider Tips */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: `${company.color}0a`,
                border: `1px solid ${company.color}30`,
              }}
            >
              <h3
                className="text-base font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Insider Tips
              </h3>
              <ul className="space-y-2">
                {company.insiderTips.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="shrink-0" style={{ color: company.color }}>
                      ★
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right panel: Must-solve problems */}
          <div className="space-y-4">
            <div
              className="rounded-2xl p-5 sticky top-6"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Must-Solve Problems
              </h3>
              <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                Highest-frequency problems at {company.name}
              </p>
              <div className="space-y-3">
                {company.mustSolve.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl p-3"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ background: company.color, color: "#fff" }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                        {p.title}
                      </div>
                      <div className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                        {p.pattern}
                      </div>
                    </div>
                    <span
                      className="shrink-0 text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: `${DIFF_COLOR[p.frequency]}18`,
                        color: DIFF_COLOR[p.frequency],
                      }}
                    >
                      {p.frequency === "Very Common" ? "★★★" : p.frequency === "Common" ? "★★" : "★"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                  Top Patterns
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.topPatterns.map((p) => (
                    <span
                      key={p}
                      className="text-[11px] px-2 py-1 rounded-full"
                      style={{
                        background: `${company.color}14`,
                        color: company.color,
                        border: `1px solid ${company.color}30`,
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
