"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  solved: Set<string>;
  bookmarked: Set<string>;
  streak: number;
  lastActivity: string;
  xp: number;
  solvedDates: Record<string, string>; // problemId -> ISO date string
  toggleSolved: (id: string, syncFn?: () => void) => void;
  toggleBookmark: (id: string, syncFn?: () => void) => void;
  isSolved: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  getSolvedCount: (patternId: string, problemIds: string[]) => number;
  hydrateFromFirestore: (data: {
    solved: Set<string>;
    bookmarked: Set<string>;
    xp: number;
    streak: number;
    lastActivity: string;
  }) => void;
  resetForUser: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      solved: new Set<string>(),
      bookmarked: new Set<string>(),
      streak: 0,
      lastActivity: "",
      xp: 0,
      solvedDates: {},

      toggleSolved: (id, syncFn) =>
        set((state) => {
          const next = new Set(state.solved);
          const today = new Date().toISOString().split("T")[0];
          let newState: Partial<ProgressState>;
          if (next.has(id)) {
            next.delete(id);
            const nextDates = { ...state.solvedDates };
            delete nextDates[id];
            newState = { solved: next, xp: Math.max(0, state.xp - 10), solvedDates: nextDates };
          } else {
            next.add(id);
            const newStreak = state.lastActivity === today ? state.streak : state.streak + 1;
            newState = {
              solved: next,
              xp: state.xp + 10,
              streak: newStreak,
              lastActivity: today,
              solvedDates: { ...state.solvedDates, [id]: today },
            };
          }
          if (syncFn) setTimeout(syncFn, 0);
          return newState;
        }),

      toggleBookmark: (id, syncFn) =>
        set((state) => {
          const next = new Set(state.bookmarked);
          next.has(id) ? next.delete(id) : next.add(id);
          if (syncFn) setTimeout(syncFn, 0);
          return { bookmarked: next };
        }),

      isSolved: (id) => get().solved.has(id),
      isBookmarked: (id) => get().bookmarked.has(id),

      getSolvedCount: (_, problemIds) => {
        const { solved } = get();
        return problemIds.filter((id) => solved.has(id)).length;
      },

      hydrateFromFirestore: (data) => set({
        solved: data.solved,
        bookmarked: data.bookmarked,
        xp: data.xp,
        streak: data.streak,
        lastActivity: data.lastActivity,
      }),

      resetForUser: () => set({
        solved: new Set<string>(),
        bookmarked: new Set<string>(),
        xp: 0,
        streak: 0,
        lastActivity: "",
        solvedDates: {},
      }),
    }),
    {
      name: "dsa-progress",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state, version } = JSON.parse(str);
          return {
            state: {
              ...state,
              solved: new Set(state.solved),
              bookmarked: new Set(state.bookmarked),
              solvedDates: state.solvedDates ?? {},
            },
            version,
          };
        },
        setItem: (name, value) => {
          const { state, version } = value;
          localStorage.setItem(
            name,
            JSON.stringify({
              state: {
                ...state,
                solved: Array.from(state.solved),
                bookmarked: Array.from(state.bookmarked),
                solvedDates: state.solvedDates ?? {},
              },
              version,
            })
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

// Lightweight store for viz-code step sync
interface StepSyncState {
  currentStep: number;
  totalSteps: number;
  setStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
  reset: () => void;
}

export const useStepSyncStore = create<StepSyncState>((set) => ({
  currentStep: -1,
  totalSteps: 0,
  setStep: (step) => set({ currentStep: step }),
  setTotalSteps: (total) => set({ totalSteps: total }),
  reset: () => set({ currentStep: -1, totalSteps: 0 }),
}));
