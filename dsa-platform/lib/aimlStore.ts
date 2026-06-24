"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIMLState {
  completed: Set<string>; // key: `${subjectId}/${chapterId}`
  toggleChapter: (key: string) => void;
  isComplete: (key: string) => boolean;
  subjectDone: (subjectId: string, chapterIds: string[]) => number;
}

export const useAIMLStore = create<AIMLState>()(
  persist(
    (set, get) => ({
      completed: new Set<string>(),
      toggleChapter: (key) =>
        set((state) => {
          const next = new Set(state.completed);
          next.has(key) ? next.delete(key) : next.add(key);
          return { completed: next };
        }),
      isComplete: (key) => get().completed.has(key),
      subjectDone: (subjectId, chapterIds) => {
        const { completed } = get();
        return chapterIds.filter((id) => completed.has(`${subjectId}/${id}`)).length;
      },
    }),
    {
      name: "aiml-progress",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state, version } = JSON.parse(str);
          return { state: { ...state, completed: new Set(state.completed) }, version };
        },
        setItem: (name, value) => {
          const { state, version } = value as { state: AIMLState; version: number };
          localStorage.setItem(name, JSON.stringify({ state: { completed: Array.from(state.completed) }, version }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
