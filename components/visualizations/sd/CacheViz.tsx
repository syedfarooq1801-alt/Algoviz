"use client";
import { useEffect, useState } from "react";

const KEYS = ["user:1", "user:2", "post:1", "post:2", "user:3", "session:A", "post:3", "user:1"];
const CAPACITY = 4;

interface CacheEntry { key: string; value: string; age: number }

export default function CacheViz() {
  const [step, setStep] = useState(0);
  const [cache, setCache] = useState<CacheEntry[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hit, setHit] = useState<boolean | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => {
        const key = KEYS[s % KEYS.length];
        setLastKey(key);
        setCache((prev) => {
          const aged = prev.map((e) => ({ ...e, age: e.age + 1 }));
          const idx = aged.findIndex((e) => e.key === key);
          if (idx !== -1) {
            setHit(true);
            const hit = aged[idx];
            const rest = aged.filter((_, i) => i !== idx);
            return [{ ...hit, age: 0 }, ...rest];
          }
          setHit(false);
          const value = `${key.split(":")[0] === "user" ? "👤" : key.split(":")[0] === "post" ? "📝" : "🔑"} data`;
          const next = [{ key, value, age: 0 }, ...aged];
          if (next.length > CAPACITY) {
            next.sort((a, b) => b.age - a.age);
            return next.slice(0, CAPACITY);
          }
          return next;
        });
        return s + 1;
      });
    }, 1100);
    return () => clearInterval(id);
  }, []);

  const evictColor = (age: number) => {
    if (age <= 1) return "#22c55e";
    if (age <= 3) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="space-y-4">
      {/* Request indicator */}
      <div className="flex items-center justify-center gap-3">
        <div className="px-4 py-2 rounded-lg text-sm font-mono" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
          GET <span style={{ color: "#4f8ef7" }}>{lastKey ?? "..."}</span>
        </div>
        {hit !== null && (
          <div className="px-3 py-1 rounded-full text-xs font-bold" style={{
            background: hit ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.12)",
            color: hit ? "#22c55e" : "#ef4444",
            border: `1px solid ${hit ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.3)"}`,
          }}>
            {hit ? "✓ HIT" : "✗ MISS → DB"}
          </div>
        )}
      </div>

      {/* Cache slots */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="px-4 py-2 text-xs font-semibold flex items-center justify-between"
          style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
          <span>⚡ LRU Cache (cap={CAPACITY})</span>
          <span style={{ color: "var(--text-muted)" }}>{cache.length}/{CAPACITY} slots used</span>
        </div>
        <div className="p-3 space-y-2">
          {Array.from({ length: CAPACITY }).map((_, i) => {
            const entry = cache[i];
            return (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-300"
                style={{ background: entry ? `${evictColor(entry.age)}10` : "rgba(0,0,0,0.15)", border: `1px solid ${entry ? `${evictColor(entry.age)}35` : "var(--border-subtle)"}` }}>
                <span className="text-xs font-mono w-4 text-center" style={{ color: "var(--text-muted)" }}>{i}</span>
                {entry ? (
                  <>
                    <span className="font-mono font-semibold flex-1" style={{ color: evictColor(entry.age) }}>{entry.key}</span>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{entry.value}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.2)", color: "var(--text-muted)" }}>
                      age {entry.age}
                    </span>
                    {i === 0 && <span className="text-xs" style={{ color: "#22c55e" }}>MRU</span>}
                    {i === cache.length - 1 && i > 0 && <span className="text-xs" style={{ color: "#ef4444" }}>LRU→evict</span>}
                  </>
                ) : (
                  <span className="text-xs" style={{ color: "var(--border)" }}>empty slot</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 text-xs justify-center">
        {[["#22c55e", "Recent"], ["#f97316", "Aging"], ["#ef4444", "Next evict"]].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span style={{ color: "var(--text-muted)" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
