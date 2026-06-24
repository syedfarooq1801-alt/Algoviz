"use client";
import { useState } from "react";

interface TrieNode { children: Map<string, TrieNode>; counts: Map<string, number> }

function makeNode(): TrieNode { return { children: new Map(), counts: new Map() }; }

function insertTrie(root: TrieNode, s: string, cnt: number) {
  let node = root;
  for (const c of s) {
    if (!node.children.has(c)) node.children.set(c, makeNode());
    node = node.children.get(c)!;
    node.counts.set(s, (node.counts.get(s) ?? 0) + cnt);
  }
}

function queryTrie(node: TrieNode | null): [string, number][] {
  if (!node) return [];
  const all: [string, number][] = [...node.counts.entries()];
  return all.sort((a, b) => b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0])).slice(0, 3);
}

const HISTORY: [string, number][] = [
  ["i love you", 5], ["island", 3], ["iroman", 2],
  ["i love leetcode", 2], ["i love you", 1],
];

export default function DesignSearchAutocompleteViz() {
  const [root] = useState<TrieNode>(() => {
    const r = makeNode();
    HISTORY.forEach(([s, c]) => insertTrie(r, s, c));
    return r;
  });
  const [prefix, setPrefix] = useState("");
  const [history, setHistory] = useState<[string, number][]>([...HISTORY]);
  const [log, setLog] = useState<string[]>([]);

  const handleInput = (c: string) => {
    if (c === "#") {
      if (prefix === "") return;
      insertTrie(root, prefix, 1);
      const existing = history.find(h => h[0] === prefix);
      if (existing) existing[1]++;
      else history.push([prefix, 1]);
      setHistory([...history]);
      setLog(l => [...l, `'#' → saved "${prefix}" (count++). Prefix reset.`]);
      setPrefix("");
      return;
    }
    const newPrefix = prefix + c;
    setPrefix(newPrefix);
    let node = root;
    for (const ch of newPrefix) {
      if (!node.children.has(ch)) { node = makeNode(); break; }
      node = node.children.get(ch)!;
    }
    const results = queryTrie(node);
    setLog(l => [...l, `input('${c}') prefix="${newPrefix}" → [${results.map(r => `"${r[0]}"(${r[1]})`).join(", ")}]`]);
  };

  let curNode: TrieNode | null = root;
  for (const c of prefix) {
    curNode = curNode?.children.get(c) ?? null;
  }
  const suggestions = queryTrie(curNode);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Design Search Autocomplete</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Trie where each node caches (sentence→count). Navigate prefix path, return top-3 by count desc / lex asc. '#' saves.
        </div>
      </div>

      {/* Input buttons */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Type characters:</div>
        <div className="flex flex-wrap gap-1 mb-3">
          {"i love lc#".split("").map((c, i) => (
            <button key={i} onClick={() => handleInput(c)} className="px-2 py-1.5 rounded text-xs font-mono font-bold"
              style={{ background: c === "#" ? "rgba(239,68,68,0.15)" : "rgba(79,142,247,0.12)", color: c === "#" ? "#ef4444" : "#4f8ef7", border: `1px solid ${c === "#" ? "rgba(239,68,68,0.3)" : "rgba(79,142,247,0.3)"}` }}>
              {c === " " ? "⎵" : c}
            </button>
          ))}
          <button onClick={() => setPrefix(p => p.slice(0, -1))} className="px-2 py-1.5 rounded text-xs"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>⌫</button>
          <button onClick={() => { setPrefix(""); setLog([]); }} className="px-2 py-1.5 rounded text-xs"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>↺</button>
        </div>

        {/* Search bar */}
        <div className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}>
          <span className="text-sm" style={{ color: "#4f8ef7" }}>🔍</span>
          <span className="text-sm font-mono" style={{ color: "var(--text-primary)" }}>{prefix || <span style={{ color: "var(--text-muted)" }}>type something...</span>}</span>
        </div>
      </div>

      {/* Autocomplete dropdown */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Top-3 suggestions (freq desc, lex asc):</div>
        {suggestions.length === 0 ? (
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>No matches for "{prefix}"</div>
        ) : (
          <div className="space-y-1">
            {suggestions.map(([s, cnt], i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: i === 0 ? "rgba(79,142,247,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(79,142,247,0.3)" : "transparent"}` }}>
                <span className="text-sm font-mono">
                  <span style={{ color: "#4f8ef7", fontWeight: "bold" }}>{s.slice(0, prefix.length)}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{s.slice(prefix.length)}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>×{cnt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Operation log</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {log.slice(-5).map((l, i) => <div key={i} className="text-xs font-mono" style={{ color: i === Math.min(4, log.length - 1) ? "#4f8ef7" : "var(--text-muted)" }}>{l}</div>)}
          {log.length === 0 && <div className="text-xs" style={{ color: "var(--text-muted)" }}>Click characters above to see results</div>}
        </div>
      </div>
    </div>
  );
}
