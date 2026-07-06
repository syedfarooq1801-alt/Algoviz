import { PATTERNS } from "@/data/problems";
import { SD_CHAPTERS } from "@/data/systemDesign";
import { SE_SUBJECTS } from "@/data/seBasics";
import { COMMON_QUESTIONS, COMPANY_VALUES } from "@/data/behavioral";
import { ESSENTIAL_DSA_SET, ESSENTIAL_SE_SET, ESSENTIAL_SD_SET } from "@/data/essentials15";

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
  timeBlock?: "AM" | "PM" | "Eve"; // intensive plan: morning / afternoon / evening
  companies?: string[]; // which companies this DSA problem is frequent at (from data/problems.ts)
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
        companies: (p as { companies?: string[] }).companies ?? [],
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

// Estimated hours for a set of tasks (1 effort unit ≈ 1 hour of focused work).
export function estHours(tasks: PlanTask[]): number {
  return Math.round(totalEffort(tasks));
}

// A self-study recall task — no link, just an instruction to redo from memory.
function recallTask(dayNum: number, label: string): PlanTask {
  return {
    domain: "dsa", id: `recall-d${dayNum}`, title: label, href: "",
    priority: 5, meta: "Active recall", kind: "problem", timeBlock: "Eve",
  };
}

// Group a curriculum-ordered DSA queue into whole-pattern chunks (by `tag`,
// which is the pattern title). Adjacent same-tag tasks merge into one group —
// a pattern is never split, since the queue is already in pattern order.
function groupByPattern(queue: PlanTask[]): PlanTask[][] {
  const groups: PlanTask[][] = [];
  for (const t of queue) {
    const last = groups[groups.length - 1];
    if (last && last[0].tag === t.tag) last.push(t);
    else groups.push([t]);
  }
  return groups;
}

// Bin-pack whole pattern-groups into `dayCount` buckets, in curriculum order,
// without ever splitting a group across two buckets. The per-day target is
// recomputed from what's left (remaining tasks / remaining days) each time,
// so patterns spread evenly across ALL days instead of front-loading and
// leaving trailing days empty — the last day always absorbs whatever remains.
function packPatternGroups(groups: PlanTask[][], dayCount: number): PlanTask[][] {
  const queue = [...groups];
  const buckets: PlanTask[][] = [];
  let remainingDays = dayCount;
  while (buckets.length < dayCount) {
    if (queue.length === 0) { buckets.push([]); remainingDays--; continue; }
    const remainingTotal = queue.reduce((n, g) => n + g.length, 0);
    const target = remainingTotal / Math.max(1, remainingDays);
    const bucket: PlanTask[] = [];
    while (queue.length > 0 && (bucket.length === 0 || bucket.length + queue[0].length <= target * 1.3)) {
      bucket.push(...queue.shift()!);
    }
    buckets.push(bucket);
    remainingDays--;
  }
  return buckets;
}

// 15-day intensive sprint: FULL syllabus coverage. Every DSA problem, SE chapter,
// and SD concept is scheduled across 9 study days (AM/PM/Eve blocks), with
// revision every 2 study days, ONE dedicated behavioral day near the end
// (day 14 — not woven daily), and a final mock on day 15.
function generateIntensivePlan(startDate: string, weakIds: string[] = []): StudyPlan {
  const durationDays = 15 as const;
  const weakSet = new Set(weakIds);
  // Curated to the "15-Day Essentials" set (122 DSA + deep SE + deep SD) so a
  // 12 hr/day sprint is realistic. Keep DSA pattern theory + only essential
  // problems, in curriculum order.
  const dsaQueue = buildDSATasks().filter((t) => t.kind === "theory" || ESSENTIAL_DSA_SET.has(t.id));
  const sdQueue = buildSDTasks().filter((t) => ESSENTIAL_SD_SET.has(t.id));
  const seQueue = buildSETasks().filter((t) => ESSENTIAL_SE_SET.has(t.id));
  const behavioralQueue = topByPriority(buildBehavioralTasks(), 999);
  const assigned: PlanTask[] = [];
  const window: PlanTask[] = []; // tasks from the last 2 study days, for revision
  const days: DayPlan[] = [];

  // Revision every 2 study days; day 14 is dedicated behavioral prep; final day is a full mock.
  const reviewDays = new Set([3, 6, 9, 12]);
  const behavioralDay = 14;
  // 15 days − 4 review − 1 behavioral day − 1 mock = 9 study days.
  const studyDayCount = durationDays - reviewDays.size - 2;
  let studyDaysLeft = studyDayCount;

  // DSA is pre-packed into whole-pattern day buckets — a pattern always
  // starts and finishes on the same day, never spilling into the next.
  const dsaBuckets = packPatternGroups(groupByPattern(dsaQueue), studyDayCount);
  let studyDayIdx = 0;

  for (let dayNum = 1; dayNum <= durationDays; dayNum++) {
    const date = addDays(startDate, dayNum - 1);

    if (dayNum === durationDays) {
      // Day 15 — full interview simulation. Weak areas first, then best of everything.
      const weakFirst = topByPriority(assigned.filter((t) => weakSet.has(t.id)), 4);
      const rest = topByPriority(assigned.filter((t) => !weakSet.has(t.id)), 6);
      const core = [...weakFirst, ...rest].map((t) => ({
        ...t, id: `rv-mock-${t.id}`,
        tag: `${weakSet.has(t.id) ? "⚠ Weak area · " : ""}${t.tag ?? ""}`,
        timeBlock: "AM" as const,
      }));
      const cheatSheet: PlanTask = {
        domain: "dsa", id: "rv-cheat-sheet", title: "Interview cheat-sheet — final glance",
        href: "/cheat-sheet", priority: 9, meta: "Last-minute reference",
        kind: "theory", timeBlock: "Eve",
      };
      // Behavioral was fully covered on day 14 — just re-drill 3 of the toughest as a warm-up.
      const behavioral = topByPriority(assigned.filter((t) => t.domain === "behavioral"), 3)
        .map((t) => ({ ...t, id: `rv-mock-${t.id}`, timeBlock: "PM" as const }));
      days.push({
        day: dayNum, date, phase: "mock", type: "mock",
        label: "Final mock — full interview simulation",
        color: PHASE_COLOR.mock, tasks: [...core, ...behavioral, cheatSheet],
        reviewNote: getReviewNote("mock"),
      });
      continue;
    }

    if (dayNum === behavioralDay) {
      // Dedicated behavioral day — NOT woven daily. One full day, close to the
      // end, so STAR stories and company values are freshest going into interviews.
      const tasks = behavioralQueue.splice(0, behavioralQueue.length).map((t, i) => ({
        ...t, timeBlock: (i % 2 === 0 ? "AM" : "PM") as "AM" | "PM",
      }));
      assigned.push(...tasks);
      days.push({
        day: dayNum, date, phase: "behavioral", type: "practice",
        label: "Behavioral prep — STAR stories & company values",
        color: PHASE_COLOR.behavioral, tasks,
        reviewNote: getReviewNote("behavioral"),
      });
      continue;
    }

    if (reviewDays.has(dayNum)) {
      // Revision day — spaced repetition: weak areas + fresh (last 2 days) +
      // highest-value older items so earlier patterns don't decay.
      // "rv-" prefix keeps completion separate from the learning-day toggle.
      const recent = topByPriority(window, 6);
      const recentIds = new Set(window.map((t) => t.id));
      const olderPool = assigned.filter((t) => !recentIds.has(t.id));
      const weakFirst = topByPriority(olderPool.filter((t) => weakSet.has(t.id)), 3);
      const weakFirstIds = new Set(weakFirst.map((t) => t.id));
      const remainingOlder = olderPool.filter((t) => !weakFirstIds.has(t.id));
      // Balance domains so SE/SD get revised too, not just DSA.
      const olderDsa = topByPriority(remainingOlder.filter((t) => t.domain === "dsa"), 2);
      const olderSupport = topByPriority(remainingOlder.filter((t) => t.domain !== "dsa"), 2);
      const merged = [...weakFirst, ...recent, ...olderDsa, ...olderSupport];
      const tasks = merged.map((t) => {
        const label = weakSet.has(t.id) ? "⚠ Weak area" : recentIds.has(t.id) ? "Fresh" : "Spaced recall";
        return {
          ...t, id: `rv-${t.id}`,
          tag: `${label}${t.tag ? ` · ${t.tag}` : ""}`,
          timeBlock: (weakSet.has(t.id) ? "AM" : t.domain === "dsa" ? "PM" : "Eve") as "AM" | "PM" | "Eve",
        };
      });
      days.push({
        day: dayNum, date, phase: "review", type: "review",
        label: "Revision — weak areas + fresh + spaced recall",
        color: PHASE_COLOR.review, tasks,
        reviewCovered: [...window], reviewNote: getReviewNote("review"),
      });
      window.length = 0;
      continue;
    }

    // Study day — DSA comes from the pre-packed whole-pattern bucket for this
    // study-day slot (never split across days). SE/SD still drain an even
    // share so the full syllabus lands by the last study day. No behavioral
    // here by design — it's concentrated on the dedicated day above.
    const share = (n: number) => Math.ceil(n / Math.max(1, studyDaysLeft));
    const dsaSlice = dsaBuckets[studyDayIdx] ?? [];
    const seSlice = seQueue.splice(0, share(seQueue.length));
    const sdSlice = sdQueue.splice(0, share(sdQueue.length));
    studyDaysLeft--;
    studyDayIdx++;

    // AM (fresh brain): first half of the day's DSA — pattern theory + Easy/Medium
    // warm-up (problems are Easy→Medium→Hard within each pattern by design).
    const half = Math.ceil(dsaSlice.length / 2);
    const amDsa = dsaSlice.slice(0, half).map((t) => ({ ...t, timeBlock: "AM" as const }));
    // PM: the Hard problems for this pattern + SE + SD theory.
    const pmDsa = dsaSlice.slice(half).map((t) => ({ ...t, timeBlock: "PM" as const }));
    const seTasks = seSlice.map((t) => ({ ...t, timeBlock: "PM" as const }));
    const sdTasks = sdSlice.map((t) => ({ ...t, timeBlock: "PM" as const }));
    // Eve: timed recall of the day's hardest — no behavioral mixed in.
    const recall = recallTask(dayNum, "Redo today's AM problems from memory — timed, no IDE");

    const tasks = [...amDsa, ...pmDsa, ...seTasks, ...sdTasks, recall];

    // Only real (non-recall) tasks feed the revision window.
    window.push(...amDsa, ...pmDsa, ...seTasks, ...sdTasks);
    assigned.push(...amDsa, ...pmDsa, ...seTasks, ...sdTasks);
    days.push({
      day: dayNum, date, phase: "dsa",
      type: dayNum <= 4 ? "learn" : "practice",
      label: labelFromTasks("Core sprint", [...amDsa, ...pmDsa]),
      color: PHASE_COLOR.dsa, tasks,
    });
  }

  return { durationDays, startDate, days };
}

export function generateStudyPlan(durationDays: 15 | 30 | 60 | 90, startDate: string, trackWeights?: Record<string, number>, weakIds?: string[]): StudyPlan {
  if (durationDays === 15) return generateIntensivePlan(startDate, weakIds);
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
  // Behavioral is NOT woven into daily study — concentrated entirely in the
  // dedicated tail days below (last 3/5/7 days), so it stays sharp near the interview.
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

    weeklyWindow.push(...dsaTasks, ...supportTasks);
    assigned.push(...dsaTasks, ...supportTasks);
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
