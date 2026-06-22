"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BrainCircuit, Code2, Search, Sparkles } from "lucide-react";

const TABS = [
  { label: "Home", href: "/", icon: BrainCircuit, match: (p: string) => p === "/" },
  { label: "DSA", href: "/dsa", icon: Code2, match: (p: string) => p.startsWith("/dsa") || p.startsWith("/problems") || p.startsWith("/patterns") || p.startsWith("/visualizations") },
  { label: "Diagnose", href: "/diagnosis", icon: Sparkles, match: (p: string) => p.startsWith("/diagnosis") },
  { label: "Stats", href: "/analytics", icon: BarChart3, match: (p: string) => p.startsWith("/analytics") },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 py-2 px-2 flex-1"
              style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
            >
              <span className="w-8 h-7 rounded-lg inline-flex items-center justify-center"
                style={{ background: active ? "var(--accent-soft)" : "transparent", border: active ? "1px solid rgba(79,140,255,0.25)" : "1px solid transparent" }}>
                <Icon size={18} />
              </span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="flex flex-col items-center gap-1 py-2 px-2 flex-1"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="w-8 h-7 rounded-lg inline-flex items-center justify-center">
            <Search size={18} />
          </span>
          <span className="text-[10px] font-medium">Search</span>
        </button>
      </div>
    </nav>
  );
}
