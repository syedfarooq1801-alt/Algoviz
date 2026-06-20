"use client";
import { PATTERNS, getTotalProblems } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import { usePrepStore } from "@/lib/prepStore";
import { useState, useMemo, Suspense } from "react";
import Link from "next/link";

type Diff = "All" | "Easy" | "Medium" | "Hard";
type Company = "All" | "Google" | "Amazon" | "Meta" | "Apple" | "Microsoft" | "LinkedIn" | "Netflix";
const COMPANIES: Company[] = ["All", "Google", "Amazon", "Meta", "Apple", "Microsoft", "LinkedIn", "Netflix"];

const DIFF_COLOR: Record<string, string> = { Easy: "#2FBF71", Medium: "#F5A524", Hard: "#EF4444" };
const DIFF_BG: Record<string, string> = {
  Easy: "rgba(47,191,113,0.12)", Medium: "rgba(245,165,36,0.12)", Hard: "rgba(239,68,68,0.12)",
};
const COMPANY_COLORS: Record<string, string> = {
  Google: "#4F8CFF", Amazon: "#F5A524", Meta: "#A78BFA", Facebook: "#A78BFA",
  Apple: "#9499C0", Microsoft: "#22D587", LinkedIn: "#0EA5E9", Netflix: "#EF4444",
};

function DSAContent() {
  const { solved, toggleSolved, isBookmarked, toggleBookmark } = useProgressStore();
  const { reviewDue } = usePrepStore();
  const today = new Date().toISOString().slice(0, 10);
  const [activeTopic, setActiveTopic] = useState("all");
  const [diff, setDiff] = useState<Diff>("All");
  const [company, setCompany] = useState<Company>("All");
  const total = getTotalProblems();

  const problems = useMemo(() => {
    const base = activeTopic === "all"
      ? PATTERNS.flatMap((p) => p.problems)
      : (PATTERNS.find((p) => p.id === activeTopic)?.problems ?? []);
    const byDiff = diff === "All" ? base : base.filter((p) => p.difficulty === diff);
    return company === "All" ? byDiff : byDiff.filter((p) => (p.companies ?? []).includes(company));
  }, [activeTopic, diff, company]);

  const firstUnsolved = problems.find((p) => !solved.has(p.id))?.id;
  const filteredSolved = problems.filter((p) => solved.has(p.id)).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", overflow: "hidden", height: "calc(100vh - 48px)" }}>

        {/* Topic Sidebar */}
        <aside style={{
          width: 172, flexShrink: 0,
          borderRight: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          overflowY: "auto", padding: "14px 8px",
        }}>
          <div style={{ padding: "0 4px 8px", fontSize: 9, letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            TOPICS
          </div>

          {/* All Topics filter button */}
          {(() => {
            const allItem = { id: "all", title: "All Topics", count: total, done: solved.size };
            const active = activeTopic === "all";
            return (
              <button key="all" onClick={() => setActiveTopic("all")} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "6px 8px", fontSize: 12, textAlign: "left", cursor: "pointer",
                background: active ? "var(--accent-soft)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-secondary)",
                borderRadius: 5, marginBottom: 1, fontWeight: active ? 600 : 400,
                outline: active ? "1px solid rgba(79,140,255,0.18)" : "1px solid transparent",
                transition: "all 0.1s",
              }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {allItem.title}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, opacity: 0.55, flexShrink: 0, marginLeft: 4 }}>
                  {allItem.done}/{allItem.count}
                </span>
              </button>
            );
          })()}

          {/* Individual patterns — filter click + theory link */}
          {PATTERNS.map((p) => {
            const active = activeTopic === p.id;
            const done = p.problems.filter((pr) => solved.has(pr.id)).length;
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", marginBottom: 1, gap: 2 }}>
                <button onClick={() => setActiveTopic(p.id)} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 8px", fontSize: 12, textAlign: "left", cursor: "pointer",
                  background: active ? "var(--accent-soft)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  borderRadius: 5, fontWeight: active ? 600 : 400,
                  outline: active ? "1px solid rgba(79,140,255,0.18)" : "1px solid transparent",
                  transition: "all 0.1s", minWidth: 0,
                }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                    {p.title}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, opacity: 0.55, flexShrink: 0, marginLeft: 4 }}>
                    {done}/{p.problems.length}
                  </span>
                </button>
                <Link href={`/patterns/${p.id}`} title="View theory" style={{
                  flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  width: 20, height: 24, borderRadius: 4, fontSize: 11,
                  color: "var(--text-muted)", textDecoration: "none", opacity: 0.6,
                  transition: "opacity 0.1s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                >
                  ↗
                </Link>
              </div>
            );
          })}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          {/* Filter bar */}
          <div style={{
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-primary)", flexShrink: 0,
          }}>
            {/* Difficulty + count row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {(["All", "Easy", "Medium", "Hard"] as Diff[]).map((d) => (
                  <button key={d} onClick={() => setDiff(d)} style={{
                    padding: "4px 12px", fontSize: 12, borderRadius: 5, cursor: "pointer",
                    fontWeight: diff === d ? 600 : 400,
                    background: diff === d ? "var(--accent-soft)" : "transparent",
                    color: diff === d ? (d === "All" ? "var(--accent)" : DIFF_COLOR[d]) : "var(--text-muted)",
                    border: diff === d
                      ? `1px solid ${d === "All" ? "rgba(79,140,255,0.22)" : DIFF_COLOR[d] + "55"}`
                      : "1px solid transparent",
                    transition: "all 0.1s",
                  }}>{d}</button>
                ))}
              </div>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)",
                background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                borderRadius: 4, padding: "3px 8px",
              }}>
                {filteredSolved} / {problems.length}
              </span>
            </div>
            {/* Company filter row */}
            <div style={{ display: "flex", gap: 4, padding: "0 20px 8px", flexWrap: "wrap" }}>
              {COMPANIES.map((c) => {
                const active = company === c;
                const color = COMPANY_COLORS[c] ?? "var(--accent)";
                return (
                  <button key={c} onClick={() => setCompany(c)} style={{
                    padding: "3px 10px", fontSize: 11, borderRadius: 20, cursor: "pointer",
                    fontWeight: active ? 600 : 400,
                    background: active ? (c === "All" ? "var(--accent-soft)" : color + "22") : "transparent",
                    color: active ? (c === "All" ? "var(--accent)" : color) : "var(--text-muted)",
                    border: active
                      ? `1px solid ${c === "All" ? "rgba(79,140,255,0.3)" : color + "55"}`
                      : "1px solid var(--border-subtle)",
                    transition: "all 0.1s",
                  }}>{c}</button>
                );
              })}
            </div>
          </div>

          {/* Theory banner — only when specific topic selected */}
          {activeTopic !== "all" && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 20px", borderBottom: "1px solid var(--border-subtle)",
              background: "rgba(79,140,255,0.04)",
            }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {PATTERNS.find(p => p.id === activeTopic)?.title}
              </span>
              <Link href={`/patterns/${activeTopic}`} style={{
                fontSize: 11, fontWeight: 600, color: "var(--accent)",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 5,
                border: "1px solid rgba(79,140,255,0.3)",
                background: "rgba(79,140,255,0.08)",
              }}>
                View Theory ↗
              </Link>
            </div>
          )}

          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "36px 1fr 150px 90px 36px 36px",
            padding: "6px 20px", fontSize: 10, color: "var(--text-muted)",
            fontFamily: "var(--font-mono)", letterSpacing: "0.06em",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-secondary)", flexShrink: 0,
          }}>
            <span>#</span><span>TITLE</span><span>TOPIC</span><span>DIFFICULTY</span><span></span><span></span>
          </div>

          {/* Problem rows */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {problems.map((prob, i) => {
              const isSolved = solved.has(prob.id);
              const isNext = prob.id === firstUnsolved;
              const bookmarked = isBookmarked(prob.id);
              const isDue = reviewDue[prob.id] && reviewDue[prob.id] <= today;
              const pattern = PATTERNS.find((p) => p.id === prob.pattern);
              const companies = (prob.companies ?? []).slice(0, 3);

              return (
                <div key={prob.id} style={{
                  display: "grid", gridTemplateColumns: "36px 1fr 150px 90px 36px 36px",
                  alignItems: "center", padding: "10px 20px",
                  borderBottom: "1px solid var(--border-subtle)",
                  background: isSolved ? "rgba(47,191,113,0.02)" : "transparent",
                  minHeight: companies.length > 0 ? 58 : 44,
                  cursor: "default",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                    {i + 1}
                  </span>

                  <div style={{ minWidth: 0, paddingRight: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Link href={`/problems/${prob.id}`} style={{
                        fontSize: 13, fontWeight: 500,
                        color: isSolved ? "var(--text-muted)" : "var(--text-primary)",
                        textDecoration: isSolved ? "line-through" : "none",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        opacity: isSolved ? 0.6 : 1, flex: 1, minWidth: 0,
                      }}>
                        {prob.title}
                      </Link>
                      {isDue && (
                        <span title="Due for review" style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, flexShrink: 0, background: "rgba(245,165,36,0.15)", color: "#F5A524", fontFamily: "var(--font-mono)" }}>DUE</span>
                      )}
                    </div>
                    {companies.length > 0 && (
                      <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", marginTop: 2 }}>
                        {companies.map((c, ci) => (
                          <span key={c}>
                            <span style={{ color: COMPANY_COLORS[c] ?? "var(--text-muted)" }}>{c}</span>
                            {ci < companies.length - 1 && <span style={{ color: "var(--text-muted)", opacity: 0.4 }}> · </span>}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <span style={{
                    fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8,
                  }}>
                    {pattern?.title ?? prob.pattern}
                  </span>

                  <span style={{
                    display: "inline-flex", alignItems: "center", fontSize: 11,
                    fontWeight: 600, fontFamily: "var(--font-mono)", padding: "3px 8px",
                    borderRadius: 4, color: DIFF_COLOR[prob.difficulty], background: DIFF_BG[prob.difficulty],
                  }}>
                    {prob.difficulty}
                  </span>

                  <button
                    onClick={() => toggleSolved(prob.id)}
                    title={isSolved ? "Mark unsolved" : "Mark solved"}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%",
                    }}
                  >
                    <span style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      background: isSolved ? "#2FBF71" : "transparent",
                      border: `1.5px solid ${isSolved ? "#2FBF71" : isNext ? "var(--accent)" : "var(--border)"}`,
                      transition: "all 0.15s",
                    }}>
                      {isSolved && <span style={{ fontSize: 11, color: "#fff", fontWeight: 700, lineHeight: 1 }}>✓</span>}
                    </span>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(prob.id); }}
                    title={bookmarked ? "Remove bookmark" : "Bookmark"}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "none", border: "none", cursor: "pointer", padding: "0 4px",
                      fontSize: 14, color: bookmarked ? "#F5A524" : "var(--text-muted)",
                      opacity: bookmarked ? 1 : 0.45,
                      transition: "color 0.15s, opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!bookmarked) e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={(e) => { if (!bookmarked) e.currentTarget.style.opacity = "0.45"; }}
                  >
                    {bookmarked ? "★" : "☆"}
                  </button>
                </div>
              );
            })}

            {problems.length === 0 && (
              <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                No problems match this filter.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DSAPage() {
  return <Suspense fallback={null}><DSAContent /></Suspense>;
}
