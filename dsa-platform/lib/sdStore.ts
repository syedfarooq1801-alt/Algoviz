"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SDProgressState {
  mastered: Set<string>;
  bookmarked: Set<string>;
  // Date (YYYY-MM-DD) each chapter was actually marked mastered — lets the
  // study-plan rebalancer tell "done on time" apart from "carried forward,
  // then done later" the same way it already does for DSA problems.
  masteredDates: Record<string, string>;
  toggleMastered: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isMastered: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  hydrateFromFirestore: (data: { mastered: Set<string>; bookmarked: Set<string>; masteredDates?: Record<string, string> }) => void;
}

export const useSDStore = create<SDProgressState>()(
  persist(
    (set, get) => ({
      mastered: new Set<string>(),
      bookmarked: new Set<string>(),
      masteredDates: {},

      toggleMastered: (id) =>
        set((state) => {
          const next = new Set(state.mastered);
          const nextDates = { ...state.masteredDates };
          if (next.has(id)) { next.delete(id); delete nextDates[id]; }
          else { next.add(id); nextDates[id] = new Date().toISOString().split("T")[0]; }
          return { mastered: next, masteredDates: nextDates };
        }),

      toggleBookmark: (id) =>
        set((state) => {
          const next = new Set(state.bookmarked);
          next.has(id) ? next.delete(id) : next.add(id);
          return { bookmarked: next };
        }),

      isMastered: (id) => get().mastered.has(id),
      isBookmarked: (id) => get().bookmarked.has(id),
      hydrateFromFirestore: (data) => set({ mastered: data.mastered, bookmarked: data.bookmarked, masteredDates: data.masteredDates ?? {} }),
    }),
    {
      name: "sd-progress",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state, version } = JSON.parse(str);
          return {
            state: {
              ...state,
              mastered: new Set(state.mastered ?? []),
              bookmarked: new Set(state.bookmarked ?? []),
              masteredDates: state.masteredDates ?? {},
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
                mastered: Array.from(state.mastered),
                bookmarked: Array.from(state.bookmarked),
                masteredDates: state.masteredDates ?? {},
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
