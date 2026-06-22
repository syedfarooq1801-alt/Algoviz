"use client";
import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Code2,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Search,
  Server,
  Sparkles,
} from "lucide-react";
import { useProgressStore } from "@/lib/store";
import { getTotalProblems } from "@/data/problems";
import AuthButton from "./AuthButton";

interface SearchSuggestion {
  id: string;
  title: string;
  pattern: string;
}

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  suggestions?: SearchSuggestion[];
}

function HeaderContent({ searchQuery = "", onSearchChange }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchQuery || searchParams.get("q") || "";
  const { solved } = useProgressStore();
  const total = getTotalProblems();

  const navigateWithQuery = (value: string) => {
    const query = value.trim();
    const path = query ? `/dsa?q=${encodeURIComponent(query)}` : "/dsa";
    if (pathname === "/dsa") router.replace(path);
    else router.push(path);
  };

  const handleSearch = () => {
    if (onSearchChange && currentQuery) onSearchChange(currentQuery);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  const primary = [
    { href: "/dsa", label: "DSA", icon: Code2, active: pathname.startsWith("/dsa") || pathname.startsWith("/problems") || pathname.startsWith("/patterns") || pathname.startsWith("/visualizations") },
    { href: "/system-design", label: "System", icon: Server, active: pathname.startsWith("/system-design") },
    { href: "/se-basics", label: "SE Basics", icon: GraduationCap, active: pathname.startsWith("/se-basics") },
    { href: "/behavioral", label: "Behavioral", icon: MessageSquareText, active: pathname.startsWith("/behavioral") },
  ];

  const tools = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, active: pathname === "/" },
    { href: "/analytics", label: "Analytics", icon: BarChart3, active: pathname.startsWith("/analytics") },
    { href: "/diagnosis", label: "Diagnosis", icon: Sparkles, active: pathname.startsWith("/diagnosis") },
    { href: "/flashcards", label: "Cards", icon: BookOpen, active: pathname.startsWith("/flashcards") },
  ];

  return (
    <header className="glass sticky top-0 z-50 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg inline-flex items-center justify-center"
            style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid rgba(79,140,255,0.28)" }}>
            <BrainCircuit size={17} />
          </span>
          <span className="font-semibold text-sm hidden sm:inline" style={{ color: "var(--text-primary)" }}>Code Algo</span>
        </Link>

        <nav className="hidden lg:flex p-0.5 rounded-lg gap-0.5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {primary.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className="px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5"
                style={{
                  background: item.active ? "var(--accent-soft)" : "transparent",
                  color: item.active ? "var(--accent)" : "var(--text-muted)",
                  border: item.active ? "1px solid rgba(79,140,255,0.32)" : "1px solid transparent",
                }}>
                <Icon size={13} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <nav className="hidden md:flex p-0.5 rounded-lg gap-0.5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {tools.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className="px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5"
                style={{
                  background: item.active ? "rgba(79,140,255,0.14)" : "transparent",
                  color: item.active ? "var(--accent)" : "var(--text-muted)",
                  border: item.active ? "1px solid rgba(79,140,255,0.28)" : "1px solid transparent",
                }}>
                <Icon size={13} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
            <span className="hidden xl:flex items-center gap-0.5"><kbd>Ctrl</kbd><kbd>K</kbd></span>
          </button>
          <AuthButton />
        </div>
      </div>

      <div style={{ height: "2px", background: "var(--border)" }}>
        <div className="h-full progress-bar" style={{ width: `${total > 0 ? (solved.size / total) * 100 : 0}%` }} />
      </div>
    </header>
  );
}

export default function Header(props: HeaderProps) {
  return (
    <Suspense fallback={null}>
      <HeaderContent {...props} />
    </Suspense>
  );
}
