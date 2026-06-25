"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SQLState {
  solved: Set<string>;
  toggleSolved: (id: string) => void;
  isSolved: (id: string) => boolean;
}

export const useSQLStore = create<SQLState>()(
  persist(
    (set, get) => ({
      solved: new Set<string>(),
      toggleSolved: (id) =>
        set((state) => {
          const next = new Set(state.solved);
          next.has(id) ? next.delete(id) : next.add(id);
          return { solved: next };
        }),
      isSolved: (id) => get().solved.has(id),
    }),
    {
      name: "sql-progress",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state, version } = JSON.parse(str);
          return { state: { ...state, solved: new Set(state.solved) }, version };
        },
        setItem: (name, value) => {
          const { state, version } = value as { state: SQLState; version: number };
          localStorage.setItem(
            name,
            JSON.stringify({ state: { solved: Array.from(state.solved) }, version })
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
