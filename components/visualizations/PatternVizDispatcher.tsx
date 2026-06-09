"use client";
import dynamic from "next/dynamic";

const PATTERN_VIZ: Record<string, React.ComponentType> = {
  "arrays-hashing":     dynamic(() => import("./PatternVizHashMap"),       { ssr: false }),
  "two-pointers":       dynamic(() => import("./PatternVizTwoPointers"),   { ssr: false }),
  "sliding-window":     dynamic(() => import("./PatternVizSlidingWindow"), { ssr: false }),
  "stack":              dynamic(() => import("./PatternVizStack"),          { ssr: false }),
  "binary-search":      dynamic(() => import("./PatternVizBinarySearch"),  { ssr: false }),
  "linked-list":        dynamic(() => import("./PatternVizLinkedList"),    { ssr: false }),
  "trees":              dynamic(() => import("./PatternVizTree"),           { ssr: false }),
  "heap":               dynamic(() => import("./PatternVizHeap"),           { ssr: false }),
  "backtracking":       dynamic(() => import("./PatternVizBacktracking"),  { ssr: false }),
  "graphs":             dynamic(() => import("./PatternVizGraphBFS"),       { ssr: false }),
  "advanced-graphs":    dynamic(() => import("./PatternVizGraphBFS"),       { ssr: false }),
  "dynamic-programming":dynamic(() => import("./PatternVizDP"),            { ssr: false }),
  "greedy":             dynamic(() => import("./PatternVizTwoPointers"),   { ssr: false }),
  "intervals":          dynamic(() => import("./PatternVizDP"),            { ssr: false }),
  "bit-manipulation":   dynamic(() => import("./PatternVizBitManip"),      { ssr: false }),
  "tries":              dynamic(() => import("./PatternVizHashMap"),        { ssr: false }),
  "math-geometry":      dynamic(() => import("./PatternVizBitManip"),      { ssr: false }),
};

interface Props { patternId: string }

export default function PatternVizDispatcher({ patternId }: Props) {
  const VizComponent = PATTERN_VIZ[patternId];
  if (!VizComponent) return null;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1.5 h-4 rounded-full"
          style={{ background: "var(--accent-blue)" }}
        />
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Live Pattern Demo
        </h2>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          auto-animating
        </span>
      </div>
      {/* Fixed-height wrapper prevents layout shift when animation runs */}
      <div style={{ minHeight: 320 }}>
        <VizComponent />
      </div>
    </div>
  );
}
