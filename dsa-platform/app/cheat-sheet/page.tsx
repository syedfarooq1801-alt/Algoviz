"use client";
import { useMobile } from "@/lib/useMobile";

/* Last-glance interview reference. Printable: hit Print → save as PDF. */

const COMPLEXITY: [string, string, string][] = [
  ["Hash map / set lookup", "O(1) avg", "O(n) build"],
  ["Binary search (sorted)", "O(log n)", "O(1)"],
  ["Two pointers / sliding window", "O(n)", "O(1)"],
  ["Sort", "O(n log n)", "O(n) / O(log n)"],
  ["Heap push / pop", "O(log n)", "O(n) heap"],
  ["BFS / DFS (graph)", "O(V + E)", "O(V)"],
  ["Dijkstra (heap)", "O(E log V)", "O(V)"],
  ["DP (2D table)", "O(n·m)", "O(n·m) → O(m)"],
  ["Backtracking (subsets)", "O(2ⁿ)", "O(n) depth"],
  ["Trie insert / search", "O(L) word len", "O(Σ·N)"],
];

const TRIGGERS: [string, string][] = [
  ["Sorted array + find pair / target", "Two pointers"],
  ["Contiguous subarray + sum/condition", "Sliding window (positive) / Prefix sum (any)"],
  ["Subarray sum = k, negatives allowed", "Prefix sum + hash map ({0:1} seed)"],
  ["Top-k / k-th largest / streaming median", "Heap (or two heaps)"],
  ["Next greater / smaller element", "Monotonic stack"],
  ["Range sum, static array, many queries", "Prefix sum array"],
  ["Find/count in rotated or monotonic space", "Binary search on answer"],
  ["All combinations / permutations / subsets", "Backtracking"],
  ["Grid / connected components / shortest path", "BFS / DFS / Union-Find"],
  ["Dependency order / cycle in directed graph", "Topological sort (Kahn / DFS)"],
  ["Overlapping intervals", "Sort by start, merge / sweep"],
  ["Optimal substructure + overlapping subproblems", "Dynamic programming"],
  ["Prefix/word lookup, autocomplete", "Trie"],
  ["Detect cycle in linked list / find duplicate", "Floyd's slow-fast"],
];

const SE_ONELINERS: [string, string][] = [
  ["ACID", "Atomicity (all-or-nothing), Consistency (valid state), Isolation (concurrent txns don't interfere), Durability (committed survives crash)."],
  ["CAP theorem", "On network partition pick Consistency OR Availability — can't have both. CP: refuse stale reads. AP: serve possibly stale."],
  ["TCP vs UDP", "TCP: reliable, ordered, connection, slower (handshake + ACKs). UDP: fire-and-forget, no order/guarantee, fast (DNS, video, games)."],
  ["Normalization", "1NF atomic cols, 2NF no partial dependency on part of key, 3NF no transitive dependency. Denormalize for read speed."],
  ["Index", "B-tree on a column → O(log n) lookup, skips full scan. Costs write speed + space. Composite index: leftmost-prefix rule."],
  ["Process vs Thread", "Process: own memory space, isolated, heavy. Thread: shares process memory, light, but needs locks for shared data."],
  ["Deadlock 4 conditions", "Mutual exclusion + Hold-and-wait + No preemption + Circular wait. Break any one to prevent."],
  ["Mutex vs Semaphore", "Mutex: ownership, one holder, lock/unlock by same thread. Semaphore: counter, signals across threads, no ownership."],
  ["Virtual memory / paging", "Each process sees contiguous virtual addresses; MMU maps pages to physical frames. Page fault → load from disk."],
  ["HTTP vs HTTPS", "HTTPS = HTTP over TLS. TLS 1.3: 1-RTT handshake, cert verifies server identity, symmetric key encrypts the session."],
  ["REST vs gRPC vs GraphQL", "REST: resource URLs, JSON, simple. gRPC: binary HTTP/2, fast, typed (internal). GraphQL: client picks fields, one endpoint."],
  ["Polymorphism", "One interface, many implementations. Compile-time (overloading) vs runtime (virtual/override via vtable)."],
];

const SD_CHECKLIST: string[] = [
  "1. Clarify — functional + non-functional reqs. Never assume DAU, QPS, read:write ratio, data size.",
  "2. Estimate — back-of-envelope: QPS, storage/5yr, bandwidth, cache size. Show the math.",
  "3. API + data model — define endpoints and schema before drawing boxes.",
  "4. High-level — client → CDN → LB → service → cache → DB. Draw it.",
  "5. Deep-dive — the 1-2 hard parts: sharding key, cache strategy, consistency, hot-spots.",
  "6. Scale — bottlenecks: DB (replicate/shard), stateless services (h-scale), cache, async via queue.",
  "7. Trade-offs — SQL vs NoSQL, strong vs eventual, push vs pull. State WHY for each pick.",
];

function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent: string }) {
  return (
    <section style={{ marginBottom: 22, breakInside: "avoid" }}>
      <h2 style={{
        fontSize: 13, fontWeight: 700, margin: "0 0 10px", color: "var(--text-primary)",
        borderLeft: `3px solid ${accent}`, paddingLeft: 8, letterSpacing: "-0.01em",
      }}>{title}</h2>
      {children}
    </section>
  );
}

export default function CheatSheetPage() {
  const isMobile = useMobile();
  const cell: React.CSSProperties = {
    fontSize: 11.5, padding: "5px 8px", borderBottom: "1px solid var(--border-subtle)",
    color: "var(--text-secondary)", verticalAlign: "top",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <style>{`@media print {
        .no-print { display: none !important; }
        body { background: #fff !important; }
      }`}</style>
      <main style={{ maxWidth: 880, margin: "0 auto", padding: isMobile ? "20px 14px 80px" : "28px 24px 60px" }}>

        <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
              Interview Cheat-Sheet
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0" }}>
              Last glance before you walk in. Print → save as PDF for offline.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            style={{
              fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 7,
              background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer",
            }}
          >Print / PDF</button>
        </div>

        <Section title="Complexity — know these cold" accent="#4F8CFF">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...cell, textAlign: "left", fontWeight: 600, color: "var(--text-muted)", fontSize: 10 }}>Operation</th>
                <th style={{ ...cell, textAlign: "left", fontWeight: 600, color: "var(--text-muted)", fontSize: 10 }}>Time</th>
                <th style={{ ...cell, textAlign: "left", fontWeight: 600, color: "var(--text-muted)", fontSize: 10 }}>Space</th>
              </tr>
            </thead>
            <tbody>
              {COMPLEXITY.map(([op, t, s]) => (
                <tr key={op}>
                  <td style={{ ...cell, color: "var(--text-primary)" }}>{op}</td>
                  <td style={{ ...cell, fontFamily: "var(--font-mono)" }}>{t}</td>
                  <td style={{ ...cell, fontFamily: "var(--font-mono)" }}>{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Pattern triggers — see X → reach for Y" accent="#06b6d4">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {TRIGGERS.map(([sig, pat]) => (
                <tr key={sig}>
                  <td style={{ ...cell, color: "var(--text-primary)", width: "55%" }}>{sig}</td>
                  <td style={{ ...cell, fontWeight: 600, color: "#06b6d4" }}>{pat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="SE / CS fundamentals — one-liners" accent="#F5A524">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SE_ONELINERS.map(([term, def]) => (
              <div key={term} style={{ fontSize: 11.5, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 700, color: "#F5A524" }}>{term}: </span>
                <span style={{ color: "var(--text-secondary)" }}>{def}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="System design — 45-minute checklist" accent="#2FBF71">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {SD_CHECKLIST.map((step) => (
              <div key={step} style={{ fontSize: 11.5, lineHeight: 1.5, color: "var(--text-secondary)" }}>{step}</div>
            ))}
          </div>
        </Section>

      </main>
    </div>
  );
}
