import { PATTERNS } from "@/data/problems";
import { SD_CHAPTERS } from "@/data/systemDesign";
import { SE_SUBJECTS } from "@/data/seBasics";
import { LLD_SUBJECTS } from "@/data/lld";
import { COMMON_QUESTIONS, COMPANY_VALUES } from "@/data/behavioral";
import { ESSENTIAL_DSA_SET, ESSENTIAL_SE_SET, ESSENTIAL_SD_SET, ESSENTIAL_LLD_SET } from "@/data/essentials15";

export type TaskDomain = "dsa" | "sd" | "se" | "lld" | "behavioral";
export type DayPhase = "dsa" | "sd" | "se" | "lld" | "review" | "mock" | "behavioral";
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
  lld: "#EC4899",
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

function buildLLDTasks(): PlanTask[] {
  return LLD_SUBJECTS.flatMap((subject) =>
    subject.chapters.map((ch) => ({
      domain: "lld" as const,
      id: `${subject.id}/${ch.id}`,
      title: ch.title,
      href: `/lld/${subject.id}#${ch.id}`,
      tag: subject.title,
      subjectId: subject.id,
      priority: 3,
      meta: subject.title,
      kind: "concept" as const,
    }))
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
  const lldQueue = buildLLDTasks().filter((t) => ESSENTIAL_LLD_SET.has(t.id));
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
    // The Two-Pointers day gets its full SE/SD load from the pinned bundle
    // below instead — skip its normal share here so that load isn't doubled
    // up, and the remaining SE/SD spreads a little more evenly over the
    // other study days instead.
    const isTwoPointersDay = dsaSlice.some((t) => t.tag === "Two Pointers");
    const seSlice = isTwoPointersDay ? [] : seQueue.splice(0, share(seQueue.length));
    const sdSlice = isTwoPointersDay ? [] : sdQueue.splice(0, share(sdQueue.length));
    const lldSlice = lldQueue.splice(0, share(lldQueue.length));
    studyDaysLeft--;
    studyDayIdx++;

    const half = Math.ceil(dsaSlice.length / 2);
    const amDsa = dsaSlice.slice(0, half).map((t) => ({ ...t, timeBlock: "AM" as const }));
    const pmDsa = dsaSlice.slice(half).map((t) => ({ ...t, timeBlock: "PM" as const }));
    const seTasks = seSlice.map((t) => ({ ...t, timeBlock: "PM" as const }));
    const sdTasks = sdSlice.map((t) => ({ ...t, timeBlock: "PM" as const }));
    const lldTasks = lldSlice.map((t) => ({ ...t, timeBlock: "Eve" as const }));
    const recall = recallTask(dayNum, "Redo today's AM problems from memory — timed, no IDE");

    const tasks = [...amDsa, ...pmDsa, ...seTasks, ...sdTasks, ...lldTasks, recall];
    window.push(...amDsa, ...pmDsa, ...seTasks, ...sdTasks, ...lldTasks);
    assigned.push(...amDsa, ...pmDsa, ...seTasks, ...sdTasks, ...lldTasks);
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
  // day that has Two Pointers alone instead (that day already skipped its
  // normal SE/SD share above, so it isn't overloaded once the pinned bundle
  // lands on it too). The Sliding-Window day keeps its own SE/SD unchanged —
  // nothing gets doubled up.
  {
    const hasTag = (d: DayPlan, tag: string) => d.tasks.some((t) => t.domain === "dsa" && t.tag === tag);
    const dayTwoPointersOnly = days.find((d) => d.type !== "rest" && hasTag(d, "Two Pointers") && !hasTag(d, "Prefix Sum"));
    const dayPrefixAndSliding = days.find((d) => d.type !== "rest" && hasTag(d, "Prefix Sum") && hasTag(d, "Sliding Window"));
    if (dayTwoPointersOnly && dayPrefixAndSliding) {
      const prefixTasks = dayPrefixAndSliding.tasks.filter((t) => t.domain === "dsa" && t.tag === "Prefix Sum");
      const bRest = dayPrefixAndSliding.tasks.filter((t) => !(t.domain === "dsa" && t.tag === "Prefix Sum"));
      dayTwoPointersOnly.tasks = [
        ...dayTwoPointersOnly.tasks,
        ...prefixTasks.map((t) => ({ ...t, timeBlock: "PM" as const })),
        ...pinnedDay2Tasks.map((t) => ({ ...t, timeBlock: "Eve" as const })),
      ];
      dayPrefixAndSliding.tasks = bRest;
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

// ---------------------------------------------------------------------------
// Missed-day rebalancing
//
// A generated plan pins every day to a fixed calendar date, so unfinished work
// on a past day would otherwise sit stranded there forever. Instead we pull
// that work forward. Two modes, chosen by whether an interview date is set:
//
//   • No interview date  → EXTEND. The plan grows by however many days the
//     missed work needs. Nothing gets denser; the finish date moves out.
//   • Interview date set → COMPRESS. The deadline is real, so the plan cannot
//     grow. Missed work is spread thinly across the days that remain before
//     the interview — miss one day with 18 left and each day grows a few
//     percent, which is invisible in practice.
//
// Rest days stay pinned to real Sundays in both modes: work is only ever
// placed on non-Sunday days, and after any day is inserted the whole array is
// re-dated and Sundays re-marked as rest.
// ---------------------------------------------------------------------------

export type RebalanceMode = "none" | "extend" | "compress";

export interface RebalanceInfo {
  mode: RebalanceMode;
  /** How many unfinished tasks were pulled forward off past days. */
  carriedCount: number;
  /** Extra days appended to fit the carried work (extend mode only). */
  daysAdded: number;
  /**
   * Compress mode only: the remaining days can't absorb the carried work
   * without going well past a normal day's load. The deadline is at risk.
   */
  overloaded: boolean;
}

const CARRY_TAG = "↺ Carried";

function isSundayISO(iso: string): boolean {
  return new Date(iso + "T00:00:00").getDay() === 0;
}

/** Split `arr` into `n` contiguous, near-equal chunks (keeps original order). */
function chunkEvenly<T>(arr: T[], n: number): T[][] {
  const out: T[][] = Array.from({ length: Math.max(0, n) }, () => [] as T[]);
  if (n <= 0) return out;
  const per = Math.floor(arr.length / n);
  const extra = arr.length % n;
  let k = 0;
  for (let i = 0; i < n; i++) {
    const take = per + (i < extra ? 1 : 0);
    out[i] = arr.slice(k, k + take);
    k += take;
  }
  return out;
}

function markCarried(t: PlanTask): PlanTask {
  const base = t.tag ?? "";
  return { ...t, tag: base.startsWith(CARRY_TAG) ? base : `${CARRY_TAG}${base ? ` · ${base}` : ""}` };
}

function blankStudyDay(): DayPlan {
  return {
    day: 0, date: "", phase: "dsa", type: "practice",
    label: "Catch-up", color: PHASE_COLOR.dsa, tasks: [],
  };
}

/**
 * Re-date and renumber every day from the start date, then force any day that
 * lands on a Sunday to be a rest day. Tasks displaced off a Sunday are
 * returned so the caller can re-place them.
 */
function redateAndFixRest(days: DayPlan[], startDate: string): PlanTask[] {
  const displaced: PlanTask[] = [];
  days.forEach((d, i) => {
    d.day = i + 1;
    d.date = addDays(startDate, i);
  });
  for (const d of days) {
    if (isSundayISO(d.date)) {
      if (d.tasks.length) { displaced.push(...d.tasks); d.tasks = []; }
      d.type = "rest";
      d.phase = "review";
      d.label = "Rest day";
      d.color = PHASE_COLOR.review;
    } else if (d.type === "rest") {
      // Shifted off Sunday — it's an ordinary (currently empty) day again.
      d.type = "practice";
      d.phase = "dsa";
      d.label = "Catch-up";
      d.color = PHASE_COLOR.dsa;
    }
  }
  return displaced;
}

export function rebalancePlan(
  plan: StudyPlan,
  today: string,
  isDone: (task: PlanTask) => boolean,
  interviewDate?: string | null
): { plan: StudyPlan; info: RebalanceInfo } {
  const none: RebalanceInfo = { mode: "none", carriedCount: 0, daysAdded: 0, overloaded: false };
  const elapsed = daysDiff(plan.startDate, today);
  if (elapsed <= 0) return { plan, info: none };

  const days: DayPlan[] = plan.days.map((d) => ({ ...d, tasks: [...d.tasks] }));
  const todayIdx = Math.min(elapsed, days.length - 1);
  // Mutable: extend mode splices extra study days into the core span.
  let coreCount = Math.min(plan.durationDays, days.length);

  // 1. Strip unfinished work off past days. Behavioral tasks have no
  //    completion toggle so they'd carry forever — leave them where they are.
  //    Per-day recall prompts ("redo today's AM problems") are tied to that
  //    day's content and every new day generates its own, so they're dropped
  //    rather than carried stale.
  const carried: PlanTask[] = [];
  for (let i = 0; i < todayIdx; i++) {
    const d = days[i];
    if (!d || d.type === "rest") continue;
    const keep: PlanTask[] = [];
    for (const t of d.tasks) {
      if (isDone(t)) { keep.push(t); continue; }            // finished work stays as history
      if (t.domain === "behavioral") { keep.push(t); continue; } // no toggle → would carry forever
      // Per-day recall prompts ("redo today's AM problems") are tied to the
      // content that was scheduled that day. That content has just moved, and
      // every study day generates its own prompt, so this one is dropped
      // rather than carried stale or left behind looking unfinished.
      if (t.id.startsWith("recall-")) continue;
      carried.push(markCarried(t));
    }
    d.tasks = keep;
  }
  if (carried.length === 0) return { plan: { ...plan, days }, info: none };

  const compress = Boolean(interviewDate);

  // Days eligible to receive carried work: study days from today onward,
  // inside the core span (never the trailing mock / behavioral days).
  const eligible = (): number[] => {
    const out: number[] = [];
    for (let i = todayIdx; i < coreCount; i++) {
      const d = days[i];
      if (!d || d.type === "rest") continue;
      if (d.phase === "mock" || d.phase === "behavioral") continue;
      if (compress && interviewDate && d.date > interviewDate) continue;
      out.push(i);
    }
    return out;
  };

  if (compress) {
    // Deadline is fixed — spread carried work across what's left, no new days.
    const slots = eligible();
    if (slots.length === 0) {
      // Nothing left before the interview: dump on the soonest working day so
      // the work is at least still visible rather than silently dropped.
      const fallback = days.findIndex((d, i) => i >= todayIdx && d.type !== "rest");
      if (fallback >= 0) days[fallback].tasks.push(...carried);
      return {
        plan: { ...plan, days },
        info: { mode: "compress", carriedCount: carried.length, daysAdded: 0, overloaded: true },
      };
    }
    const chunks = chunkEvenly(carried, slots.length);
    let worstRatio = 0;
    slots.forEach((dayIdx, ci) => {
      const before = totalEffort(days[dayIdx].tasks);
      days[dayIdx].tasks = [...days[dayIdx].tasks, ...chunks[ci]];
      const after = totalEffort(days[dayIdx].tasks);
      if (before > 0) worstRatio = Math.max(worstRatio, after / before);
    });
    return {
      plan: { ...plan, days },
      info: {
        mode: "compress",
        carriedCount: carried.length,
        daysAdded: 0,
        overloaded: worstRatio > 1.6,
      },
    };
  }

  // EXTEND — no deadline, so keep daily load flat and let the plan grow.
  // Rebuild the remaining stream (carried work first, then everything already
  // scheduled from today onward) and re-slice it over the study days using
  // each day's original effort budget, appending days for the overflow.
  const slots = eligible();
  const budget = (() => {
    const study = plan.days.filter((d) => d.type === "learn" || d.type === "practice");
    const eff = study.length ? totalEffort(study.flatMap((d) => d.tasks)) / study.length : 0;
    return Math.max(4, eff);
  })();

  const stream: PlanTask[] = [...carried];
  for (const i of slots) {
    stream.push(...days[i].tasks);
    days[i].tasks = [];
  }

  let daysAdded = 0;
  const MAX_ADDED = 60; // hard stop; a plan needing more than this is a rewrite
  let leftover = 0;

  for (let guard = 0; guard < MAX_ADDED + 2; guard++) {
    const targets = eligible();
    // Clear every target first — a previous pass may have filled days that a
    // re-date has since turned into rest days or shifted around.
    for (const i of targets) days[i].tasks = [];

    const queue = [...stream];
    for (const i of targets) {
      if (queue.length === 0) break;
      const day = days[i];
      let eff = 0;
      while (queue.length > 0) {
        const next = queue[0];
        const e = taskEffort(next);
        if (day.tasks.length > 0 && eff + e > budget + 0.75) break;
        day.tasks.push(queue.shift()!);
        eff += e;
        if (eff >= budget) break;
      }
      day.label = labelFromTasks(day.label, day.tasks);
    }

    leftover = queue.length;
    if (leftover === 0) break;
    if (daysAdded >= MAX_ADDED) break;

    // Still work left over — append another study day at the end of the core
    // span (before the mock / behavioral tail), then re-date so Sundays stay
    // rest days, and run the fill again over the new slot set.
    days.splice(coreCount, 0, blankStudyDay());
    coreCount += 1;
    daysAdded++;
    const displaced = redateAndFixRest(days, plan.startDate);
    if (displaced.length) stream.push(...displaced);
  }

  // Clear any day that ended up with nothing so it doesn't render as an empty
  // work day, and refresh labels.
  for (const d of days) {
    if (d.type !== "rest" && d.tasks.length === 0 && d.phase !== "mock" && d.phase !== "behavioral") {
      d.label = "Free — buffer day";
    }
  }

  return {
    plan: { ...plan, days },
    info: { mode: "extend", carriedCount: carried.length, daysAdded, overloaded: false },
  };
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
