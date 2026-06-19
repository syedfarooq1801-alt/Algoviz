"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { SD_CHAPTERS } from "@/data/systemDesign";
import { SE_SUBJECTS } from "@/data/seBasics";
import { useFlashcardStore } from "@/lib/flashcardStore";

type Domain = "sd" | "se";
type CardState = "front" | "back";

interface Flashcard {
  id: string;
  domain: Domain;
  topic: string;    // chapter/subject name
  front: string;    // question / concept name
  back: string;     // explanation
  hint?: string;
}

function buildSDCards(): Flashcard[] {
  return SD_CHAPTERS.flatMap((ch) =>
    ch.concepts.map((c) => ({
      id: `sd-${c.id}`,
      domain: "sd" as const,
      topic: ch.title,
      front: c.title,
      back: [
        c.difficulty && `Difficulty: ${c.difficulty}`,
        c.summary ?? `Core ${ch.title} concept. Review the full explanation on the System Design page.`,
      ].filter(Boolean).join("\n\n"),
      hint: `This is a ${c.difficulty ?? "System Design"} concept in ${ch.title}.`,
    }))
  );
}

function buildSECards(): Flashcard[] {
  return SE_SUBJECTS.flatMap((subj) =>
    subj.chapters.map((ch) => ({
      id: `se-${subj.id}-${ch.id}`,
      domain: "se" as const,
      topic: subj.title,
      front: ch.title,
      back: ch.blocks
        .filter((b) => b.type === "para" || b.type === "analogy")
        .map((b) => b.text ?? "")
        .filter(Boolean)
        .slice(0, 2)
        .join("\n\n") || `Key ${subj.title} concept. Review the full chapter in SE Basics.`,
      hint: `${subj.title} — ${ch.blocks.some((b) => b.type === "interview") ? "Common interview topic" : "Core concept"}`,
    }))
  );
}

export default function FlashcardsPage() {
  const { known, weak, markKnown, markWeak, resetAll, isKnown, isWeak } = useFlashcardStore();
  const [domain, setDomain] = useState<Domain>("sd");
  const [filter, setFilter] = useState<"all" | "weak" | "unseen">("all");
  const [cardState, setCardState] = useState<CardState>("front");
  const [idx, setIdx] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const allCards = useMemo(() => {
    const cards = domain === "sd" ? buildSDCards() : buildSECards();
    if (filter === "weak")   return cards.filter((c) => isWeak(c.id));
    if (filter === "unseen") return cards.filter((c) => !isKnown(c.id) && !isWeak(c.id));
    return cards;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, filter, known, weak]);

  const card = allCards[idx] ?? null;

  const totalCards = domain === "sd" ? buildSDCards().length : buildSECards().length;
  const knownCount = allCards.filter((c) => isKnown(c.id)).length;
  const weakCount  = allCards.filter((c) => isWeak(c.id)).length;

  const handleKnown = () => {
    if (!card) return;
    markKnown(card.id);
    advance();
  };

  const handleWeak = () => {
    if (!card) return;
    markWeak(card.id);
    advance();
  };

  const advance = () => {
    setCardState("front");
    if (idx + 1 >= allCards.length) {
      setSessionDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  };

  const restart = () => {
    setIdx(0);
    setCardState("front");
    setSessionDone(false);
  };

  const domainColor = domain === "sd" ? "#2FBF71" : "#F5A524";
  const domainLabel = domain === "sd" ? "System Design" : "SE Basics";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <main className="max-w-2xl mx-auto px-4 pb-8">
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>Flashcards</span>
        </div>

        <div className="mt-4 mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Flashcard Mode</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Quick "know it / didn't know it" drill. Much faster than re-reading chapters.
            </p>
          </div>
          <button
            onClick={() => { resetAll(); restart(); }}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
            Reset all
          </button>
        </div>

        {/* Domain toggle */}
        <div className="flex gap-2 mb-4">
          {(["sd", "se"] as Domain[]).map((d) => (
            <button key={d} onClick={() => { setDomain(d); setIdx(0); setCardState("front"); setSessionDone(false); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: domain === d ? (d === "sd" ? "rgba(47,191,113,0.15)" : "rgba(245,165,36,0.15)") : "var(--bg-card)",
                color: domain === d ? (d === "sd" ? "#2FBF71" : "#F5A524") : "var(--text-muted)",
                border: `1px solid ${domain === d ? (d === "sd" ? "rgba(47,191,113,0.35)" : "rgba(245,165,36,0.35)") : "var(--border)"}`,
              }}>
              {d === "sd" ? "System Design" : "SE Basics"}
            </button>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "weak", "unseen"] as const).map((f) => (
            <button key={f} onClick={() => { setFilter(f); setIdx(0); setCardState("front"); setSessionDone(false); }}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize"
              style={{
                background: filter === f ? "var(--accent-soft)" : "var(--bg-card)",
                color: filter === f ? "var(--accent)" : "var(--text-muted)",
                border: `1px solid ${filter === f ? "rgba(79,140,255,0.35)" : "var(--border)"}`,
              }}>
              {f === "all" ? `All (${totalCards})` : f === "weak" ? `Weak (${allCards.filter(c => isWeak(c.id)).length})` : `Unseen (${allCards.filter(c => !isKnown(c.id) && !isWeak(c.id)).length})`}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
            <span>{knownCount} known · {weakCount} weak · {allCards.length - knownCount - weakCount} remaining</span>
            <span>{idx + 1} / {allCards.length}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${allCards.length ? ((idx) / allCards.length) * 100 : 0}%`, background: domainColor }} />
          </div>
        </div>

        {/* Card */}
        {sessionDone || allCards.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="text-4xl mb-4">
              {weakCount === 0 ? "🏆" : weakCount < allCards.length * 0.3 ? "💪" : "📚"}
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {allCards.length === 0 ? "No cards in this filter" : "Session complete!"}
            </h2>
            {allCards.length > 0 && (
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                {knownCount} known · {weakCount} to review
              </p>
            )}
            <div className="flex gap-3 justify-center flex-wrap">
              {weakCount > 0 && (
                <button onClick={() => { setFilter("weak"); setIdx(0); setCardState("front"); setSessionDone(false); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                  Drill weak cards ({weakCount})
                </button>
              )}
              <button onClick={restart}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "rgba(79,140,255,0.12)", color: "#4F8CFF", border: "1px solid rgba(79,140,255,0.3)" }}>
                Restart
              </button>
            </div>
          </div>
        ) : card ? (
          <div>
            {/* Card face */}
            <button
              onClick={() => setCardState((s) => s === "front" ? "back" : "front")}
              className="w-full text-left rounded-2xl p-7 transition-all"
              style={{
                background: "var(--bg-card)",
                border: `2px solid ${cardState === "back" ? domainColor + "50" : "var(--border)"}`,
                minHeight: 220,
              }}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs px-2 py-1 rounded-full"
                  style={{ background: `${domainColor}15`, color: domainColor, border: `1px solid ${domainColor}30` }}>
                  {card.topic}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {cardState === "front" ? "tap to reveal →" : "← tap to hide"}
                </span>
              </div>

              {cardState === "front" ? (
                <div>
                  <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                    {domain === "sd" ? "System Design Concept" : "SE Basics Chapter"}
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{card.front}</h2>
                  {card.hint && (
                    <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>Hint: {card.hint}</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: domainColor }}>Explanation</div>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
                    {card.back}
                  </p>
                  <Link
                    href={domain === "sd" ? `/system-design/concept/${card.id.replace("sd-", "")}` : `/se-basics/${card.id.replace("se-", "").split("-")[0]}#${card.id.replace("se-", "").split("-").slice(1).join("-")}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block mt-4 text-xs"
                    style={{ color: domainColor }}>
                    Full {domainLabel} page →
                  </Link>
                </div>
              )}
            </button>

            {/* Know it / Didn't know it */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={handleWeak}
                className="py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }}>
                ✗ Didn&apos;t know it
              </button>
              <button onClick={handleKnown}
                className="py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(47,191,113,0.1)", color: "#2FBF71", border: "1px solid rgba(47,191,113,0.25)" }}>
                ✓ Know it
              </button>
            </div>

            {/* Skip */}
            <button onClick={advance} className="w-full text-center mt-3 text-xs"
              style={{ color: "var(--text-muted)" }}>
              Skip →
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
