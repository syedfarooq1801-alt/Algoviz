"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Code2,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  LogOut,
  Moon,
  Server,
  Sun,
  Swords,
  Trophy,
} from "lucide-react";
import { LogoIcon } from "@/components/Logo";
import { useInterviewStore } from "@/lib/interviewStore";
import { useAuth } from "@/lib/authContext";
import { useTheme } from "@/lib/themeStore";
import { usePrepStore } from "@/lib/prepStore";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  badge?: number;
}

function NavLink({ href, label, icon: Icon, active, badge }: NavItem) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors"
      style={{
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        border: active ? "1px solid rgba(79,140,255,0.22)" : "1px solid transparent",
      }}
    >
      <Icon size={15} />
      {label}
      {badge != null && badge > 0 && (
        <span style={{
          marginLeft: "auto", fontSize: 10, fontWeight: 700,
          minWidth: 18, height: 18, borderRadius: 9,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 4px", background: "#F5A524", color: "#000", flexShrink: 0,
        }}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { targetDate, targetCompany, daysUntil } = useInterviewStore();
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const { reviewDue } = usePrepStore();
  const days = daysUntil();
  const todayIso = new Date().toISOString().slice(0, 10);
  const dueCount = Object.values(reviewDue).filter((d) => d <= todayIso).length;

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : "U";

  const learn: NavItem[] = [
    {
      href: "/dsa",
      label: "DSA",
      icon: Code2,
      active:
        pathname.startsWith("/dsa") ||
        pathname.startsWith("/problems") ||
        pathname.startsWith("/patterns") ||
        pathname.startsWith("/visualizations"),
      badge: dueCount || undefined,
    },
    {
      href: "/system-design",
      label: "System Design",
      icon: Server,
      active: pathname.startsWith("/system-design"),
    },
    {
      href: "/se-basics",
      label: "SE Basics",
      icon: GraduationCap,
      active: pathname.startsWith("/se-basics"),
    },
    {
      href: "/behavioral",
      label: "Behavioral",
      icon: MessageSquareText,
      active: pathname.startsWith("/behavioral"),
    },
  ];

  const tools: NavItem[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      active: pathname.startsWith("/analytics"),
    },
    {
      href: "/flashcards",
      label: "Flashcards",
      icon: BookOpen,
      active: pathname.startsWith("/flashcards"),
    },
    {
      href: "/study-plan",
      label: "Study Plan",
      icon: CalendarDays,
      active: pathname.startsWith("/study-plan"),
    },
    {
      href: "/mock",
      label: "Mock Interview",
      icon: Swords,
      active: pathname.startsWith("/mock"),
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      active: pathname.startsWith("/leaderboard"),
    },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto"
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        width: "220px",
      }}
    >
      {/* Logo */}
      <div className="px-4 pt-5 pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-lg inline-flex items-center justify-center shrink-0"
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
              border: "1px solid rgba(79,140,255,0.28)",
            }}
          >
            <LogoIcon size={17} />
          </span>
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            Code Algo
          </span>
        </Link>
      </div>

      {/* Interview countdown */}
      {targetDate && days !== null && (
        <div
          className="mx-3 mb-3 px-3 py-2 rounded-lg"
          style={{
            background: "var(--accent-soft)",
            border: "1px solid rgba(79,140,255,0.2)",
          }}
        >
          <div className="text-xs font-medium" style={{ color: "var(--accent)" }}>
            {targetCompany ?? "Interview"}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {Math.max(0, days)} days remaining
          </div>
        </div>
      )}

      {/* LEARN section */}
      <div className="px-3 mb-1">
        <div
          className="px-2 py-1.5 text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          Learn
        </div>
        <div className="space-y-0.5">
          {learn.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </div>

      {/* TOOLS section */}
      <div className="px-3 mt-4 mb-1">
        <div
          className="px-2 py-1.5 text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          Tools
        </div>
        <div className="space-y-0.5">
          {tools.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-auto px-3 py-4"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 min-w-0 flex-1" style={{ textDecoration: "none" }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
                border: "1px solid rgba(79,140,255,0.25)",
              }}
            >
              {initials || "G"}
            </div>
            <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              {user?.displayName ?? user?.email ?? "Guest — sign in"}
            </span>
          </Link>
          <div className="flex items-center gap-1 shrink-0">
            {user && (
              <button
                onClick={() => signOut()}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                title="Sign out"
              >
                <LogOut size={12} />
              </button>
            )}
            <button
              onClick={toggle}
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
