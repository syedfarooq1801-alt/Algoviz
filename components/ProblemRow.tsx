"use client";
import { Problem } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import Link from "next/link";

interface Props {
  problem: Problem;
  index: number;
}

const diffColor = {
  Easy: "#22c55e",
  Medium: "#f97316",
  Hard: "#ef4444",
};

const diffBg = {
  Easy: "rgba(34, 197, 94, 0.1)",
  Medium: "rgba(249, 115, 22, 0.1)",
  Hard: "rgba(239, 68, 68, 0.1)",
};

export default function ProblemRow({ problem, index }: Props) {
  const solved = useProgressStore((state) => state.solved.has(problem.id));
  const bookmarked = useProgressStore((state) => state.bookmarked.has(problem.id));
  const toggleSolved = useProgressStore((state) => state.toggleSolved);
  const toggleBookmark = useProgressStore((state) => state.toggleBookmark);

  return (
    <div
      className="problem-row flex items-center gap-3 px-4 py-2.5 border-b text-sm"
      style={{
        borderColor: "var(--border-subtle)",
        animationDelay: `${index * 0.03}s`,
        opacity: 0,
        animation: `fadeInUp 0.3s ease-out ${index * 0.03}s forwards`,
      }}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => toggleSolved(problem.id)}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer"
        style={{
          border: solved ? "1.5px solid #16a34a" : "1.5px solid var(--text-muted)",
          background: solved ? "#16a34a" : "transparent",
          boxShadow: solved ? "0 0 0 4px rgba(22, 163, 74, 0.2)" : undefined,
        }}
        title={solved ? "Mark unsolved" : "Mark solved"}
      >
        {solved ? (
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M2 7.5L6 11.5L14 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "var(--text-muted)", opacity: 0.65 }}
          />
        )}
      </button>

      {/* Problem number */}
      <span className="w-5 text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
        {index + 1}
      </span>

      {/* Problem name */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/problems/${problem.id}`}
          className="font-medium hover:text-blue-400 transition-colors truncate block"
          style={{ color: solved ? "var(--text-muted)" : "var(--text-primary)" }}
        >
          <span style={{ textDecoration: solved ? "line-through" : "none", opacity: solved ? 0.6 : 1 }}>
            {problem.title}
          </span>
        </Link>
      </div>

      {/* Difficulty */}
      <span
        className="shrink-0 w-20 flex items-center justify-center text-xs font-medium px-2 py-0.5 rounded-full"
        style={{
          color: diffColor[problem.difficulty],
          background: diffBg[problem.difficulty],
        }}
      >
        {problem.difficulty}
      </span>

      {/* Difficulty Score */}
      <div className="shrink-0 w-24 hidden sm:flex items-center gap-1">
        <div className="flex-1 h-1 rounded-full" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(problem.difficultyScore / 10) * 100}%`,
              background: diffColor[problem.difficulty],
              opacity: 0.7,
            }}
          />
        </div>
        <span className="text-xs w-8 text-right" style={{ color: "var(--text-muted)" }}>
          {problem.difficultyScore}/10
        </span>
      </div>

      {/* Frequency badge */}
      <div className="shrink-0 w-8 hidden md:flex items-center justify-center">
        {problem.frequency === "High" ? (
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ background: "rgba(79, 142, 247, 0.1)", color: "#4f8ef7", fontSize: "10px" }}
          >
            HOT
          </span>
        ) : (
          <span className="w-full" />
        )}
      </div>

      {/* Viz indicator */}
      <div className="shrink-0 w-6 flex justify-center">
        <Link
          href={`/visualizations/${problem.id}`}
          title={problem.hasVisualization ? "View visualization" : "View pattern visualization"}
          className="text-xs hover:scale-110 transition-transform"
        >
          <span style={{ color: problem.hasVisualization ? "#a855f7" : "var(--text-muted)" }}>▶</span>
        </Link>
      </div>

      {/* LeetCode link */}
      <a
        href={problem.leetcodeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 w-8 flex justify-center hover:scale-110 transition-transform"
        title="Open on LeetCode"
      >
        <svg width="18" height="18" viewBox="0 0 50 50" fill="none">
          <path d="M36 35H14" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
          <path d="M14 15l10 10-10 10" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* Bookmark */}
      <button
        onClick={() => toggleBookmark(problem.id)}
        className="shrink-0 w-5 flex justify-center hover:scale-110 transition-all"
        title={bookmarked ? "Remove bookmark" : "Bookmark for review"}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={bookmarked ? "#4f8ef7" : "none"}
          stroke={bookmarked ? "#4f8ef7" : "var(--text-muted)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      </button>
    </div>
  );
}
