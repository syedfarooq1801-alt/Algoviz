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
  const [tab, setTab] = useState<"viz" | "code">("viz");
  const { currentStep, totalSteps, reset } = useStepSyncStore();

  const handleTabChange = (newTab: "viz" | "code") => {
    setTab(newTab);
    if (newTab === "viz") reset();
  };

  const tabs = [
    { id: "viz" as const, label: "▶ Visualization" },
    { id: "code" as const, label: "{ } Code & Explanation" },
  ];

  return (
    <>
      {/* Tab bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", width: "fit-content" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: tab === t.id ? "rgba(79,142,247,0.18)" : "transparent",
                color: tab === t.id ? "#4f8ef7" : "var(--text-muted)",
                border: tab === t.id ? "1px solid rgba(79,142,247,0.35)" : "1px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Step sync indicator — shows when a code step is selected */}
        {tab === "viz" && currentStep >= 0 && totalSteps > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{
            background: "rgba(79,142,247,0.1)",
            border: "1px solid rgba(79,142,247,0.3)",
            color: "#4f8ef7",
          }}>
            <span>⟳</span>
            <span>Synced to step {currentStep + 1}/{totalSteps}</span>
            <button onClick={reset} className="ml-1 opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {tab === "code" && currentStep >= 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{
            background: "rgba(79,142,247,0.1)",
            border: "1px solid rgba(79,142,247,0.3)",
            color: "#4f8ef7",
          }}>
            <span>⟳</span>
            <span>Step {currentStep + 1} highlighted</span>
          </div>
        )}
      </div>

      {/* Content */}
      {tab === "viz" && (
        <div className="space-y-4">
          {VizComponent ? <VizComponent /> : <ProblemVizFallback problem={problem} pattern={pattern} />}
          {/* Approach steps — visible in viz tab so you can click while watching animation */}
          <ApproachSteps problemId={problemId} />
          {/* Hints */}
          <HintPanel problemId={problemId} />
        </div>
      )}
      {tab === "code" && (
        <CodeExplanationPanelDynamic problemId={problemId} />
      )}
    </>
  );
}
