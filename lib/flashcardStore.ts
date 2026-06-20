"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FlashcardState {
  known: Set<string>;  // card IDs marked "know it"
  weak: Set<string>;   // card IDs marked "didn't know"
  markKnown: (id: string) => void;
  markWeak: (id: string) => void;
  resetCard: (id: string) => void;
  resetAll: () => void;
  isKnown: (id: string) => boolean;
  isWeak: (id: string) => boolean;
  hydrateFromFirestore: (data: { known: Set<string>; weak: Set<string> }) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      known: new Set<string>(),
      weak: new Set<string>(),

      markKnown: (id) =>
        set((state) => {
          const known = new Set(state.known);
          const weak = new Set(state.weak);
          known.add(id);
          weak.delete(id);
          return { known, weak };
        }),

      markWeak: (id) =>
        set((state) => {
          const known = new Set(state.known);
          const weak = new Set(state.weak);
          weak.add(id);
          known.delete(id);
          return { known, weak };
        }),

      resetCard: (id) =>
        set((state) => {
          const known = new Set(state.known);
          const weak = new Set(state.weak);
          known.delete(id);
          weak.delete(id);
          return { known, weak };
        }),

      resetAll: () => set({ known: new Set(), weak: new Set() }),
      isKnown: (id) => get().known.has(id),
      isWeak: (id) => get().weak.has(id),
      hydrateFromFirestore: (data) => set({ known: data.known, weak: data.weak }),
    }),
    {
      name: "flashcard-progress",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state, version } = JSON.parse(str);
          return {
            state: {
              ...state,
              known: new Set(state.known ?? []),
              weak: new Set(state.weak ?? []),
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
                known: Array.from(state.known),
                weak: Array.from(state.weak),
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
