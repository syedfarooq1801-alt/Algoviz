"use client";
import { useState, useMemo } from "react";
import { SD_CHAPTERS } from "@/data/systemDesign";
import { SE_SUBJECTS } from "@/data/seBasics";
import { useFlashcardStore } from "@/lib/flashcardStore";

type Domain = "sd" | "se";
interface Flashcard { id: string; domain: Domain; topic: string; front: string; back: string; }

function buildSDCards(): Flashcard[] {
  return SD_CHAPTERS.flatMap((ch) =>
    ch.concepts.map((c) => ({
      id: `sd-${c.id}`, domain: "sd" as const, topic: ch.title, front: c.title,
      back: c.summary ?? `Core ${ch.title} concept.`,
    }))
  );
}

function buildSECards(): Flashcard[] {
  return SE_SUBJECTS.flatMap((subj) =>
    subj.chapters.map((ch) => ({
      id: `se-${subj.id}-${ch.id}`, domain: "se" as const, topic: subj.title, front: ch.title,
      back: ch.blocks.filter((b) => b.type === "para" || b.type === "analogy").map((b) => b.text ?? "").filter(Boolean).slice(0, 2).join("\n\n") || `${subj.title} — ${ch.title}`,
    }))
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  sd: "var(--accent)", se: "#22D587",
};

export default function FlashcardsPage() {
  const { known, weak, markKnown, markWeak, isKnown, isWeak, isDue, getDueCount } = useFlashcardStore();
  const [domain, setDomain] = useState<Domain>("sd");
  const [filter, setFilter] = useState<"all" | "due" | "weak" | "unseen">("due");
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);

  const allCards = useMemo(() => {
    const cards = domain === "sd" ? buildSDCards() : buildSECards();
    if (filter === "due") return cards.filter((c) => (isKnown(c.id) || isWeak(c.id)) ? isDue(c.id) : true);
    if (filter === "weak") return cards.filter((c) => isWeak(c.id));
    if (filter === "unseen") return cards.filter((c) => !isKnown(c.id) && !isWeak(c.id));
    return cards;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, filter, known, weak]);

  const allDomainCards = useMemo(() => domain === "sd" ? buildSDCards() : buildSECards(), [domain]);
  const dueCount = getDueCount(allDomainCards.map((c) => c.id));

  const card = allCards[idx] ?? null;
  const totalCards = domain === "sd" ? buildSDCards().length : buildSECards().length;
  const knownCount = allCards.filter((c) => isKnown(c.id)).length;

  const advance = (n: number) => {
    setFlipped(false);
    setTimeout(() => setIdx((i) => Math.min(i + n, allCards.length)), 50);
  };

  const handleConfidence = (level: "again" | "hard" | "good" | "easy") => {
    if (!card) return;
    if (level === "good" || level === "easy") markKnown(card.id);
    else markWeak(card.id);
    advance(1);
  };

  const progress = allCards.length > 0 ? ((idx) / allCards.length) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Flashcards
          </h1>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)",
            background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
            borderRadius: 5, padding: "3px 10px",
          }}>
            {idx + (card ? 0 : 0)} / {allCards.length} cards
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "var(--border-subtle)", borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "var(--accent)", borderRadius: 2, transition: "width 0.3s ease" }} />
        </div>

        {/* Domain + filter pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {(["sd", "se"] as Domain[]).map((d) => (
            <button key={d} onClick={() => { setDomain(d); setIdx(0); setFlipped(false); }} style={{
              padding: "5px 14px", fontSize: 12, borderRadius: 5, cursor: "pointer",
              background: domain === d ? "var(--accent-soft)" : "transparent",
              color: domain === d ? "var(--accent)" : "var(--text-muted)",
              border: domain === d ? "1px solid rgba(79,140,255,0.22)" : "1px solid var(--border-subtle)",
              fontWeight: domain === d ? 600 : 400, transition: "all 0.1s",
            }}>
              {d === "sd" ? "System Design" : "SE Basics"}
            </button>
          ))}
          <div style={{ width: 1, background: "var(--border-subtle)", margin: "0 4px" }} />
          {(["due", "all", "weak", "unseen"] as const).map((f) => {
            const label = f === "due" ? `Due${dueCount > 0 ? ` (${dueCount})` : ""}` : f.charAt(0).toUpperCase() + f.slice(1);
            const active = filter === f;
            const color = f === "due" ? "#2FBF71" : "#F5A524";
            return (
              <button key={f} onClick={() => { setFilter(f); setIdx(0); setFlipped(false); }} style={{
                padding: "5px 14px", fontSize: 12, borderRadius: 5, cursor: "pointer",
                background: active ? `${color}1A` : "transparent",
                color: active ? color : "var(--text-muted)",
                border: active ? `1px solid ${color}44` : "1px solid var(--border-subtle)",
                fontWeight: active ? 600 : 400, transition: "all 0.1s",
              }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* Flip Card */}
        {card ? (
          <>
            <div
              onClick={() => setFlipped((f) => !f)}
              style={{ perspective: 1200, cursor: "pointer", marginBottom: 16 }}
            >
              <div style={{
                position: "relative", height: 220,
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.5s ease",
              }}>
                {/* Front */}
                <div style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: 32, textAlign: "center",
                }}>
                  <span style={{
                    fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.1em",
                    color: CATEGORY_COLORS[card.domain] ?? "var(--accent)",
                    marginBottom: 16,
                  }}>
                    {card.topic.toUpperCase()}
                  </span>
                  <p style={{ fontSize: 18, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.4, margin: 0 }}>
                    {card.front}
                  </p>
                  <span style={{ marginTop: 24, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    tap to reveal →
                  </span>
                </div>

                {/* Back */}
                <div style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "#0A1220",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: 32, textAlign: "center",
                }}>
                  <span style={{
                    fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.1em",
                    color: "var(--accent)", marginBottom: 16,
                  }}>
                    ANSWER
                  </span>
                  <p style={{
                    fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6,
                    margin: 0, maxHeight: 120, overflow: "auto",
                    whiteSpace: "pre-wrap",
                  }}>
                    {card.back}
                  </p>
                </div>
              </div>
            </div>

            {/* Confidence buttons */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {([
                { label: "Again", level: "again" as const, color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
                { label: "Hard",  level: "hard"  as const, color: "#F5A524", bg: "rgba(245,165,36,0.1)", border: "rgba(245,165,36,0.25)" },
                { label: "Good",  level: "good"  as const, color: "var(--accent)", bg: "var(--accent-soft)", border: "rgba(79,140,255,0.25)" },
                { label: "Easy",  level: "easy"  as const, color: "#2FBF71", bg: "rgba(47,191,113,0.1)", border: "rgba(47,191,113,0.25)" },
              ]).map((btn) => (
                <button key={btn.label} onClick={() => handleConfidence(btn.level)} style={{
                  flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 600,
                  color: btn.color, background: btn.bg,
                  border: `1px solid ${btn.border}`, borderRadius: 7, cursor: "pointer",
                  transition: "opacity 0.1s",
                }}>
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Nav */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button onClick={() => { setFlipped(false); setTimeout(() => setIdx((i) => Math.max(0, i - 1)), 50); }}
                disabled={idx === 0}
                style={{
                  padding: "6px 18px", fontSize: 12, borderRadius: 5, cursor: idx === 0 ? "default" : "pointer",
                  background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                  color: idx === 0 ? "var(--text-muted)" : "var(--text-secondary)", opacity: idx === 0 ? 0.4 : 1,
                }}>
                ← Prev
              </button>
              <span style={{ alignSelf: "center", fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {idx + 1} / {allCards.length}
              </span>
              <button onClick={() => advance(1)} disabled={idx >= allCards.length - 1}
                style={{
                  padding: "6px 18px", fontSize: 12, borderRadius: 5,
                  cursor: idx >= allCards.length - 1 ? "default" : "pointer",
                  background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                  color: idx >= allCards.length - 1 ? "var(--text-muted)" : "var(--text-secondary)",
                  opacity: idx >= allCards.length - 1 ? 0.4 : 1,
                }}>
                Next →
              </button>
            </div>
          </>
        ) : (
          <div style={{
            height: 220, background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 10,
          }}>
            <span style={{ fontSize: 32 }}>🎉</span>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
              {allCards.length === 0 ? "No cards in this filter." : "Session complete!"}
            </p>
            <button onClick={() => { setIdx(0); setFlipped(false); }} style={{
              marginTop: 8, padding: "7px 20px", fontSize: 12, borderRadius: 5,
              background: "var(--accent-soft)", color: "var(--accent)",
              border: "1px solid rgba(79,140,255,0.25)", cursor: "pointer",
            }}>
              Restart
            </button>
          </div>
        )}

        {/* Stats footer */}
        <div style={{
          marginTop: 24, display: "flex", gap: 20, justifyContent: "center",
          fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)",
        }}>
          <span><span style={{ color: "#2FBF71" }}>{dueCount}</span> due today</span>
          <span><span style={{ color: "var(--accent)" }}>{knownCount}</span> learned</span>
          <span><span style={{ color: "#F5A524" }}>{allDomainCards.filter((c) => isWeak(c.id)).length}</span> weak</span>
        </div>
      </main>
    </div>
  );
}
