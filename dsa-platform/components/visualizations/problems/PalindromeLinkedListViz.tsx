"use client";
import { useState, useEffect, useRef } from "react";

const LIST = [1, 2, 3, 2, 1];

type Phase = "find-middle" | "reverse" | "compare" | "done";

interface AlgoState {
  phase: Phase;
  slow: number;
  fast: number;
  // reverse phase
  prev: number | null;
  curr: number | null;
  revList: (number | null)[];
  // compare phase
  p1: number;
  p2: number;
  matches: boolean[];
  isPalindrome: boolean | null;
}

function buildInitialState(): AlgoState {
  return {
    phase: "find-middle",
    slow: 0,
    fast: 0,
    prev: null,
    curr: 0,
    revList: LIST.map(() => null),
    p1: 0,
    p2: 0,
    matches: [],
    isPalindrome: null,
  };
}

export default function PalindromeLinkedListViz() {
  const [phase, setPhase] = useState<Phase>("find-middle");
  const [slow, setSlow] = useState(0);
  const [fast, setFast] = useState(0);
  const [revList, setRevList] = useState<(number | null)[]>(LIST.map(() => null));
  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);
  const [matches, setMatches] = useState<boolean[]>([]);
  const [isPalindrome, setIsPalindrome] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — Phase 1: find middle using slow/fast pointers");
  const stateRef = useRef<AlgoState>(buildInitialState());
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    const s = buildInitialState();
    stateRef.current = s;
    setPhase(s.phase);
    setSlow(s.slow);
    setFast(s.fast);
    setRevList(s.revList);
    setP1(s.p1);
    setP2(s.p2);
    setMatches(s.matches);
    setIsPalindrome(null);
    setPlaying(false);
    setMsg("Phase 1: find middle using slow/fast pointers");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;

    if (st.phase === "find-middle") {
      const ns = st.slow + 1;
      const nf = st.fast + 2;
      if (nf >= LIST.length) {
        // slow is now at middle; start reverse from slow
        const mid = ns <= LIST.length ? ns : st.slow;
        const actualMid = nf >= LIST.length ? st.slow + 1 : st.slow;
        // For odd length: fast goes past end after 2 hops, slow is at (n-1)/2
        // We'll start reversing from slow+1
        const startRev = st.slow + 1;
        const newRev = LIST.map(() => null) as (number | null)[];
        stateRef.current = {
          ...st,
          phase: "reverse",
          slow: st.slow,
          fast: Math.min(nf, LIST.length - 1),
          prev: null,
          curr: startRev,
          revList: newRev,
          p1: 0,
          p2: startRev,
        };
        setPhase("reverse");
        setSlow(st.slow);
        setFast(Math.min(nf, LIST.length - 1));
        setRevList(newRev);
        setMsg(`Middle found at index ${st.slow}. Phase 2: reverse second half starting at index ${startRev}`);
        return;
      }
      stateRef.current = { ...st, slow: ns, fast: nf };
      setSlow(ns);
      setFast(nf);
      setMsg(`slow → ${ns} (val=${LIST[ns] ?? "null"}), fast → ${nf} (val=${LIST[nf] ?? "null"})`);
      return;
    }

    if (st.phase === "reverse") {
      const curr = st.curr;
      if (curr === null || curr >= LIST.length) {
        // done reversing, start compare
        stateRef.current = { ...st, phase: "compare", p1: 0, p2: st.slow };
        setPhase("compare");
        setP1(0);
        setP2(st.slow);
        setMsg(`Phase 3: compare first half with reversed second half`);
        return;
      }
      // Build reversed second half in-place into revList
      const newRev = [...st.revList];
      // We insert at mirror position: from end going back
      const insertAt = LIST.length - 1 - (curr - (st.slow + 1));
      newRev[insertAt] = LIST[curr];
      stateRef.current = { ...st, curr: curr + 1, revList: newRev };
      setRevList([...newRev]);
      setMsg(`Reversing: placed LIST[${curr}]=${LIST[curr]} → reversed position ${insertAt}`);
      return;
    }

    if (st.phase === "compare") {
      const { p1: a, p2: b } = st;
      if (a >= b || b >= LIST.length) {
        // done comparing
        const allMatch = st.matches.every(Boolean);
        stateRef.current = { ...st, phase: "done", isPalindrome: allMatch };
        setPhase("done");
        setIsPalindrome(allMatch);
        setPlaying(false);
        setMsg(allMatch ? "All pairs matched — PALINDROME!" : "Mismatch found — NOT PALINDROME");
        return;
      }
      const match = LIST[a] === LIST[b];
      const nm = [...st.matches, match];
      stateRef.current = { ...st, p1: a + 1, p2: b - 1, matches: nm };
      setP1(a + 1);
      setP2(b - 1);
      setMatches([...nm]);
      setMsg(`Compare [${a}]=${LIST[a]} vs [${b}]=${LIST[b]} → ${match ? "MATCH" : "MISMATCH"}`);
      return;
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const done = phase === "done";

  const phaseColors: Record<Phase, string> = {
    "find-middle": "#4f8ef7",
    "reverse": "#f97316",
    "compare": "#a855f7",
    "done": "#22c55e",
  };
  const phaseLabels: Record<Phase, string> = {
    "find-middle": "Phase 1: Find Middle",
    "reverse": "Phase 2: Reverse Half",
    "compare": "Phase 3: Compare",
    "done": "Done",
  };

  // For compare phase: which pairs have been compared
  const comparedPairs: Array<{ a: number; b: number; match: boolean }> = matches.map((m, i) => ({
    a: i,
    b: LIST.length - 1 - i,
    match: m,
  }));

  const getNodeColor = (i: number) => {
    if (phase === "find-middle") {
      if (i === slow && i === fast) return { bg: "rgba(168,85,247,0.3)", border: "#a855f7", text: "#a855f7" };
      if (i === slow) return { bg: "rgba(249,115,22,0.25)", border: "#f97316", text: "#f97316" };
      if (i === fast) return { bg: "rgba(79,142,247,0.25)", border: "#4f8ef7", text: "#4f8ef7" };
    }
    if (phase === "compare" || phase === "done") {
      // find if this index is currently being compared
      const currA = stateRef.current.p1;
      const currB = stateRef.current.p2;
      if (phase === "compare" && (i === currA || i === currB)) {
        return { bg: "rgba(168,85,247,0.25)", border: "#a855f7", text: "#a855f7" };
      }
      const pair = comparedPairs.find(p => p.a === i || p.b === i);
      if (pair) {
        return pair.match
          ? { bg: "rgba(34,197,94,0.2)", border: "#22c55e", text: "#22c55e" }
          : { bg: "rgba(239,68,68,0.2)", border: "#ef4444", text: "#ef4444" };
      }
    }
    return { bg: "var(--bg-hover)", border: "var(--border)", text: "var(--text-secondary)" };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Palindrome Linked List — Three Phase Detection
        </h3>
        <div className="flex gap-2 flex-wrap items-center mb-2">
          <button
            onClick={() => setPlaying(!playing)}
            disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done || playing} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={reset} className="px-3 py-1.5 rounded text-xs" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "80px", accentColor: "#4f8ef7" }} />
          <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: `${phaseColors[phase]}18`, color: phaseColors[phase], border: `1px solid ${phaseColors[phase]}40` }}>
            {phaseLabels[phase]}
          </span>
        </div>
      </div>

      {/* Main list visualization */}
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
          List: [1, 2, 3, 2, 1]
        </div>
        <div className="flex items-center gap-1">
          {LIST.map((v, i) => {
            const c = getNodeColor(i);
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold font-mono transition-all duration-300"
                    style={{ background: c.bg, border: `2px solid ${c.border}`, color: c.text }}
                  >
                    {v}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)", fontSize: "9px" }}>
                    [{i}]
                  </div>
                </div>
                {i < LIST.length - 1 && (
                  <div style={{ width: 20, height: 2, background: "rgba(79,142,247,0.3)", margin: "0 2px 14px 2px" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Pointer labels */}
        {phase === "find-middle" && (
          <div className="mt-3 flex gap-4 text-xs">
            <span style={{ color: "#f97316" }}>■ slow (index {slow})</span>
            <span style={{ color: "#4f8ef7" }}>■ fast (index {fast})</span>
          </div>
        )}

        {(phase === "compare" || phase === "done") && (
          <div className="mt-3 flex gap-4 text-xs">
            <span style={{ color: "#22c55e" }}>■ matched pair</span>
            <span style={{ color: "#ef4444" }}>■ mismatched pair</span>
            <span style={{ color: "#a855f7" }}>■ comparing now</span>
          </div>
        )}
      </div>

      {/* Reversed second half display */}
      {(phase === "reverse" || phase === "compare" || phase === "done") && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "#f97316" }}>
            Reversed second half (built during phase 2)
          </div>
          <div className="flex items-center gap-1">
            {revList.map((v, i) => (
              <div key={i} className="flex items-center">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
                  style={{
                    background: v !== null ? "rgba(249,115,22,0.2)" : "var(--bg-hover)",
                    border: v !== null ? "2px solid #f97316" : "1px dashed var(--border)",
                    color: v !== null ? "#f97316" : "var(--text-muted)",
                  }}
                >
                  {v !== null ? v : "?"}
                </div>
                {i < revList.length - 1 && (
                  <div style={{ width: 20, height: 2, background: "rgba(249,115,22,0.25)", margin: "0 2px" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison pairs */}
      {comparedPairs.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "#a855f7" }}>Compared pairs</div>
          <div className="flex flex-wrap gap-2">
            {comparedPairs.map((p, i) => (
              <div
                key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-mono"
                style={{
                  background: p.match ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                  border: `1px solid ${p.match ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
                  color: p.match ? "#22c55e" : "#ef4444",
                }}
              >
                [{p.a}]={LIST[p.a]} vs [{p.b}]={LIST[p.b]} {p.match ? "✓" : "✗"}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)" }}>
        {msg}
      </div>

      {isPalindrome !== null && (
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: isPalindrome ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${isPalindrome ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
          }}
        >
          <div className="font-bold text-base" style={{ color: isPalindrome ? "#22c55e" : "#ef4444" }}>
            {isPalindrome ? "PALINDROME" : "NOT PALINDROME"}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            [1, 2, 3, 2, 1] {isPalindrome ? "reads the same forwards and backwards" : "does not read the same forwards and backwards"}
          </div>
        </div>
      )}
    </div>
  );
}
