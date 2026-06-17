import { PATTERNS } from "@/data/problems";
import { SD_CHAPTERS } from "@/data/systemDesign";
import { SE_SUBJECTS } from "@/data/seBasics";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TaskDomain = "dsa" | "sd" | "se";
export type DayPhase = "dsa" | "sd" | "se" | "review" | "mock";
export type DayType = "learn" | "practice" | "review" | "mock" | "rest";

export interface PlanTask {
  domain: TaskDomain;
  id: string;
  title: string;
  href: string;
  difficulty?: string;
  tag?: string;        // pattern (DSA), chapter (SD), subject (SE)
  subjectId?: string;  // SE: for seStore key `${subjectId}/${chapterId}`
  priority: number;    // higher = more important to review (1–9)
  meta?: string;       // display label on review cards: "Hard · High freq", "Fundamental", etc.
}

export interface DayPlan {
  day: number;
  date: string;
  phase: DayPhase;
  type: DayType;
  label: string;
  color: string;
  tasks: PlanTask[];        // content days: work to do; review days: focus tasks
  reviewCovered?: PlanTask[]; // review days only: ALL tasks covered in this window
  reviewNote?: string;
}

export interface StudyPlan {
  durationDays: 30 | 60 | 90;
  startDate: string;
  days: DayPlan[];
}

// ─── Domain Colors ────────────────────────────────────────────────────────────

export const PHASE_COLOR: Record<DayPhase, string> = {
  dsa:    "#4F8CFF",
  sd:     "#2FBF71",
  se:     "#F5A524",
  review: "#9AA4B2",
  mock:   "#EF4444",
};

// ─── Priority scoring ─────────────────────────────────────────────────────────

function dsaPriority(difficulty: string, frequency: string): number {
  const f = frequency === "High" ? 3 : frequency === "Medium" ? 2 : 1;
  const d = difficulty === "Hard" ? 3 : difficulty === "Medium" ? 2 : 1;
  return f * 2 + d; // 3–9, higher = must review
}

function sdPriority(difficulty: string): number {
  return difficulty === "Fundamental" ? 3 : difficulty === "Intermediate" ? 2 : 1;
}

// ─── Task builders (with priority + meta) ────────────────────────────────────

function buildDSATasks(): PlanTask[] {
  return PATTERNS.flatMap((pattern) =>
    pattern.problems.map((p) => {
      const freq = (p as { frequency?: string }).frequency ?? "Medium";
      return {
        domain: "dsa" as const,
        id: p.id,
        title: p.title,
        href: p.hasVisualization ? `/visualizations/${p.id}` : `/problems/${p.id}`,
        difficulty: p.difficulty,
        tag: pattern.title,
        priority: dsaPriority(p.difficulty, freq),
        meta: `${p.difficulty} · ${freq} freq`,
      };
    })
  );
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
    })),
    ...(chapter.caseStudies ?? []).map((cs) => ({
      domain: "sd" as const,
      id: cs.id,
      title: cs.title,
      href: `/system-design/case-study/${cs.id}`,
      tag: "Case Study",
      priority: 2,
      meta: "Case Study",
    })),
  ]);
}

function buildSETasks(): PlanTask[] {
  return SE_SUBJECTS.flatMap((subject) =>
    subject.chapters.map((ch) => {
      const hasInterview = ch.blocks.some(
        (b) => b.type === "interview" || b.type === "placement"
      );
      return {
        domain: "se" as const,
        id: `${subject.id}/${ch.id}`,
        title: ch.title,
        href: `/se-basics/${subject.id}#${ch.id}`,
        tag: subject.title,
        subjectId: subject.id,
        priority: hasInterview ? 3 : 2,
        meta: hasInterview ? "Interview focus" : subject.title,
      };
    })
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addDays(iso: string, n: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function topByPriority(tasks: PlanTask[], n: number): PlanTask[] {
  return [...tasks].sort((a, b) => b.priority - a.priority).slice(0, n);
}

/** Spread tasks across contentDays, grouping same-tag tasks together. */
function distribute(tasks: PlanTask[], contentDays: number, maxPerDay: number): PlanTask[][] {
  const out: PlanTask[][] = Array.from({ length: contentDays }, () => []);
  let dayIdx = 0;
  for (const task of tasks) {
    if (out[dayIdx].length >= maxPerDay) dayIdx = Math.min(dayIdx + 1, contentDays - 1);
    if (out[dayIdx].length < maxPerDay) out[dayIdx].push(task);
  }
  return out;
}

// ─── Review notes (strategy tips) ────────────────────────────────────────────

const REVIEW_NOTES: Record<string, string[]> = {
  dsa: [
    "Re-solve the HIGH-PRIORITY problems below from scratch — no hints. These are the ones interviewers test most.",
    "For each problem: write the brute force first, then optimize. Say your approach aloud before coding.",
    "Timed mode: 20 min per problem. If stuck after 10 min, draw the pattern structure then continue.",
    "Focus on HARD + Medium-freq problems — these separate candidates. If you solved them before, verify you can do it again cold.",
  ],
  sd: [
    "For each Fundamental concept below: draw the architecture from memory. Check your version against the concept page.",
    "Answer this for every concept: What fails without it? What's the main trade-off? When would you NOT use it?",
    "For case studies: whiteboard the full design in 8 min. Cover: requirements, scale, data model, key components.",
    "Walk through these concepts as a sequence — how do they compose into a real system?",
  ],
  se: [
    "For each chapter marked 'Interview focus': recite the top 3 interview Q&As from memory, then verify.",
    "Write the analogy or memory trick for each chapter below without looking. These are what make answers stick.",
    "Go through these chapters and answer: 'How would I explain this to an interviewer in 60 seconds?'",
  ],
  review: [
    "Cross-domain drill: pick one DSA problem, one SD concept, one SE chapter from your weakest areas. Deep-dive each.",
    "Do the problems you haven't solved yet — those are your real gaps. Don't skip to new content.",
    "Pattern-map drill: for each unsolved DSA problem, identify the pattern first before attempting. No random trial-and-error.",
    "SD + SE integration: for each SE topic (OS, DBMS, CN), find where it appears in system design and connect the dots.",
  ],
  mock: [
    "DSA Mock: 2 problems, 35 min total. No hints, no looking at solution. Grade: Did you get AC? Was your complexity correct?",
    "SD Mock: Pick a case study you haven't read. Design it solo in 45 min. Cover all 6 steps. Grade yourself on completeness.",
    "Full simulation: 30-min DSA (2 problems) + 45-min SD (1 case study). Treat it like a real interview. No interruptions.",
  ],
};

function getReviewNote(phase: DayPhase, idx: number): string {
  const arr = REVIEW_NOTES[phase] ?? REVIEW_NOTES["review"];
  return arr[idx % arr.length];
}

// ─── Plan Allocations ─────────────────────────────────────────────────────────
// Total phase days = contentDays + floor(contentDays/6) + 1
//   30-day:  DSA(10→12) + SD(6→8)  + SE(4→5)  + final(5)  = 30
//   60-day:  DSA(20→24) + SD(14→17)+ SE(11→13) + final(6)  = 60
//   90-day:  DSA(28→33) + SD(22→26)+ SE(18→22) + final(9)  = 90

const ALLOC: Record<30 | 60 | 90, { dsa: number; sd: number; se: number; final: number }> = {
  30: { dsa: 10, sd: 6,  se: 4,  final: 5 },
  60: { dsa: 20, sd: 14, se: 11, final: 6 },
  90: { dsa: 28, sd: 22, se: 18, final: 9 },
};

const MAX_PER_DAY: Record<30 | 60 | 90, Record<TaskDomain, number>> = {
  30: { dsa: 5, sd: 5, se: 4 },
  60: { dsa: 5, sd: 5, se: 5 },
  90: { dsa: 7, sd: 5, se: 3 },
};

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateStudyPlan(durationDays: 30 | 60 | 90, startDate: string): StudyPlan {
  const alloc = ALLOC[durationDays];
  const maxPerDay = MAX_PER_DAY[durationDays];

  const dsaChunks = distribute(buildDSATasks(), alloc.dsa, maxPerDay.dsa);
  const sdChunks  = distribute(buildSDTasks(),  alloc.sd,  maxPerDay.sd);
  const seChunks  = distribute(buildSETasks(),  alloc.se,  maxPerDay.se);

  const days: DayPlan[] = [];
  let dayNum = 1;
  let reviewNoteIdx = 0;

  function schedulePhase(
    phase: "dsa" | "sd" | "se",
    chunks: PlanTask[][],
    contentDays: number
  ) {
    const totalPhaseDays = contentDays + Math.floor(contentDays / 6) + 1;
    let contentDay = 0;
    let windowBuffer: PlanTask[] = []; // tasks since last review
    const allPhaseTasks: PlanTask[] = chunks.flat();

    for (let i = 0; i < totalPhaseDays; i++) {
      const date = addDays(startDate, dayNum - 1);
      const isEndOfPhase = i === totalPhaseDays - 1;
      const isWeeklyReview = (i + 1) % 7 === 0;
      const isReview = isWeeklyReview || isEndOfPhase;

      if (isReview) {
        // Focus = top 8 by priority from the window (or entire phase for end-of-phase)
        const pool = isEndOfPhase ? allPhaseTasks : windowBuffer;
        const focusTasks = topByPriority(pool, 8);
        days.push({
          day: dayNum,
          date,
          phase,
          type: "review",
          label: isEndOfPhase
            ? `${phase === "dsa" ? "DSA" : phase === "sd" ? "System Design" : "SE Basics"} — Full Phase Review`
            : `Week ${Math.ceil((i + 1) / 7)} Review — ${phase === "dsa" ? "DSA" : phase === "sd" ? "System Design" : "SE Basics"}`,
          color: PHASE_COLOR.review,
          tasks: focusTasks,
          reviewCovered: [...windowBuffer],
          reviewNote: getReviewNote(phase, reviewNoteIdx++),
        });
        windowBuffer = [];
      } else {
        const tasks = chunks[contentDay] ?? [];
        windowBuffer.push(...tasks);
        const isFirstDay = contentDay === 0;
        const tags = [...new Set(tasks.map((t) => t.tag).filter(Boolean))];
        const label = isFirstDay
          ? `Start: ${tags[0] ?? (phase === "dsa" ? "DSA" : phase === "sd" ? "System Design" : "SE Basics")}`
          : tags.slice(0, 2).join(" + ") || (phase === "dsa" ? "Practice" : phase === "sd" ? "SD Concepts" : "SE Reading");

        days.push({
          day: dayNum,
          date,
          phase,
          type: contentDay < Math.ceil(contentDays * 0.4) ? "learn" : "practice",
          label,
          color: PHASE_COLOR[phase],
          tasks,
        });
        contentDay++;
      }
      dayNum++;
    }
  }

  schedulePhase("dsa", dsaChunks, alloc.dsa);
  schedulePhase("sd",  sdChunks,  alloc.sd);
  schedulePhase("se",  seChunks,  alloc.se);

  // Collect top tasks from all domains for comprehensive review days
  const topDSA = topByPriority(dsaChunks.flat(), 6);
  const topSD  = topByPriority(sdChunks.flat(), 4);
  const topSE  = topByPriority(seChunks.flat(), 4);

  const mockCount = Math.min(3, Math.floor(alloc.final * 0.4));
  const revCount  = alloc.final - mockCount;

  const revConfig: Array<{ label: string; tasks: PlanTask[]; note: string }> = [
    { label: "Comprehensive Review — DSA High-Priority Problems", tasks: topDSA, note: getReviewNote("review", 0) },
    { label: "Comprehensive Review — System Design Fundamentals", tasks: topSD,  note: getReviewNote("review", 1) },
    { label: "Comprehensive Review — SE Basics Interview Chapters", tasks: topSE, note: getReviewNote("review", 2) },
    { label: "All Domains — Unsolved & Weak Spots", tasks: [...topDSA.slice(0,3), ...topSD.slice(0,3), ...topSE.slice(0,2)], note: getReviewNote("review", 3) },
    { label: "Spaced Repetition — Cross-Domain Drill", tasks: [...topDSA.slice(3), ...topSD.slice(2), ...topSE.slice(2)], note: getReviewNote("review", 0) },
  ];

  for (let i = 0; i < revCount; i++) {
    const cfg = revConfig[i % revConfig.length];
    days.push({
      day: dayNum,
      date: addDays(startDate, dayNum - 1),
      phase: "review",
      type: "review",
      label: cfg.label,
      color: PHASE_COLOR.review,
      tasks: cfg.tasks,
      reviewNote: cfg.note,
    });
    dayNum++;
  }

  const mockLabels = [
    "Mock Interview — DSA",
    "Mock Interview — System Design",
    "Final Mock — Full Placement Simulation",
  ];
  for (let i = 0; i < mockCount; i++) {
    days.push({
      day: dayNum,
      date: addDays(startDate, dayNum - 1),
      phase: "mock",
      type: "mock",
      label: mockLabels[Math.min(i, mockLabels.length - 1)],
      color: PHASE_COLOR.mock,
      tasks: i === 0 ? topDSA.slice(0, 3) : i === 1 ? topSD.slice(0, 3) : [...topDSA.slice(0,2), ...topSD.slice(0,2)],
      reviewNote: getReviewNote("mock", i),
    });
    dayNum++;
  }

  return { durationDays, startDate, days };
}

// ─── Spaced Repetition (used by ReviewQueue) ──────────────────────────────────

const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

export function getDueForReview(
  solvedDates: Record<string, string>,
  today: string
): string[] {
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
