"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { LLD_SUBJECTS, LLD_SUBJECT_META, getTotalLLDChapters, searchLLD } from "@/data/lld";
import { useLLDStore } from "@/lib/lldStore";

export default function LLDPage() {
  const { completed, subjectDone } = useLLDStore();
  const [query, setQuery] = useState("");

  const totalChapters = getTotalLLDChapters();
  const doneCount = completed.size;

  const hits = useMemo(() => (query.trim().length >= 2 ? searchLLD(query) : []), [query]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="mx-auto max-w-[1120px] px-6 pb-8">
        <section className="max-w-[760px] pb-12 pt-14">
          <div className="mb-4 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Interview Prep / {totalChapters} chapters
          </div>
          <h1
            className="mb-4 text-5xl font-semibold leading-tight tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Low-Level Design
          </h1>
          <p className="max-w-[700px] text-[17px] leading-8" style={{ color: "var(--text-secondary)" }}>
            SOLID principles, design patterns (Creational, Structural, Behavioral), and full class-diagram walkthroughs for classic and real-world problems. A dedicated interview round at Amazon, Flipkart, Uber, and Swiggy.
          </p>

          <div className="mt-9 max-w-[420px]">
            <div className="mb-2 flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
              <span>Chapters completed</span>
              <span>
                {doneCount} / {totalChapters}
              </span>
            </div>
            <div className="h-px overflow-hidden" style={{ background: "var(--border-subtle)" }}>
              <div
                className="h-full progress-bar"
                style={{ width: `${totalChapters ? (doneCount / totalChapters) * 100 : 0}%` }}
              />
            </div>
          </div>
        </section>

        <div className="relative mb-12 max-w-[760px]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search LLD topics"
            className="w-full rounded-none px-0 py-3 text-sm outline-none"
            style={{
              background: "transparent",
              borderBottom: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          />
          {hits.length > 0 && (
            <div
              className="absolute left-0 right-0 z-20 mt-3 max-h-96 overflow-y-auto py-2"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {hits.map((h, i) => (
                <Link
                  key={i}
                  href={`/lld/${h.subjectId}#${h.chapterId}`}
                  className="block px-4 py-3 transition-colors"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onClick={() => setQuery("")}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {h.subjectTitle}
                    </span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {h.chapterTitle}
                    </span>
                  </div>
                  {h.snippet && (
                    <p className="mt-1 text-xs leading-5" style={{ color: "var(--text-muted)" }}>
                      {h.snippet}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        <section className="max-w-[760px]">
          {LLD_SUBJECTS.map((s) => {
            const meta = LLD_SUBJECT_META[s.id];
            const ids = s.chapters.map((c) => c.id);
            const done = subjectDone(s.id, ids);
            const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;
            return (
              <Link
                key={s.id}
                href={`/lld/${s.id}`}
                className="group block py-8"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <div className="mb-2 flex items-baseline justify-between gap-6">
                  <h2
                    className="text-2xl font-semibold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.title}
                  </h2>
                  <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                    {done}/{ids.length}
                  </span>
                </div>
                <p className="mb-4 text-[15px] leading-7" style={{ color: "var(--text-secondary)" }}>
                  {meta?.blurb}
                </p>
                <div className="mb-5 text-xs leading-6" style={{ color: "var(--text-muted)" }}>
                  {meta?.topics}
                </div>
                <div className="h-px overflow-hidden" style={{ background: "var(--border-subtle)" }}>
                  <div
                    className="h-full transition-all"
                    style={{ width: `${pct}%`, background: meta?.accent ?? "var(--accent)" }}
                  />
                </div>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
