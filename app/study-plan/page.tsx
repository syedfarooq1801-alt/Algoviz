"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { generateStudyPlan, PHASE_COLOR, type DayPlan } from "@/lib/studyPlan";
import { useProgressStore } from "@/lib/store";

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
  const { solved } = useProgressStore();
  const [duration, setDuration] = useState<Duration>(30);
  const [activeWeek, setActiveWeek] = useState(0);

  const plan = useMemo(() => generateStudyPlan(duration, todayISO()), [duration]);

  const weeks: DayPlan[][] = useMemo(() => {
    const w: DayPlan[][] = [];
    for (let i = 0; i < plan.days.length; i += 7) {
      w.push(plan.days.slice(i, i + 7));
    }
    return w;
  }, [plan]);

  const week = weeks[activeWeek] ?? [];
  const totalWeeks = weeks.length;

  // Today's task list = first week, first non-rest day (or active week day 0)
  const focusDay = week.find((d) => d.type !== "rest") ?? week[0];

  // Stats
  const totalTasks = plan.days.reduce((n, d) => n + d.tasks.length, 0);
  const completedTasks = plan.days.reduce(
    (n, d) => n + d.tasks.filter((t) => t.domain === "dsa" && solved.has(t.id)).length, 0
  );

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
          {/* Duration selector */}
          <div style={{ display: "flex", gap: 3, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 6, padding: 3 }}>
            {DAYS_OPTIONS.map((d) => (
              <button key={d} onClick={() => { setDuration(d); setActiveWeek(0); }} style={{
                padding: "4px 14px", fontSize: 12, borderRadius: 4, cursor: "pointer",
                background: duration === d ? "var(--accent)" : "transparent",
                color: duration === d ? "#fff" : "var(--text-muted)",
                fontWeight: duration === d ? 600 : 400, border: "none",
                transition: "all 0.1s",
              }}>
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Weekly calendar card */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10,
          padding: 16, marginBottom: 20,
        }}>
          {/* Week nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button onClick={() => setActiveWeek((w) => Math.max(0, w - 1))} disabled={activeWeek === 0}
              style={{ fontSize: 16, color: activeWeek === 0 ? "var(--text-muted)" : "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", opacity: activeWeek === 0 ? 0.3 : 1 }}>
              ‹
            </button>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              Week {activeWeek + 1} / {totalWeeks}
            </span>
            <button onClick={() => setActiveWeek((w) => Math.min(totalWeeks - 1, w + 1))} disabled={activeWeek === totalWeeks - 1}
              style={{ fontSize: 16, color: activeWeek === totalWeeks - 1 ? "var(--text-muted)" : "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", opacity: activeWeek === totalWeeks - 1 ? 0.3 : 1 }}>
              ›
            </button>
          </div>

          {/* 7-day grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {WEEK_DAYS.map((label, wi) => {
              const day = week[wi];
              if (!day) return <div key={wi} />;
              const color = PHASE_COLOR[day.phase] ?? "var(--text-muted)";
              const isRest = day.type === "rest";
              return (
                <div key={wi} style={{
                  background: isRest ? "transparent" : `${color}14`,
                  border: `1px solid ${isRest ? "var(--border-subtle)" : color + "33"}`,
                  borderRadius: 7, padding: "8px 4px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: isRest ? "var(--text-muted)" : color }}>
                    {isRest ? "Rest" : PHASE_LABEL[day.phase] ?? day.phase}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>D{day.day}</div>
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
                  {focusDay.tasks.length} tasks
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {focusDay.tasks.map((task) => {
                  const done = task.domain === "dsa" && solved.has(task.id);
                  return (
                    <Link key={task.id} href={task.href} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 10px", borderRadius: 6,
                        background: done ? "rgba(47,191,113,0.05)" : "var(--bg-secondary)",
                        border: `1px solid ${done ? "rgba(47,191,113,0.2)" : "var(--border-subtle)"}`,
                        transition: "border-color 0.1s",
                      }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                          background: done ? "#2FBF71" : "transparent",
                          border: `1.5px solid ${done ? "#2FBF71" : "var(--border)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {done && <span style={{ fontSize: 9, color: "#fff" }}>✓</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 12, fontWeight: 500,
                            color: done ? "var(--text-muted)" : "var(--text-primary)",
                            textDecoration: done ? "line-through" : "none",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{task.title}</div>
                          {task.tag && (
                            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{task.tag}</div>
                          )}
                        </div>
                        {task.difficulty && (
                          <span style={{
                            fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: 3,
                            color: task.difficulty === "Easy" ? "#2FBF71" : task.difficulty === "Medium" ? "#F5A524" : "#EF4444",
                            background: task.difficulty === "Easy" ? "rgba(47,191,113,0.1)" : task.difficulty === "Medium" ? "rgba(245,165,36,0.1)" : "rgba(239,68,68,0.1)",
                          }}>{task.difficulty}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
                {focusDay.tasks.length === 0 && (
                  <div style={{ textAlign: "center", padding: 24, fontSize: 13, color: "var(--text-muted)" }}>Rest day</div>
                )}
              </div>
            </div>

            {/* Milestones */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, alignSelf: "start" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>Week milestones</div>
              {(["dsa", "sd", "se", "behavioral"] as const).map((phase) => {
                const phaseTasks = week.flatMap((d) => d.tasks.filter((t) => t.domain === phase));
                if (!phaseTasks.length) return null;
                const color = PHASE_COLOR[phase] ?? "var(--text-muted)";
                const donePct = phase === "dsa"
                  ? Math.round((phaseTasks.filter((t) => solved.has(t.id)).length / phaseTasks.length) * 100)
                  : 0;
                return (
                  <div key={phase} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{PHASE_LABEL[phase]}</span>
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                        {phaseTasks.length} items
                      </span>
                    </div>
                    <div style={{ height: 4, background: "var(--border-subtle)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${donePct}%`, background: color, borderRadius: 2, transition: "width 0.3s" }} />
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
