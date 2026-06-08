"use client";
import { useEffect } from "react";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { useStepSyncStore } from "@/lib/store";

interface Props {
  problemId: string;
  compact?: boolean; // compact mode for pattern page
}

export default function ApproachSteps({ problemId, compact = false }: Props) {
  const content = PROBLEM_CONTENT[problemId];
  const { currentStep, setStep, setTotalSteps } = useStepSyncStore();

  const steps = content?.approach ?? [];

  useEffect(() => {
    if (steps.length > 0) setTotalSteps(steps.length);
  }, [steps.length, setTotalSteps]);

  if (!content || steps.length === 0) return null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(79,142,247,0.04)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">🗺️</span>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Step-by-Step Approach
          </h3>
          {currentStep >= 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(79,142,247,0.15)",
                color: "#4f8ef7",
                border: "1px solid rgba(79,142,247,0.3)",
              }}
            >
              Step {currentStep + 1}/{steps.length}
            </span>
          )}
        </div>
        {currentStep >= 0 && (
          <button
            onClick={() => setStep(-1)}
            className="text-xs transition-all"
            style={{ color: "var(--text-muted)" }}
          >
            Clear ✕
          </button>
        )}
      </div>

      {/* Steps */}
      <div className={`p-3 space-y-1.5 ${compact ? "" : ""}`}>
        {!compact && (
          <p className="text-xs px-1 pb-1" style={{ color: "var(--text-muted)" }}>
            Click a step to sync — watch the animation for that step
          </p>
        )}
        {steps.map((step, i) => {
          const isActive = currentStep === i;
          return (
            <button
              key={i}
              onClick={() => setStep(isActive ? -1 : i)}
              className="w-full flex gap-3 text-sm rounded-lg px-3 py-2 cursor-pointer transition-all text-left"
              style={{
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "rgba(79,142,247,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(79,142,247,0.3)" : "1px solid transparent",
              }}
            >
              <span
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{
                  background: isActive ? "#4f8ef7" : "rgba(79,142,247,0.2)",
                  color: isActive ? "#fff" : "#4f8ef7",
                }}
              >
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
