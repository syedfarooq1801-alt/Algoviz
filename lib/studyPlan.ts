import { PATTERNS, Problem } from "@/data/problems";

export interface DayPlan {
  day: number;
  date: string; // ISO string relative to startDate
  patternId: string;
  patternTitle: string;
  patternColor: string;
  problems: Problem[];
  type: "learn" | "practice" | "review" | "rest";
  label: string;
}

export interface StudyPlan {
  durationDays: 30 | 60;
  startDate: string;
  days: DayPlan[];
}

// Assign problems-per-day based on difficulty mix
function chunkProblems(problems: Problem[], days: number): Problem[][] {
  const chunks: Problem[][] = [];
  const perDay = Math.ceil(problems.length / days);
  for (let i = 0; i < problems.length; i += perDay) {
    chunks.push(problems.slice(i, i + perDay));
  }
  return chunks;
}

export function generateStudyPlan(durationDays: 30 | 60, startDate: string): StudyPlan {
  const days: DayPlan[] = [];
  let dayNumber = 1;

  // Pattern weights: each pattern gets proportional days
  const totalProblems = PATTERNS.reduce((s, p) => s + p.problems.length, 0);

  // Reserve last 3 days for review
  const activeDays = durationDays - 3;

  for (const pattern of PATTERNS) {
    if (dayNumber > activeDays) break;

    const patternDays = Math.max(1, Math.round((pattern.problems.length / totalProblems) * activeDays));
    const cappedDays = Math.min(patternDays, activeDays - dayNumber + 1);

    // Day 1 of pattern = learn day, rest = practice
    const chunks = chunkProblems(pattern.problems, cappedDays);

    for (let i = 0; i < cappedDays; i++) {
      const date = addDays(startDate, dayNumber - 1);
      days.push({
        day: dayNumber,
        date,
        patternId: pattern.id,
        patternTitle: pattern.title,
        patternColor: pattern.color,
        problems: chunks[i] ?? [],
        type: i === 0 ? "learn" : "practice",
        label: i === 0 ? `Learn: ${pattern.title}` : `Practice: ${pattern.title}`,
      });
      dayNumber++;
      if (dayNumber > activeDays) break;
    }
  }

  // Fill remaining active days up to activeDays with rest
  while (dayNumber <= activeDays) {
    days.push({
      day: dayNumber,
      date: addDays(startDate, dayNumber - 1),
      patternId: "",
      patternTitle: "Free Practice",
      patternColor: "slate",
      problems: [],
      type: "rest",
      label: "Free Practice / Catch-up",
    });
    dayNumber++;
  }

  // Last 3 days: review
  for (let i = 0; i < 3; i++) {
    days.push({
      day: dayNumber,
      date: addDays(startDate, dayNumber - 1),
      patternId: "",
      patternTitle: "Review",
      patternColor: "purple",
      problems: [],
      type: "review",
      label: i === 2 ? "Final Mock Review" : `Review Day ${i + 1}`,
    });
    dayNumber++;
  }

  return { durationDays, startDate, days };
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// Spaced repetition: problems due for review
// Review intervals: 1 day, 3 days, 7 days, 14 days, 30 days
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

export function getDueForReview(
  solvedDates: Record<string, string>,
  today: string
): string[] {
  const due: string[] = [];
  for (const [problemId, solvedDate] of Object.entries(solvedDates)) {
    const daysSince = daysDiff(solvedDate, today);
    if (REVIEW_INTERVALS.includes(daysSince)) {
      due.push(problemId);
    }
  }
  return due;
}

export function getUpcomingReviews(
  solvedDates: Record<string, string>,
  today: string
): Array<{ problemId: string; dueIn: number }> {
  const upcoming: Array<{ problemId: string; dueIn: number }> = [];
  for (const [problemId, solvedDate] of Object.entries(solvedDates)) {
    const daysSince = daysDiff(solvedDate, today);
    // Find next interval
    const nextInterval = REVIEW_INTERVALS.find((i) => i > daysSince);
    if (nextInterval !== undefined) {
      upcoming.push({ problemId, dueIn: nextInterval - daysSince });
    }
  }
  return upcoming.sort((a, b) => a.dueIn - b.dueIn).slice(0, 10);
}

function daysDiff(from: string, to: string): number {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}
