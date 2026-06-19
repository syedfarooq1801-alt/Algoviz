"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { generateStudyPlan, type DayPhase, type DayPlan, type PlanTask } from "@/lib/studyPlan";
import { useProgressStore } from "@/lib/store";
import { useSDStore } from "@/lib/sdStore";
import { useSEStore } from "@/lib/seStore";
import { useInterviewStore, COMPANIES, type TargetCompany } from "@/lib/interviewStore";
import { PREP_TRACKS, usePrepStore, type PrepTrackId } from "@/lib/prepStore";

type Duration = 30 | 60 | 90;
type PhaseFilter = "all" | DayPhase;

const PHASE_LABEL: Record<DayPhase, string> = {
  dsa: "DSA",
  sd: "System Design",
  se: "SE Basics",
  review: "Review",
  mock: "Mock",
  behavioral: "Behavioral",
};

const FILTERS: { id: PhaseFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "dsa", label: "DSA" },
  { id: "sd", label: "System Design" },
  { id: "se", label: "SE Basics" },
  { id: "review", label: "Review" },
  { id: "mock", label: "Mock" },
  { id: "behavioral", label: "Behavioral" },
];

export default function StudyPlanPage() {
  const today = new Date().toISOString().split("T")[0];
  const [duration, setDuration] = useState<Duration>(90);
  const [startDate, setStartDate] = useState(today);
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>("all");
  const { solved, toggleSolved } = useProgressStore();
  const { mastered, toggleMastered } = useSDStore();
  const { completed, toggleChapter } = useSEStore();
  const { targetDate, targetCompany, setTarget, clearTarget, daysUntil } = useInterviewStore();
  const { selectedTrack, setTrack } = usePrepStore();
  const [interviewDate, setInterviewDate] = useState(targetDate ?? "");
  const [interviewCompany, setInterviewCompany] = useState<TargetCompany>(targetCompany ?? "Google");
  const days = daysUntil();

  const plan = useMemo(
    () => generateStudyPlan(duration, startDate, PREP_TRACKS[selectedTrack].weights),
    [duration, startDate, selectedTrack]
  );
  const todayIdx = plan.days.findIndex((d) => d.date === today);
  const todayDay = todayIdx >= 0 ? todayIdx + 1 : null;
  const currentWeek = todayDay ? Math.ceil(todayDay / 7) : 1;
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const displayWeek = activeWeek ?? currentWeek;
  const totalWeeks = Math.ceil(plan.days.length / 7);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const visibleDays = useMemo(() => {
    const start = (displayWeek - 1) * 7 + 1;
    const end = displayWeek * 7;
    return plan.days
      .filter((day) => day.day >= start && day.day <= end)
      .filter((day) => phaseFilter === "all" || day.phase === phaseFilter);
  }, [displayWeek, phaseFilter, plan.days]);

  const totals = useMemo(() => {
    let done = 0;
    let total = 0;
    for (const day of plan.days) {
      for (const task of day.tasks) {
        total += 1;
        if (isTaskDone(task, solved, mastered, completed)) done += 1;
      }
    }
    return { done, total };
  }, [plan.days, solved, mastered, completed]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-7 pb-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/" className="text-xs hover:underline" style={{ color: "var(--text-muted)" }}>Home</Link>
            <h1 className="text-2xl font-semibold mt-2 mb-1" style={{ color: "var(--text-primary)" }}>Study plan</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {totals.done}/{totals.total} tasks complete
              {targetDate && days !== null ? ` · ${targetCompany ?? "Interview"} in ${Math.max(0, days)} days` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {([30, 60, 90] as const).map((d) => (
              <button key={d} onClick={() => setDuration(d)} className="quiet-pill" data-active={duration === d}>
                {d}d
              </button>
            ))}
          </div>
        </div>

        <section className="quiet-panel p-4 mb-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Start date">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setActiveWeek(null); }}
                  className="quiet-input"
                />
              </Field>
              <Field label="Prep track">
                <select value={selectedTrack} onChange={(e) => setTrack(e.target.value as PrepTrackId)} className="quiet-input">
                  {Object.entries(PREP_TRACKS).map(([id, track]) => <option key={id} value={id}>{track.title}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
              <Field label="Company">
                <select value={interviewCompany} onChange={(e) => setInterviewCompany(e.target.value as TargetCompany)} className="quiet-input">
                  {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Interview date">
                <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className="quiet-input" />
              </Field>
              <div className="flex items-end gap-2">
                <button onClick={() => { if (interviewDate) setTarget(interviewDate, interviewCompany); }} className="btn-primary px-3 py-2 text-xs">Save</button>
                {targetDate && <button onClick={clearTarget} className="btn-ghost px-3 py-2 text-xs">Clear</button>}
              </div>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>{PREP_TRACKS[selectedTrack].focus}</p>
        </section>

        <section className="quiet-panel mb-4 overflow-hidden">
          <div className="flex flex-wrap gap-1 p-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            {FILTERS.map((filter) => (
              <button key={filter.id} onClick={() => setPhaseFilter(filter.id)} className="quiet-pill" data-active={phaseFilter === filter.id}>
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 overflow-x-auto p-2">
            {weeks.map((week) => (
              <button key={week} onClick={() => setActiveWeek(week)} className="week-tab" data-active={week === displayWeek}>
                Week {week}
              </button>
            ))}
          </div>
        </section>

        {todayDay && Math.ceil(todayDay / 7) === displayWeek && (
          <div className="quiet-panel px-4 py-3 mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            Today: Day {todayDay} · {plan.days[todayIdx]?.label}
          </div>
        )}

        <section className="quiet-panel overflow-hidden">
          <div className="study-head">
            <span>Day</span>
            <span>Focus</span>
            <span>Progress</span>
          </div>
          {visibleDays.length > 0 ? visibleDays.map((day) => (
            <DayRow
              key={day.day}
              day={day}
              isToday={day.date === today}
              solved={solved}
              mastered={mastered}
              completed={completed}
              toggleSolved={toggleSolved}
              toggleMastered={toggleMastered}
              toggleChapter={toggleChapter}
            />
          )) : (
            <div className="px-4 py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              No days match this filter in week {displayWeek}.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</span>
      {children}
    </label>
  );
}

function DayRow({
  day,
  isToday,
  solved,
  mastered,
  completed,
  toggleSolved,
  toggleMastered,
  toggleChapter,
}: {
  day: DayPlan;
  isToday: boolean;
  solved: Set<string>;
  mastered: Set<string>;
  completed: Set<string>;
  toggleSolved: (id: string) => void;
  toggleMastered: (id: string) => void;
  toggleChapter: (id: string) => void;
}) {
  const [open, setOpen] = useState(isToday);
  const done = day.tasks.filter((task) => isTaskDone(task, solved, mastered, completed)).length;
  const total = day.tasks.length;
  const covered = day.reviewCovered?.length ?? 0;
  const displayTotal = total || covered;
  const progress = total ? `${done}/${total}` : covered ? `${covered} covered` : "-";

  function handleToggle(task: PlanTask) {
    if (task.kind === "theory" || task.kind === "behavioral") return;
    if (task.domain === "dsa") toggleSolved(task.id);
    else if (task.domain === "sd") toggleMastered(task.id);
    else if (task.domain === "se") toggleChapter(task.id);
  }

  return (
    <div className={isToday ? "study-row is-today" : "study-row"}>
      <button onClick={() => setOpen(!open)} className="study-summary">
        <span className="min-w-0">
          <span className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Day {day.day}{isToday ? " · Today" : ""}
          </span>
          <span className="block text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{day.date}</span>
        </span>
        <span className="min-w-0">
          <span className="block text-sm truncate" style={{ color: "var(--text-secondary)" }}>{day.label}</span>
          <span className="block text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{PHASE_LABEL[day.phase]} · {day.type}</span>
        </span>
        <span className="text-right">
          <span className="block text-sm font-mono" style={{ color: total && done === total ? "var(--accent-green)" : "var(--text-secondary)" }}>{progress}</span>
          {displayTotal ? (
            <span className="block mt-2 meter-track">
              <span className="meter-fill blue-only" style={{ width: `${total ? Math.round((done / total) * 100) : 100}%` }} />
            </span>
          ) : null}
        </span>
      </button>

      {open && (
        <div className="study-detail">
          {day.reviewNote && <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{day.reviewNote}</p>}
          <div className="grid md:grid-cols-2 gap-2">
            {(day.tasks.length ? day.tasks : day.reviewCovered ?? []).slice(0, 20).map((task) => {
              const taskDone = isTaskDone(task, solved, mastered, completed);
              const canToggle = task.kind !== "theory" && task.kind !== "behavioral";
              return (
                <div key={`${task.domain}-${task.id}`} className="study-task" style={{ padding: 0 }}>
                  {canToggle && (
                    <button
                      onClick={() => handleToggle(task)}
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: 32,
                        alignSelf: "stretch",
                        background: taskDone ? "rgba(47,191,113,0.08)" : "transparent",
                        borderRight: "1px solid var(--border-subtle)",
                        color: taskDone ? "#2FBF71" : "var(--text-muted)",
                        fontSize: 13,
                        transition: "background 0.15s",
                      }}
                      title={taskDone ? "Mark unsolved" : "Mark solved"}
                    >
                      {taskDone ? "✓" : "○"}
                    </button>
                  )}
                  <Link
                    href={task.href}
                    className="flex items-center justify-between flex-1 min-w-0 px-3 py-2"
                  >
                    <span className="truncate text-xs" style={{ color: taskDone ? "var(--accent-green)" : "var(--text-secondary)" }}>
                      {task.title}
                    </span>
                    <span className="text-xs ml-2 shrink-0" style={{ color: "var(--text-muted)" }}>{task.difficulty ?? task.meta ?? task.domain}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function isTaskDone(task: PlanTask, solved: Set<string>, mastered: Set<string>, completed: Set<string>) {
  if (task.kind === "theory" || task.kind === "behavioral") return true;
  if (task.domain === "dsa") return solved.has(task.id);
  if (task.domain === "sd") return mastered.has(task.id);
  if (task.domain === "se") return completed.has(task.id);
  return false;
}
