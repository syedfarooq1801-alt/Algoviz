"use client";
import { useEffect, useState } from "react";

const LONG_URLS = [
  "https://example.com/blog/2024/system-design",
  "https://github.com/user/repo/blob/main/README.md",
  "https://docs.google.com/spreadsheets/d/abc123xyz",
  "https://www.amazon.com/dp/B08N5WRWNW?ref=nav",
];

interface Entry { shortCode: string; longUrl: string; hits: number; createdAt: number }

function base62(n: number): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  while (n > 0) { result = chars[n % 62] + result; n = Math.floor(n / 62); }
  return result.padStart(6, "0");
}

export default function URLShortenerViz() {
  const [db, setDb] = useState<Entry[]>([]);
  const [cache, setCache] = useState<Record<string, Entry>>({});
  const [activeOp, setActiveOp] = useState<{ type: "write" | "read"; code: string; hit: boolean } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const isRead = t % 3 !== 0 && db.length > 0;

        if (isRead && db.length > 0) {
          const entry = db[t % db.length];
          const isHit = !!cache[entry.shortCode];
          setActiveOp({ type: "read", code: entry.shortCode, hit: isHit });
          if (!isHit) {
            setCache((prev) => { const next = { ...prev, [entry.shortCode]: entry }; return next; });
          }
          setDb((prev) => prev.map((e) => e.shortCode === entry.shortCode ? { ...e, hits: e.hits + 1 } : e));
        } else {
          const longUrl = LONG_URLS[t % LONG_URLS.length];
          const id64 = t * 1000 + 10000;
          const shortCode = base62(id64);
          const newEntry: Entry = { shortCode, longUrl, hits: 0, createdAt: t };
          setActiveOp({ type: "write", code: shortCode, hit: false });
          setDb((prev) => [newEntry, ...prev].slice(0, 6));
        }

        setTimeout(() => setActiveOp(null), 700);
        return t + 1;
      });
    }, 1400);
    return () => clearInterval(id);
  }, [db, cache]);

  return (
    <div className="space-y-4">
      {/* Current operation */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
        style={{ background: activeOp ? (activeOp.type === "write" ? "rgba(79,142,247,0.1)" : activeOp.hit ? "rgba(34,197,94,0.1)" : "rgba(249,115,22,0.1)") : "var(--bg-card)", border: `1px solid ${activeOp ? (activeOp.type === "write" ? "rgba(79,142,247,0.35)" : activeOp.hit ? "rgba(34,197,94,0.35)" : "rgba(249,115,22,0.35)") : "var(--border)"}`, minHeight: 52 }}>
        {activeOp ? (
          <>
            <span className="text-lg">{activeOp.type === "write" ? "✏️" : activeOp.hit ? "⚡" : "🔍"}</span>
            <div>
              <div className="text-xs font-semibold" style={{ color: activeOp.type === "write" ? "#4f8ef7" : activeOp.hit ? "#22c55e" : "#f97316" }}>
                {activeOp.type === "write" ? "WRITE: Shorten URL" : activeOp.hit ? "READ: Cache HIT" : "READ: DB lookup"}
              </div>
              <div className="font-mono text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                bit.ly/<span style={{ color: "#a855f7" }}>{activeOp.code}</span>
              </div>
            </div>
          </>
        ) : <span className="text-xs" style={{ color: "var(--text-muted)" }}>Idle...</span>}
      </div>

      {/* Architecture flow */}
      <div className="flex items-center gap-2 text-xs justify-center flex-wrap">
        {["Client", "→", "API Server", "→", "Cache (Redis)", "→", "DB (MySQL)"].map((item, i) => (
          <span key={i} style={{ color: i % 2 === 0 ? "var(--text-secondary)" : "var(--text-muted)", background: i % 2 === 0 ? "var(--bg-card)" : "transparent", padding: i % 2 === 0 ? "2px 8px" : "2px 0", borderRadius: 6, border: i % 2 === 0 ? "1px solid var(--border)" : "none" }}>
            {item}
          </span>
        ))}
      </div>

      {/* DB table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="px-4 py-2 text-xs font-semibold flex items-center justify-between"
          style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
          <span>🗄️ URL Table</span>
          <span style={{ color: "var(--text-muted)" }}>{Object.keys(cache).length} in cache</span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
          {db.slice(0, 5).map((entry) => {
            const inCache = !!cache[entry.shortCode];
            return (
              <div key={entry.shortCode} className="flex items-center gap-3 px-4 py-2 text-xs">
                <span className="font-mono font-bold shrink-0" style={{ color: "#a855f7" }}>/{entry.shortCode}</span>
                <span className="flex-1 truncate font-mono" style={{ color: "var(--text-muted)" }}>{entry.longUrl}</span>
                <span style={{ color: "#4f8ef7" }}>{entry.hits} hits</span>
                {inCache && <span className="px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>⚡</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
