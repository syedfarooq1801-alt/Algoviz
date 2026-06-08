"use client";
import { useProgressStore } from "@/lib/store";
import { getTotalProblems } from "@/data/problems";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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

export default function Header({ searchQuery = "", onSearchChange, suggestions = [] }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchQuery || searchParams.get("q") || "";
  const { solved, xp, streak } = useProgressStore();
  const total = getTotalProblems();
  const solvedCount = solved.size;
  const showSuggestions = Boolean(currentQuery && suggestions.length > 0);

  const navigateWithQuery = (value: string) => {
    const query = value.trim();
    const path = query ? `/?q=${encodeURIComponent(query)}` : "/";
    if (pathname === "/") {
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

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search problems..."
              value={currentQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "var(--accent-blue)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "var(--border)";
              }}
            />
            {showSuggestions && (
              <div
                className="absolute left-0 right-0 mt-2 rounded-xl border bg-[rgba(15,15,23,0.96)] shadow-xl overflow-hidden"
                style={{ borderColor: "var(--border)", zIndex: 50 }}
              >
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion.id}
                    href={`/problems/${suggestion.id}`}
                    className="block px-4 py-3 text-sm transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    <div className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {suggestion.title}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {suggestion.pattern}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span style={{ color: "var(--text-muted)" }}>Solved</span>
            <span className="font-semibold" style={{ color: "var(--accent-green)" }}>
              {solvedCount}
            </span>
            <span style={{ color: "var(--text-muted)" }}>/ {total}</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span>🔥</span>
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {streak}
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span>⚡</span>
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {xp} XP
            </span>
          </div>
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
