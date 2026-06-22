import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SDProgressState {
  mastered: Set<string>;
  bookmarked: Set<string>;
  toggleMastered: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isMastered: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  hydrateFromFirestore: (data: { mastered: Set<string>; bookmarked: Set<string> }) => void;
}

export const useSDStore = create<SDProgressState>()(
  persist(
    (set, get) => ({
      mastered: new Set<string>(),
      bookmarked: new Set<string>(),

      toggleMastered: (id) =>
        set((state) => {
          const next = new Set(state.mastered);
          next.has(id) ? next.delete(id) : next.add(id);
          return { mastered: next };
        }),

      toggleBookmark: (id) =>
        set((state) => {
          const next = new Set(state.bookmarked);
          next.has(id) ? next.delete(id) : next.add(id);
          return { bookmarked: next };
        }),

      isMastered: (id) => get().mastered.has(id),
      isBookmarked: (id) => get().bookmarked.has(id),
      hydrateFromFirestore: (data) => set({ mastered: data.mastered, bookmarked: data.bookmarked }),
    }),
    {
      name: "sd-v1",
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
