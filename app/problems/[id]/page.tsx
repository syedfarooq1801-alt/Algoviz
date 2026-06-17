"use client";
import { use, useState, useEffect } from "react";
import { getProblemById, getPatternById } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import Header from "@/components/Header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import HintPanel from "@/components/HintPanel";
import CodeRunner from "@/components/CodeRunner";
import { getProblemViz } from "@/components/visualizations/problemVizMap";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProblemPage({ params }: Props) {
  const { id } = use(params);
  const problem = getProblemById(id);
  if (!problem) notFound();

  const pattern = getPatternById(problem.pattern);
  const { isSolved, isBookmarked, toggleSolved, toggleBookmark } = useProgressStore();
  const solved = isSolved(id);
  const bookmarked = isBookmarked(id);
  const content = PROBLEM_CONTENT[id];
  const VizComponent = getProblemViz(id);
  const [celebrate, setCelebrate] = useState(false);
  const handleSolve = () => {
    const wasSolved = isSolved(id);
    toggleSolved(id);
    if (!wasSolved) { setCelebrate(true); setTimeout(() => setCelebrate(false), 1400); }
  };
  const [lang, setLang] = useState<"cpp" | "python">("python");
  useEffect(() => {
    const saved = localStorage.getItem("codeLang") as "cpp" | "python" | null;
    if (saved) setLang(saved);
  }, []);
  const switchLang = (l: "cpp" | "python") => {
    setLang(l);
    localStorage.setItem("codeLang", l);
  };

  const diffColor = problem.difficulty === "Easy" ? "var(--accent-green)" : problem.difficulty === "Medium" ? "var(--accent-orange)" : "var(--accent-red)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {celebrate && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none">
          <div className="animate-pop flex flex-col items-center gap-2 px-8 py-6 rounded-2xl"
            style={{ background: "var(--bg-secondary)", border: "1px solid rgba(45,212,160,0.4)", boxShadow: "var(--shadow-lg)" }}>
            <span className="text-4xl">🎉</span>
            <span className="text-sm font-semibold" style={{ color: "var(--accent-green)" }}>Solved! +10 XP</span>
          </div>
        </div>
      )}
      <Header />

      <main className="max-w-3xl mx-auto px-5 pb-24">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          {pattern && (
            <>
              <Link href={`/patterns/${pattern.id}`} className="hover:text-white transition-colors">{pattern.title}</Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span style={{ color: "var(--text-secondary)" }}>{problem.title}</span>
        </div>

        {/* Problem header — restrained: title, one metadata line, one primary action */}
        <div className="mt-6 mb-10">
          <h1 className="title-1 mb-3" style={{ color: "var(--text-primary)" }}>{problem.title}</h1>

          {/* Single metadata line — no chips */}
          <div className="flex items-center gap-2.5 text-sm mb-7" style={{ color: "var(--text-muted)" }}>
            <span style={{ color: diffColor, fontWeight: 600 }}>{problem.difficulty}</span>
            <span>·</span>
            {pattern && <Link href={`/patterns/${pattern.id}`} className="hover:underline" style={{ color: "var(--text-secondary)" }}>{pattern.title}</Link>}
            {problem.frequency === "High" && <><span>·</span><span>High frequency</span></>}
          </div>

          {/* Actions — one primary, the rest quiet */}
          <div className="flex items-center gap-3">
            <button onClick={handleSolve} className="px-5 py-2.5 text-sm rounded-lg font-medium transition-all"
              style={{
                background: solved ? "var(--accent-soft)" : "var(--accent)",
                color: solved ? "var(--accent-green)" : "#fff",
                border: `1px solid ${solved ? "rgba(47,191,113,0.4)" : "var(--accent)"}`,
              }}>
              {solved ? "✓ Solved" : "Mark Solved"}
            </button>
            <button onClick={() => toggleBookmark(id)} className="text-sm transition-colors"
              style={{ color: bookmarked ? "var(--accent)" : "var(--text-muted)" }}>
              {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
            </button>
            <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>
              LeetCode ↗
            </a>
          </div>
        </div>

        {/* Content */}
        {content ? (
          <div className="space-y-4">
            {/* Intuition */}
            <Section title="💡 Intuition" color="var(--accent-orange)">
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.intuition}</p>
            </Section>

            {/* Interactive visualization — the hero of the lesson */}
            {VizComponent && (
              <div className="rounded-2xl p-5 reveal" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
                <p className="eyebrow mb-4" style={{ color: "var(--accent-purple)" }}>Watch it work — interactive</p>
                <VizComponent />
              </div>
            )}

            {/* Hints — try before peeking */}
            <HintPanel problemId={id} />

            {/* Why It Works — deep explanation */}
            {content.whyItWorks && (
              <Section title="🔬 Why This Works (Deep Dive)" color="#4F8CFF">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.whyItWorks}</p>
              </Section>
            )}

            {/* Pattern Connection */}
            {content.patternConnection && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(79,140,255,0.06)", border: "1px solid rgba(79,140,255,0.2)" }}
              >
                <h3 className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#4F8CFF" }}>🧩 Pattern Connection</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{content.patternConnection}</p>
              </div>
            )}

            {/* Walkthrough Example */}
            {content.walkthroughExample && (
              <Section title="🚶 Step-by-Step Walkthrough" color="#2FBF71">
                <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono" style={{ color: "var(--text-secondary)" }}>{content.walkthroughExample}</pre>
              </Section>
            )}

            {/* Approach */}
            <Section title="🧠 Approach" color="var(--accent-blue)">
              <ol className="space-y-2">
                {content.approach.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: "rgba(79,140,255,0.12)", color: "var(--accent-blue)" }}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Section>

            {/* Solution with language toggle */}
            <Section title="⌨️ Solution" color="var(--accent-purple)">
              <div className="flex items-center gap-1 mb-3">
                <button
                  onClick={() => switchLang("python")}
                  className="px-3 py-1 rounded text-xs font-semibold transition-all"
                  style={{
                    background: lang === "python" ? "var(--accent-blue)" : "rgba(255,255,255,0.06)",
                    color: lang === "python" ? "#fff" : "var(--text-muted)",
                    border: lang === "python" ? "1px solid var(--accent-blue)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Python
                </button>
                <button
                  onClick={() => switchLang("cpp")}
                  className="px-3 py-1 rounded text-xs font-semibold transition-all"
                  style={{
                    background: lang === "cpp" ? "var(--accent-purple)" : "rgba(255,255,255,0.06)",
                    color: lang === "cpp" ? "#fff" : "var(--text-muted)",
                    border: lang === "cpp" ? "1px solid var(--accent-purple)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  C++
                </button>
              </div>
              <pre
                className="text-xs overflow-x-auto rounded-lg p-3"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <code>
                  {lang === "python"
                    ? (content.pythonSolution ?? "# Python solution coming soon")
                    : content.cppSolution}
                </code>
              </pre>
            </Section>

            {/* Code Playground */}
            <Section title="🧪 Code Playground" color="var(--accent-green)">
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                Write and run code right here. Experiment, test ideas, break things.
              </p>
              <CodeRunner
                defaultLang="python"
                starterPython={`# Scratchpad — write Python, hit Run\n\ndef solve():\n    pass\n\nprint("hello from ${id}")`}
                starterCpp={`// Scratchpad — write C++, hit Run\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    cout << "hello from ${id}" << endl;\n    return 0;\n}`}
              />
            </Section>

            {/* Alternative Approaches */}
            {content.alternativeApproaches && content.alternativeApproaches.length > 0 && (
              <Section title="🔀 Alternative Approaches" color="#F5A524">
                <ul className="space-y-2">
                  {content.alternativeApproaches.map((alt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "#F5A524", marginTop: "2px" }}>◆</span>
                      {alt}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Complexity */}
            <div className="grid grid-cols-2 gap-4">
              <Section title="⏱ Time Complexity" color="var(--accent-orange)">
                <p className="text-lg font-mono font-bold mb-1" style={{ color: "var(--accent-orange)" }}>{content.timeComplexity}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{content.timeExplanation}</p>
              </Section>
              <Section title="💾 Space Complexity" color="var(--accent-blue)">
                <p className="text-lg font-mono font-bold mb-1" style={{ color: "var(--accent-blue)" }}>{content.spaceComplexity}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{content.spaceExplanation}</p>
              </Section>
            </div>

            {/* Common Mistakes */}
            {content.commonMistakes && content.commonMistakes.length > 0 && (
              <Section title="❌ Common Mistakes" color="var(--accent-red)">
                <ul className="space-y-2">
                  {content.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-red)", marginTop: "2px" }}>✗</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Edge Cases */}
            <Section title="⚠️ Edge Cases & Gotchas" color="#F5A524">
              <ul className="space-y-1.5">
                {content.edgeCases.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "#F5A524" }}>⚡</span>
                    {e}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Pro Tips */}
            {content.proTips && content.proTips.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(47,191,113,0.05)", border: "1px solid rgba(47,191,113,0.2)" }}
              >
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#2FBF71" }}>✅ Pro Tips</h3>
                <ul className="space-y-1.5">
                  {content.proTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span style={{ color: "#2FBF71" }}>→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Memory Trick */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(79,140,255,0.06)",
                border: "1px solid rgba(79,140,255,0.2)",
              }}
            >
              <h3 className="text-sm font-semibold mb-2" style={{ color: "#4F8CFF" }}>🧠 Memory Trick</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.memoryTrick}</p>
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="text-3xl mb-3">🚧</div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
              Detailed explanation coming soon
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Check LeetCode or the visualization for this problem.
            </p>
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-xs px-4 py-2 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "var(--accent-orange)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Open on LeetCode →
            </a>
          </div>
        )}

        {/* Related problems — same pattern */}
        {pattern && pattern.problems.filter((p) => p.id !== id).length > 0 && (
          <section className="mt-12">
            <p className="eyebrow mb-3">More in {pattern.title}</p>
            <div className="space-y-1">
              {pattern.problems.filter((p) => p.id !== id).slice(0, 6).map((p) => (
                <Link key={p.id} href={p.hasVisualization ? `/visualizations/${p.id}` : `/problems/${p.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <span className="shrink-0 text-sm" style={{ color: isSolved(p.id) ? "var(--accent-green)" : "var(--text-muted)" }}>{isSolved(p.id) ? "✓" : "○"}</span>
                  <span className="flex-1 text-sm" style={{ color: "var(--text-primary)" }}>{p.title}</span>
                  <span className="text-xs" style={{ color: p.difficulty === "Easy" ? "var(--accent-green)" : p.difficulty === "Medium" ? "var(--accent-orange)" : "var(--accent-red)" }}>{p.difficulty}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  // strip any leading emoji + whitespace so titles are clean editorial labels
  const clean = title.replace(/^[^\p{L}]+/u, "").trim();
  return (
    <section className="group-gap">
      <p className="eyebrow mb-3" style={{ color }}>{clean}</p>
      {children}
    </section>
  );
}
