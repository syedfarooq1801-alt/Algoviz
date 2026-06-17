"use client";
import { useEffect, useState } from "react";

const ALGORITHMS = ["Token Bucket", "Leaky Bucket", "Fixed Window", "Sliding Window"] as const;
type Algo = typeof ALGORITHMS[number];

const LIMIT = 5;
const WINDOW = 10;

export default function RateLimiterViz() {
  const [algo, setAlgo] = useState<Algo>("Token Bucket");
  const [tokens, setTokens] = useState(LIMIT);
  const [requests, setRequests] = useState<{ id: number; allowed: boolean; t: number }[]>([]);
  const [windowCount, setWindowCount] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const newT = t + 1;

        // Refill tokens every 5 ticks
        if (newT % 5 === 0) {
          setTokens((prev) => Math.min(prev + 2, LIMIT));
          if (newT % WINDOW === 0) setWindowCount(0);
        }

        // New request
        const burst = newT % 7 < 4;
        if (burst) {
          let allowed = false;
          setTokens((prev) => {
            if (algo === "Token Bucket" || algo === "Leaky Bucket") {
              if (prev > 0) { allowed = true; return prev - 1; }
              return prev;
            }
            if (algo === "Fixed Window" || algo === "Sliding Window") {
              setWindowCount((wc) => {
                if (wc < LIMIT) { allowed = true; return wc + 1; }
                return wc;
              });
              return prev;
            }
            return prev;
          });
          const reqId = newT;
          setTimeout(() => {
            setRequests((prev) => [{ id: reqId, allowed, t: newT }, ...prev].slice(0, 8));
          }, 0);
        }

        return newT;
      });
    }, 600);
    return () => clearInterval(id);
  }, [algo]);

  const allowed = requests.filter((r) => r.allowed).length;
  const blocked = requests.filter((r) => !r.allowed).length;

  return (
    <div className="space-y-4">
      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ALGORITHMS.map((a) => (
          <button key={a} onClick={() => { setAlgo(a); setTokens(LIMIT); setWindowCount(0); setRequests([]); }}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
            style={{ background: algo === a ? "rgba(79,142,247,0.15)" : "var(--bg-card)", color: algo === a ? "#4f8ef7" : "var(--text-muted)", border: `1px solid ${algo === a ? "rgba(79,142,247,0.4)" : "var(--border)"}` }}>
            {a}
          </button>
        ))}
      </div>

      {/* Token/bucket display */}
      <div className="flex gap-4 justify-center items-center">
        {(algo === "Token Bucket" || algo === "Leaky Bucket") && (
          <div className="text-center">
            <div className="flex gap-1 justify-center mb-1">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <div key={i} className="w-6 h-6 rounded transition-all duration-300"
                  style={{ background: i < tokens ? "rgba(79,142,247,0.8)" : "rgba(0,0,0,0.2)", border: `1px solid ${i < tokens ? "#4f8ef7" : "var(--border)"}` }} />
              ))}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{tokens}/{LIMIT} tokens</div>
          </div>
        )}
        {(algo === "Fixed Window" || algo === "Sliding Window") && (
          <div className="text-center">
            <div className="relative w-48 h-6 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)" }}>
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${(windowCount / LIMIT) * 100}%`, background: windowCount >= LIMIT ? "#ef4444" : "#4f8ef7" }} />
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {windowCount}/{LIMIT} in window ({tick % WINDOW}/{WINDOW}s)
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 text-xs">
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: "#22c55e" }}>{allowed}</div>
            <div style={{ color: "var(--text-muted)" }}>allowed</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: "#ef4444" }}>{blocked}</div>
            <div style={{ color: "var(--text-muted)" }}>blocked</div>
          </div>
        </div>
      </div>

      {/* Request stream */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="px-4 py-2 text-xs font-semibold" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
          Request Stream
        </div>
        <div className="flex flex-wrap gap-2 p-3">
          {requests.map((r) => (
            <div key={r.id} className="px-2 py-1 rounded text-xs font-mono"
              style={{ background: r.allowed ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: r.allowed ? "#22c55e" : "#ef4444", border: `1px solid ${r.allowed ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.3)"}` }}>
              #{r.id % 100} {r.allowed ? "✓" : "✗"}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        {algo === "Token Bucket" && "Tokens refill at fixed rate. Burst allowed while tokens remain."}
        {algo === "Leaky Bucket" && "Requests processed at constant rate. Excess dropped (no burst)."}
        {algo === "Fixed Window" && "Counter resets every window. Boundary burst problem exists."}
        {algo === "Sliding Window" && "Rolling time window. Smoother than fixed but more memory."}
      </p>
    </div>
  );
}
