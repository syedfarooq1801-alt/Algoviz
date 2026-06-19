"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Code2,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Moon,
  Server,
  Sun,
  Swords,
} from "lucide-react";
import { useInterviewStore } from "@/lib/interviewStore";
import { useAuth } from "@/lib/authContext";
import { useTheme } from "@/lib/themeStore";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}

function NavLink({ href, label, icon: Icon, active }: NavItem) {
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
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { targetDate, targetCompany, daysUntil } = useInterviewStore();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const days = daysUntil();

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
      href: "/mock",
      label: "Mock Interview",
      icon: Swords,
      active: pathname.startsWith("/mock"),
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
            <BrainCircuit size={16} />
          </span>
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            AlgoVis
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
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
                border: "1px solid rgba(79,140,255,0.25)",
              }}
            >
              {initials}
            </div>
            <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              {user?.displayName ?? user?.email ?? "Guest"}
            </span>
          </div>
          <button
            onClick={toggle}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            style={{
              background: "var(--bg-hover)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
