"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const INTERVALS = [1, 3, 7, 14, 30, 60]; // days per level

interface FlashcardState {
  known: Set<string>;
  weak: Set<string>;
  nextReview: Record<string, string>;  // cardId → ISO date
  level: Record<string, number>;       // cardId → interval index

  markKnown: (id: string) => void;
  markWeak: (id: string) => void;
  resetCard: (id: string) => void;
  resetAll: () => void;
  isKnown: (id: string) => boolean;
  isWeak: (id: string) => boolean;
  isDue: (id: string) => boolean;
  getDueCount: (ids: string[]) => number;
  hydrateFromFirestore: (data: { known: Set<string>; weak: Set<string>; nextReview?: Record<string, string>; level?: Record<string, number> }) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      known: new Set<string>(),
      weak: new Set<string>(),
      nextReview: {},
      level: {},

      markKnown: (id) =>
        set((state) => {
          const known = new Set(state.known);
          const weak = new Set(state.weak);
          known.add(id);
          weak.delete(id);
          const nextLevel = Math.min((state.level[id] ?? 0) + 1, INTERVALS.length - 1);
          return {
            known, weak,
            level: { ...state.level, [id]: nextLevel },
            nextReview: { ...state.nextReview, [id]: addDays(INTERVALS[nextLevel]) },
          };
        }),

      markWeak: (id) =>
        set((state) => {
          const known = new Set(state.known);
          const weak = new Set(state.weak);
          weak.add(id);
          known.delete(id);
          return {
            known, weak,
            level: { ...state.level, [id]: 0 },
            nextReview: { ...state.nextReview, [id]: addDays(1) },
          };
        }),

      resetCard: (id) =>
        set((state) => {
          const known = new Set(state.known);
          const weak = new Set(state.weak);
          known.delete(id);
          weak.delete(id);
          const { [id]: _l, ...level } = state.level;
          const { [id]: _r, ...nextReview } = state.nextReview;
          return { known, weak, level, nextReview };
        }),

      resetAll: () => set({ known: new Set(), weak: new Set(), nextReview: {}, level: {} }),
      isKnown: (id) => get().known.has(id),
      isWeak: (id) => get().weak.has(id),
      isDue: (id) => {
        const nr = get().nextReview[id];
        return !nr || nr <= todayISO();
      },
      getDueCount: (ids) => ids.filter((id) => get().isDue(id) && (get().known.has(id) || get().weak.has(id))).length,

      hydrateFromFirestore: (data) => set({
        known: data.known, weak: data.weak,
        nextReview: data.nextReview ?? {},
        level: data.level ?? {},
      }),
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
              nextReview: state.nextReview ?? {},
              level: state.level ?? {},
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
                nextReview: state.nextReview,
                level: state.level,
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
