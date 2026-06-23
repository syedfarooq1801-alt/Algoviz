"use client";
import { create } from "zustand";

interface TutorState {
  isOpen: boolean;
  // A prompt queued from elsewhere (e.g. a text selection) for Axon to answer.
  pending: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  askAbout: (text: string) => void;
  consumePending: () => string | null;
}

export const useTutorStore = create<TutorState>((set, get) => ({
  isOpen: false,
  pending: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  askAbout: (text) => set({ isOpen: true, pending: text }),
  consumePending: () => {
    const p = get().pending;
    if (p) set({ pending: null });
    return p;
  },
}));
