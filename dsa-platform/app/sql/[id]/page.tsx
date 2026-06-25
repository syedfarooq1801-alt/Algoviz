"use client";
import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSQLProblem, SQL_PROBLEMS } from "@/data/sqlProblems";
import { useSQLStore } from "@/lib/sqlStore";

interface Props { params: Promise<{ id: string }>; }

const DIFF_COLOR = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };

export default function SQLProblemPage({ params }: Props) {
  const { id } = use(params);
  const problem = getSQLProblem(id);
  if (!problem) notFound();

  const { isSolved, toggleSolved } = useSQLStore();
  const solved = isSolved(id);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<"solution" | "explanation">("solution");

  const currentIdx = SQL_PROBLEMS.findIndex((p) => p.id === id);
  const prevProblem = SQL_PROBLEMS[currentIdx - 1];
  const nextProblem = SQL_PROBLEMS[currentIdx + 1];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="mx-auto max-w-[1120px] px-6 pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pt-8 pb-6 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/sql" className="hover:underline">SQL Problems</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{problem.category}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
                  {problem.title}
                </h1>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    background: `${DIFF_COLOR[problem.difficulty]}15`,
                    color: DIFF_COLOR[problem.difficulty],
                    border: `1px solid ${DIFF_COLOR[problem.difficulty]}40`,
                  }}
                >
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <span className="text-xs px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                  {problem.category}
                </span>
                {problem.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }}>
                    {t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => toggleSolved(id)}
                className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: solved ? "rgba(34,197,94,0.1)" : "var(--bg-card)",
                  border: `1px solid ${solved ? "#22c55e" : "var(--border)"}`,
                  color: solved ? "#22c55e" : "var(--text-muted)",
                }}
              >
                {solved ? "✓ Solved" : "○ Mark Solved"}
              </button>
            </div>

            {/* Problem statement */}
            <div className="rounded-xl p-5 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Problem</h2>
              <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{problem.description}</p>
              {problem.hint && (
                <div className="mt-4 rounded-lg px-4 py-3" style={{ background: "rgba(79,142,247,0.06)", border: "1px solid rgba(79,142,247,0.2)" }}>
                  <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>Hint: </span>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{problem.hint}</span>
                </div>
              )}
            </div>

            {/* Schemas */}
            <div className="mb-6 space-y-4">
              {problem.schemas.map((schema) => (
                <div key={schema.name} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <div className="px-4 py-2.5 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                    Table: {schema.name}
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        {schema.columns.map((col) => (
                          <th key={col} className="px-4 py-2 text-left font-medium" style={{ color: "var(--text-secondary)" }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {schema.sample.map((row, i) => (
                        <tr key={i} style={{ borderBottom: i < schema.sample.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2 font-mono" style={{ color: "var(--text-primary)" }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Solution toggle */}
            {!showSolution ? (
              <button
                onClick={() => setShowSolution(true)}
                className="mb-6 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: "var(--accent)", color: "#fff", border: "none" }}
              >
                Show Solution
              </button>
            ) : (
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab("solution")}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: activeTab === "solution" ? "var(--accent)" : "var(--bg-card)",
                      color: activeTab === "solution" ? "#fff" : "var(--text-muted)",
                      border: `1px solid ${activeTab === "solution" ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    SQL Solution
                  </button>
                  <button
                    onClick={() => setActiveTab("explanation")}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: activeTab === "explanation" ? "var(--accent)" : "var(--bg-card)",
                      color: activeTab === "explanation" ? "#fff" : "var(--text-muted)",
                      border: `1px solid ${activeTab === "explanation" ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    Explanation
                  </button>
                </div>

                {activeTab === "solution" && (
                  <pre
                    className="rounded-xl px-5 py-4 overflow-x-auto text-xs leading-6"
                    style={{ background: "var(--bg-code)", border: "1px solid var(--border)", color: "var(--text-code)", fontFamily: "var(--font-mono)" }}
                  >
                    <code>{problem.solution}</code>
                  </pre>
                )}
                {activeTab === "explanation" && (
                  <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    <ol className="space-y-3">
                      {problem.explanation.map((line, i) => (
                        <li key={i} className="flex gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: "rgba(79,142,247,0.15)", color: "var(--accent)" }}>
                            {i + 1}
                          </span>
                          <span className="leading-7">{line}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              {prevProblem ? (
                <Link href={`/sql/${prevProblem.id}`} className="text-sm" style={{ color: "var(--accent)" }}>
                  ← {prevProblem.title}
                </Link>
              ) : <div />}
              {nextProblem && (
                <Link href={`/sql/${nextProblem.id}`} className="text-sm" style={{ color: "var(--accent)" }}>
                  {nextProblem.title} →
                </Link>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4">
            <div className="rounded-xl p-4 sticky top-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Companies</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {problem.companies.map((c) => (
                  <span key={c} className="text-xs px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>
                    {c}
                  </span>
                ))}
              </div>

              <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Key Concepts</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {problem.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-1 rounded-full" style={{ background: "rgba(79,142,247,0.08)", color: "var(--accent)", border: "1px solid rgba(79,142,247,0.2)" }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>All SQL Problems</div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {SQL_PROBLEMS.map((p) => (
                  <Link
                    key={p.id}
                    href={`/sql/${p.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all"
                    style={{
                      background: p.id === id ? "var(--accent-soft)" : "transparent",
                      color: p.id === id ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    <span style={{ color: DIFF_COLOR[p.difficulty], fontSize: 8 }}>●</span>
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
