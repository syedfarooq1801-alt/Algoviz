"use client";
import { use, useState } from "react";
import { getPatternById, PATTERNS } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import Header from "@/components/Header";
import ProgressRing from "@/components/ProgressRing";
import Link from "next/link";
import { notFound } from "next/navigation";
import PatternVizDispatcher from "@/components/visualizations/PatternVizDispatcher";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import dynamic from "next/dynamic";

const ApproachSteps = dynamic(
  () => import("@/components/visualizations/ApproachSteps"),
  { ssr: false }
);

interface Props {
  params: Promise<{ slug: string }>;
}

export default function PatternPage({ params }: Props) {
  const { slug } = use(params);
  const pattern = getPatternById(slug);
  if (!pattern) notFound();

  const { solved } = useProgressStore();
  const problemIds = pattern.problems.map((p) => p.id);
  const solvedCount = problemIds.filter((id) => solved.has(id)).length;
  const total = pattern.problems.length;
  const pct = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

  const currentIndex = PATTERNS.findIndex((p) => p.id === slug);
  const prevPattern = currentIndex > 0 ? PATTERNS[currentIndex - 1] : null;
  const nextPattern = currentIndex < PATTERNS.length - 1 ? PATTERNS[currentIndex + 1] : null;

  const byDiff = {
    Easy: pattern.problems.filter((p) => p.difficulty === "Easy"),
    Medium: pattern.problems.filter((p) => p.difficulty === "Medium"),
    Hard: pattern.problems.filter((p) => p.difficulty === "Hard"),
  };
  const diffColor = { Easy: "var(--accent-green)", Medium: "var(--accent-orange)", Hard: "var(--accent-red)" } as const;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />

      <main className="max-w-4xl mx-auto px-6 pb-28">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/dsa" className="hover:text-white transition-colors">DSA</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>{pattern.title}</span>
        </div>

        {/* ── 1. PATTERN HERO ── */}
        <section className="mt-6 mb-10 reveal reveal-1">
          <p className="eyebrow mb-2">Pattern {currentIndex + 1} of {PATTERNS.length}</p>
          <h1 className="title-1 mb-4" style={{ color: "var(--text-primary)" }}>{pattern.title}</h1>
          <p className="lede max-w-2xl mb-7">{pattern.description}</p>

          {/* Visualization is the hero */}
          <div className="rounded-2xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
            <PatternVizDispatcher patternId={slug} />
          </div>
        </section>

        {/* Recognition signals — "when do I reach for this?" */}
        <section className="mb-10 reveal reveal-2">
          <p className="eyebrow mb-3">Recognition signals</p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
            {pattern.recognitionSignals.map((signal, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="mt-0.5" style={{ color: "var(--accent)" }}>→</span>{signal}
              </div>
            ))}
          </div>
        </section>

        <hr className="hairline my-10" />

        {/* ── 2. MENTAL MODEL ── */}
        <section className="mb-10 reading">
          <p className="eyebrow mb-3">Mental model</p>
          <p className="text-xl leading-relaxed mb-5" style={{ color: "var(--text-primary)", fontWeight: 500 }}>
            &ldquo;{pattern.realWorldAnalogy}&rdquo;
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>{pattern.coreIntuition}</p>

          {pattern.keyInsights && pattern.keyInsights.length > 0 && (
            <div className="space-y-3 mt-6">
              {pattern.keyInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span className="shrink-0 font-mono text-xs mt-0.5" style={{ color: "var(--accent)" }}>0{i + 1}</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          )}

          {/* Template — inline, monospace, no heavy box */}
          <div className="mt-7">
            <p className="eyebrow mb-2">Template</p>
            <pre className="text-xs"><code>{pattern.template}</code></pre>
          </div>
        </section>

        <hr className="hairline my-10" />

        {/* ── 3. PROBLEM PROGRESSION (Easy → Medium → Hard) ── */}
        <section className="mb-12">
          <p className="eyebrow mb-1">Practice progression</p>
          <h2 className="title-2 mb-1" style={{ color: "var(--text-primary)" }}>Work up the difficulty</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Start easy, build the reflex, then push into harder variants.</p>

          <div className="space-y-7">
            {(["Easy", "Medium", "Hard"] as const).map((tier) => {
              const probs = byDiff[tier];
              if (probs.length === 0) return null;
              const tierSolved = probs.filter((p) => solved.has(p.id)).length;
              return (
                <div key={tier}>
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="text-sm font-semibold" style={{ color: diffColor[tier] }}>{tier}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{tierSolved}/{probs.length}</span>
                    <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
                  </div>
                  <div className="space-y-1">
                    {probs.map((p) => {
                      const isSolved = solved.has(p.id);
                      return (
                        <Link key={p.id} href={p.hasVisualization ? `/visualizations/${p.id}` : `/problems/${p.id}`}
                          className="group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                          style={{ background: "transparent" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                          <span className="shrink-0 text-sm" style={{ color: isSolved ? "var(--accent-green)" : "var(--text-muted)" }}>{isSolved ? "✓" : "○"}</span>
                          <span className="flex-1 text-sm" style={{ color: isSolved ? "var(--text-muted)" : "var(--text-primary)" }}>{p.title}</span>
                          {p.hasVisualization && <span className="text-xs" style={{ color: "var(--accent-purple)" }}>▶ visual</span>}
                          {p.frequency === "High" && <span className="text-xs" style={{ color: "var(--accent-green)" }}>★ frequent</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="hairline my-10" />

        {/* ── 4. MASTERY TRACKER ── */}
        <section className="mb-12">
          <p className="eyebrow mb-4">Mastery tracker</p>
          <div className="grid md:grid-cols-[auto_1fr] gap-7 items-start">
            <div className="flex items-center gap-4">
              <ProgressRing pct={pct} size={84} stroke={7} label={`${pct}%`} />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{solvedCount}/{total} solved</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{pct === 100 ? "Pattern mastered 🎉" : pct >= 60 ? "Almost there" : "Keep going"}</div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Recognition checklist */}
              <div>
                <div className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>You&apos;ve mastered this when you can…</div>
                <ul className="space-y-1.5">
                  {(pattern.thinkingProcess ?? pattern.recognitionSignals).slice(0, 5).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-green)" }}>✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common mistakes */}
              {pattern.commonMistakes && pattern.commonMistakes.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2" style={{ color: "var(--accent-red)" }}>Avoid these mistakes</div>
                  <ul className="space-y-1.5">
                    {pattern.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--accent-red)" }}>✗</span>{m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pattern.whenNotToUse && (
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: "var(--accent-orange)" }}>When NOT to use</div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{pattern.whenNotToUse}</p>
                </div>
              )}
            </div>
          </div>

          {/* Complexity + Big-O reference, lower priority */}
          <div className="flex items-center gap-6 mt-8 text-sm">
            <span style={{ color: "var(--text-muted)" }}>Typical complexity:</span>
            <span className="font-mono" style={{ color: "var(--text-primary)" }}>Time {pattern.timeComplexity}</span>
            <span className="font-mono" style={{ color: "var(--text-primary)" }}>Space {pattern.spaceComplexity}</span>
          </div>
          <div className="mt-4"><BigOCheatSheet patternId={slug} /></div>

          {/* Per-problem approaches, collapsed and de-emphasized */}
          <details className="mt-4">
            <summary className="text-sm cursor-pointer select-none" style={{ color: "var(--text-muted)" }}>Step-by-step approaches for every problem</summary>
            <div className="space-y-2 mt-3">
              {pattern.problems.map((problem) => (
                <ProblemApproach key={problem.id} problem={problem} ApproachSteps={ApproachSteps} />
              ))}
            </div>
          </details>
        </section>

        {/* ── 5. NEXT PATTERN ── */}
        <section>
          <hr className="hairline mb-8" />
          {nextPattern ? (
            <Link href={`/patterns/${nextPattern.id}`} className="block rounded-2xl p-6 lift" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="eyebrow mb-1">Up next in your journey</p>
              <div className="flex items-center justify-between gap-4">
                <h3 className="title-2" style={{ color: "var(--text-primary)" }}>{nextPattern.title}</h3>
                <span className="text-xl" style={{ color: "var(--accent)" }}>→</span>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl p-6 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>🏁 Last pattern — you&apos;ve reached the end of the DSA track.</p>
            </div>
          )}
          <div className="flex items-center justify-between mt-4 text-sm">
            {prevPattern ? (
              <Link href={`/patterns/${prevPattern.id}`} style={{ color: "var(--text-muted)" }}>← {prevPattern.title}</Link>
            ) : <span />}
            <Link href="/dsa" style={{ color: "var(--text-muted)" }}>All patterns</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

const BIG_O_DATA: Record<string, { structures: { name: string; access: string; search: string; insert: string; delete: string; space: string }[]; algorithms: { name: string; best: string; avg: string; worst: string; space: string }[] }> = {
  "arrays-hashing": {
    structures: [
      { name: "Array", access: "O(1)", search: "O(n)", insert: "O(n)", delete: "O(n)", space: "O(n)" },
      { name: "Hash Map", access: "O(1)*", search: "O(1)*", insert: "O(1)*", delete: "O(1)*", space: "O(n)" },
      { name: "Hash Set", access: "—", search: "O(1)*", insert: "O(1)*", delete: "O(1)*", space: "O(n)" },
    ],
    algorithms: [
      { name: "Two Sum (HashMap)", best: "O(n)", avg: "O(n)", worst: "O(n²)**", space: "O(n)" },
      { name: "Frequency Count", best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(k)" },
      { name: "Group Anagrams", best: "O(nk log k)", avg: "O(nk log k)", worst: "O(nk log k)", space: "O(nk)" },
    ],
  },
  "two-pointers": {
    structures: [
      { name: "Sorted Array", access: "O(1)", search: "O(log n)", insert: "O(n)", delete: "O(n)", space: "O(1)" },
    ],
    algorithms: [
      { name: "Two Pointers (sorted)", best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
      { name: "3Sum", best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
      { name: "Trapping Rain Water", best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
    ],
  },
  "sliding-window": {
    structures: [{ name: "Array/String", access: "O(1)", search: "O(n)", insert: "O(n)", delete: "O(n)", space: "O(n)" }],
    algorithms: [
      { name: "Fixed Window Max", best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
      { name: "Variable Window", best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(k)" },
      { name: "Min Window Substring", best: "O(n+m)", avg: "O(n+m)", worst: "O(n+m)", space: "O(m)" },
    ],
  },
  "binary-search": {
    structures: [{ name: "Sorted Array", access: "O(1)", search: "O(log n)", insert: "O(n)", delete: "O(n)", space: "O(1)" }],
    algorithms: [
      { name: "Binary Search", best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
      { name: "Rotated Search", best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
      { name: "Search 2D Matrix", best: "O(1)", avg: "O(log(m×n))", worst: "O(log(m×n))", space: "O(1)" },
    ],
  },
  "trees": {
    structures: [
      { name: "BST", access: "O(log n)*", search: "O(log n)*", insert: "O(log n)*", delete: "O(log n)*", space: "O(n)" },
      { name: "Balanced BST", access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)", space: "O(n)" },
    ],
    algorithms: [
      { name: "DFS (recursive)", best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(h)" },
      { name: "BFS (level order)", best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(w)" },
      { name: "Lowest Common Ancestor", best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(h)" },
    ],
  },
  "heap": {
    structures: [
      { name: "Binary Heap (Min/Max)", access: "O(n)", search: "O(n)", insert: "O(log n)", delete: "O(log n)", space: "O(n)" },
      { name: "Priority Queue", access: "O(1) top", search: "O(n)", insert: "O(log n)", delete: "O(log n)", space: "O(n)" },
    ],
    algorithms: [
      { name: "Heap Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
      { name: "Top K Elements", best: "O(n log k)", avg: "O(n log k)", worst: "O(n log k)", space: "O(k)" },
      { name: "K-way Merge", best: "O(n log k)", avg: "O(n log k)", worst: "O(n log k)", space: "O(k)" },
    ],
  },
  "graphs": {
    structures: [
      { name: "Adjacency List", access: "O(V+E)", search: "O(V+E)", insert: "O(1)", delete: "O(E)", space: "O(V+E)" },
      { name: "Adjacency Matrix", access: "O(1)", search: "O(V²)", insert: "O(1)", delete: "O(V)", space: "O(V²)" },
    ],
    algorithms: [
      { name: "BFS", best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
      { name: "DFS", best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
      { name: "Dijkstra", best: "O(E log V)", avg: "O(E log V)", worst: "O(E log V)", space: "O(V)" },
      { name: "Topological Sort", best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    ],
  },
  "dynamic-programming": {
    structures: [{ name: "DP Table", access: "O(1)", search: "O(1)", insert: "O(1)", delete: "O(1)", space: "O(n²)*" }],
    algorithms: [
      { name: "0/1 Knapsack", best: "O(nW)", avg: "O(nW)", worst: "O(nW)", space: "O(nW) or O(W)" },
      { name: "LCS / Edit Distance", best: "O(mn)", avg: "O(mn)", worst: "O(mn)", space: "O(mn) or O(n)" },
      { name: "Coin Change", best: "O(n×amount)", avg: "O(n×amount)", worst: "O(n×amount)", space: "O(amount)" },
      { name: "LIS", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²) naive", space: "O(n)" },
    ],
  },
};

const GLOBAL_BIG_O = [
  { name: "Array Sort",       best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(log n)", note: "Timsort (Python, Java)" },
  { name: "Quick Sort",       best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)",       space: "O(log n)", note: "Worst case on sorted input" },
  { name: "Merge Sort",       best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)",      note: "Stable, guaranteed" },
  { name: "Heap Sort",        best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)",      note: "In-place, not stable" },
  { name: "Binary Search",    best: "O(1)",        avg: "O(log n)",   worst: "O(log n)",   space: "O(1)",      note: "Requires sorted input" },
  { name: "BFS / DFS",        best: "O(V+E)",      avg: "O(V+E)",     worst: "O(V+E)",     space: "O(V)",      note: "Graph traversal" },
  { name: "Dijkstra (heap)",  best: "O(E log V)",  avg: "O(E log V)", worst: "O(E log V)", space: "O(V)",      note: "Non-negative weights" },
  { name: "Bellman-Ford",     best: "O(VE)",        avg: "O(VE)",      worst: "O(VE)",      space: "O(V)",      note: "Handles negative edges" },
  { name: "Floyd-Warshall",   best: "O(V³)",        avg: "O(V³)",      worst: "O(V³)",      space: "O(V²)",     note: "All-pairs shortest path" },
  { name: "Union-Find",       best: "O(α(n))",     avg: "O(α(n))",    worst: "O(α(n))",    space: "O(n)",      note: "α = inverse Ackermann ≈ O(1)" },
  { name: "Trie Insert/Search", best: "O(m)",      avg: "O(m)",       worst: "O(m)",        space: "O(m×n)",    note: "m = key length" },
];

function BigOCheatSheet({ patternId }: { patternId: string }) {
  const [open, setOpen] = useState(false);
  const data = BIG_O_DATA[patternId];

  return (
    <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid rgba(79,140,255,0.3)" }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-5 py-3"
        style={{ background: "rgba(79,140,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <span style={{ color: "#4F8CFF" }}>⏱️</span>
          <span className="text-sm font-semibold" style={{ color: "#4F8CFF" }}>Big-O Complexity Cheat Sheet</span>
          <span className="text-xs px-2 py-0.5 rounded-full hidden sm:inline" style={{ background: "rgba(79,140,255,0.1)", color: "var(--text-muted)", border: "1px solid rgba(79,140,255,0.2)" }}>
            {data ? "pattern-specific + global reference" : "global reference"}
          </span>
        </div>
        <div className="text-xs transition-transform duration-200" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", color: "var(--text-muted)" }}>▶</div>
      </button>

      {open && (
        <div className="p-4 space-y-4" style={{ borderTop: "1px solid rgba(79,140,255,0.15)" }}>
          {data && (
            <>
              <div>
                <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Data Structures</div>
                <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <div className="grid text-xs font-medium px-3 py-1.5" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", background: "rgba(0,0,0,0.2)", color: "var(--text-muted)" }}>
                    <span>Structure</span><span className="text-center">Access</span><span className="text-center">Search</span><span className="text-center">Insert</span><span className="text-center">Delete</span><span className="text-center">Space</span>
                  </div>
                  {data.structures.map((s) => (
                    <div key={s.name} className="grid text-xs px-3 py-2 border-t" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{s.name}</span>
                      <span className="text-center font-mono" style={{ color: s.access.includes("1)") ? "#2FBF71" : s.access.includes("log") ? "#4F8CFF" : "#F5A524" }}>{s.access}</span>
                      <span className="text-center font-mono" style={{ color: s.search.includes("1)") ? "#2FBF71" : s.search.includes("log") ? "#4F8CFF" : "#F5A524" }}>{s.search}</span>
                      <span className="text-center font-mono" style={{ color: s.insert.includes("1)") ? "#2FBF71" : s.insert.includes("log") ? "#4F8CFF" : "#F5A524" }}>{s.insert}</span>
                      <span className="text-center font-mono" style={{ color: s.delete.includes("1)") ? "#2FBF71" : s.delete.includes("log") ? "#4F8CFF" : "#F5A524" }}>{s.delete}</span>
                      <span className="text-center font-mono" style={{ color: "var(--text-muted)" }}>{s.space}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>This Pattern's Algorithms</div>
                <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <div className="grid text-xs font-medium px-3 py-1.5" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", background: "rgba(0,0,0,0.2)", color: "var(--text-muted)" }}>
                    <span>Algorithm</span><span className="text-center">Best</span><span className="text-center">Avg</span><span className="text-center">Worst</span><span className="text-center">Space</span>
                  </div>
                  {data.algorithms.map((a) => (
                    <div key={a.name} className="grid text-xs px-3 py-2 border-t" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", borderColor: "var(--border-subtle)" }}>
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{a.name}</span>
                      <span className="text-center font-mono" style={{ color: "#2FBF71" }}>{a.best}</span>
                      <span className="text-center font-mono" style={{ color: "#4F8CFF" }}>{a.avg}</span>
                      <span className="text-center font-mono" style={{ color: a.worst.includes("²") || a.worst.includes("n³") ? "#ef4444" : "#F5A524" }}>{a.worst}</span>
                      <span className="text-center font-mono" style={{ color: "var(--text-muted)" }}>{a.space}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Global Algorithm Reference</div>
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="grid text-xs font-medium px-3 py-1.5" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 2fr", background: "rgba(0,0,0,0.2)", color: "var(--text-muted)" }}>
                <span>Algorithm</span><span className="text-center">Best</span><span className="text-center">Avg</span><span className="text-center">Worst</span><span className="text-center">Space</span><span>Note</span>
              </div>
              {GLOBAL_BIG_O.map((a) => (
                <div key={a.name} className="grid text-xs px-3 py-2 border-t" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 2fr", borderColor: "var(--border-subtle)" }}>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>{a.name}</span>
                  <span className="text-center font-mono" style={{ color: "#2FBF71" }}>{a.best}</span>
                  <span className="text-center font-mono" style={{ color: "#4F8CFF" }}>{a.avg}</span>
                  <span className="text-center font-mono" style={{ color: a.worst.includes("²") || a.worst.includes("³") ? "#ef4444" : "#F5A524" }}>{a.worst}</span>
                  <span className="text-center font-mono" style={{ color: "var(--text-muted)" }}>{a.space}</span>
                  <span style={{ color: "var(--text-muted)" }}>{a.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            {[["#2FBF71", "O(1) / O(log n) — Fast"], ["#4F8CFF", "O(n) / O(n log n) — Acceptable"], ["#F5A524", "O(n²) — Slow (avoid if possible)"], ["#ef4444", "O(n³)+ — Use only when n is small"]].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                <span style={{ color: "var(--text-muted)" }}>{l}</span>
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>* = amortized. ** = rare worst case with collisions.</p>
        </div>
      )}
    </div>
  );
}

// Collapsible per-problem approach accordion for pattern page
function ProblemApproach({
  problem,
  ApproachSteps,
}: {
  problem: import("@/data/problems").Problem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApproachSteps: React.ComponentType<any>;
}) {
  const [open, setOpen] = useState(false);
  const content = PROBLEM_CONTENT[problem.id];
  if (!content || !content.approach?.length) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
        style={{ background: "var(--bg-card)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="transition-transform duration-200"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--text-muted)" }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {problem.title}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{
            background: problem.difficulty === "Easy" ? "rgba(47,191,113,0.1)" : problem.difficulty === "Medium" ? "rgba(245,165,36,0.1)" : "rgba(239,68,68,0.1)",
            color: problem.difficulty === "Easy" ? "#2FBF71" : problem.difficulty === "Medium" ? "#F5A524" : "#ef4444",
          }}>
            {problem.difficulty}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {content.approach.length} steps
        </span>
      </button>
      {open && (
        <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <ApproachSteps problemId={problem.id} compact />
        </div>
      )}
    </div>
  );
}
