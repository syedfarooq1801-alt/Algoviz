"use client";
import { useEffect, useState, useMemo } from "react";
import {
  User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut,
} from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { isAdmin } from "@/lib/admin";
import { LogOut, Shield } from "lucide-react";

interface AdminUser {
  uid: string;
  username: string | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [signInErr, setSignInErr] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"xp" | "recent" | "solved">("xp");

  const admin = isAdmin(user?.email);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!admin) return;
    setLoadingUsers(true);
    const unsub = onSnapshot(
      collection(db, "users"),
      (snap) => {
        setUsers(snap.docs.map((d) => ({
          uid: d.id,
          username: d.data().username ?? null,
          displayName: d.data().displayName ?? null,
          email: d.data().email ?? null,
          xp: d.data().xp ?? 0,
          streak: d.data().streak ?? 0,
          solved: d.data().solved ?? [],
          lastActivity: d.data().lastActivity ?? "",
          createdAt: d.data().createdAt ?? "",
        })));
        setLoadingUsers(false);
      },
      (err) => { console.error(err); setLoadingUsers(false); }
    );
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
        u.username?.toLowerCase().includes(q) ||
        u.displayName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "solved") return b.solved.length - a.solved.length;
      return (b.lastActivity || "").localeCompare(a.lastActivity || "");
    });
  }, [users, search, sortBy]);

  const handleSignIn = async () => {
    setSignInErr(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: unknown) {
      setSignInErr((e as { message?: string }).message ?? "Sign-in failed.");
    }
  };

  // --- Not signed in: login screen ---
  if (!authReady) {
    return <Center>Loading…</Center>;
  }

  if (!user) {
    return (
      <Center>
        <div style={card}>
          <Shield size={32} color="var(--accent)" />
          <h1 style={{ fontSize: 20, fontWeight: 800, marginTop: 14 }}>AlgoViz Admin</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6, marginBottom: 20 }}>
            Restricted. Sign in with an authorized account.
          </p>
          <button onClick={handleSignIn} style={primaryBtn}>Sign in with Google</button>
          {signInErr && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 12 }}>{signInErr}</p>}
        </div>
      </Center>
    );
  }

  // --- Signed in but not admin: denied ---
  if (!admin) {
    return (
      <Center>
        <div style={card}>
          <div style={{ fontSize: 36 }}>🔒</div>
          <h1 style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>Access denied</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
            {user.email} is not an administrator.
          </p>
          <button onClick={() => fbSignOut(auth)} style={{ ...ghostBtn, marginTop: 18 }}>Sign out</button>
        </div>
      </Center>
    );
  }

  // --- Admin dashboard ---
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>⚙️ Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Live view of all users · signed in as {user.email}
          </p>
        </div>
        <button onClick={() => fbSignOut(auth)} style={ghostBtn}>
          <LogOut size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />Sign out
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total Users", value: stats.totalUsers, color: "var(--accent)" },
          { label: "Active Today", value: stats.activeToday, color: "#2FBF71" },
          { label: "Total XP", value: stats.totalXP.toLocaleString(), color: "#F5A524" },
          { label: "Problems Solved", value: stats.totalSolved.toLocaleString(), color: "#A78BFA" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "16px 14px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{ flex: 1, minWidth: 200, padding: "8px 14px", borderRadius: 8, fontSize: 13, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {(["xp", "solved", "recent"] as const).map((s) => (
            <button key={s} onClick={() => setSortBy(s)} style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: "1px solid", borderColor: sortBy === s ? "var(--accent)" : "var(--border)",
              background: sortBy === s ? "var(--accent-soft)" : "var(--bg-card)",
              color: sortBy === s ? "var(--accent)" : "var(--text-secondary)",
            }}>
              {s === "xp" ? "XP" : s === "solved" ? "Solved" : "Recent"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 70px 70px 110px", padding: "10px 16px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <span>User</span>
          <span style={{ textAlign: "right" }}>XP</span>
          <span style={{ textAlign: "right" }}>Streak</span>
          <span style={{ textAlign: "right" }}>Solved</span>
          <span style={{ textAlign: "right" }}>Last Active</span>
        </div>

        {loadingUsers ? (
          <div style={emptyRow}>Loading users…</div>
        ) : filtered.length === 0 ? (
          <div style={emptyRow}>No users found.</div>
        ) : (
          filtered.map((u, i) => (
            <div key={u.uid} style={{ display: "grid", gridTemplateColumns: "1fr 90px 70px 70px 110px", padding: "11px 16px", alignItems: "center", borderBottom: i < filtered.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.username ?? u.displayName ?? "Anonymous"}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email ?? "—"}</div>
              </div>
              <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, textAlign: "right" }}>{u.xp.toLocaleString()}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "right" }}>{u.streak}🔥</div>
              <div style={{ fontSize: 13, color: "#2FBF71", textAlign: "right" }}>{u.solved.length}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right" }}>{fmtDate(u.lastActivity)}</div>
            </div>
          ))
        )}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 20 }}>Live · updates in real-time</p>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {children}
    </div>
  );
}

const card: React.CSSProperties = {
  textAlign: "center", padding: "36px 32px", borderRadius: 16,
  background: "var(--bg-card)", border: "1px solid var(--border)", maxWidth: 380, width: "100%",
};
const primaryBtn: React.CSSProperties = {
  padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
  background: "var(--accent)", color: "#fff", border: "none", width: "100%",
};
const ghostBtn: React.CSSProperties = {
  padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
  background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)",
};
const emptyRow: React.CSSProperties = {
  padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13,
};
