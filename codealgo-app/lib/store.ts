import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProgressState {
  solved: Set<string>;
  bookmarked: Set<string>;
  xp: number;
  streak: number;
  lastActivity: string;
  studyPlanDuration: 30 | 60 | 90;
  solvedDates: Record<string, string>;
  solveTimes: Record<string, number>;
  hasCompletedOnboarding: boolean;
  interviewDate: string; // YYYY-MM-DD or ""
  isSolved: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  toggleSolved: (id: string) => void;
  toggleBookmark: (id: string) => void;
  setStudyPlanDuration: (d: 30 | 60 | 90) => void;
  setHasCompletedOnboarding: (v: boolean) => void;
  setInterviewDate: (d: string) => void;
  setSolveTime: (id: string, minutes: number) => void;
  addXP: (amount: number) => void;
  hydrateFromFirestore: (data: Partial<{
    solved: Set<string>; bookmarked: Set<string>; xp: number; streak: number;
    lastActivity: string; studyPlanDuration: 30 | 60 | 90;
    solvedDates: Record<string, string>; solveTimes: Record<string, number>;
  }>) => void;
  resetForUser: () => void;
}

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      solved: new Set<string>(),
      bookmarked: new Set<string>(),
      xp: 0,
      streak: 0,
      lastActivity: "",
      studyPlanDuration: 30,
      solvedDates: {},
      solveTimes: {},
      hasCompletedOnboarding: false,
      interviewDate: "",

      isSolved: (id) => get().solved.has(id),
      isBookmarked: (id) => get().bookmarked.has(id),

      toggleSolved: (id) =>
        set((s) => {
          const next = new Set(s.solved);
          const today = todayIso();
          let { xp, streak, lastActivity, solvedDates, solveTimes } = s;
          if (next.has(id)) {
            next.delete(id);
            xp = Math.max(0, xp - 10);
          } else {
            next.add(id);
            xp += 10;
            if (lastActivity !== today) {
              streak = lastActivity === new Date(Date.now() - 86400000).toISOString().split("T")[0]
                ? streak + 1 : 1;
            }
            lastActivity = today;
            solvedDates = { ...solvedDates, [id]: today };
          }
          return { solved: next, xp, streak, lastActivity, solvedDates, solveTimes };
        }),

      toggleBookmark: (id) =>
        set((s) => {
          const next = new Set(s.bookmarked);
          next.has(id) ? next.delete(id) : next.add(id);
          return { bookmarked: next };
        }),

      setStudyPlanDuration: (d) => set({ studyPlanDuration: d }),
      setHasCompletedOnboarding: (v) => set({ hasCompletedOnboarding: v }),
      setInterviewDate: (d) => set({ interviewDate: d }),
      setSolveTime: (id, minutes) => set((s) => ({ solveTimes: { ...s.solveTimes, [id]: minutes } })),
      addXP: (amount) => set((s) => ({ xp: s.xp + amount })),

      hydrateFromFirestore: (data) =>
        set((s) => ({
          solved: data.solved ?? s.solved,
          bookmarked: data.bookmarked ?? s.bookmarked,
          xp: data.xp ?? s.xp,
          streak: data.streak ?? s.streak,
          lastActivity: data.lastActivity ?? s.lastActivity,
          studyPlanDuration: data.studyPlanDuration ?? s.studyPlanDuration,
          solvedDates: data.solvedDates ?? s.solvedDates,
          solveTimes: data.solveTimes ?? s.solveTimes,
        })),

      resetForUser: () =>
        set({
          solved: new Set(), bookmarked: new Set(), xp: 0, streak: 0,
          lastActivity: "", solvedDates: {}, solveTimes: {},
          // hasCompletedOnboarding and interviewDate intentionally NOT reset — device-level flags
        }),
    }),
    {
      name: "progress-v1",
      storage: createJSONStorage(() => AsyncStorage, {
        replacer: (_key, value) =>
          value instanceof Set ? { __type: "Set", values: [...value] } : value,
        reviver: (_key, value) =>
          value && typeof value === "object" && (value as any).__type === "Set"
            ? new Set((value as any).values)
            : value,
      }),
    }
  )
);
