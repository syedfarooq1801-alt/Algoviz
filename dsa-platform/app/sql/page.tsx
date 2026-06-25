"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { SQL_PROBLEMS, SQL_CATEGORIES, type SQLCategory } from "@/data/sqlProblems";
import { useSQLStore } from "@/lib/sqlStore";

const DIFF_COLOR = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

export default function SQLPage() {
  const { isSolved, toggleSolved } = useSQLStore();
  const [activeCategory, setActiveCategory] = useState<SQLCategory | "All">("All");
  const [query, setQuery] = useState("");

  const solvedCount = SQL_PROBLEMS.filter((p) => isSolved(p.id)).length;

  const filtered = useMemo(() => {
    let list = SQL_PROBLEMS;
    if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    if (query.trim().length >= 2) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, query]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="mx-auto max-w-[1120px] px-6 pb-12">
        <section className="max-w-[760px] pb-10 pt-14">
          <div className="mb-4 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Interview Prep / {SQL_PROBLEMS.length} problems
          </div>
          <h1
            className="mb-4 text-5xl font-semibold leading-tight tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            SQL Problems
          </h1>
          <p className="max-w-[700px] text-[17px] leading-8" style={{ color: "var(--text-secondary)" }}>
            Real query problems with schemas, solutions, and explanations. Window functions, CTEs, joins, aggregations — tested at Meta, Stripe, Databricks, and analytics roles everywhere.
          </p>
          <div className="mt-8 max-w-[420px]">
            <div className="mb-2 flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
              <span>Solved</span>
              <span>
                {solvedCount} / {SQL_PROBLEMS.length}
              </span>
            </div>
            <div className="h-px overflow-hidden" style={{ background: "var(--border-subtle)" }}>
              <div
                className="h-full progress-bar"
                style={{ width: `${(solvedCount / SQL_PROBLEMS.length) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* Search + Filter */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems or tags..."
            className="rounded-lg px-3 py-2 text-sm outline-none flex-1 min-w-[200px]"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
          <div className="flex flex-wrap gap-2">
            {(["All", ...SQL_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as SQLCategory | "All")}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: activeCategory === cat ? "var(--accent)" : "var(--bg-card)",
                  color: activeCategory === cat ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${activeCategory === cat ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Problem List */}
        <div className="space-y-2 max-w-[900px]">
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              No problems match your filter.
            </div>
          )}
          {filtered.map((p) => {
            const solved = isSolved(p.id);
            return (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-xl px-4 py-4 transition-all"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${solved ? "rgba(34,197,94,0.2)" : "var(--border)"}`,
                }}
              >
                <button
                  onClick={() => toggleSolved(p.id)}
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: solved ? "rgba(34,197,94,0.15)" : "transparent",
                    border: `2px solid ${solved ? "#22c55e" : "var(--border)"}`,
                    color: "#22c55e",
                  }}
                >
                  {solved && <span style={{ fontSize: 10 }}>✓</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <Link href={`/sql/${p.id}`}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="text-sm font-medium hover:underline"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {p.title}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${DIFF_COLOR[p.difficulty]}18`,
                          color: DIFF_COLOR[p.difficulty],
                          border: `1px solid ${DIFF_COLOR[p.difficulty]}40`,
                        }}
                      >
                        {p.difficulty}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {p.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded"
                          style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                </div>
                <div className="shrink-0 text-right">
                  <div
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }}
                  >
                    {p.category}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 justify-end">
                    {p.companies.slice(0, 2).map((c) => (
                      <span key={c} className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
