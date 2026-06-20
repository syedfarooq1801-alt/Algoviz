"use client";
import { useAuth } from "@/lib/authContext";
import { useProgressStore } from "@/lib/store";
import { PATTERNS, getTotalProblems } from "@/data/problems";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

function ProfileContent() {
  const { user, signIn, signOut, signInError } = useAuth();
  const { solved, bookmarked, xp, streak } = useProgressStore();
  const total = getTotalProblems();
  const solvedCount = solved.size;
  const bookmarkedCount = bookmarked.size;
  const pct = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

  // Solved per pattern
  const patternBreakdown = PATTERNS.map((p) => ({
    title: p.title,
    total: p.problems.length,
    solved: p.problems.filter((pr) => solved.has(pr.id)).length,
  }));

  // Recently solved
  const recentlySolved = PATTERNS.flatMap((p) =>
    p.problems.filter((pr) => solved.has(pr.id)).map((pr) => ({ ...pr, pattern: p.title }))
  ).slice(0, 10);

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      <div className="max-w-lg mx-auto px-4 pt-32 text-center">
        <div className="text-6xl mb-6">🔐</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          Sign in to view your profile
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Your progress, streaks, and XP sync across all your devices.
        </p>
        <button
          onClick={signIn}
          className="flex items-center gap-3 mx-auto px-6 py-3 rounded-xl font-medium text-sm"
          style={{ background: "rgba(79,140,255,0.15)", border: "1px solid rgba(79,140,255,0.3)", color: "#4F8CFF" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        {signInError && (
          <div className="mt-4 max-w-sm mx-auto text-xs px-4 py-3 rounded-lg text-left"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
            {signInError}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">

        {/* Profile card */}
        <div className="rounded-2xl p-6 flex items-center gap-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {user.photoURL ? (
            <Image src={user.photoURL} alt={user.displayName ?? ""} width={72} height={72} className="rounded-full" />
          ) : (
            <div className="w-18 h-18 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ background: "rgba(79,140,255,0.2)", color: "#4F8CFF", width: 72, height: 72 }}>
              {user.displayName?.[0]}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{user.displayName}</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user.email}</p>
          </div>
          <button onClick={signOut} className="px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
            Sign out
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Problems Solved", value: `${solvedCount}/${total}`, sub: `${pct}%`, color: "#2FBF71" },
            { label: "XP Earned", value: xp, sub: "experience", color: "#F5A524" },
            { label: "Day Streak", value: streak, sub: "days", color: "#4F8CFF" },
            { label: "Bookmarked", value: bookmarkedCount, sub: "for review", color: "#4F8CFF" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex justify-between text-sm mb-3">
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Overall Progress</span>
            <span style={{ color: "var(--text-muted)" }}>{solvedCount} / {total} problems</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{pct}% complete</div>
        </div>

        {/* Pattern breakdown */}
        <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Progress by Pattern</h2>
          <div className="space-y-3">
            {patternBreakdown.map((p) => (
              <div key={p.title}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "var(--text-secondary)" }}>{p.title}</span>
                  <span style={{ color: "var(--text-muted)" }}>{p.solved}/{p.total}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${p.total > 0 ? (p.solved / p.total) * 100 : 0}%`, background: "#4F8CFF" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookmarked problems */}
        {bookmarkedCount > 0 && (
          <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              🔖 Bookmarked for Review ({bookmarkedCount})
            </h2>
            <div className="grid gap-2">
              {PATTERNS.flatMap((p) =>
                p.problems.filter((pr) => bookmarked.has(pr.id)).map((pr) => (
                  <Link key={pr.id} href={`/problems/${pr.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                    style={{ border: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{pr.title}</span>
                    <span className="px-2 py-0.5 rounded text-xs" style={{
                      background: pr.difficulty === "Easy" ? "rgba(47,191,113,0.1)" : pr.difficulty === "Medium" ? "rgba(245,165,36,0.1)" : "rgba(239,68,68,0.1)",
                      color: pr.difficulty === "Easy" ? "#2FBF71" : pr.difficulty === "Medium" ? "#F5A524" : "#ef4444",
                    }}>{pr.difficulty}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* Recently solved */}
        {recentlySolved.length > 0 && (
          <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              ✅ Solved Problems
            </h2>
            <div className="grid gap-2">
              {recentlySolved.map((pr) => (
                <Link key={pr.id} href={`/problems/${pr.id}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                  style={{ border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{pr.title}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{pr.pattern}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  );
}
