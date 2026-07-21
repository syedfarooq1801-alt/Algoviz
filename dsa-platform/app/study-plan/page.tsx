"use client";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useMobile } from "@/lib/useMobile";
import Link from "next/link";
import { generateStudyPlan, rebalancePlan, PHASE_COLOR, estHours, type DayPlan, type PlanTask } from "@/lib/studyPlan";
import { useProgressStore } from "@/lib/store";
import { useSDStore } from "@/lib/sdStore";
import { useSEStore } from "@/lib/seStore";
import { useLLDStore } from "@/lib/lldStore";
import { useInterviewStore } from "@/lib/interviewStore";

const DAYS_OPTIONS = [21, 30, 60, 90] as const;
type Duration = 21 | 30 | 60 | 90;

const PHASE_LABEL: Record<string, string> = {
  dsa: "DSA", sd: "System Design", se: "SE Basics", lld: "LLD",
  review: "Review", mock: "Mock", behavioral: "Behavioral",
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Same palette as /dsa sheet, so a company reads the same color everywhere.
const COMPANY_COLORS: Record<string, string> = {
  Google: "#4F8CFF", Amazon: "#F5A524", Meta: "#A78BFA", Facebook: "#A78BFA",
  Apple: "#9499C0", Microsoft: "#22D587", LinkedIn: "#0EA5E9", Netflix: "#EF4444",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00").getTime();
  const b = new Date(toISO + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
}

// Tag a task link so the detail page's Next button follows the plan sequence.
function withPlanSrc(href: string): string {
  const h = href.indexOf("#");
  const hash = h >= 0 ? href.slice(h) : "";
  const base = h >= 0 ? href.slice(0, h) : href;
  return `${base}${base.includes("?") ? "&" : "?"}src=plan${hash}`;
}

export default function StudyPlanPage() {
  const isMobile = useMobile();
  const { solved, toggleSolved, studyPlanDuration, setStudyPlanDuration, planStartDate, setPlanStartDate, weakAreas, toggleWeak, isWeak } = useProgressStore();
  const { mastered, toggleMastered } = useSDStore();
  const { completed, toggleChapter } = useSEStore();
  const { completed: lldCompleted, toggleChapter: toggleLLDChapter } = useLLDStore();
  const targetDate = useInterviewStore((s) => s.targetDate);
  const duration: Duration = studyPlanDuration;
  const [activeWeek, setActiveWeek] = useState(0);

  const today = todayISO();
  // Anchor the plan to a fixed start date so "today" maps to a real day.
  // First visit (or after reset) sets it to today.
  useEffect(() => {
    if (!planStartDate) setPlanStartDate(today);
  }, [planStartDate, setPlanStartDate, today]);
  const startDate = planStartDate || today;

  function changeDuration(d: Duration) {
    setStudyPlanDuration(d);
    const idx = Math.max(0, Math.min(daysBetween(startDate, today), d - 1));
    setActiveWeek(Math.floor(idx / 7));
    setActiveDayIdx(idx % 7);
  }

  const weakKey = useMemo(() => Array.from(weakAreas).sort().join(","), [weakAreas]);
  const basePlan = useMemo(
    () => generateStudyPlan(duration, startDate, undefined, weakKey ? weakKey.split(",") : []),
    [duration, startDate, weakKey]
  );

  // Completion check shared by the rebalancer and the task rows below.
  const isDoneTask = useCallback(
    (t: PlanTask) =>
      t.domain === "dsa" ? solved.has(t.id)
      : t.domain === "sd" ? mastered.has(t.id)
      : t.domain === "se" ? completed.has(t.id)
      : t.domain === "lld" ? lldCompleted.has(t.id)
      : false,
    [solved, mastered, completed, lldCompleted]
  );

  // Missed days never strand their work. With no interview date the plan
  // extends; with one set it compresses into the days left before it.
  const { plan, rebalance } = useMemo(() => {
    const r = rebalancePlan(basePlan, today, isDoneTask, targetDate);
    return { plan: r.plan, rebalance: r.info };
  }, [basePlan, today, isDoneTask, targetDate]);

  // Which day index is "today" within the plan (clamped to the plan range).
  const todayIdx = useMemo(() => {
    const diff = daysBetween(startDate, today);
    return Math.max(0, Math.min(diff, plan.days.length - 1));
  }, [startDate, today, plan.days.length]);

  // Effective "current" day = earliest day (up to today) with unfinished work.
  // Missed days roll forward instead of being skipped; advances only when done.
  const currentIdx = useMemo(() => {
    for (let i = 0; i <= todayIdx; i++) {
      const d = plan.days[i];
      if (!d || d.type === "rest") continue;
      const todo = d.tasks.filter((t) => t.domain !== "behavioral");
      if (todo.length && !todo.every(isDoneTask)) return i;
    }
    return todayIdx; // all caught up → real today
  }, [plan, todayIdx, isDoneTask]);
  const daysBehind = todayIdx - currentIdx;

  // Rebalance notice is a dismissible toast, not a permanent banner. Dismissal
  // is remembered per calendar day — closing it hides it for today, but if you
  // miss another day it pops again the next day. Keyed on the day so it can't
  // nag on every reload.
  const rebalanceSig = today;
  const [rebalanceDismissed, setRebalanceDismissed] = useState<string | null>(null);
  useEffect(() => {
    try { setRebalanceDismissed(localStorage.getItem("studyplan-rebalance-dismissed")); } catch { /* ignore */ }
  }, []);
  const showRebalanceToast = rebalance.mode !== "none" && rebalanceDismissed !== rebalanceSig;
  function dismissRebalance() {
    try { localStorage.setItem("studyplan-rebalance-dismissed", rebalanceSig); } catch { /* ignore */ }
    setRebalanceDismissed(rebalanceSig);
  }

  // Readiness — a single running signal instead of waiting until the last
  // day to find out. Blends actual completion across DSA/SE/SD/LLD (deduped
  // by underlying id, so a problem re-listed on a review/mock day only
  // counts once) with a small penalty for flagged weak areas.
  const readiness = useMemo(() => {
    const byDomain: Record<string, Set<string>> = { dsa: new Set(), se: new Set(), sd: new Set(), lld: new Set() };
    for (const day of plan.days) {
      for (const t of day.tasks) {
        if (t.domain === "behavioral" || t.id.startsWith("recall-") || t.id === "rv-cheat-sheet") continue;
        const set = byDomain[t.domain];
        if (set) set.add(baseId(t.id));
      }
    }
    const doneIn = (domain: keyof typeof byDomain, isDone: (id: string) => boolean) =>
      [...byDomain[domain]].filter(isDone).length;
    const totalAll = Object.values(byDomain).reduce((s, set) => s + set.size, 0);
    const doneAll =
      doneIn("dsa", (id) => solved.has(id)) +
      doneIn("se", (id) => completed.has(id)) +
      doneIn("sd", (id) => mastered.has(id)) +
      doneIn("lld", (id) => lldCompleted.has(id));
    const pct = totalAll ? (doneAll / totalAll) * 100 : 0;
    const weakPenalty = Math.min(15, weakAreas.size * 1.5);
    return Math.max(0, Math.min(100, Math.round(pct - weakPenalty)));
  }, [plan, solved, mastered, completed, lldCompleted, weakAreas]);

  const weeks: DayPlan[][] = useMemo(() => {
    const w: DayPlan[][] = [];
    for (let i = 0; i < plan.days.length; i += 7) w.push(plan.days.slice(i, i + 7));
    return w;
  }, [plan]);

  const week = weeks[activeWeek] ?? [];
  const totalWeeks = weeks.length;
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0);

  // Open on the current (earliest unfinished) day so missed work surfaces.
  const didAutoInit = useRef(false);
  useEffect(() => {
    if (didAutoInit.current) return;
    didAutoInit.current = true;
    setActiveWeek(Math.floor(currentIdx / 7));
    setActiveDayIdx(currentIdx % 7);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  const focusDay = week[activeDayIdx] ?? week.find((d) => d.type !== "rest") ?? week[0];

  function changeWeek(next: number) {
    setActiveWeek(next);
    const nextWeek = weeks[next] ?? [];
    const firstNonRest = nextWeek.findIndex((d) => d.type !== "rest");
    setActiveDayIdx(firstNonRest >= 0 ? firstNonRest : 0);
  }

  function changeStartDate(d: string) {
    if (!d) return;
    setPlanStartDate(d);
    // Re-jump focus to where "today" lands in the re-anchored plan.
    const idx = Math.max(0, Math.min(daysBetween(d, today), duration - 1));
    setActiveWeek(Math.floor(idx / 7));
    setActiveDayIdx(idx % 7);
  }

  function isTaskDone(task: PlanTask): boolean {
    if (task.domain === "dsa") return solved.has(task.id);
    if (task.domain === "sd") return mastered.has(task.id);
    if (task.domain === "se") return completed.has(task.id);
    if (task.domain === "lld") return lldCompleted.has(task.id);
    return false;
  }

  function toggleTask(task: PlanTask) {
    if (task.domain === "dsa") { toggleSolved(task.id); return; }
    if (task.domain === "sd") { toggleMastered(task.id); return; }
    if (task.domain === "se") { toggleChapter(task.id); return; }
    if (task.domain === "lld") { toggleLLDChapter(task.id); return; }
  }

  function tasksDoneCount(tasks: PlanTask[]) {
    return tasks.filter(isTaskDone).length;
  }

  // Strip revision prefixes so a weak flag maps to the underlying problem/concept.
  function baseId(id: string): string {
    return id.replace(/^rv-mock-/, "").replace(/^rv-/, "");
  }

  function renderTask(task: PlanTask) {
    const done = isTaskDone(task);
    const canToggle = task.domain !== "behavioral";
    const bId = baseId(task.id);
    const weak = isWeak(bId);
    const canFlag = !!task.href && task.kind !== "behavioral" && !task.id.startsWith("recall-");
    return (
      <div
        key={task.id}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px", borderRadius: 6,
          background: done ? "rgba(47,191,113,0.05)" : weak ? "rgba(245,165,36,0.06)" : "var(--bg-secondary)",
          border: `1px solid ${done ? "rgba(47,191,113,0.2)" : weak ? "rgba(245,165,36,0.3)" : "var(--border-subtle)"}`,
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
            <Link href={withPlanSrc(task.href)} target="_blank" rel="noopener noreferrer" style={{
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
          {!!task.companies?.length && (
            <div style={{ fontSize: 9.5, fontFamily: "var(--font-mono)", marginTop: 1 }}>
              {task.companies.slice(0, 3).map((c, ci) => (
                <span key={c}>
                  <span style={{ color: COMPANY_COLORS[c] ?? "var(--text-muted)" }}>{c}</span>
                  {ci < Math.min(task.companies!.length, 3) - 1 && (
                    <span style={{ color: "var(--text-muted)", opacity: 0.4 }}> &middot; </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Weak-area flag — resurfaces this item in future revision days */}
        {canFlag && (
          <button
            onClick={() => toggleWeak(bId)}
            title={weak ? "Unflag — you've got this" : "Flag as weak — resurface in revision"}
            style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: 4, padding: 0,
              background: weak ? "rgba(245,165,36,0.15)" : "transparent",
              border: `1px solid ${weak ? "#F5A524" : "var(--border-subtle)"}`,
              color: weak ? "#F5A524" : "var(--text-muted)",
              cursor: "pointer", fontSize: 11, lineHeight: 1,
            }}
          >⚠</button>
        )}

        {task.difficulty && task.difficulty !== "Theory" && (
          <span style={{
            fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: 3,
            color: task.difficulty === "Easy" ? "#2FBF71" : task.difficulty === "Medium" ? "#F5A524" : "#EF4444",
            background: task.difficulty === "Easy" ? "rgba(47,191,113,0.1)" : task.difficulty === "Medium" ? "rgba(245,165,36,0.1)" : "rgba(239,68,68,0.1)",
          }}>{task.difficulty}</span>
        )}
      </div>
    );
  }

  const TIME_BLOCKS: { key: "AM" | "PM" | "Eve"; label: string }[] = [
    { key: "AM", label: "Morning · fresh brain — hardest new material" },
    { key: "PM", label: "Afternoon · theory + more practice" },
    { key: "Eve", label: "Evening · timed recall + behavioral" },
  ];

  const totalTasks = plan.days.reduce((n, d) => n + d.tasks.filter(t => t.domain !== "behavioral").length, 0);
  const completedTasks = plan.days.reduce((n, d) => n + d.tasks.filter(isTaskDone).length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Missed-day rebalance toast — dismissible; remembered per day */}
      {showRebalanceToast && (
        <div style={{
          position: "fixed", top: isMobile ? 12 : 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 90, width: "min(560px, calc(100vw - 24px))",
          display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px",
          borderRadius: 10,
          background: rebalance.overloaded ? "rgba(30,16,16,0.98)" : "rgba(14,26,20,0.98)",
          border: `1px solid ${rebalance.overloaded ? "rgba(239,68,68,0.4)" : "rgba(47,191,113,0.4)"}`,
          boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          animation: "sp-toast-in 0.25s ease",
        }}>
          <style>{`@keyframes sp-toast-in{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
          <span style={{ fontSize: 15, lineHeight: "18px", flexShrink: 0 }}>{rebalance.overloaded ? "⚠" : "↺"}</span>
          <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--text-secondary)", flex: 1 }}>
            <strong style={{ color: rebalance.overloaded ? "#EF4444" : "#2FBF71" }}>
              {rebalance.carriedCount} task{rebalance.carriedCount > 1 ? "s" : ""} carried forward
            </strong>
            {rebalance.mode === "extend" ? (
              <>
                {" — "}nothing was lost. Your missed work moved into today and everything after it
                shifted along, so the plan now runs{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {rebalance.daysAdded} day{rebalance.daysAdded === 1 ? "" : "s"} longer
                </strong>
                . Daily load is unchanged. Set an interview date to compress instead of extend.
              </>
            ) : rebalance.overloaded ? (
              <>
                {" — "}but there aren&apos;t enough days left before your interview to absorb it
                comfortably. The remaining days are now heavier than normal. Consider trimming
                scope rather than trying to do everything.
              </>
            ) : (
              <>
                {" — "}nothing was lost. Because you have an interview date set, the plan
                can&apos;t run longer, so the missed work was spread thinly across the days you
                have left. Your finish date is unchanged.
              </>
            )}
          </div>
          <button
            onClick={dismissRebalance}
            aria-label="Dismiss"
            style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: 5, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)",
              fontSize: 13, lineHeight: 1,
            }}
          >✕</button>
        </div>
      )}
      <main style={{ maxWidth: 1152, margin: "0 auto", padding: isMobile ? "20px 14px 80px" : "28px 20px 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: 0 }}>
              Study Plan
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0" }}>
              {completedTasks} tasks done · {totalTasks - completedTasks} remaining
              {duration === 21 && (
                <span style={{ color: "#06b6d4" }}>
                  {" · "}21-Day Essentials — 122 curated problems + deep SE/SD
                </span>
              )}
              {rebalance.mode === "none" && daysBehind > 0 && (
                <span style={{ color: "#F5A524" }}>
                  {" · "}{daysBehind} day{daysBehind > 1 ? "s" : ""} behind — catch up
                </span>
              )}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div
              title="Blends actual DSA/SE/SD/LLD completion, minus a small penalty for flagged weak areas"
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "5px 10px", borderRadius: 6,
                background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: readiness >= 70 ? "#2FBF71" : readiness >= 40 ? "#F5A524" : "#EF4444",
              }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Readiness</span>
              <span style={{
                fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)",
                color: readiness >= 70 ? "#2FBF71" : readiness >= 40 ? "#F5A524" : "#EF4444",
              }}>{readiness}%</span>
            </div>
            <Link href="/cheat-sheet" style={{
              fontSize: 11, fontWeight: 600, color: "var(--accent)", textDecoration: "none",
              padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border-subtle)",
              background: "var(--bg-secondary)",
            }}>📄 Cheat-sheet</Link>
            {/* Start date — aligns the plan to the real calendar */}
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
              Started
              <input
                type="date"
                value={startDate}
                onChange={(e) => changeStartDate(e.target.value)}
                style={{
                  fontSize: 12, padding: "4px 8px", borderRadius: 6,
                  background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)", colorScheme: "dark",
                }}
              />
            </label>
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
              const isToday = activeWeek * 7 + wi === todayIdx; // real calendar today
              const weekday = day.date
                ? new Date(day.date + "T00:00:00").toLocaleDateString("en", { weekday: "short" })
                : label;
              const dateLabel = day.date
                ? new Date(day.date + "T00:00:00").toLocaleDateString("en", { month: "short", day: "numeric" })
                : "";
              return (
                <div key={wi} onClick={() => setActiveDayIdx(wi)} style={{
                  position: "relative",
                  background: isActive ? `${color}28` : isRest ? "transparent" : `${color}14`,
                  border: `2px solid ${isActive ? color : isToday ? "var(--accent)" : isRest ? "var(--border-subtle)" : color + "33"}`,
                  boxShadow: isToday ? "0 0 0 1px var(--accent) inset" : "none",
                  borderRadius: 7, padding: "8px 4px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.12s",
                }}>
                  <div style={{ fontSize: 9, color: isToday ? "var(--accent)" : "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 1 }}>
                    {isToday ? "TODAY" : weekday}
                  </div>
                  {dateLabel && (
                    <div style={{ fontSize: 8.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 3 }}>
                      {dateLabel}
                    </div>
                  )}
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
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 260px", gap: 14 }}>
            {/* Task list */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: PHASE_COLOR[focusDay.phase] ?? "var(--accent)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  Day {focusDay.day} — {focusDay.label}
                  {focusDay.date && (() => {
                    const gi = activeWeek * 7 + activeDayIdx;
                    const isRealToday = gi === todayIdx;
                    const isBehind = gi < todayIdx;
                    const prefix = isRealToday ? "Today · " : isBehind ? "Catch up · " : "";
                    const color = isRealToday ? "var(--accent)" : isBehind ? "#F5A524" : "var(--text-muted)";
                    return (
                      <span style={{ fontSize: 11, fontWeight: 400, color, marginLeft: 8 }}>
                        {prefix}{fmtDate(focusDay.date)}
                      </span>
                    );
                  })()}
                </span>
                <span style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                  {estHours(focusDay.tasks) > 0 && (
                    <span style={{
                      fontSize: 10, fontFamily: "var(--font-mono)", color: PHASE_COLOR[focusDay.phase] ?? "var(--text-muted)",
                      background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                      borderRadius: 4, padding: "2px 7px",
                    }}>
                      ≈ {estHours(focusDay.tasks)}h
                    </span>
                  )}
                  <span style={{
                    fontSize: 10, fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)", background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)", borderRadius: 4, padding: "2px 7px",
                  }}>
                    {tasksDoneCount(focusDay.tasks)}/{focusDay.tasks.length} done
                  </span>
                </span>
              </div>

              {/* Revision / mock / behavioral protocol — how to work this day, not just what */}
              {focusDay.reviewNote && (focusDay.type === "review" || focusDay.type === "mock" || focusDay.phase === "behavioral") && (
                <div style={{
                  marginBottom: 14, padding: "10px 12px", borderRadius: 8,
                  background: focusDay.type === "mock" ? "rgba(239,68,68,0.07)" : "rgba(154,164,178,0.08)",
                  border: `1px solid ${focusDay.type === "mock" ? "rgba(239,68,68,0.25)" : "var(--border-subtle)"}`,
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                    color: focusDay.type === "mock" ? "#EF4444" : "var(--text-secondary)", marginBottom: 6,
                  }}>
                    {focusDay.type === "mock" ? "Mock protocol" : focusDay.phase === "behavioral" ? "How to prep" : "How to revise"}
                  </div>
                  <div style={{
                    fontSize: 11.5, lineHeight: 1.6, color: "var(--text-secondary)",
                    whiteSpace: "pre-line", fontFamily: "var(--font-mono)",
                  }}>
                    {focusDay.reviewNote}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {focusDay.tasks.some((t) => t.timeBlock) ? (
                  TIME_BLOCKS.map(({ key, label }) => {
                    const blockTasks = focusDay.tasks.filter((t) => t.timeBlock === key);
                    if (!blockTasks.length) return null;
                    return (
                      <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <span style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                            color: PHASE_COLOR[focusDay.phase] ?? "var(--accent)",
                            background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                            borderRadius: 4, padding: "2px 7px",
                          }}>{key}</span>
                          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{label}</span>
                          <span style={{ marginLeft: "auto", fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                            ≈ {estHours(blockTasks) || 1}h
                          </span>
                        </div>
                        {blockTasks.map(renderTask)}
                      </div>
                    );
                  })
                ) : (
                  focusDay.tasks.map(renderTask)
                )}
                {focusDay.tasks.length === 0 && (
                  <div style={{ textAlign: "center", padding: 24, fontSize: 13, color: "var(--text-muted)" }}>Rest day</div>
                )}
              </div>
            </div>

            {/* Milestones — all domains with real progress */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, alignSelf: "start" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>Week milestones</div>
              {(["dsa", "sd", "se", "lld"] as const).map((phase) => {
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
