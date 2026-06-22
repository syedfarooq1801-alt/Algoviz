import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ReadinessState = "unseen" | "attempted" | "solved" | "reviewing" | "mastered";
export type PrepTrackId =
  | "faang-dsa"
  | "product-sde1"
  | "service-placement"
  | "backend-focused"
  | "system-design-heavy"
  | "crunch-30"
  | "weak-dp"
  | "weak-graphs";

export interface MockProblemReview {
  problemId: string;
  title: string;
  pattern: string;
  difficulty: string;
  solved: boolean;
  timeSpentSecs: number;
  complexityStated: boolean;
  edgeCasesConsidered: boolean;
  solutionRevealed: boolean;
  selfExplainScore: number;
  notes: string;
}

export interface MockSessionReview {
  id: string;
  date: string;
  durationMins: number;
  difficulty: string;
  score: number;
  problems: MockProblemReview[];
  insights: string[];
}

export interface BehavioralDraft {
  id: string;
  question: string;
  company: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  rubric: Record<string, number>;
  updatedAt: string;
}

interface PrepState {
  problemStates: Record<string, ReadinessState>;
  reviewDue: Record<string, string>;
  successfulReviews: Record<string, number>;
  mockSessions: MockSessionReview[];
  behavioralDrafts: Record<string, BehavioralDraft>;
  selectedTrack: PrepTrackId;
  hydrateFromFirestore: (data: {
    reviewDue?: Record<string, string>;
    problemStates?: Record<string, ReadinessState>;
    selectedTrack?: PrepTrackId;
    behavioralDrafts?: Record<string, BehavioralDraft>;
  }) => void;
  setProblemState: (problemId: string, state: ReadinessState) => void;
  scheduleReview: (problemId: string, outcome: "solved" | "failed" | "reviewed-fast" | "mastered") => void;
  addMockSession: (session: Omit<MockSessionReview, "id" | "date" | "score" | "insights">) => MockSessionReview;
  saveBehavioralDraft: (draft: Omit<BehavioralDraft, "updatedAt">) => void;
  setTrack: (track: PrepTrackId) => void;
}

const REVIEW_OFFSETS = [1, 3, 7, 21];

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function scoreProblem(p: MockProblemReview): number {
  let score = 0;
  if (p.solved) score += 45;
  if (p.complexityStated) score += 15;
  if (p.edgeCasesConsidered) score += 15;
  if (!p.solutionRevealed) score += 10;
  score += Math.min(15, Math.max(0, p.selfExplainScore * 3));
  return score;
}

function buildInsights(problems: MockProblemReview[]): string[] {
  if (!problems.length) return ["Run a mock interview to unlock coaching insights."];
  const insights: string[] = [];
  const failed = problems.filter((p) => !p.solved);
  const skippedEdges = problems.filter((p) => !p.edgeCasesConsidered);
  const missingComplexity = problems.filter((p) => !p.complexityStated);
  const slow = problems.filter((p) => p.timeSpentSecs > 25 * 60);
  const byPattern = problems.reduce<Record<string, { total: number; weak: number }>>((acc, p) => {
    acc[p.pattern] ??= { total: 0, weak: 0 };
    acc[p.pattern].total++;
    if (!p.solved || p.timeSpentSecs > 25 * 60 || !p.edgeCasesConsidered) acc[p.pattern].weak++;
    return acc;
  }, {});
  const weakest = Object.entries(byPattern).sort((a, b) => b[1].weak - a[1].weak)[0];
  if (weakest?.[1].weak) insights.push(`Weakest at ${weakest[0]} under pressure.`);
  if (failed.length) insights.push(`${failed.length} problem${failed.length > 1 ? "s" : ""} need same-week retry.`);
  if (skippedEdges.length) insights.push(`Edge cases missing on ${skippedEdges.length} problem${skippedEdges.length > 1 ? "s" : ""}.`);
  if (missingComplexity.length) insights.push("State time and space complexity before finishing.");
  if (slow.length) insights.push(`Time pressure on ${slow.map((p) => p.title).join(", ")}.`);
  if (!insights.length) insights.push("Strong mock: correctness, complexity, edge cases all covered.");
  return insights.slice(0, 5);
}

export const PREP_TRACKS: Record<PrepTrackId, { title: string; focus: string }> = {
  "faang-dsa": { title: "FAANG DSA", focus: "High-frequency medium/hard DSA with mocks." },
  "product-sde1": { title: "Product Company SDE-1", focus: "Balanced DSA, CS fundamentals, and behavioral prep." },
  "service-placement": { title: "Service Company Placement", focus: "Core DSA, SE basics, aptitude-style fundamentals." },
  "backend-focused": { title: "Backend-Focused", focus: "DSA plus databases, networking, OS, and scalable services." },
  "system-design-heavy": { title: "System Design Heavy", focus: "Architecture concepts, case studies, and tradeoff drills." },
  "crunch-30": { title: "30-Day Crunch", focus: "Highest ROI problems, mocks, and review loops." },
  "weak-dp": { title: "Weak in DP", focus: "Dynamic programming pattern recognition and repetition." },
  "weak-graphs": { title: "Weak in Graphs", focus: "Graph BFS/DFS, advanced graphs, and design traversal thinking." },
};

export const usePrepStore = create<PrepState>()(
  persist(
    (set, get) => ({
      problemStates: {},
      reviewDue: {},
      successfulReviews: {},
      mockSessions: [],
      behavioralDrafts: {},
      selectedTrack: "product-sde1" as PrepTrackId,

      hydrateFromFirestore: (data) =>
        set({
          ...(data.reviewDue !== undefined ? { reviewDue: data.reviewDue } : {}),
          ...(data.problemStates !== undefined ? { problemStates: data.problemStates } : {}),
          ...(data.selectedTrack !== undefined ? { selectedTrack: data.selectedTrack } : {}),
          ...(data.behavioralDrafts !== undefined ? { behavioralDrafts: data.behavioralDrafts } : {}),
        }),

      setProblemState: (problemId, state) =>
        set((s) => ({ problemStates: { ...s.problemStates, [problemId]: state } })),

      scheduleReview: (problemId, outcome) =>
        set((s) => {
          const fastCount = outcome === "reviewed-fast" ? (s.successfulReviews[problemId] ?? 0) + 1 : 0;
          const state: ReadinessState =
            outcome === "mastered" || fastCount >= 2 ? "mastered" :
            outcome === "failed" ? "reviewing" :
            outcome === "solved" ? "solved" : "reviewing";
          const offset = outcome === "failed" ? 1 : REVIEW_OFFSETS[Math.min(fastCount, REVIEW_OFFSETS.length - 1)];
          return {
            problemStates: { ...s.problemStates, [problemId]: state },
            successfulReviews: { ...s.successfulReviews, [problemId]: fastCount },
            reviewDue: { ...s.reviewDue, [problemId]: addDays(offset) },
          };
        }),

      addMockSession: (session) => {
        const score = session.problems.length
          ? Math.round(session.problems.reduce((sum, p) => sum + scoreProblem(p), 0) / session.problems.length)
          : 0;
        const saved: MockSessionReview = {
          ...session,
          id: makeId("mock"),
          date: todayIso(),
          score,
          insights: buildInsights(session.problems),
        };
        set((s) => {
          const nextDue = { ...s.reviewDue };
          const nextStates = { ...s.problemStates };
          for (const p of session.problems) {
            nextStates[p.problemId] = p.solved ? "solved" : "reviewing";
            nextDue[p.problemId] = addDays(p.solved && p.timeSpentSecs < 20 * 60 ? 3 : 1);
          }
          return {
            mockSessions: [saved, ...s.mockSessions].slice(0, 40),
            problemStates: nextStates,
            reviewDue: nextDue,
          };
        });
        return saved;
      },

      saveBehavioralDraft: (draft) =>
        set((s) => ({
          behavioralDrafts: {
            ...s.behavioralDrafts,
            [draft.id]: { ...draft, updatedAt: new Date().toISOString() },
          },
        })),

      setTrack: (track) => set({ selectedTrack: track }),
    }),
    {
      name: "prep-v1",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
