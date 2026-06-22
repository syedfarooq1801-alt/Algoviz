"use client";
import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import { isAdmin } from "@/lib/admin";
import { getTotalProblems } from "@/data/problems";
import Link from "next/link";

interface AdminUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  xp: number;
  streak: number;
  solved: string[];
  lastActivity: string;
  createdAt: string;
}

function fmtDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"xp" | "recent" | "solved">("xp");
  const total = getTotalProblems();

  const admin = isAdmin(user?.email);

  useEffect(() => {
    if (!admin) return;
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({
        uid: d.id,
        displayName: d.data().displayName ?? null,
        email: d.data().email ?? null,
        xp: d.data().xp ?? 0,
        streak: d.data().streak ?? 0,
        solved: d.data().solved ?? [],
        lastActivity: d.data().lastActivity ?? "",
        createdAt: d.data().createdAt ?? "",
      })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [admin]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalXP = users.reduce((s, u) => s + u.xp, 0);
    const totalSolved = users.reduce((s, u) => s + u.solved.length, 0);
    const today = new Date().toISOString().split("T")[0];
    const activeToday = users.filter((u) => u.lastActivity === today).length;
    return { totalUsers, totalXP, totalSolved, activeToday };
  }, [users]);

  const filtered = useMemo(() => {
    let list = users;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        (u.displayName?.toLowerCase().includes(q)) ||
        (u.email?.toLowerCase().includes(q))
      );
    }
    return [...list].sort((a, b) => {
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "solved") return b.solved.length - a.solved.length;
      return (b.lastActivity || "").localeCompare(a.lastActivity || "");
    });
  }, [users, search, sortBy]);

  if (authLoading) {
    return <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>;
  }

  if (!admin) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
          Admin access only
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
          This dashboard is restricted to administrators.
        </p>
        <Link href="/" style={{ color: "var(--accent)", fontSize: 13 }}>← Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 60px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.03em" }}>
          ⚙️ Admin Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Real-time view of all users and platform activity.
        </p>
      </div>

      {/* Aggregate stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total Users", value: stats.totalUsers, color: "var(--accent)" },
          { label: "Active Today", value: stats.activeToday, color: "#2FBF71" },
          { label: "Total XP", value: stats.totalXP.toLocaleString(), color: "#F5A524" },
          { label: "Problems Solved", value: stats.totalSolved.toLocaleString(), color: "#A78BFA" },
        ].map((s) => (
          <div key={s.label} style={{
            padding: "16px 14px", borderRadius: 12,
            background: "var(--bg-card)", border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{
            flex: 1, minWidth: 200, padding: "8px 14px", borderRadius: 8, fontSize: 13,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            color: "var(--text-primary)", outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {(["xp", "solved", "recent"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: "1px solid",
                borderColor: sortBy === s ? "var(--accent)" : "var(--border)",
                background: sortBy === s ? "var(--accent-soft)" : "var(--bg-card)",
                color: sortBy === s ? "var(--accent)" : "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {s === "xp" ? "XP" : s === "solved" ? "Solved" : "Recent"}
            </button>
          ))}
        </div>
      </div>

      {/* User table */}
      <div style={{ borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 90px 70px 70px 110px",
          padding: "10px 16px", background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          <span>User</span>
          <span style={{ textAlign: "right" }}>XP</span>
          <span style={{ textAlign: "right" }}>Streak</span>
          <span style={{ textAlign: "right" }}>Solved</span>
          <span style={{ textAlign: "right" }}>Last Active</span>
        </div>

        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No users found.</div>
        ) : (
          filtered.map((u, i) => (
            <Link
              key={u.uid}
              href={`/profile/${u.uid}`}
              style={{
                display: "grid", gridTemplateColumns: "1fr 90px 70px 70px 110px",
                padding: "11px 16px", alignItems: "center", textDecoration: "none",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border-subtle)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {u.displayName ?? "Anonymous"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {u.email ?? "—"}
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, textAlign: "right" }}>{u.xp.toLocaleString()}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "right" }}>{u.streak}🔥</div>
              <div style={{ fontSize: 13, color: "#2FBF71", textAlign: "right" }}>{u.solved.length}/{total}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right" }}>{fmtDate(u.lastActivity)}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
