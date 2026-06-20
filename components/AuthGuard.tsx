"use client";
import { useAuth } from "@/lib/authContext";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTotalProblems } from "@/data/problems";

const FEATURES = [
  { icon: "⚡", title: "Spaced Repetition", desc: "Schedule problem reviews on a 1→3→7→21 day cycle. Never re-forget what you once understood." },
  { icon: "🏢", title: "Company Filters", desc: "Filter any problem set by Google, Amazon, Meta, Apple, Microsoft, LinkedIn, or Netflix." },
  { icon: "📐", title: "Pattern-First Learning", desc: "Every problem is tagged to a pattern with full theory. Learn the pattern once, solve 10 problems from memory." },
  { icon: "📅", title: "Adaptive Study Plan", desc: "30/60/90-day plan generator. Set your interview date and get a daily schedule that adapts to your progress." },
  { icon: "🃏", title: "SRS Flashcards", desc: "Concept cards with spaced repetition. Due cards surface automatically — no manual scheduling." },
  { icon: "🎯", title: "No Coding Here", desc: "This is your study layer. Understand the problem deeply here, then code it on LeetCode. Clean separation of concerns." },
];

const TESTIMONIALS = [
  { quote: "Pattern-first approach changed how I read problems. Stopped grinding, started recognizing. Got the offer in 6 weeks.", name: "Rahul M.", role: "SDE-2" },
  { quote: "SRS for DSA problems is the missing piece. I kept re-forgetting sliding window every 2 weeks — not anymore.", name: "Priya S.", role: "Software Engineer" },
  { quote: "Company filters + review scheduling in one place. The ROI versus random LeetCode grinding is not even close.", name: "James K.", role: "Backend Engineer" },
];

const VS_NEETCODE = [
  { feature: "Spaced repetition for problems", us: true, them: false },
  { feature: "Company-filtered problem sets", us: true, them: false },
  { feature: "Pattern theory + problems on one page", us: true, them: false },
  { feature: "Adaptive study plan with interview date", us: true, them: false },
  { feature: "SRS flashcards with due tracking", us: true, them: false },
  { feature: "Focused study (no editor distraction)", us: true, them: false },
];

function LandingPage() {
  const { signIn } = useAuth();
  const total = getTotalProblems();
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", overflowY: "auto" }}>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 14px", borderRadius: 20, marginBottom: 24,
          background: "rgba(79,140,255,0.1)", border: "1px solid rgba(79,140,255,0.25)",
          fontSize: 12, color: "var(--accent)", fontWeight: 600,
        }}>
          {total}+ problems · SRS scheduling · Pattern theory
        </div>

        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800,
          color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 20,
        }}>
          Study smart.<br />
          <span style={{ color: "var(--accent)" }}>Code on LeetCode.</span><br />
          Beat the FAANG interview.
        </h1>

        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>
          Code Algo is your structured study layer — pattern theory, spaced repetition, company filters, and a personalized study plan. No editor, no distraction. Understand deeply here, then code on LeetCode.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={signIn}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(255,255,255,0.9)"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,255,255,0.9)"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="rgba(255,255,255,0.9)"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(255,255,255,0.9)"/>
            </svg>
            Sign in with Google
          </button>
        </div>
        <p style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>
          Free. Progress syncs across all your devices.
        </p>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ padding: "20px 22px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: 28, letterSpacing: "-0.02em" }}>
          Engineers who stopped grinding and started studying
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={{
              padding: "20px 22px", borderRadius: 12,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, flex: 1 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: 24, letterSpacing: "-0.02em" }}>
          Why not just use NeetCode?
        </h2>
        <div style={{ borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 110px 110px",
            padding: "10px 20px", background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)",
            color: "var(--text-muted)", letterSpacing: "0.06em",
          }}>
            <span>FEATURE</span>
            <span style={{ textAlign: "center", color: "var(--accent)" }}>CODE ALGO</span>
            <span style={{ textAlign: "center" }}>NEETCODE</span>
          </div>
          {VS_NEETCODE.map((row, i) => (
            <div key={row.feature} style={{
              display: "grid", gridTemplateColumns: "1fr 110px 110px",
              padding: "11px 20px", alignItems: "center",
              borderBottom: i < VS_NEETCODE.length - 1 ? "1px solid var(--border-subtle)" : "none",
              background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
            }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{row.feature}</span>
              <span style={{ textAlign: "center", fontSize: 14, color: "#2FBF71" }}>{row.us ? "✓" : "✗"}</span>
              <span style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)" }}>{row.them ? "✓" : "✗"}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 12 }}>
          NeetCode has great video explanations. Code Algo has the structured study workflow around them.
        </p>
      </section>
    </div>
  );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return <LandingPage />;

  return <>{children}</>;
}
