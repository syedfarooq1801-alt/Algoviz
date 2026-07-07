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
  durationDays: 21 | 30 | 60 | 90;
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
// without ever splitting a group across two buckets — minimizing the largest
// bucket (the "split array into k parts, minimize max part sum" problem,
// same technique as Split Array Largest Sum / Capacity to Ship Packages).
//
// Binary search finds the smallest max-sum achievable in <= dayCount
// contiguous partitions, then a greedy pass builds those partitions. If that
// leaves fewer than dayCount buckets (parts merged more than needed), the
// largest remaining bucket is repeatedly split at its best internal boundary
// — still only ever moving a boundary BETWEEN groups, never through one —
// until all dayCount slots are used. This spreads patterns far more evenly
// than a single-pass greedy-with-overflow-margin approach.
function packPatternGroups(groups: PlanTask[][], dayCount: number): PlanTask[][] {
  const n = groups.length;
  if (n === 0) return Array.from({ length: dayCount }, () => []);
  const sizes = groups.map((g) => g.length);

  const countParts = (maxSum: number): number => {
    let parts = 1, cur = 0;
    for (const s of sizes) {
      if (cur + s > maxSum && cur > 0) { parts++; cur = 0; }
      cur += s;
    }
    return parts;
  };

  let lo = Math.max(...sizes), hi = sizes.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (countParts(mid) <= dayCount) hi = mid; else lo = mid + 1;
  }
  const maxSum = lo;

  // Build the actual index-partitions using that minimal maxSum.
  let partitions: number[][] = [];
  {
    let cur: number[] = [], curSum = 0;
    for (let i = 0; i < n; i++) {
      if (curSum + sizes[i] > maxSum && cur.length > 0) { partitions.push(cur); cur = []; curSum = 0; }
      cur.push(i);
      curSum += sizes[i];
    }
    if (cur.length) partitions.push(cur);
  }

  // Fewer partitions than day slots? Split the largest one at its best
  // boundary (minimizing the resulting max of the two halves) and repeat.
  while (partitions.length < dayCount) {
    let bestIdx = -1, bestSum = -1;
    for (let i = 0; i < partitions.length; i++) {
      if (partitions[i].length <= 1) continue;
      const sum = partitions[i].reduce((s, gi) => s + sizes[gi], 0);
      if (sum > bestSum) { bestSum = sum; bestIdx = i; }
    }
    if (bestIdx === -1) break; // nothing left splittable (each partition is a single group)

    const part = partitions[bestIdx];
    const total = part.reduce((s, gi) => s + sizes[gi], 0);
    let bestSplit = 1, bestMax = Infinity, leftSum = 0;
    for (let k = 1; k < part.length; k++) {
      leftSum += sizes[part[k - 1]];
      const m = Math.max(leftSum, total - leftSum);
      if (m < bestMax) { bestMax = m; bestSplit = k; }
    }
    partitions.splice(bestIdx, 1, part.slice(0, bestSplit), part.slice(bestSplit));
  }

  const result: PlanTask[][] = partitions.map((idxs) => idxs.flatMap((i) => groups[i]));
  while (result.length < dayCount) result.push([]); // only if n < dayCount
  return result;
}

// 21-day plan: the SAME essentials (122 DSA + 51 SE + 43 SD) and the SAME
// cadence ratio as the original 15-day plan (review after every 2 study
// days), but actually spread across every available non-Sunday day in the
// 21-day span — not squeezed into a fixed 10 study days with a dead week of
// buffer at the end. Real calendar Sundays are the only rest days; every
// other day carries real (lighter) work. Final mock and behavioral prep are
// NOT part of the 21 days — both are appended as separate days right after.
function generate21DayPlan(startDate: string, weakIds: string[] = []): StudyPlan {
  const targetDays = 21;
  const weakSet = new Set(weakIds);
  const dsaQueue = buildDSATasks().filter((t) => t.kind === "theory" || ESSENTIAL_DSA_SET.has(t.id));
  let sdQueue = buildSDTasks().filter((t) => ESSENTIAL_SD_SET.has(t.id));
  let seQueue = buildSETasks().filter((t) => ESSENTIAL_SE_SET.has(t.id));
  const behavioralQueue = topByPriority(buildBehavioralTasks(), 999);
  const assigned: PlanTask[] = [];
  const window: PlanTask[] = [];
  const days: DayPlan[] = [];

  // Manual pin: all the OS topics (CPU Scheduling, IPC, Process
  // Synchronization, Deadlocks, Memory Management, Page Replacement, File
  // Systems, Linux Essentials) + Caching, CDN & Edge (SD) all belong
  // together on the Two-Pointers/Prefix-Sum day. Pull them out of the
  // normal sequential drain now so they land there exactly, not wherever
  // the day-by-day split would otherwise put them. Order here doesn't
  // control display order — that comes from seQueue's curriculum order
  // (OS chapters stay in their natural chapter sequence).
  const pinnedDay2Ids = new Set([
    "operating-systems/cpu-scheduling-algorithms",
    "operating-systems/inter-process-communication",
    "operating-systems/process-synchronization",
    "operating-systems/deadlocks",
    "operating-systems/memory-management",
    "operating-systems/page-replacement-algorithms",
    "operating-systems/file-systems",
    "operating-systems/linux-essentials-interview-focused",
    "caching",
    "cdn",
  ]);
  const pinnedDay2Tasks: PlanTask[] = [];
  seQueue = seQueue.filter((t) => {
    if (pinnedDay2Ids.has(t.id)) { pinnedDay2Tasks.push(t); return false; }
    return true;
  });
  sdQueue = sdQueue.filter((t) => {
    if (pinnedDay2Ids.has(t.id)) { pinnedDay2Tasks.push(t); return false; }
    return true;
  });

  const weekdayOf = (dn: number) => new Date(addDays(startDate, dn - 1) + "T00:00:00").getDay();
  const allDays = Array.from({ length: targetDays }, (_, i) => i + 1);
  const nonSundays = allDays.filter((d) => weekdayOf(d) !== 0);

  // Same ratio as the original plan (review after every 2 study days —
  // i.e. every 3rd non-Sunday day is review), but applied across ALL
  // non-Sunday days in the 21-day span so every one of them gets real work.
  const reviewDays = new Set<number>();
  {
    let count = 0;
    for (const d of nonSundays) {
      count++;
      if (count % 3 === 0) reviewDays.add(d);
    }
  }
  const studyDayCount = nonSundays.length - reviewDays.size;

  const dsaBuckets = packPatternGroups(groupByPattern(dsaQueue), studyDayCount);
  let studyDayIdx = 0;
  let studyDaysLeft = studyDayCount;

  let slot = 0; // counts study slots only, for the "learn vs practice" split below
  for (let dayNum = 1; dayNum <= targetDays; dayNum++) {
    const date = addDays(startDate, dayNum - 1);

    if (weekdayOf(dayNum) === 0) {
      days.push({
        day: dayNum, date, phase: "review", type: "rest",
        label: "Rest day", color: PHASE_COLOR.review, tasks: [],
      });
      continue;
    }

    if (reviewDays.has(dayNum)) {
      const recent = topByPriority(window, 6);
      const recentIds = new Set(window.map((t) => t.id));
      const olderPool = assigned.filter((t) => !recentIds.has(t.id));
      const weakFirst = topByPriority(olderPool.filter((t) => weakSet.has(t.id)), 3);
      const weakFirstIds = new Set(weakFirst.map((t) => t.id));
      const remainingOlder = olderPool.filter((t) => !weakFirstIds.has(t.id));
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

    // Study slot — DSA comes from the pre-packed whole-pattern bucket for
    // this slot, so a pattern always starts and finishes on the same day.
    const share = (n: number) => Math.ceil(n / Math.max(1, studyDaysLeft));
    const dsaSlice = dsaBuckets[studyDayIdx] ?? [];
    const seSlice = seQueue.splice(0, share(seQueue.length));
    const sdSlice = sdQueue.splice(0, share(sdQueue.length));
    studyDaysLeft--;
    studyDayIdx++;

    const half = Math.ceil(dsaSlice.length / 2);
    const amDsa = dsaSlice.slice(0, half).map((t) => ({ ...t, timeBlock: "AM" as const }));
    const pmDsa = dsaSlice.slice(half).map((t) => ({ ...t, timeBlock: "PM" as const }));
    const seTasks = seSlice.map((t) => ({ ...t, timeBlock: "PM" as const }));
    const sdTasks = sdSlice.map((t) => ({ ...t, timeBlock: "PM" as const }));
    const recall = recallTask(dayNum, "Redo today's AM problems from memory — timed, no IDE");

    const tasks = [...amDsa, ...pmDsa, ...seTasks, ...sdTasks, recall];
    window.push(...amDsa, ...pmDsa, ...seTasks, ...sdTasks);
    assigned.push(...amDsa, ...pmDsa, ...seTasks, ...sdTasks);
    days.push({
      day: dayNum, date, phase: "dsa",
      type: slot <= 4 ? "learn" : "practice",
      label: labelFromTasks("Core sprint", [...amDsa, ...pmDsa]),
      color: PHASE_COLOR.dsa, tasks,
    });
    slot++;
  }

  // Manual rebalance: Prefix Sum bundled with Sliding Window makes that day
  // too hard (two non-trivial patterns same day). Move Prefix Sum onto the
  // day that has Two Pointers alone instead, and swap that day's SE/SD load
  // onto the (now Sliding-Window-only) day — so neither day stacks a hard
  // second DSA pattern AND a context-switch into SE/SD.
  {
    const isSeSd = (t: PlanTask) => t.domain === "se" || t.domain === "sd";
    const hasTag = (d: DayPlan, tag: string) => d.tasks.some((t) => t.domain === "dsa" && t.tag === tag);
    const dayTwoPointersOnly = days.find((d) => d.type !== "rest" && hasTag(d, "Two Pointers") && !hasTag(d, "Prefix Sum"));
    const dayPrefixAndSliding = days.find((d) => d.type !== "rest" && hasTag(d, "Prefix Sum") && hasTag(d, "Sliding Window"));
    if (dayTwoPointersOnly && dayPrefixAndSliding) {
      const prefixTasks = dayPrefixAndSliding.tasks.filter((t) => t.domain === "dsa" && t.tag === "Prefix Sum");
      const bSeSd = dayPrefixAndSliding.tasks.filter(isSeSd);
      const aSeSd = dayTwoPointersOnly.tasks.filter(isSeSd);
      const aRest = dayTwoPointersOnly.tasks.filter((t) => !isSeSd(t));
      const bRest = dayPrefixAndSliding.tasks.filter((t) => !isSeSd(t) && !(t.domain === "dsa" && t.tag === "Prefix Sum"));
      dayTwoPointersOnly.tasks = [
        ...aRest,
        ...prefixTasks.map((t) => ({ ...t, timeBlock: "PM" as const })),
        ...pinnedDay2Tasks.map((t) => ({ ...t, timeBlock: "Eve" as const })),
      ];
      dayPrefixAndSliding.tasks = [...bRest, ...aSeSd, ...bSeSd];
      // Pinned tasks were pulled out before the main drain, so they never
      // entered `assigned` — add them now so the final mock can still pull
      // from them (review days have already run by this point in the loop).
      assigned.push(...pinnedDay2Tasks);
    } else {
      // Fallback — the expected day shapes weren't found (e.g. pattern
      // grouping changed). Don't silently drop the pinned tasks: attach
      // them to the first study day instead.
      const firstStudyDay = days.find((d) => d.type === "learn" || d.type === "practice");
      if (firstStudyDay) {
        firstStudyDay.tasks = [...firstStudyDay.tasks, ...pinnedDay2Tasks.map((t) => ({ ...t, timeBlock: "Eve" as const }))];
        assigned.push(...pinnedDay2Tasks);
      }
    }
  }

  // Final technical mock — entirely OUTSIDE the 21 days, day 22.
  let dayNum = targetDays + 1;
  {
    const date = addDays(startDate, dayNum - 1);
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
    days.push({
      day: dayNum, date, phase: "mock", type: "mock",
      label: "Final technical mock — DSA/SE/SD simulation",
      color: PHASE_COLOR.mock, tasks: [...core, cheatSheet],
      reviewNote: getReviewNote("mock"),
    });
    dayNum++;
  }

  // Behavioral prep — entirely OUTSIDE the 21 days, appended right after the mock.
  const behavioralExtraDays = 2;
  const behavioralPerDay = Math.ceil(behavioralQueue.length / behavioralExtraDays);
  for (let i = 0; i < behavioralExtraDays; i++) {
    const date = addDays(startDate, dayNum - 1);
    const slice = behavioralQueue.splice(0, behavioralPerDay).map((t, ti) => ({
      ...t, timeBlock: (ti % 2 === 0 ? "AM" : "PM") as "AM" | "PM",
    }));
    days.push({
      day: dayNum, date, phase: "behavioral", type: "practice",
      label: `Behavioral prep ${i + 1}/${behavioralExtraDays} — STAR stories & company values`,
      color: PHASE_COLOR.behavioral, tasks: slice,
      reviewNote: getReviewNote("behavioral"),
    });
    dayNum++;
  }

  return { durationDays: targetDays, startDate, days };
}

export function generateStudyPlan(durationDays: 21 | 30 | 60 | 90, startDate: string, trackWeights?: Record<string, number>, weakIds?: string[]): StudyPlan {
  if (durationDays === 21) return generate21DayPlan(startDate, weakIds);
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
  // Behavioral is entirely OUTSIDE these durationDays — appended as extra days
  // after the loop, so DSA/SE/SD fully own the stated time span (no carve-out).
  const behavioralQueue = buildBehavioralTasks();
  const assigned: PlanTask[] = [];
  const weeklyWindow: PlanTask[] = [];
  const days: DayPlan[] = [];
  const behavioralDays = durationDays === 30 ? 3 : durationDays === 60 ? 5 : 7;
  // Real weekday of a plan day (0 = Sunday, 6 = Saturday).
  // Saturday = review, Sunday = mock. Both are weekend days (no new learning).
  const weekdayOf = (dn: number) => new Date(addDays(startDate, dn - 1) + "T00:00:00").getDay();
  const isSatReview = (dn: number) => weekdayOf(dn) === 6;
  const isSunMock   = (dn: number) => weekdayOf(dn) === 0;
  const isWeekend   = (dn: number) => isSatReview(dn) || isSunMock(dn);
  const coreWorkDays = Array.from({ length: durationDays }, (_, i) => i + 1).filter((day) => !isWeekend(day)).length;

  function remainingCoreEffort() {
    return totalEffort(dsaQueue) + totalEffort(sdQueue) + totalEffort(seQueue);
  }

  function remainingCoreWorkDays(dayNum: number) {
    return Array.from({ length: Math.max(0, durationDays - dayNum + 1) }, (_, i) => dayNum + i)
      .filter((day) => !isWeekend(day)).length;
  }

  for (let dayNum = 1; dayNum <= durationDays; dayNum++) {
    const date = addDays(startDate, dayNum - 1);
    const slot = (dayNum - 1) % 7;
    const week = Math.ceil(dayNum / 7);

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

  // Behavioral prep — entirely OUTSIDE durationDays, appended right after so
  // DSA/SE/SD get the full stated time span. Last appended day is the capstone:
  // a combined behavioral + technical mock.
  for (let i = 0; i < behavioralDays; i++) {
    const dayNum = durationDays + i + 1;
    const date = addDays(startDate, dayNum - 1);
    const isFinal = i === behavioralDays - 1;
    const target = Math.max(3, totalEffort(behavioralQueue) / Math.max(1, behavioralDays - i));
    const tasks = takeByEffort(behavioralQueue, target, 2);
    days.push({
      day: dayNum,
      date,
      phase: isFinal ? "mock" : "behavioral",
      type: isFinal ? "mock" : "practice",
      label: isFinal ? "Final behavioral + technical mock" : labelFromTasks("Behavioral prep", tasks),
      color: isFinal ? PHASE_COLOR.mock : PHASE_COLOR.behavioral,
      tasks: isFinal ? [...tasks, ...topByPriority(assigned, 4)] : tasks,
      reviewNote: getReviewNote(isFinal ? "mock" : "behavioral"),
    });
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
