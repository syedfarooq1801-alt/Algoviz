"use client";
import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { useProgressStore } from "@/lib/store";
import { validateUsername, isUsernameAvailable, claimUsername } from "@/lib/username";

// Blocks the app until a signed-in user has chosen a unique username.
// Shown once on first sign-in; editing later happens in the profile page.
export default function UsernameGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const username = useProgressStore((s) => s.username);
  const setUsername = useProgressStore((s) => s.setUsername);

  const suggested = (user?.displayName ?? user?.email?.split("@")[0] ?? "")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 20);

  const [value, setValue] = useState(suggested);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Not signed in, or already has a username → render the app.
  if (!user || username) return <>{children}</>;

  const handleSubmit = async () => {
    setError(null);
    const v = value.trim();
    const invalid = validateUsername(v);
    if (invalid) { setError(invalid); return; }
    setSaving(true);
    try {
      const free = await isUsernameAvailable(v, user.uid);
      if (!free) { setError("That username is taken. Try another."); setSaving(false); return; }
      await claimUsername(user.uid, v);
      setUsername(v);
    } catch (e) {
      setError((e as Error).message ?? "Could not save username.");
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "36px 32px", borderRadius: 16, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Pick your username</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6, marginBottom: 20 }}>
          This is the name shown on the leaderboard and your public profile. Choose carefully — it must be unique.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", borderRadius: 10, background: "var(--bg-secondary)", border: `1px solid ${error ? "#EF4444" : "var(--border)"}` }}>
          <span style={{ color: "var(--text-muted)", fontSize: 15 }}>@</span>
          <input
            autoFocus
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(null); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !saving) handleSubmit(); }}
            placeholder="your_handle"
            maxLength={20}
            style={{ flex: 1, padding: "11px 0", background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 15 }}
          />
        </div>

        {error && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 8 }}>{error}</p>}
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>3–20 characters · letters, numbers, underscore</p>

        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: "100%", marginTop: 20, padding: "11px 0", borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: "var(--accent)", color: "#fff", border: "none", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
