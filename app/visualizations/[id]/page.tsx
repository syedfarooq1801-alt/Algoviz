"use client";
import { use } from "react";
import { getProblemById, getPatternById } from "@/data/problems";
import Link from "next/link";
import { notFound } from "next/navigation";
import VizPageTabs from "@/components/visualizations/VizPageTabs";
import { VIZ_MAP } from "@/components/visualizations/problemVizMap";

interface Props {
  params: Promise<{ id: string }>;
}

export default function VisualizationPage({ params }: Props) {
  const { id } = use(params);
  const problem = getProblemById(id);
  if (!problem) notFound();

  const pattern = getPatternById(problem.pattern);
  const VizComponent = VIZ_MAP[id];

  const diffColor =
    problem.difficulty === "Easy"
      ? "var(--accent-green)"
      : problem.difficulty === "Medium"
      ? "var(--accent-orange)"
      : "var(--accent-red)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="mx-auto max-w-[1120px] px-6 pb-8">
        {/* Editorial header */}
        <section className="max-w-[760px] pb-10 pt-14">
          <div className="mb-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {pattern ? (
              <>
                <Link href={`/patterns/${pattern.id}`} className="hover:underline">
                  {pattern.title}
                </Link>
                {" · Visualization"}
              </>
            ) : (
              "Visualization"
            )}
          </div>
          <h1 className="title-1 mb-5" style={{ color: "var(--text-primary)" }}>
            {problem.title}
          </h1>
          <div
            className="flex flex-wrap items-center gap-2.5 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <span style={{ color: diffColor, fontWeight: 600 }}>{problem.difficulty}</span>
            <span>·</span>
            <Link href={`/problems/${id}`} className="hover:underline">
              Back to problem
            </Link>
            <span>·</span>
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LeetCode ↗
            </a>
          </div>
        </section>

        {/* Visualization — dominant hero */}
        <VizPageTabs
          problem={problem}
          pattern={pattern ?? null}
          VizComponent={VizComponent}
          problemId={id}
        />
      </main>
    </div>
  );
}
