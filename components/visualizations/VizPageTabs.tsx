"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import ProblemVizFallback from "@/components/visualizations/ProblemVizFallback";
import CodeExplanationPanel from "@/components/visualizations/CodeExplanationPanel";
import type { Problem, Pattern } from "@/data/problems";

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

  const tabs = [
    { id: "viz" as const, label: "▶ Visualization", icon: "▶" },
    { id: "code" as const, label: "{ } Code & Explanation", icon: "{}" },
  ];

  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", width: "fit-content" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
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

      {/* Content */}
      {tab === "viz" && (
        VizComponent ? <VizComponent /> : <ProblemVizFallback problem={problem} pattern={pattern} />
      )}
      {tab === "code" && (
        <CodeExplanationPanelDynamic problemId={problemId} />
      )}
    </>
  );
}
