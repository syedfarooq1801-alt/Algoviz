"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS: Record<string, React.ReactNode> = {
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10" />,
  dsa: <path d="M4 6h16M4 12h16M4 18h10" />,
  sd: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  se: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
};

const TABS = [
  { key: "home", label: "Home", href: "/", match: (p: string) => p === "/" },
  { key: "dsa", label: "DSA", href: "/dsa", match: (p: string) => p.startsWith("/dsa") || p.startsWith("/problems") || p.startsWith("/patterns") || p.startsWith("/visualizations") },
  { key: "sd", label: "System", href: "/system-design", match: (p: string) => p.startsWith("/system-design") },
  { key: "se", label: "SE Basics", href: "/se-basics", match: (p: string) => p.startsWith("/se-basics") },
];

const navItemStyle = (active: boolean): React.CSSProperties => ({
  color: active ? "var(--accent)" : "var(--text-muted)",
});

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <Link
              key={t.key}
              href={t.href}
              className="flex flex-col items-center gap-1 py-2 px-3 flex-1 hover:opacity-80 active:opacity-60"
              style={navItemStyle(active)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[t.key]}
              </svg>
              <span className="text-[10px] font-medium">{t.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="flex flex-col items-center gap-1 py-2 px-3 flex-1 hover:opacity-80 active:opacity-60"
          style={{ color: "var(--text-muted)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {ICONS.search}
          </svg>
          <span className="text-[10px] font-medium">Search</span>
        </button>
      </div>
    </nav>
  );
}
