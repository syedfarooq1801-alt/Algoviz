"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import ProblemVizFallback from "@/components/visualizations/ProblemVizFallback";
import HintPanel from "@/components/HintPanel";
import ApproachSteps from "@/components/visualizations/ApproachSteps";
import type { Problem, Pattern } from "@/data/problems";
import { useStepSyncStore } from "@/lib/store";

const CodeExplanationPanelDynamic = dynamic(
  () => import("@/components/visualizations/CodeExplanationPanel"),
  { ssr: false }
);

interface Props {
  problem: Problem;
  pattern: Pattern | null;
  VizComponent: React.ComponentType | undefined;
  problemId: string;
}

export default function VizPageTabs({ problem, pattern, VizComponent, problemId }: Props) {
  const [showCode, setShowCode] = useState(false);
  const { currentStep, totalSteps, reset } = useStepSyncStore();

  return (
    <div className="space-y-12">
      {/* Visualization — the dominant hero */}
      <div>
        {currentStep >= 0 && totalSteps > 0 && (
          <div className="mb-4 flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span style={{ color: "var(--accent)" }}>
              Step {currentStep + 1} / {totalSteps}
            </span>
            <button onClick={reset} className="hover:underline">
              clear
            </button>
          </div>
        )}
        <div style={{ minHeight: 480 }}>
          {VizComponent ? (
            <VizComponent />
          ) : (
            <ProblemVizFallback problem={problem} pattern={pattern} />
          )}
        </div>
      </div>

      {/* Approach steps */}
      <ApproachSteps problemId={problemId} />

      {/* Hints */}
      <HintPanel problemId={problemId} />

      {/* Code & Explanation — expandable */}
      <div>
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex w-full items-center justify-between py-4 text-sm font-medium transition-colors"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <span style={{ color: showCode ? "var(--text-primary)" : "var(--text-muted)" }}>
            Code &amp; Explanation
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200"
            style={{
              color: "var(--text-muted)",
              transform: showCode ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {showCode && (
          <div className="pt-4">
            <CodeExplanationPanelDynamic problemId={problemId} />
          </div>
        )}
      </div>
    </div>
  );
}
