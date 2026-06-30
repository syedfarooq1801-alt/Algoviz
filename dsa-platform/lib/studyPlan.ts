import { PATTERNS } from "@/data/problems";
import { SD_CHAPTERS } from "@/data/systemDesign";
import { SE_SUBJECTS } from "@/data/seBasics";
import { COMMON_QUESTIONS, COMPANY_VALUES } from "@/data/behavioral";

export type TaskDomain = "dsa" | "sd" | "se" | "behavioral";
export type DayPhase = "dsa" | "sd" | "se" | "review" | "mock" | "behavioral";
export type DayType = "learn" | "practice" | "review" | "mock" | "rest";

export interface PlanTask {
  domain: TaskDomain;
  id: string;
  title: string;
  href: string;
  difficulty?: string;
  tag?: string;
  subjectId?: string;
  priority: number;
  meta?: string;
  kind?: "theory" | "problem" | "concept" | "behavioral";
}

export interface DayPlan {
  day: number;
  date: string;
  phase: DayPhase;
  type: DayType;
  label: string;
  color: string;
  tasks: PlanTask[];
  reviewCovered?: PlanTask[];
  reviewNote?: string;
}

export interface StudyPlan {
  durationDays: 15 | 30 | 60 | 90;
  startDate: string;
  days: DayPlan[];
}

export const PHASE_COLOR: Record<DayPhase, string> = {
  dsa: "#4F8CFF",
  sd: "#2FBF71",
  se: "#F5A524",
  review: "#9AA4B2",
  mock: "#EF4444",
  behavioral: "#A5AFBD",
};

function dsaPriority(difficulty: string, frequency: string): number {
  const f = frequency === "High" ? 3 : frequency === "Medium" ? 2 : 1;
  const d = difficulty === "Hard" ? 3 : difficulty === "Medium" ? 2 : 1;
  return f * 2 + d;
}

function sdPriority(difficulty: string): number {
  return difficulty === "Fundamental" ? 3 : difficulty === "Intermediate" ? 2 : 1;
}

function buildDSATasks(): PlanTask[] {
  return PATTERNS.flatMap((pattern) => [
    {
      domain: "dsa" as const,
      id: `theory-${pattern.id}`,
      title: `${pattern.title} theory`,
      href: `/patterns/${pattern.id}`,
      difficulty: "Theory",
      tag: pattern.title,
      priority: 6,
      meta: "Pattern theory",
      kind: "theory" as const,
    },
    ...pattern.problems.map((p) => {
      const freq = (p as { frequency?: string }).frequency ?? "Medium";
      return {
        domain: "dsa" as const,
        id: p.id,
        title: p.title,
        href: `/problems/${p.id}`,
        difficulty: p.difficulty,
        tag: pattern.title,
        priority: dsaPriority(p.difficulty, freq),
        meta: `${p.difficulty} · ${freq} freq`,
        kind: "problem" as const,
      };
    }),
  ]);
}

function buildSDTasks(): PlanTask[] {
  return SD_CHAPTERS.flatMap((chapter) => [
    ...chapter.concepts.map((c) => ({
      domain: "sd" as const,
      id: c.id,
      title: c.title,
      href: `/system-design/concept/${c.id}`,
      tag: chapter.title,
      priority: sdPriority(c.difficulty),
      meta: c.difficulty,
      kind: "concept" as const,
    })),
    ...(chapter.caseStudies ?? []).map((cs) => ({
      domain: "sd" as const,
      id: cs.id,
      title: cs.title,
      href: `/system-design/case-study/${cs.id}`,
      tag: "Case Study",
      priority: 2,
      meta: "Case Study",
      kind: "concept" as const,
    })),
  ]);
}

function buildSETasks(): PlanTask[] {
  return SE_SUBJECTS.flatMap((subject) =>
    subject.chapters.map((ch) => {
      const hasInterview = ch.blocks.some((b) => b.type === "interview" || b.type === "placement");
      return {
        domain: "se" as const,
        id: `${subject.id}/${ch.id}`,
        title: ch.title,
        href: `/se-basics/${subject.id}#${ch.id}`,
        tag: subject.title,
        subjectId: subject.id,
        priority: hasInterview ? 3 : 2,
        meta: hasInterview ? "Interview focus" : subject.title,
        kind: "concept" as const,
      };
    })
  );
}

function buildBehavioralTasks(): PlanTask[] {
  const companyTasks = COMPANY_VALUES.flatMap((company) => [
    {
      domain: "behavioral" as const,
      id: `behavioral-${company.company.toLowerCase()}-values`,
      title: `${company.company} values`,
      href: "/behavioral",
      tag: company.company,
      priority: 3,
      meta: "Company values",
      kind: "behavioral" as const,
    },
    ...company.questions.slice(0, 2).map((q) => ({
      domain: "behavioral" as const,
      id: `behavioral-${q.id}`,
      title: q.question,
      href: "/behavioral",
      tag: company.company,
      priority: 3,
      meta: q.principle ?? "STAR",
      kind: "behavioral" as const,
    })),
  ]);
  const commonTasks = COMMON_QUESTIONS.map((q, i) => ({
    domain: "behavioral" as const,
    id: `behavioral-common-${i}`,
    title: q.question,
    href: "/behavioral",
    tag: q.category,
    priority: 2,
    meta: "Common question",
    kind: "behavioral" as const,
  }));
  return [...companyTasks, ...commonTasks];
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function topByPriority(tasks: PlanTask[], n: number): PlanTask[] {
  return [...tasks].sort((a, b) => b.priority - a.priority).slice(0, n);
}

function taskEffort(task: PlanTask): number {
  if (task.kind === "theory") return 1;
  if (task.domain === "behavioral") return 1.5;
  if (task.domain !== "dsa") return 1.5;
  if (task.difficulty === "Easy") return 1;
  if (task.difficulty === "Medium") return 2;
  if (task.difficulty === "Hard") return 3;
  return 1.5;
}

function totalEffort(tasks: PlanTask[]): number {
  return tasks.reduce((sum, task) => sum + taskEffort(task), 0);
}

function takeByEffort(queue: PlanTask[], target: number, minItems = 1): PlanTask[] {
  const picked: PlanTask[] = [];
  let effort = 0;
  while (queue.length > 0) {
    const next = queue[0];
    const nextEffort = taskEffort(next);
    if (picked.length >= minItems && effort + nextEffort > target + 0.75) break;
    picked.push(queue.shift()!);
    effort += nextEffort;
    if (effort >= target) break;
  }
  return picked;
}

function takeDsaPatternByEffort(queue: PlanTask[], target: number, minItems = 1): PlanTask[] {
  const tag = queue[0]?.tag;
  if (!tag) return [];
  const picked: PlanTask[] = [];
  let effort = 0;
  while (queue.length > 0 && queue[0].tag === tag) {
    const next = queue[0];
    const nextEffort = taskEffort(next);
    if (picked.length >= minItems && effort + nextEffort > target + 0.75) break;
    picked.push(queue.shift()!);
    effort += nextEffort;
    if (effort >= target) break;
  }
  return picked;
}

function labelFromTasks(fallback: string, tasks: PlanTask[]): string {
  const tags = [...new Set(tasks.map((task) => task.tag).filter(Boolean))].slice(0, 2);
  return tags.length ? tags.join(" + ") : fallback;
}

function getReviewNote(phase: DayPhase): string {
  if (phase === "mock") {
    return [
      "Timed mock — simulate the real interview. No hints, no peeking.",
      "1. Pick 2 problems, 35 min each. Talk through brute force → optimal out loud.",
      "2. State time/space complexity before coding. Code clean, then dry-run on an edge case.",
      "3. For each SE/SD item: answer as if the interviewer just asked it cold.",
      "4. Score yourself: correct? optimal? explained clearly? Note every gap.",
    ].join("\n");
  }
  if (phase === "behavioral") return "Draft answers out loud. Keep each answer under 2.5 minutes. Use STAR — Situation, Task, Action, Result.";
  return [
    "Active recall — do NOT re-read solutions. Retrieval is what builds memory.",
    "1. Each DSA problem: hide the solution, re-derive the approach + code from memory, then check.",
    "2. Each SE/SD concept: explain it out loud in 60s as if teaching an interviewer.",
    "3. Redo the single hardest problem fully on paper, no IDE.",
    "4. Anything you blanked on → write it down. That list is tomorrow's warm-up.",
  ].join("\n");
}

// 15-day intensive sprint: 10-12 hr/day, breadth-first over depth, revision
// every 2 study days. Goal: cover the highest-value DSA patterns, SE chapters,
// and SD fundamentals fast enough to walk into interviews in 2 weeks.
function generateIntensivePlan(startDate: string): StudyPlan {
  const durationDays = 15 as const;
  // Priority-ordered queues — most interview-critical items first.
  const dsaQueue = buildDSATasks(); // curriculum order: front-loads core patterns
  const sdQueue = topByPriority(buildSDTasks(), 999);   // fundamentals first
  const seQueue = topByPriority(buildSETasks(), 999);   // interview-focus chapters first
  const assigned: PlanTask[] = [];
  const window: PlanTask[] = []; // tasks from the last 2 study days, for revision
  const days: DayPlan[] = [];

  // Revision every 2 study days; final day is a full mock.
  const reviewDays = new Set([3, 6, 9, 12]);

  for (let dayNum = 1; dayNum <= durationDays; dayNum++) {
    const date = addDays(startDate, dayNum - 1);

    if (dayNum === durationDays) {
      // Day 15 — full interview simulation from the best of everything seen.
      const tasks = topByPriority(assigned, 8).map((t) => ({ ...t, id: `rv-mock-${t.id}` }));
      days.push({
        day: dayNum, date, phase: "mock", type: "mock",
        label: "Final mock — full interview simulation",
        color: PHASE_COLOR.mock, tasks, reviewNote: getReviewNote("mock"),
      });
      continue;
    }

    if (reviewDays.has(dayNum)) {
      // Revision day — spaced repetition: fresh material from the last 2 days
      // PLUS the highest-value older items so earlier patterns don't decay.
      // "rv-" prefix keeps completion separate from the learning-day toggle.
      const recent = topByPriority(window, 7);
      const recentIds = new Set(window.map((t) => t.id));
      const olderPool = assigned.filter((t) => !recentIds.has(t.id));
      // Balance domains so SE/SD get revised too, not just DSA.
      const olderDsa = topByPriority(olderPool.filter((t) => t.domain === "dsa"), 3);
      const olderSupport = topByPriority(olderPool.filter((t) => t.domain !== "dsa"), 2);
      const merged = [...recent, ...olderDsa, ...olderSupport];
      const tasks = merged.map((t) => ({
        ...t,
        id: `rv-${t.id}`,
        tag: `${recentIds.has(t.id) ? "Fresh" : "Spaced recall"}${t.tag ? ` · ${t.tag}` : ""}`,
      }));
      days.push({
        day: dayNum, date, phase: "review", type: "review",
        label: "Revision — fresh + spaced recall",
        color: PHASE_COLOR.review, tasks,
        reviewCovered: [...window], reviewNote: getReviewNote("review"),
      });
      window.length = 0;
      continue;
    }

    // Study day — ~11 effort units ≈ 10-12 hours.
    // Two DSA pattern slices (breadth) + one SE chapter + one SD concept.
    const dsaTasks = [
      ...takeDsaPatternByEffort(dsaQueue, 4, 1),
      ...takeDsaPatternByEffort(dsaQueue, 4, 1),
    ];
    const seTasks = takeByEffort(seQueue, 2, 1);
    const sdTasks = takeByEffort(sdQueue, 1.5, 1);
    const tasks = [...dsaTasks, ...seTasks, ...sdTasks];

    window.push(...tasks);
    assigned.push(...tasks);
    days.push({
      day: dayNum, date, phase: "dsa",
      type: dayNum <= 4 ? "learn" : "practice",
      label: labelFromTasks("Core sprint", tasks),
      color: PHASE_COLOR.dsa, tasks,
    });
  }

  return { durationDays, startDate, days };
}

export function generateStudyPlan(durationDays: 15 | 30 | 60 | 90, startDate: string, trackWeights?: Record<string, number>): StudyPlan {
  if (durationDays === 15) return generateIntensivePlan(startDate);
  const tw = trackWeights ?? {};
  const wDsa = tw.dsa ?? 0;
  const wSd = tw.sd ?? 0;
  const wSe = tw.se ?? 0;
  const wTotal = wDsa + wSd + wSe;
  const dsaFrac = wTotal > 0 ? Math.max(0.10, wDsa / wTotal) : 0.62;
  const supportFrac = wTotal > 0 ? Math.max(0.05, (wSd + wSe) / wTotal / 2) : 0.19;
  const dsaQueue = buildDSATasks();
  const sdQueue = buildSDTasks();
  const seQueue = buildSETasks();
  const behavioralQueue = buildBehavioralTasks();
  const assigned: PlanTask[] = [];
  const weeklyWindow: PlanTask[] = [];
  const days: DayPlan[] = [];
  const behavioralDays = durationDays === 30 ? 3 : durationDays === 60 ? 5 : 7;
  const coreEndDay = durationDays - behavioralDays;
  // Real weekday of a plan day (0 = Sunday, 6 = Saturday).
  // Saturday = review, Sunday = mock. Both are weekend days (no new learning).
  const weekdayOf = (dn: number) => new Date(addDays(startDate, dn - 1) + "T00:00:00").getDay();
  const isSatReview = (dn: number) => weekdayOf(dn) === 6;
  const isSunMock   = (dn: number) => weekdayOf(dn) === 0;
  const isWeekend   = (dn: number) => isSatReview(dn) || isSunMock(dn);
  const coreWorkDays = Array.from({ length: coreEndDay }, (_, i) => i + 1).filter((day) => !isWeekend(day)).length;

  function remainingCoreEffort() {
    return totalEffort(dsaQueue) + totalEffort(sdQueue) + totalEffort(seQueue);
  }

  function remainingCoreWorkDays(dayNum: number) {
    return Array.from({ length: Math.max(0, coreEndDay - dayNum + 1) }, (_, i) => dayNum + i)
      .filter((day) => !isWeekend(day)).length;
  }

  for (let dayNum = 1; dayNum <= durationDays; dayNum++) {
    const date = addDays(startDate, dayNum - 1);
    const slot = (dayNum - 1) % 7;
    const week = Math.ceil(dayNum / 7);

    if (dayNum > coreEndDay) {
      const target = Math.max(3, totalEffort(behavioralQueue) / Math.max(1, durationDays - dayNum + 1));
      const tasks = takeByEffort(behavioralQueue, target, 2);
      days.push({
        day: dayNum,
        date,
        phase: dayNum === durationDays ? "mock" : "behavioral",
        type: dayNum === durationDays ? "mock" : "practice",
        label: dayNum === durationDays ? "Final behavioral + technical mock" : labelFromTasks("Behavioral prep", tasks),
        color: dayNum === durationDays ? PHASE_COLOR.mock : PHASE_COLOR.behavioral,
        tasks: dayNum === durationDays ? [...tasks, ...topByPriority(assigned, 4)] : tasks,
        reviewNote: getReviewNote(dayNum === durationDays ? "mock" : "behavioral"),
      });
      continue;
    }

    if (isSatReview(dayNum)) {
      // Saturday: review this week's learning — separate completion tracking via "rv-" prefix
      const tasks = topByPriority(weeklyWindow.length ? weeklyWindow : assigned, 8)
        .map((t) => ({ ...t, id: `rv-${t.id}` }));
      days.push({
        day: dayNum,
        date,
        phase: "review",
        type: "review",
        label: `Week ${week} review`,
        color: PHASE_COLOR.review,
        tasks,
        reviewCovered: [...weeklyWindow],
        reviewNote: getReviewNote("review"),
      });
      weeklyWindow.length = 0; // clear after Saturday review
      continue;
    }

    if (isSunMock(dayNum)) {
      // Sunday: timed mock from best problems seen so far
      const tasks = topByPriority(assigned, 6)
        .map((t) => ({ ...t, id: `rv-mock-${t.id}` }));
      days.push({
        day: dayNum,
        date,
        phase: "mock",
        type: "mock",
        label: `Week ${week} mock interview`,
        color: PHASE_COLOR.mock,
        tasks,
        reviewNote: getReviewNote("mock"),
      });
      continue;
    }

    const workDaysLeft = Math.max(1, remainingCoreWorkDays(dayNum));
    const dailyTarget = Math.max(6, remainingCoreEffort() / workDaysLeft);
    const dsaTarget = Math.max(2, dailyTarget * dsaFrac);
    const supportTarget = Math.max(1.5, dailyTarget * supportFrac);
    const supportQueue = slot === 2 || slot === 4 ? seQueue : sdQueue;
    const alternateQueue = supportQueue === seQueue ? sdQueue : seQueue;
    const dsaTasks = takeDsaPatternByEffort(dsaQueue, dsaTarget, 1);
    let supportTasks = takeByEffort(supportQueue, supportTarget, 1);

    if (dsaQueue.length === 0 || supportTasks.length === 0) {
      supportTasks = [...supportTasks, ...takeByEffort(alternateQueue, supportTarget, supportTasks.length ? 0 : 1)];
    }

    const tasks = [...dsaTasks, ...supportTasks];
    const phase: DayPhase =
      supportTasks.some((task) => task.domain === "se") ? "se" :
      supportTasks.some((task) => task.domain === "sd") ? "sd" : "dsa";

    weeklyWindow.push(...tasks);
    assigned.push(...tasks);
    days.push({
      day: dayNum,
      date,
      phase,
      type: dayNum <= Math.ceil(coreWorkDays * 0.35) ? "learn" : "practice",
      label: labelFromTasks("Core curriculum", tasks),
      color: PHASE_COLOR[phase],
      tasks,
    });
  }

  while (behavioralQueue.length > 0 && days.length > 0) {
    days[days.length - 1].tasks.push(...takeByEffort(behavioralQueue, 999, 0));
  }

  return { durationDays, startDate, days };
}

const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

export function getDueForReview(solvedDates: Record<string, string>, today: string): string[] {
  return Object.entries(solvedDates)
    .filter(([, d]) => REVIEW_INTERVALS.includes(daysDiff(d, today)))
    .map(([id]) => id);
}

export function getUpcomingReviews(
  solvedDates: Record<string, string>,
  today: string
): Array<{ problemId: string; dueIn: number }> {
  return Object.entries(solvedDates)
    .flatMap(([id, d]) => {
      const since = daysDiff(d, today);
      const next = REVIEW_INTERVALS.find((i) => i > since);
      return next !== undefined ? [{ problemId: id, dueIn: next - since }] : [];
    })
    .sort((a, b) => a.dueIn - b.dueIn)
    .slice(0, 10);
}

function daysDiff(from: string, to: string): number {
  return Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
}
