"use client";
import { practiceUrl, practiceLabel, type Problem } from "@/data/problems";

/** LeetCode's mark — the angular bracket-and-bar glyph, in its brand amber. */
function LeetCodeMark({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" fill="#F5A524" />
    </svg>
  );
}

/** GeeksforGeeks' mark — the twin-node "GG" glyph, in its brand green. */
function GfGMark({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11.94 6.87a4.9 4.9 0 0 0-3.3 1.28 4.29 4.29 0 0 0-1.4 3.2 4.3 4.3 0 0 0 1.36 3.2 4.75 4.75 0 0 0 3.36 1.3 4.7 4.7 0 0 0 3.3-1.26 4.3 4.3 0 0 0 1.4-3.24 4.28 4.28 0 0 0-1.38-3.2 4.72 4.72 0 0 0-3.34-1.28zm0 1.72a3 3 0 0 1 2.12.8 2.6 2.6 0 0 1 .86 1.96 2.62 2.62 0 0 1-.86 1.98 3.05 3.05 0 0 1-2.12.8 3.06 3.06 0 0 1-2.14-.8 2.62 2.62 0 0 1-.86-1.98 2.6 2.6 0 0 1 .86-1.96 3.02 3.02 0 0 1 2.14-.8z" fill="#2F8D46" />
      <path d="M4.6 8.02a3.44 3.44 0 0 0-2.42.94A3.14 3.14 0 0 0 1.16 11.3a3.15 3.15 0 0 0 1 2.36 3.47 3.47 0 0 0 2.46.95c.72 0 1.38-.16 1.96-.48l-.72-1.4c-.36.2-.76.3-1.2.3a1.9 1.9 0 0 1-1.34-.5 1.62 1.62 0 0 1-.54-1.24c0-.48.18-.9.53-1.23a1.86 1.86 0 0 1 1.33-.5c.44 0 .84.1 1.2.3l.73-1.4a4.06 4.06 0 0 0-1.97-.46zM19.4 8.02c-.72 0-1.38.16-1.96.47l.72 1.4c.36-.2.76-.3 1.2-.3.53 0 .97.17 1.32.5.36.34.54.75.54 1.23 0 .49-.18.9-.54 1.24a1.9 1.9 0 0 1-1.33.5c-.44 0-.84-.1-1.2-.3l-.72 1.4c.58.32 1.24.48 1.96.48a3.47 3.47 0 0 0 2.45-.95 3.15 3.15 0 0 0 1-2.36 3.14 3.14 0 0 0-1.01-2.35 3.44 3.44 0 0 0-2.43-.96z" fill="#2F8D46" />
    </svg>
  );
}

/**
 * The "go read the actual problem" link. Follows practiceUrl(), so a
 * LeetCode-Premium problem shows the GeeksforGeeks mark and opens the free
 * mirror instead of a paywall.
 */
export default function PracticeLinkIcon({ problem, size = 15 }: { problem: Problem; size?: number }) {
  const onGfG = practiceLabel(problem) === "GeeksforGeeks";
  return (
    <a
      href={practiceUrl(problem)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title={problem.premium && problem.freeUrl
        ? `${problem.title} is LeetCode Premium — opens the free GeeksforGeeks version`
        : `Open ${problem.title} on ${practiceLabel(problem)}`}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 2px", opacity: 0.75, transition: "opacity 0.15s, transform 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.15)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.75"; e.currentTarget.style.transform = "scale(1)"; }}
    >
      {onGfG ? <GfGMark size={size} /> : <LeetCodeMark size={size} />}
    </a>
  );
}
