"use client";
import { useEffect } from "react";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { useStepSyncStore } from "@/lib/store";

interface Props {
  problemId: string;
  compact?: boolean;
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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Step-by-Step Approach
        </h3>
        {currentStep >= 0 && (
          <button
            onClick={() => setStep(-1)}
            className="text-xs transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            Clear
          </button>
        )}
      </div>
      {!compact && (
        <p className="mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
          Click a step to sync with the visualization.
        </p>
      )}
      <div className="space-y-2">
        {steps.map((step, i) => {
          const isActive = currentStep === i;
          return (
            <button
              key={i}
              onClick={() => setStep(isActive ? -1 : i)}
              className="flex w-full gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all"
              style={{
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "var(--accent-soft)" : "transparent",
                border: isActive
                  ? "1px solid rgba(79,140,255,0.25)"
                  : "1px solid transparent",
              }}
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: isActive ? "var(--accent)" : "rgba(79,140,255,0.15)",
                  color: isActive ? "#fff" : "var(--accent)",
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
