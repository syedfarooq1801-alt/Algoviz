"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  solved: Set<string>;
  bookmarked: Set<string>;
  streak: number;
  lastActivity: string;
  xp: number;
  toggleSolved: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isSolved: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  getSolvedCount: (patternId: string, problemIds: string[]) => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      solved: new Set<string>(),
      bookmarked: new Set<string>(),
      streak: 0,
      lastActivity: "",
      xp: 0,

      toggleSolved: (id) =>
        set((state) => {
          const next = new Set(state.solved);
          const today = new Date().toISOString().split("T")[0];
          if (next.has(id)) {
            next.delete(id);
            return { solved: next, xp: Math.max(0, state.xp - 10) };
          } else {
            next.add(id);
            const newStreak = state.lastActivity === today ? state.streak : state.streak + 1;
            return { solved: next, xp: state.xp + 10, streak: newStreak, lastActivity: today };
          }
        }),

      toggleBookmark: (id) =>
        set((state) => {
          const next = new Set(state.bookmarked);
          next.has(id) ? next.delete(id) : next.add(id);
          return { bookmarked: next };
        }),

      isSolved: (id) => get().solved.has(id),
      isBookmarked: (id) => get().bookmarked.has(id),

      getSolvedCount: (_, problemIds) => {
        const { solved } = get();
        return problemIds.filter((id) => solved.has(id)).length;
      },
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
