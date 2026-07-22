"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LLDState {
  completed: Set<string>;
  // Date (YYYY-MM-DD) each chapter was actually marked complete — lets the
  // study-plan rebalancer tell "done on time" apart from "carried forward,
  // then done later" the same way it already does for DSA problems.
  completedDates: Record<string, string>;
  toggleChapter: (key: string) => void;
  isComplete: (key: string) => boolean;
  subjectDone: (subjectId: string, chapterIds: string[]) => number;
  hydrateFromFirestore: (data: { completed: Set<string>; completedDates?: Record<string, string> }) => void;
  resetForUser: () => void;
}

export const useLLDStore = create<LLDState>()(
  persist(
    (set, get) => ({
      completed: new Set<string>(),
      completedDates: {},
      toggleChapter: (key) =>
        set((state) => {
          const next = new Set(state.completed);
          const nextDates = { ...state.completedDates };
          if (next.has(key)) { next.delete(key); delete nextDates[key]; }
          else { next.add(key); nextDates[key] = new Date().toISOString().split("T")[0]; }
          return { completed: next, completedDates: nextDates };
        }),
      isComplete: (key) => get().completed.has(key),
      subjectDone: (subjectId, chapterIds) => {
        const { completed } = get();
        return chapterIds.filter((id) => completed.has(`${subjectId}/${id}`)).length;
      },
      hydrateFromFirestore: (data) => set({ completed: data.completed, completedDates: data.completedDates ?? {} }),
      resetForUser: () => set({ completed: new Set<string>(), completedDates: {} }),
    }),
    {
      name: "lld-progress",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state, version } = JSON.parse(str);
          return { state: { ...state, completed: new Set(state.completed), completedDates: state.completedDates ?? {} }, version };
        },
        setItem: (name, value) => {
          const { state, version } = value as { state: LLDState; version: number };
          localStorage.setItem(name, JSON.stringify({ state: { completed: Array.from(state.completed), completedDates: state.completedDates ?? {} }, version }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
