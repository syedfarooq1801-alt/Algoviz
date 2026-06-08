"use client";
import Link from "next/link";
import { useProgressStore } from "@/lib/store";
import { getDueForReview, getUpcomingReviews } from "@/lib/studyPlan";
import { getProblemById } from "@/data/problems";
import { useMemo } from "react";

export default function ReviewQueue() {
  const { solvedDates } = useProgressStore();
  const today = new Date().toISOString().split("T")[0];

  const due = useMemo(() => getDueForReview(solvedDates, today), [solvedDates, today]);
  const upcoming = useMemo(() => getUpcomingReviews(solvedDates, today), [solvedDates, today]);

  if (due.length === 0 && upcoming.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.04)" }}>
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(168,85,247,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-base">🔁</span>
          <h3 className="text-sm font-semibold" style={{ color: "#a855f7" }}>Spaced Repetition</h3>
          {due.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse"
              style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
              {due.length} due today
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Review solved problems at optimal intervals</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Due today */}
        {due.length > 0 && (
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: "#ef4444" }}>⚠ Due Today</div>
            <div className="flex flex-wrap gap-2">
              {due.map((id) => {
                const problem = getProblemById(id);
                if (!problem) return null;
                return (
                  <Link
                    key={id}
                    href={problem.hasVisualization ? `/visualizations/${id}` : `/problems/${id}`}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.25)",
                    }}
                  >
                    {problem.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Upcoming Reviews</div>
            <div className="space-y-1">
              {upcoming.slice(0, 5).map(({ problemId, dueIn }) => {
                const problem = getProblemById(problemId);
                if (!problem) return null;
                return (
                  <div key={problemId} className="flex items-center justify-between">
                    <Link
                      href={problem.hasVisualization ? `/visualizations/${problemId}` : `/problems/${problemId}`}
                      className="text-xs transition-all"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {problem.title}
                    </Link>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      in {dueIn} day{dueIn !== 1 ? "s" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
