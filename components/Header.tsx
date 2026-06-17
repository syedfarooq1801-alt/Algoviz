"use client";
import { useProgressStore } from "@/lib/store";
import { getTotalProblems } from "@/data/problems";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";
import AuthButton from "./AuthButton";
import { useSDStore } from "@/lib/sdStore";

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

function HeaderContent({ searchQuery = "", onSearchChange, suggestions = [] }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchQuery || searchParams.get("q") || "";
  const { solved, xp, streak } = useProgressStore();
  const { mastered } = useSDStore();
  const isSDMode = pathname.startsWith("/system-design");
  const isSEMode = pathname.startsWith("/se-basics");
  const isDSAMode = pathname.startsWith("/dsa") || pathname.startsWith("/problems") || pathname.startsWith("/patterns") || pathname.startsWith("/visualizations");
  const total = getTotalProblems();
  const solvedCount = solved.size;
  const showSuggestions = Boolean(currentQuery && suggestions.length > 0);

  const navigateWithQuery = (value: string) => {
    const query = value.trim();
    const path = query ? `/dsa?q=${encodeURIComponent(query)}` : "/dsa";
    if (pathname === "/dsa") {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  const handleSearchChange = (value: string) => {
    if (onSearchChange) onSearchChange(value);
    navigateWithQuery(value);
  };

  return (
    <header
      className="glass sticky top-0 z-50 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            ∑
          </div>
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            AlgoVis
          </span>
        </Link>

        {/* Mode toggle */}
        <div className="flex shrink-0 p-0.5 rounded-lg gap-0.5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <Link
            href="/dsa"
            className="px-3 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: isDSAMode ? "var(--accent-soft)" : "transparent",
              color: isDSAMode ? "var(--accent)" : "var(--text-muted)",
              border: isDSAMode ? "1px solid rgba(91,140,255,0.35)" : "1px solid transparent",
            }}
          >
            DSA
          </Link>
          <Link
            href="/system-design"
            className="px-3 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: isSDMode ? "rgba(79,140,255,0.18)" : "transparent",
              color: isSDMode ? "#4F8CFF" : "var(--text-muted)",
              border: isSDMode ? "1px solid rgba(79,140,255,0.35)" : "1px solid transparent",
            }}
          >
            System Design
          </Link>
          <Link
            href="/se-basics"
            className="px-3 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: isSEMode ? "rgba(45,212,160,0.16)" : "transparent",
              color: isSEMode ? "var(--accent-green)" : "var(--text-muted)",
              border: isSEMode ? "1px solid rgba(45,212,160,0.35)" : "1px solid transparent",
            }}
          >
            SE Basics
          </Link>
        </div>

        {/* Right: command-palette trigger + profile */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            <span>⌕</span>
            <span className="hidden sm:inline">Search</span>
            <span className="hidden sm:flex items-center gap-0.5"><kbd>⌘</kbd><kbd>K</kbd></span>
          </button>
          <AuthButton />
        </div>
      </div>

      {/* Progress bar at bottom of header */}
      <div style={{ height: "2px", background: "var(--border)" }}>
        <div
          className="h-full progress-bar"
          style={{ width: `${total > 0 ? (solvedCount / total) * 100 : 0}%` }}
        />
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
