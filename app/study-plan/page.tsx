"use client";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { generateStudyPlan, DayPlan } from "@/lib/studyPlan";
import { useProgressStore } from "@/lib/store";
import { getProblemById } from "@/data/problems";

const COLOR_MAP: Record<string, string> = {
  blue: "#4f8ef7", green: "#22c55e", purple: "#a855f7", orange: "#f97316",
  cyan: "#06b6d4", yellow: "#eab308", emerald: "#10b981", red: "#ef4444",
  violet: "#8b5cf6", teal: "#14b8a6", indigo: "#6366f1", amber: "#f59e0b",
  lime: "#84cc16", rose: "#f43f5e", slate: "#94a3b8", pink: "#ec4899",
};

export default function StudyPlanPage() {
  const today = new Date().toISOString().split("T")[0];
  const [duration, setDuration] = useState<30 | 60>(30);
  const [startDate, setStartDate] = useState(today);
  const { solved } = useProgressStore();

  const plan = useMemo(
    () => generateStudyPlan(duration, startDate),
    [duration, startDate]
  );

  const todayDay = useMemo(() => {
    const idx = plan.days.findIndex((d) => d.date === today);
    return idx >= 0 ? idx + 1 : null;
  }, [plan, today]);

  const currentWeek = todayDay ? Math.ceil(todayDay / 7) : 1;
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const displayWeek = activeWeek ?? currentWeek;

  const totalWeeks = Math.ceil(plan.days.length / 7);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const weekDays = plan.days.filter((d) => Math.ceil(d.day / 7) === displayWeek);

  const solvedInPlan = plan.days.reduce((acc, d) => {
    return acc + d.problems.filter((p) => solved.has(p.id)).length;
  }, 0);
  const totalInPlan = plan.days.reduce((acc, d) => acc + d.problems.length, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-xs" style={{ color: "var(--text-muted)" }}>← Home</Link>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            📅 Study Plan
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Auto-generated daily schedule covering all 17 patterns
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {/* Duration toggle */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Duration</div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg-hover)" }}>
              {([30, 60] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className="px-4 py-1.5 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: duration === d ? "rgba(79,142,247,0.2)" : "transparent",
                    color: duration === d ? "#4f8ef7" : "var(--text-muted)",
                    border: duration === d ? "1px solid rgba(79,142,247,0.35)" : "1px solid transparent",
                  }}
                >
                  {d}-Day
                </button>
              ))}
            </div>
          </div>

          {/* Start date */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Start Date</div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          {/* Progress summary */}
          <div className="ml-auto text-right">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Overall Progress</div>
            <div className="text-lg font-bold" style={{ color: "#4f8ef7" }}>
              {solvedInPlan}/{totalInPlan}
              <span className="text-xs font-normal ml-1" style={{ color: "var(--text-muted)" }}>problems</span>
            </div>
          </div>
        </div>

        {/* Week selector */}
        <div className="flex gap-2 flex-wrap mb-6">
          {weeks.map((w) => {
            const isCurrentWeek = w === currentWeek && startDate === today;
            return (
              <button
                key={w}
                onClick={() => setActiveWeek(w)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: displayWeek === w ? "rgba(79,142,247,0.18)" : "var(--bg-card)",
                  color: displayWeek === w ? "#4f8ef7" : "var(--text-muted)",
                  border: displayWeek === w ? "1px solid rgba(79,142,247,0.35)" : "1px solid var(--border)",
                }}
              >
                Week {w} {isCurrentWeek ? "← today" : ""}
              </button>
            );
          })}
        </div>

        {/* Days grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {weekDays.map((day) => (
            <DayCard key={day.day} day={day} solved={solved} isToday={day.date === today} />
          ))}
        </div>

      </div>
    </div>
  );
}

function DayCard({ day, solved, isToday }: { day: DayPlan; solved: Set<string>; isToday: boolean }) {
  const [expanded, setExpanded] = useState(isToday);
  const color = COLOR_MAP[day.patternColor] ?? "#4f8ef7";
  const solvedCount = day.problems.filter((p) => solved.has(p.id)).length;
  const total = day.problems.length;
  const allDone = total > 0 && solvedCount === total;

  const typeIcon = day.type === "learn" ? "📖" : day.type === "practice" ? "💪" : day.type === "review" ? "🔁" : "🎯";

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        border: isToday ? `1px solid ${color}60` : "1px solid var(--border)",
        background: isToday ? `rgba(${hexToRgb(color)}, 0.06)` : "var(--bg-card)",
      }}
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{typeIcon}</span>
            <div>
              <div className="text-xs font-bold" style={{ color: isToday ? color : "var(--text-primary)" }}>
                Day {day.day} {isToday && <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>Today</span>}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {day.label}
              </div>
            </div>
          </div>
          {total > 0 && (
            <div className="text-right">
              <div className="text-xs font-semibold" style={{ color: allDone ? "#22c55e" : color }}>
                {allDone ? "✓" : `${solvedCount}/${total}`}
              </div>
            </div>
          )}
        </div>

        {/* Mini progress bar */}
        {total > 0 && (
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(solvedCount / total) * 100}%`,
                background: allDone ? "#22c55e" : color,
              }}
            />
          </div>
        )}
      </button>

      {/* Problem list */}
      {expanded && day.problems.length > 0 && (
        <div className="px-4 pb-3 space-y-1.5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="pt-2" />
          {day.problems.map((problem) => {
            const isSolved = solved.has(problem.id);
            return (
              <Link
                key={problem.id}
                href={problem.hasVisualization ? `/visualizations/${problem.id}` : `/problems/${problem.id}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-xs"
                style={{
                  background: isSolved ? "rgba(34,197,94,0.08)" : "var(--bg-hover)",
                  color: isSolved ? "#22c55e" : "var(--text-secondary)",
                  border: isSolved ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent",
                }}
              >
                <span>{isSolved ? "✓" : "○"}</span>
                <span className="flex-1 truncate">{problem.title}</span>
                <span className="shrink-0" style={{
                  color: problem.difficulty === "Easy" ? "#22c55e" : problem.difficulty === "Medium" ? "#f97316" : "#ef4444"
                }}>
                  {problem.difficulty[0]}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {expanded && day.type === "review" && (
        <div className="px-4 pb-3 pt-1 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Go back to patterns you struggled with. Re-solve problems from memory.
          </p>
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "79,142,247";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
