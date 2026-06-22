import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SEState {
  completed: Set<string>;
  toggleChapter: (key: string) => void;
  isComplete: (key: string) => boolean;
  subjectDone: (subjectId: string, chapterIds: string[]) => number;
  hydrateFromFirestore: (data: { completed: Set<string> }) => void;
}

export const useSEStore = create<SEState>()(
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

      hydrateFromFirestore: (data) => set({ completed: data.completed }),
    }),
    {
      name: "se-v1",
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
