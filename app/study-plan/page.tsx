"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { generateStudyPlan, PHASE_COLOR, type DayPlan, type PlanTask } from "@/lib/studyPlan";
import { useProgressStore } from "@/lib/store";
import { useSDStore } from "@/lib/sdStore";
import { useSEStore } from "@/lib/seStore";

const DAYS_OPTIONS = [30, 60, 90] as const;
type Duration = 30 | 60 | 90;

const PHASE_LABEL: Record<string, string> = {
  dsa: "DSA", sd: "System Design", se: "SE Basics",
  review: "Review", mock: "Mock", behavioral: "Behavioral",
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function StudyPlanPage() {
  const { solved, toggleSolved, studyPlanDuration, setStudyPlanDuration } = useProgressStore();
  const { mastered, toggleMastered } = useSDStore();
  const { completed, toggleChapter } = useSEStore();
  const duration: Duration = studyPlanDuration;
  const [activeWeek, setActiveWeek] = useState(0);

  function changeDuration(d: Duration) {
    setStudyPlanDuration(d);
    setActiveWeek(0);
  }

  const plan = useMemo(() => generateStudyPlan(duration, todayISO()), [duration]);

  const weeks: DayPlan[][] = useMemo(() => {
    const w: DayPlan[][] = [];
    for (let i = 0; i < plan.days.length; i += 7) w.push(plan.days.slice(i, i + 7));
    return w;
  }, [plan]);

  const week = weeks[activeWeek] ?? [];
  const totalWeeks = weeks.length;
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0);
  const focusDay = week[activeDayIdx] ?? week.find((d) => d.type !== "rest") ?? week[0];

  function changeWeek(next: number) {
    setActiveWeek(next);
    const nextWeek = weeks[next] ?? [];
    const firstNonRest = nextWeek.findIndex((d) => d.type !== "rest");
    setActiveDayIdx(firstNonRest >= 0 ? firstNonRest : 0);
  }

  function isTaskDone(task: PlanTask): boolean {
    if (task.domain === "dsa") return solved.has(task.id);
    if (task.domain === "sd") return mastered.has(task.id);
    if (task.domain === "se") return completed.has(task.id);
    return false;
  }

  function toggleTask(task: PlanTask) {
    if (task.domain === "dsa") { toggleSolved(task.id); return; }
    if (task.domain === "sd") { toggleMastered(task.id); return; }
    if (task.domain === "se") { toggleChapter(task.id); return; }
  }

  function tasksDoneCount(tasks: PlanTask[]) {
    return tasks.filter(isTaskDone).length;
  }

  const totalTasks = plan.days.reduce((n, d) => n + d.tasks.filter(t => t.domain !== "behavioral").length, 0);
  const completedTasks = plan.days.reduce((n, d) => n + d.tasks.filter(isTaskDone).length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: 0 }}>
              Study Plan
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0" }}>
              {completedTasks} tasks done · {totalTasks - completedTasks} remaining
            </p>
          </div>
          <div style={{ display: "flex", gap: 3, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 6, padding: 3 }}>
            {DAYS_OPTIONS.map((d) => (
              <button key={d} onClick={() => changeDuration(d)} style={{
                padding: "4px 14px", fontSize: 12, borderRadius: 4, cursor: "pointer",
                background: duration === d ? "var(--accent)" : "transparent",
                color: duration === d ? "#fff" : "var(--text-muted)",
                fontWeight: duration === d ? 600 : 400, border: "none", transition: "all 0.1s",
              }}>{d}d</button>
            ))}
          </div>
        </div>

        {/* Weekly calendar card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button onClick={() => changeWeek(Math.max(0, activeWeek - 1))} disabled={activeWeek === 0}
              style={{ fontSize: 16, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", opacity: activeWeek === 0 ? 0.3 : 1 }}>‹</button>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              Week {activeWeek + 1} / {totalWeeks}
            </span>
            <button onClick={() => changeWeek(Math.min(totalWeeks - 1, activeWeek + 1))} disabled={activeWeek === totalWeeks - 1}
              style={{ fontSize: 16, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", opacity: activeWeek === totalWeeks - 1 ? 0.3 : 1 }}>›</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {WEEK_DAYS.map((label, wi) => {
              const day = week[wi];
              if (!day) return <div key={wi} />;
              const color = PHASE_COLOR[day.phase] ?? "var(--text-muted)";
              const isRest = day.type === "rest";
              const dayDone = isRest ? 0 : tasksDoneCount(day.tasks);
              const dayTotal = isRest ? 0 : day.tasks.filter(t => t.domain !== "behavioral").length;
              const isActive = wi === activeDayIdx;
              return (
                <div key={wi} onClick={() => setActiveDayIdx(wi)} style={{
                  background: isActive ? `${color}28` : isRest ? "transparent" : `${color}14`,
                  border: `2px solid ${isActive ? color : isRest ? "var(--border-subtle)" : color + "33"}`,
                  borderRadius: 7, padding: "8px 4px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.12s",
                }}>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: isRest ? "var(--text-muted)" : color }}>
                    {isRest ? "Rest" : PHASE_LABEL[day.phase] ?? day.phase}
                  </div>
                  {!isRest && dayTotal > 0 && (
                    <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>
                      {dayDone}/{dayTotal}
                    </div>
                  )}
                  {isRest && <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>D{day.day}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-column: tasks + milestones */}
        {focusDay && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 14 }}>
            {/* Task list */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: PHASE_COLOR[focusDay.phase] ?? "var(--accent)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  Day {focusDay.day} — {focusDay.label}
                </span>
                <span style={{
                  marginLeft: "auto", fontSize: 10, fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)", background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)", borderRadius: 4, padding: "2px 7px",
                }}>
                  {tasksDoneCount(focusDay.tasks)}/{focusDay.tasks.length} done
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {focusDay.tasks.map((task) => {
                  const done = isTaskDone(task);
                  const canToggle = task.domain !== "behavioral";
                  return (
                    <div
                      key={task.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 10px", borderRadius: 6,
                        background: done ? "rgba(47,191,113,0.05)" : "var(--bg-secondary)",
                        border: `1px solid ${done ? "rgba(47,191,113,0.2)" : "var(--border-subtle)"}`,
                        transition: "border-color 0.1s",
                      }}
                    >
                      {/* Checkbox — separate toggle */}
                      <button
                        onClick={() => canToggle && toggleTask(task)}
                        disabled={!canToggle}
                        style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                          background: done ? "#2FBF71" : "transparent",
                          border: `1.5px solid ${done ? "#2FBF71" : "var(--border)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: canToggle ? "pointer" : "default", padding: 0,
                        }}
                      >
                        {done && <span style={{ fontSize: 9, color: "#fff", lineHeight: 1 }}>✓</span>}
                      </button>

                      {/* Title — navigates to topic/problem */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {task.href ? (
                          <Link href={task.href} target="_blank" rel="noopener noreferrer" style={{
                            display: "block", fontSize: 12, fontWeight: 500,
                            color: done ? "var(--text-muted)" : "var(--accent)",
                            textDecoration: done ? "line-through" : "none",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{task.title}</Link>
                        ) : (
                          <div style={{
                            fontSize: 12, fontWeight: 500,
                            color: done ? "var(--text-muted)" : "var(--text-primary)",
                            textDecoration: done ? "line-through" : "none",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{task.title}</div>
                        )}
                        {task.tag && (
                          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{task.tag}</div>
                        )}
                      </div>

                      {task.difficulty && task.difficulty !== "Theory" && (
                        <span style={{
                          fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: 3,
                          color: task.difficulty === "Easy" ? "#2FBF71" : task.difficulty === "Medium" ? "#F5A524" : "#EF4444",
                          background: task.difficulty === "Easy" ? "rgba(47,191,113,0.1)" : task.difficulty === "Medium" ? "rgba(245,165,36,0.1)" : "rgba(239,68,68,0.1)",
                        }}>{task.difficulty}</span>
                      )}
                    </div>
                  );
                })}
                {focusDay.tasks.length === 0 && (
                  <div style={{ textAlign: "center", padding: 24, fontSize: 13, color: "var(--text-muted)" }}>Rest day</div>
                )}
              </div>
            </div>

            {/* Milestones — all domains with real progress */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, alignSelf: "start" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>Week milestones</div>
              {(["dsa", "sd", "se"] as const).map((phase) => {
                const phaseTasks = week.flatMap((d) => d.tasks.filter((t) => t.domain === phase));
                if (!phaseTasks.length) return null;
                const color = PHASE_COLOR[phase] ?? "var(--text-muted)";
                const done = tasksDoneCount(phaseTasks);
                const pct = Math.round((done / phaseTasks.length) * 100);
                return (
                  <div key={phase} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{PHASE_LABEL[phase]}</span>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                        {done}/{phaseTasks.length}
                      </span>
                    </div>
                    <div style={{ height: 4, background: "var(--border-subtle)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
