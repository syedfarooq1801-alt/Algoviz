"use client";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {
  generateStudyPlan,
  DayPlan,
  PlanTask,
  PHASE_COLOR,
  DayPhase,
} from "@/lib/studyPlan";
import { useProgressStore } from "@/lib/store";
import { useSDStore } from "@/lib/sdStore";
import { useSEStore } from "@/lib/seStore";
import { PATTERNS } from "@/data/problems";
import { getAllConcepts, getAllCaseStudyRefs } from "@/data/systemDesign";
import { getTotalSEChapters } from "@/data/seBasics";

type Duration = 30 | 60 | 90;
type PhaseFilter = "all" | DayPhase;

const DURATION_LABELS: Record<Duration, string> = {
  30: "30-Day Intensive",
  60: "60-Day Standard",
  90: "90-Day Comprehensive",
};

const PHASE_LABEL: Record<DayPhase, string> = {
  dsa: "DSA",
  sd: "System Design",
  se: "SE Basics",
  review: "Review",
  mock: "Mock",
};

const TYPE_ICON: Record<string, string> = {
  learn: "◈",
  practice: "◇",
  review: "↺",
  mock: "⚡",
  rest: "○",
};

export default function StudyPlanPage() {
  const today = new Date().toISOString().split("T")[0];
  const [duration, setDuration] = useState<Duration>(90);
  const [startDate, setStartDate] = useState(today);
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>("all");

  const { solved } = useProgressStore();
  const { mastered } = useSDStore();
  const { completed } = useSEStore();

  const plan = useMemo(
    () => generateStudyPlan(duration, startDate),
    [duration, startDate]
  );

  const todayDayIdx = useMemo(
    () => plan.days.findIndex((d) => d.date === today),
    [plan, today]
  );
  const todayDay = todayDayIdx >= 0 ? todayDayIdx + 1 : null;
  const currentWeek = todayDay ? Math.ceil(todayDay / 7) : 1;
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const displayWeek = activeWeek ?? currentWeek;

  const visibleDays = useMemo(() => {
    const filtered = phaseFilter === "all"
      ? plan.days
      : plan.days.filter((d) => d.phase === phaseFilter);
    return filtered.filter((d) => Math.ceil(d.day / 7) === displayWeek);
  }, [plan, phaseFilter, displayWeek]);

  const totalWeeks = Math.ceil(plan.days.length / 7);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  // Overall domain progress
  const totalDSA = PATTERNS.reduce((s, p) => s + p.problems.length, 0);
  const totalSD  = getAllConcepts().length + getAllCaseStudyRefs().length;
  const totalSE  = getTotalSEChapters();

  // Plan-specific progress
  const planTotals = useMemo(() => {
    let dsa = 0, sd = 0, se = 0, dsaDone = 0, sdDone = 0, seDone = 0;
    for (const day of plan.days) {
      for (const t of day.tasks) {
        if (t.domain === "dsa") { dsa++; if (solved.has(t.id)) dsaDone++; }
        if (t.domain === "sd")  { sd++;  if (mastered.has(t.id)) sdDone++; }
        if (t.domain === "se")  { se++;  if (completed.has(t.id)) seDone++; }
      }
    }
    return { dsa, sd, se, dsaDone, sdDone, seDone };
  }, [plan, solved, mastered, completed]);

  const overallDone  = planTotals.dsaDone + planTotals.sdDone + planTotals.seDone;
  const overallTotal = planTotals.dsa + planTotals.sd + planTotals.se;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-10 pb-24 lg:pb-10">

        {/* Editorial header */}
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <Link href="/" className="text-xs hover:underline" style={{ color: "var(--text-muted)" }}>← Home</Link>
          </div>
          <p className="eyebrow mb-3">PLACEMENT PREP ROADMAP</p>
          <h1 className="title-1 mb-3" style={{ color: "var(--text-primary)" }}>
            Your Complete Study Plan
          </h1>
          <p className="lede" style={{ maxWidth: "38rem" }}>
            DSA patterns, System Design concepts, and SE Basics — all in one schedule with built-in revision days.
          </p>
        </div>

        {/* Phase progress overview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {([
            { phase: "dsa" as const, label: "DSA",           done: solved.size,   total: totalDSA, planDone: planTotals.dsaDone, planTotal: planTotals.dsa },
            { phase: "sd"  as const, label: "System Design", done: mastered.size, total: totalSD,  planDone: planTotals.sdDone,  planTotal: planTotals.sd  },
            { phase: "se"  as const, label: "SE Basics",     done: completed.size, total: totalSE, planDone: planTotals.seDone,  planTotal: planTotals.se  },
          ] as const).map((item) => {
            const pct = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
            return (
              <button
                key={item.phase}
                onClick={() => setPhaseFilter(phaseFilter === item.phase ? "all" : item.phase)}
                className="p-4 rounded-xl text-left transition-all"
                style={{
                  background: phaseFilter === item.phase ? `rgba(${hexToRgb(PHASE_COLOR[item.phase])},0.08)` : "var(--bg-card)",
                  border: phaseFilter === item.phase ? `1px solid ${PHASE_COLOR[item.phase]}50` : "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: PHASE_COLOR[item.phase] }}>
                    {item.label}
                  </span>
                  <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{pct}%</span>
                </div>
                <div className="h-[2px] rounded-full overflow-hidden mb-2" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: PHASE_COLOR[item.phase], transition: "width 0.6s ease" }}
                  />
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {item.done} / {item.total} total
                  {item.planTotal > 0 && (
                    <span className="ml-1">· {item.planDone}/{item.planTotal} in plan</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Config + summary row */}
        <div className="flex flex-wrap items-start gap-4 mb-8 p-4 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {/* Duration */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Duration</div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg-hover)" }}>
              {([30, 60, 90] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: duration === d ? "rgba(79,140,255,0.2)" : "transparent",
                    color: duration === d ? "#4F8CFF" : "var(--text-muted)",
                    border: duration === d ? "1px solid rgba(79,140,255,0.35)" : "1px solid transparent",
                  }}
                >
                  {d}d
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
              onChange={(e) => { setStartDate(e.target.value); setActiveWeek(null); }}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
            />
          </div>

          {/* Summary */}
          <div className="ml-auto text-right">
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{DURATION_LABELS[duration]}</div>
            <div className="text-lg font-bold" style={{ color: "var(--accent)" }}>
              {overallDone}/{overallTotal}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>tasks complete</div>
          </div>
        </div>

        {/* Phase filter row */}
        <div className="flex gap-2 flex-wrap mb-5">
          {(["all", "dsa", "sd", "se", "review", "mock"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setPhaseFilter(f)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                background: phaseFilter === f
                  ? f === "all" ? "rgba(79,140,255,0.18)" : `rgba(${hexToRgb(PHASE_COLOR[f as DayPhase])},0.18)`
                  : "var(--bg-card)",
                color: phaseFilter === f
                  ? f === "all" ? "#4F8CFF" : PHASE_COLOR[f as DayPhase]
                  : "var(--text-muted)",
                border: phaseFilter === f
                  ? f === "all" ? "1px solid rgba(79,140,255,0.35)" : `1px solid ${PHASE_COLOR[f as DayPhase]}50`
                  : "1px solid var(--border)",
              }}
            >
              {f === "all" ? "All" : PHASE_LABEL[f as DayPhase]}
            </button>
          ))}
        </div>

        {/* Week selector */}
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
          {weeks.map((w) => {
            const isCurrentWeek = w === currentWeek && startDate === today;
            const hasContent = phaseFilter === "all"
              ? plan.days.some((d) => Math.ceil(d.day / 7) === w)
              : plan.days.some((d) => Math.ceil(d.day / 7) === w && d.phase === phaseFilter);
            return (
              <button
                key={w}
                onClick={() => setActiveWeek(w)}
                disabled={!hasContent}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: displayWeek === w ? "rgba(79,140,255,0.18)" : "var(--bg-card)",
                  color: displayWeek === w ? "#4F8CFF" : hasContent ? "var(--text-muted)" : "var(--border)",
                  border: displayWeek === w ? "1px solid rgba(79,140,255,0.35)" : "1px solid var(--border)",
                  opacity: hasContent ? 1 : 0.4,
                }}
              >
                Wk {w}{isCurrentWeek ? " ←" : ""}
              </button>
            );
          })}
        </div>

        {/* Today banner */}
        {todayDay && Math.ceil(todayDay / 7) === displayWeek && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(79,140,255,0.08)", border: "1px solid rgba(79,140,255,0.25)", color: "#4F8CFF" }}>
            Today is Day {todayDay} — {plan.days[todayDayIdx]?.label}
          </div>
        )}

        {/* Day cards */}
        {visibleDays.length === 0 ? (
          <div className="py-16 text-center" style={{ color: "var(--text-muted)" }}>
            No {phaseFilter !== "all" ? PHASE_LABEL[phaseFilter as DayPhase] : ""} days in week {displayWeek}.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleDays.map((day) => (
              <DayCard
                key={day.day}
                day={day}
                isToday={day.date === today}
                solved={solved}
                mastered={mastered}
                completed={completed}
              />
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-10 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          {(["dsa", "sd", "se", "review", "mock"] as DayPhase[]).map((p) => (
            <span key={p} className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: PHASE_COLOR[p] }} />
              {PHASE_LABEL[p]}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-3">
            <span>{TYPE_ICON.learn} Learn</span>
            <span>{TYPE_ICON.practice} Practice</span>
            <span>{TYPE_ICON.review} Review</span>
            <span>{TYPE_ICON.mock} Mock</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── DayCard ─────────────────────────────────────────────────────────────────

function DayCard({
  day,
  isToday,
  solved,
  mastered,
  completed,
}: {
  day: DayPlan;
  isToday: boolean;
  solved: Set<string>;
  mastered: Set<string>;
  completed: Set<string>;
}) {
  const [expanded, setExpanded] = useState(isToday || day.type === "review" || day.type === "mock");
  const [showAll, setShowAll] = useState(false);

  function isDone(task: PlanTask): boolean {
    if (task.domain === "dsa") return solved.has(task.id);
    if (task.domain === "sd")  return mastered.has(task.id);
    if (task.domain === "se")  return completed.has(task.id);
    return false;
  }

  const isReviewOrMock = day.type === "review" || day.type === "mock";
  const doneTasks  = day.tasks.filter(isDone).length;
  const totalTasks = day.tasks.length;
  const allDone    = totalTasks > 0 && doneTasks === totalTasks;
  const color      = day.color;

  // For review days, show count of covered tasks as secondary info
  const coveredCount = day.reviewCovered?.length ?? 0;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: isToday ? `1px solid ${color}70` : "1px solid var(--border)",
        background: isToday ? `rgba(${hexToRgb(color)},0.05)` : "var(--bg-card)",
      }}
    >
      {/* Card header */}
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-3 text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            <span className="mt-0.5 text-sm shrink-0" style={{ color }}>{TYPE_ICON[day.type]}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                <span className="text-xs font-bold" style={{ color: isToday ? color : "var(--text-primary)" }}>
                  Day {day.day}
                </span>
                {isToday && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${color}25`, color }}>
                    Today
                  </span>
                )}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: `rgba(${hexToRgb(color)},0.15)`, color }}>
                  {PHASE_LABEL[day.phase]}
                </span>
              </div>
              <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{day.label}</div>
            </div>
          </div>
          <div className="shrink-0 text-right">
            {isReviewOrMock && coveredCount > 0 ? (
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{coveredCount} covered</div>
            ) : totalTasks > 0 ? (
              <div className="text-xs font-semibold" style={{ color: allDone ? "#2FBF71" : color }}>
                {allDone ? "✓" : `${doneTasks}/${totalTasks}`}
              </div>
            ) : null}
          </div>
        </div>

        {!isReviewOrMock && totalTasks > 0 && (
          <div className="mt-2 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full"
              style={{ width: `${(doneTasks / totalTasks) * 100}%`, background: allDone ? "#2FBF71" : color, transition: "width 0.4s ease" }}
            />
          </div>
        )}
      </button>

      {expanded && (
        <div className="border-t" style={{ borderColor: "var(--border-subtle)" }}>

          {/* Review/mock: focus section */}
          {isReviewOrMock && totalTasks > 0 && (
            <div className="px-4 pt-3 pb-2">
              <div className="text-[10px] font-semibold mb-2 uppercase tracking-wide" style={{ color }}>
                Focus on these first
              </div>
              <div className="space-y-1.5">
                {day.tasks.map((task) => {
                  const done = isDone(task);
                  const domainColor = task.domain === "dsa" ? "#4F8CFF" : task.domain === "sd" ? "#2FBF71" : "#F5A524";
                  return (
                    <Link key={task.id} href={task.href}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background: done ? "rgba(47,191,113,0.06)" : "var(--bg-hover)",
                        color: "var(--text-secondary)",
                        borderLeft: `2px solid ${done ? "#2FBF71" : domainColor}`,
                      }}
                    >
                      <span className="shrink-0 text-[10px]" style={{ color: done ? "#2FBF71" : "var(--text-muted)" }}>
                        {done ? "✓" : "↺"}
                      </span>
                      <span className="flex-1 truncate">{task.title}</span>
                      {task.meta && (
                        <span className="shrink-0 text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {task.meta}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content days: task list */}
          {!isReviewOrMock && totalTasks > 0 && (
            <div className="px-4 pt-3 pb-3 space-y-1.5">
              {day.tasks.map((task) => {
                const done = isDone(task);
                return (
                  <Link key={task.id} href={task.href}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-xs"
                    style={{
                      background: done ? "rgba(47,191,113,0.08)" : "var(--bg-hover)",
                      color: done ? "#2FBF71" : "var(--text-secondary)",
                      border: done ? "1px solid rgba(47,191,113,0.2)" : "1px solid transparent",
                    }}
                  >
                    <span className="shrink-0">{done ? "✓" : "○"}</span>
                    <span className="flex-1 truncate">{task.title}</span>
                    {task.difficulty && (
                      <span className="shrink-0" style={{
                        color: task.difficulty === "Easy" ? "#2FBF71" : task.difficulty === "Medium" ? "#F5A524" : "#EF4444",
                      }}>
                        {task.difficulty[0]}
                      </span>
                    )}
                    {!task.difficulty && task.tag && (
                      <span className="shrink-0 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {task.tag.split(" ")[0]}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Review note */}
          {day.reviewNote && (
            <div className="mx-4 mb-3 px-3 py-2.5 rounded-lg text-xs leading-relaxed"
              style={{ background: `rgba(${hexToRgb(color)},0.06)`, borderLeft: `2px solid ${color}`, color: "var(--text-secondary)" }}>
              {day.reviewNote}
            </div>
          )}

          {/* Collapsible: all covered in window */}
          {isReviewOrMock && coveredCount > 0 && (
            <div className="px-4 pb-3">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[10px] font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {showAll ? "▲" : "▼"} All covered this window ({coveredCount})
              </button>
              {showAll && (
                <div className="mt-2 space-y-1">
                  {day.reviewCovered?.map((task) => {
                    const done = isDone(task);
                    return (
                      <Link key={task.id} href={task.href}
                        className="flex items-center gap-2 px-2 py-1 rounded text-[10px] transition-all"
                        style={{ color: done ? "#2FBF71" : "var(--text-muted)" }}
                      >
                        <span>{done ? "✓" : "○"}</span>
                        <span className="flex-1 truncate">{task.title}</span>
                        {task.meta && <span style={{ color: "var(--border)" }}>{task.meta}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return "79,140,255";
  return `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`;
}
