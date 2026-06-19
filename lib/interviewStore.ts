"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COMPANIES = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Uber", "Stripe", "Other"] as const;
export type TargetCompany = typeof COMPANIES[number];

interface InterviewState {
  targetDate: string | null;       // ISO date string "2025-10-15"
  targetCompany: TargetCompany | null;
  setTarget: (date: string, company: TargetCompany) => void;
  clearTarget: () => void;
  daysUntil: () => number | null;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      targetDate: null,
      targetCompany: null,
      setTarget: (date, company) => set({ targetDate: date, targetCompany: company }),
      clearTarget: () => set({ targetDate: null, targetCompany: null }),
      daysUntil: () => {
        const { targetDate } = get();
        if (!targetDate) return null;
        const diff = Math.ceil(
          (new Date(targetDate).getTime() - Date.now()) / 86400000
        );
        return diff;
      },
    }),
    { name: "interview-target" }
  )
);
