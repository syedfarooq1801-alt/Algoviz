"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import Link from "next/link";

interface Leader {
  uid: string;
  username: string | null;
  photoURL: string | null;
  xp: number;
  streak: number;
  solvedCount: number;
}

// Public display name — the user-chosen handle.
function publicName(l: Leader): string {
  return l.username || "Anonymous";
}

function initials(name: string): string {
  return name.split(/[\s_]+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function rankBadge(rank: number) {
  if (rank === 1) return { emoji: "🥇", color: "#FFD700" };
  if (rank === 2) return { emoji: "🥈", color: "#C0C0C0" };
  if (rank === 3) return { emoji: "🥉", color: "#CD7F32" };
  return null;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"xp" | "streak" | "solved">("xp");

  useEffect(() => {
    const field = tab === "xp" ? "xp" : tab === "streak" ? "streak" : "solvedCount";
    const q = query(collection(db, "leaderboard"), orderBy(field, "desc"), limit(100));
    setLoading(true);
    const unsub = onSnapshot(q, (snap) => {
      const data: Leader[] = snap.docs.map((d) => ({
        uid: d.id,
        username: d.data().username ?? null,
        photoURL: d.data().photoURL ?? null,
        xp: d.data().xp ?? 0,
        streak: d.data().streak ?? 0,
        solvedCount: d.data().solvedCount ?? 0,
      }));
      setLeaders(data);
      setLoading(false);
    });
    return unsub;
  }, [tab]);

  const myRank = user ? leaders.findIndex((l) => l.uid === user.uid) + 1 : 0;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 60px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.03em" }}>
          🏆 Leaderboard
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Top 100 users ranked by XP, streak, and problems solved. Real-time.
        </p>
      </div>

      {/* My rank callout */}
      {user && myRank > 0 && (
        <div style={{
          padding: "12px 16px", borderRadius: 10, marginBottom: 20,
          background: "var(--accent-soft)", border: "1px solid rgba(79,140,255,0.22)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
            Your rank: #{myRank}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {leaders[myRank - 1]?.xp.toLocaleString()} XP · {leaders[myRank - 1]?.solvedCount} solved
          </span>
        </div>
      )}

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["xp", "streak", "solved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: "1px solid",
              borderColor: tab === t ? "var(--accent)" : "var(--border)",
              background: tab === t ? "var(--accent-soft)" : "var(--bg-card)",
              color: tab === t ? "var(--accent)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t === "xp" ? "⚡ XP" : t === "streak" ? "🔥 Streak" : "✅ Solved"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: "44px 1fr 80px 70px 70px",
          padding: "10px 16px", background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          <span>#</span>
          <span>User</span>
          <span style={{ textAlign: "right" }}>XP</span>
          <span style={{ textAlign: "right" }}>Streak</span>
          <span style={{ textAlign: "right" }}>Solved</span>
        </div>

        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Loading...
          </div>
        ) : (
          leaders.map((leader, i) => {
            const rank = i + 1;
            const badge = rankBadge(rank);
            const isMe = user?.uid === leader.uid;

            return (
              <div
                key={leader.uid}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr 80px 70px 70px",
                  padding: "11px 16px",
                  alignItems: "center",
                  borderBottom: i < leaders.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  background: isMe ? "rgba(79,140,255,0.06)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  transition: "background 0.1s",
                }}
              >
                {/* Rank */}
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  {badge ? (
                    <span style={{ fontSize: 16 }}>{badge.emoji}</span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>{rank}</span>
                  )}
                </div>

                {/* User */}
                <Link href={`/profile/${leader.uid}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: "var(--accent-soft)", border: "1px solid rgba(79,140,255,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "var(--accent)",
                  }}>
                    {initials(publicName(leader))}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: isMe ? "var(--accent)" : "var(--text-primary)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {publicName(leader)}
                      {isMe && <span style={{ fontSize: 10, color: "var(--accent)", marginLeft: 6, fontWeight: 700 }}>YOU</span>}
                    </div>
                  </div>
                </Link>

                {/* XP */}
                <div style={{ fontSize: 13, fontWeight: tab === "xp" ? 700 : 400, color: tab === "xp" ? "var(--accent)" : "var(--text-secondary)", textAlign: "right" }}>
                  {leader.xp.toLocaleString()}
                </div>

                {/* Streak */}
                <div style={{ fontSize: 13, fontWeight: tab === "streak" ? 700 : 400, color: tab === "streak" ? "#F5A524" : "var(--text-secondary)", textAlign: "right" }}>
                  {leader.streak}🔥
                </div>

                {/* Solved */}
                <div style={{ fontSize: 13, fontWeight: tab === "solved" ? 700 : 400, color: tab === "solved" ? "#2FBF71" : "var(--text-secondary)", textAlign: "right" }}>
                  {leader.solvedCount}
                </div>
              </div>
            );
          })
        )}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 16 }}>
        Updates in real-time · Top 100 by XP
      </p>
    </div>
  );
}
