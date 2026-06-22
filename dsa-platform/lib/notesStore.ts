"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotesState {
  notes: Record<string, string>; // problemId -> note text
  setNote: (id: string, text: string) => void;
  getNote: (id: string) => string;
  deleteNote: (id: string) => void;
  hasNote: (id: string) => boolean;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},
      setNote: (id, text) =>
        set((state) => ({ notes: { ...state.notes, [id]: text } })),
      getNote: (id) => get().notes[id] ?? "",
      deleteNote: (id) =>
        set((state) => {
          const next = { ...state.notes };
          delete next[id];
          return { notes: next };
        }),
      hasNote: (id) => Boolean(get().notes[id]?.trim()),
    }),
    { name: "problem-notes" }
  )
);
