"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getTotalProblems } from "@/data/problems";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PublicProfile {
  username: string | null;
  photoURL: string | null;
  xp: number;
  streak: number;
  solvedCount: number;
  activeDays: number;
  createdAt: string;
  selectedTrack?: string;
}

function initials(name: string): string {
  return name.split(/[\s_]+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
}

export default function PublicProfilePage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = use(params);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const total = getTotalProblems();

  useEffect(() => {
    // Read the public projection only — never the private users doc.
    getDoc(doc(db, "leaderboard", uid))
      .then((snap) => {
        if (!snap.exists()) { setNotFound(true); return; }
        const d = snap.data();
        setProfile({
          username: d.username ?? null,
          photoURL: d.photoURL ?? null,
          xp: d.xp ?? 0,
          streak: d.streak ?? 0,
          solvedCount: d.solvedCount ?? 0,
          activeDays: d.activeDays ?? 0,
          createdAt: d.createdAt ?? "",
          selectedTrack: d.selectedTrack,
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [uid]);

  if (loading) {
    return <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>;
  }

  if (notFound || !profile) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>User not found.</p>
        <Link href="/" style={{ color: "var(--accent)", fontSize: 13 }}>← Back to dashboard</Link>
      </div>
    );
  }

  const solvedCount = profile.solvedCount;
  const pct = total > 0 ? Math.round((solvedCount / total) * 100) : 0;
  const joinedDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en", { month: "short", year: "numeric" }) : "—";
  const activeDays = profile.activeDays;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 60px" }}>
      <Link href="/" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 13, color: "var(--text-muted)", marginBottom: 24, textDecoration: "none",
      }}>
        <ArrowLeft size={14} /> Dashboard
      </Link>

      {/* Profile header */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
          background: "var(--accent-soft)", border: "1px solid rgba(79,140,255,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, fontWeight: 700, color: "var(--accent)",
        }}>
          {initials(profile.username ?? "?")}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {profile.username ?? "Anonymous"}
          </h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            Joined {joinedDate}{profile.selectedTrack ? ` · ${profile.selectedTrack} track` : ""}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "XP", value: profile.xp.toLocaleString(), color: "var(--accent)" },
          { label: "Streak", value: `${profile.streak}🔥`, color: "#F5A524" },
          { label: "Solved", value: solvedCount, color: "#2FBF71" },
          { label: "Active Days", value: activeDays, color: "#A78BFA" },
        ].map((s) => (
          <div key={s.label} style={{
            padding: "16px 12px", borderRadius: 12, textAlign: "center",
            background: "var(--bg-card)", border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ padding: "18px 20px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Problem Progress</span>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{solvedCount}/{total} ({pct}%)</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: "var(--bg-secondary)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 4, transition: "width 0.4s" }} />
        </div>
      </div>
    </div>
  );
}
