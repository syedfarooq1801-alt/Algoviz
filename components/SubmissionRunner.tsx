"use client";
import { useState, useRef, useEffect } from "react";
import { getProblemRunner, buildTestCode, type ProblemTestCase } from "@/data/testCases";
import { usePrepStore } from "@/lib/prepStore";

// Wandbox free C++ runner (no API key, scratchpad only)
const WANDBOX_URL = "https://wandbox.org/api/compile.json";
const PYODIDE_VERSION = "0.26.4";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<unknown>;
    __pyodide?: unknown;
    __pyodideLoading?: Promise<unknown>;
  }
}

type Lang = "python" | "cpp";
type Mode = "scratchpad" | "submit";

type TestStatus = "pending" | "running" | "pass" | "fail" | "error";
interface TestResult {
  tc: ProblemTestCase;
  status: TestStatus;
  actual?: string;
  errorMsg?: string;
  timeMs?: number;
}

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Python runtime"));
    document.head.appendChild(s);
  });
}

async function getPyodide(onProgress: (msg: string) => void): Promise<any> {
  if (typeof window === "undefined") throw new Error("Pyodide browser only");
  if (window.__pyodide) return window.__pyodide;
  if (window.__pyodideLoading) return window.__pyodideLoading;
  window.__pyodideLoading = (async () => {
    onProgress("Loading Python runtime (first run only, ~5s)…");
    if (!window.loadPyodide) await injectScript(`${PYODIDE_BASE}pyodide.js`);
    const py = await window.loadPyodide!({ indexURL: PYODIDE_BASE });
    window.__pyodide = py;
    return py;
  })();
  return window.__pyodideLoading;
}

async function runPythonCode(code: string, onProgress: (msg: string) => void): Promise<{ output: string; error?: string }> {
  const py = await getPyodide(onProgress);
  let out = "";
  py.setStdout({ batched: (s: string) => { out += s + "\n"; } });
  py.setStderr({ batched: (s: string) => { out += s + "\n"; } });
  try {
    await py.runPythonAsync(code);
    return { output: out.trim() };
  } catch (e) {
    return { output: out.trim(), error: (e as Error).message ?? String(e) };
  }
}

function normalizeJson(s: string): string {
  try { return JSON.stringify(JSON.parse(s)); } catch { return s.trim(); }
}

function StatusBadge({ status }: { status: TestStatus }) {
  const map: Record<TestStatus, { icon: string; color: string }> = {
    pending: { icon: "○", color: "var(--text-muted)" },
    running: { icon: "●", color: "var(--accent)" },
    pass:    { icon: "✓", color: "#2FBF71" },
    fail:    { icon: "✗", color: "#EF4444" },
    error:   { icon: "!", color: "#F5A524" },
  };
  const { icon, color } = map[status];
  return (
    <span className="font-mono text-sm font-bold" style={{ color }}>
      {icon}
    </span>
  );
}

interface Props {
  problemId: string;
  starterCpp?: string;
  starterPython?: string;
  defaultLang?: Lang;
}

export default function SubmissionRunner({ problemId, starterCpp, starterPython, defaultLang = "python" }: Props) {
  const runner = getProblemRunner(problemId);
  const addCodeAttempt = usePrepStore((s) => s.addCodeAttempt);
  const codeAttempts = usePrepStore((s) => s.codeAttempts).filter((a) => a.problemId === problemId).slice(0, 5);
  const hasTestCases = runner !== null;

  const getStarter = (l: Lang) =>
    l === "python"
      ? (runner?.pythonStarter ?? starterPython ?? "")
      : (starterCpp ?? "");

  const [mode, setMode] = useState<Mode>("scratchpad");
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [code, setCode] = useState(getStarter(defaultLang));
  const [stdin, setStdin] = useState("");

  // Scratchpad output
  const [scratchOutput, setScratchOutput] = useState<{ text: string; ok: boolean } | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");

  // Submit results
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customExpected, setCustomExpected] = useState("");

  // Timer
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerActive]);

  const resetTimer = () => { setElapsed(0); setTimerActive(true); };
  const toggleTimer = () => setTimerActive((v) => !v);

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const taRef = useRef<HTMLTextAreaElement>(null);

  const switchLang = (l: Lang) => {
    setLang(l);
    setCode(getStarter(l));
    setScratchOutput(null);
    setTestResults(null);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setScratchOutput(null);
  };

  // ── Scratchpad run ─────────────────────────────────────────────────────────

  const runScratchPython = async () => {
    const py = await getPyodide(setStatus);
    setStatus("");
    let out = "";
    py.setStdout({ batched: (s: string) => { out += s + "\n"; } });
    py.setStderr({ batched: (s: string) => { out += s + "\n"; } });
    try {
      if (stdin) py.runPython(`import sys, io\nsys.stdin = io.StringIO(${JSON.stringify(stdin)})`);
      await py.runPythonAsync(code);
      setScratchOutput({ text: out.trim() || "(no output)", ok: true });
    } catch (e) {
      const msg = (e as Error).message || String(e);
      setScratchOutput({ text: (out + "\n" + msg).trim(), ok: false });
    }
  };

  const runScratchCpp = async () => {
    setStatus("Compiling C++ on remote server…");
    try {
      const res = await fetch(WANDBOX_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compiler: "gcc-head", code, stdin, "compiler-option-raw": "-std=c++17" }),
      });
      const data = await res.json();
      const compileErr = data.compiler_error || "";
      const runErr = data.program_error || "";
      const progOut = data.program_output || "";
      if (/Resource temporarily unavailable|OCI runtime/.test(compileErr + runErr)) {
        setScratchOutput({ text: "C++ server busy. Python runs instantly in your browser — switch to Python, or retry in a moment.", ok: false });
        return;
      }
      const text = [compileErr, progOut, runErr].filter(Boolean).join("\n").trim() || "(no output)";
      setScratchOutput({ text, ok: data.status === "0" });
    } catch (e) {
      setScratchOutput({ text: `Cannot reach C++ server: ${(e as Error).message}. Try Python instead.`, ok: false });
    } finally {
      setStatus("");
    }
  };

  const runScratch = async () => {
    setRunning(true);
    setScratchOutput(null);
    try {
      if (lang === "python") await runScratchPython();
      else await runScratchCpp();
    } catch (e) {
      setScratchOutput({ text: `Error: ${(e as Error).message}`, ok: false });
    } finally {
      addCodeAttempt({
        problemId,
        lang,
        mode: "scratchpad",
        passed: 0,
        total: 1,
        elapsedSecs: elapsed,
        summary: "Scratchpad run",
      });
      setRunning(false);
      setStatus("");
    }
  };

  // ── Submit run ─────────────────────────────────────────────────────────────

  const runSubmit = async () => {
    if (!runner) return;
    setSubmitting(true);
    setTestResults(null);

    const extraCases: ProblemTestCase[] = customInput.trim()
      ? [{ id: "custom", label: "Custom case", input: customInput.trim(), expected: customExpected.trim() || "null" }]
      : [];
    const cases = [...runner.testCases, ...extraCases];

    // init all as pending
    const initial: TestResult[] = cases.map((tc) => ({ tc, status: "pending" }));
    setTestResults([...initial]);

    const finalResults: TestResult[] = [];
    for (let i = 0; i < cases.length; i++) {
      const tc = cases[i];
      setTestResults((prev) => prev ? prev.map((r, idx) => idx === i ? { ...r, status: "running" } : r) : null);

      const fullCode = buildTestCode(runner, code, tc.input);
      const t0 = performance.now();
      let result: TestResult;
      try {
        const { output, error } = await runPythonCode(fullCode, (msg) => {
          if (i === 0) setStatus(msg);
        });
        setStatus("");
        const timeMs = Math.round(performance.now() - t0);

        if (error && !output) {
          result = { tc, status: "error", actual: "", errorMsg: cleanPythonError(error), timeMs };
        } else {
          const actual = output.trim();
          const expected = tc.expected.trim();
          const pass = normalizeJson(actual) === normalizeJson(expected);
          result = { tc, status: pass ? "pass" : "fail", actual, timeMs };
        }
      } catch (e) {
        result = { tc, status: "error", actual: "", errorMsg: (e as Error).message };
      }

      finalResults.push(result);
      setTestResults((prev) => prev ? prev.map((r, idx) => idx === i ? result : r) : null);
    }

    const passCount = finalResults.filter((r) => r.status === "pass").length;
    addCodeAttempt({
      problemId,
      lang,
      mode: "submit",
      passed: passCount,
      total: finalResults.length,
      elapsedSecs: elapsed,
      summary: passCount === finalResults.length ? "Accepted" : `${passCount}/${finalResults.length} tests passed`,
    });
    setSubmitting(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart, end = ta.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 4; });
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      if (mode === "scratchpad") runScratch();
      else runSubmit();
    }
  };

  // Summary stats
  const passed = testResults?.filter((r) => r.status === "pass").length ?? 0;
  const total = testResults?.length ?? 0;
  const allDone = testResults ? testResults.every((r) => r.status !== "pending" && r.status !== "running") : false;
  const allPass = allDone && passed === total;

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          {/* Language pills */}
          <div className="flex items-center gap-1">
            {(["python", "cpp"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                style={{
                  background: lang === l ? "var(--accent-soft)" : "transparent",
                  color: lang === l ? "var(--accent)" : "var(--text-muted)",
                  border: lang === l ? "1px solid rgba(91,140,255,0.35)" : "1px solid transparent",
                }}
              >
                {l === "python" ? "Python" : "C++"}
              </button>
            ))}
          </div>

          {/* Mode pills — only show Submit if test cases exist for this problem */}
          {hasTestCases && (
            <div className="flex items-center gap-1 ml-2 pl-2" style={{ borderLeft: "1px solid var(--border)" }}>
              {(["scratchpad", "submit"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: mode === m ? (m === "submit" ? "rgba(47,191,113,0.15)" : "var(--bg-secondary)") : "transparent",
                    color: mode === m ? (m === "submit" ? "#2FBF71" : "var(--text-secondary)") : "var(--text-muted)",
                    border: mode === m ? `1px solid ${m === "submit" ? "rgba(47,191,113,0.3)" : "var(--border)"}` : "1px solid transparent",
                  }}
                >
                  {m === "scratchpad" ? "Run" : "Submit"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 ml-auto mr-2">
          <span
            className="font-mono text-sm tabular-nums"
            style={{ color: elapsed >= 3600 ? "#F5A524" : "var(--text-secondary)", minWidth: "3.5rem", textAlign: "right" }}
          >
            {fmtTime(elapsed)}
          </span>
          <button
            onClick={toggleTimer}
            title={timerActive ? "Pause timer" : "Resume timer"}
            className="w-5 h-5 flex items-center justify-center rounded transition-opacity hover:opacity-80"
            style={{ color: timerActive ? "#2FBF71" : "var(--text-muted)", fontSize: "10px" }}
          >
            {timerActive ? "⏸" : "▶"}
          </button>
          <button
            onClick={resetTimer}
            title="Reset timer"
            className="w-5 h-5 flex items-center justify-center rounded transition-opacity hover:opacity-80"
            style={{ color: "var(--text-muted)", fontSize: "10px" }}
          >
            ↺
          </button>
        </div>

        {/* Action button */}
        {mode === "scratchpad" ? (
          <button onClick={runScratch} disabled={running} className="btn-primary px-3.5 py-1.5 text-xs" style={{ opacity: running ? 0.6 : 1 }}>
            {running ? "Running…" : "▶ Run"}
          </button>
        ) : (
          <button
            onClick={runSubmit}
            disabled={submitting || lang !== "python"}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all"
            style={{
              background: submitting || lang !== "python" ? "var(--bg-secondary)" : "#2FBF71",
              color: submitting || lang !== "python" ? "var(--text-muted)" : "#000",
              opacity: submitting ? 0.7 : 1,
              cursor: lang !== "python" ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Running tests…" : lang !== "python" ? "Python only" : "▶ Submit"}
          </button>
        )}
      </div>

      {/* Editor */}
      <textarea
        ref={taRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        rows={Math.min(22, Math.max(8, code.split("\n").length + 1))}
        className="w-full px-4 py-3 outline-none resize-y"
        style={{
          background: "#0d0d12",
          color: "var(--text-primary)",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          lineHeight: "1.6",
          tabSize: 4,
        }}
      />

      {/* ── Scratchpad: stdin + output ──────────────────────────────────────── */}
      {mode === "scratchpad" && (
        <>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <input
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="stdin (optional)"
              className="w-full px-4 py-2 outline-none"
              style={{ background: "var(--bg-card)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "12px" }}
            />
          </div>

          {status && (
            <div className="px-4 py-2 text-xs" style={{ color: "var(--accent)", borderTop: "1px solid var(--border)" }}>
              {status}
            </div>
          )}

          {scratchOutput && (
            <div style={{ borderTop: "1px solid var(--border)" }}>
              <div className="px-4 py-1.5 text-xs font-medium" style={{ color: scratchOutput.ok ? "#2FBF71" : "#EF4444" }}>
                {scratchOutput.ok ? "● Output" : "● Error"}
              </div>
              <pre className="px-4 pb-3 m-0" style={{ background: "transparent", border: "none", borderRadius: 0, color: "var(--text-secondary)" }}>
                <code>{scratchOutput.text}</code>
              </pre>
            </div>
          )}
        </>
      )}

      {/* ── Submit: test case results ───────────────────────────────────────── */}
      {mode === "submit" && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {/* Loading runtime status */}
          {status && (
            <div className="px-4 py-2 text-xs" style={{ color: "var(--accent)" }}>
              {status}
            </div>
          )}

          {/* Not started state */}
          {!testResults && !submitting && lang === "python" && (
            <div className="px-4 py-6 text-center" style={{ color: "var(--text-muted)" }}>
              <div className="text-2xl mb-2">🧪</div>
              <p className="text-sm">Click Submit to run against {runner?.testCases.length ?? 0} test cases</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Python runs in your browser — no server needed</p>
            </div>
          )}

          {lang === "python" && (
            <div className="grid sm:grid-cols-2 gap-2 px-4 pb-4">
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder='Custom JSON input, e.g. {"nums":[1,2],"target":3}'
                rows={2}
                className="rounded-lg text-xs p-2 outline-none resize-none"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
              />
              <textarea
                value={customExpected}
                onChange={(e) => setCustomExpected(e.target.value)}
                placeholder="Expected stdout JSON"
                rows={2}
                className="rounded-lg text-xs p-2 outline-none resize-none"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
              />
            </div>
          )}

          {lang !== "python" && mode === "submit" && (
            <div className="px-4 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
              Submit mode runs Python test cases only. Switch to Python or use Run mode for C++.
            </div>
          )}

          {/* Summary bar */}
          {testResults && allDone && (
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ background: allPass ? "rgba(47,191,113,0.08)" : "rgba(239,68,68,0.08)", borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{allPass ? "🎉" : "❌"}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: allPass ? "#2FBF71" : "#EF4444" }}>
                    {allPass ? "All test cases passed!" : `${passed} / ${total} test cases passed`}
                  </div>
                  {allPass && (
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Accepted
                    </div>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(passed / total) * 100}%`, background: allPass ? "#2FBF71" : "#EF4444" }}
                />
              </div>
            </div>
          )}

          {/* Per-test rows */}
          {testResults && (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {testResults.map((r, i) => (
                <TestCaseRow key={r.tc.id} result={r} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="px-4 py-1.5 text-xs" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
        {mode === "scratchpad"
          ? "Cmd/Ctrl+Enter to run · Python runs offline via Pyodide · C++ via Wandbox"
          : "Cmd/Ctrl+Enter to submit · Python test harness runs in your browser"}
      </div>
    </div>
  );
}

// ── TestCaseRow ───────────────────────────────────────────────────────────────

function TestCaseRow({ result, index }: { result: TestResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { tc, status, actual, errorMsg, timeMs } = result;

  const canExpand = (status === "fail" || status === "error") && (actual !== undefined || errorMsg);

  return (
    <div>
      <button
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:opacity-90 transition-opacity"
        style={{ background: "transparent" }}
        onClick={() => canExpand && setExpanded((v) => !v)}
      >
        <StatusBadge status={status} />
        <span className="text-sm flex-1" style={{ color: "var(--text-secondary)" }}>
          {tc.hidden ? `Hidden test ${index + 1}` : tc.label}
        </span>
        {status === "running" && (
          <span className="text-xs animate-pulse" style={{ color: "var(--accent)" }}>running…</span>
        )}
        {timeMs !== undefined && status !== "running" && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{timeMs}ms</span>
        )}
        {canExpand && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{expanded ? "▲" : "▼"}</span>
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {status === "fail" && (
            <div className="mt-2 space-y-2">
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Input</div>
                <pre className="text-xs px-3 py-2 rounded-lg m-0" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                  <code>{tc.input}</code>
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: "#2FBF71" }}>Expected</div>
                  <pre className="text-xs px-3 py-2 rounded-lg m-0" style={{ background: "rgba(47,191,113,0.07)", color: "#2FBF71", border: "1px solid rgba(47,191,113,0.2)" }}>
                    <code>{tc.expected}</code>
                  </pre>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: "#EF4444" }}>Got</div>
                  <pre className="text-xs px-3 py-2 rounded-lg m-0" style={{ background: "rgba(239,68,68,0.07)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <code>{actual || "(no output)"}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mt-2">
              <div className="text-xs font-medium mb-1" style={{ color: "#F5A524" }}>Runtime Error</div>
              <pre className="text-xs px-3 py-2 rounded-lg m-0 overflow-auto max-h-40" style={{ background: "rgba(245,165,36,0.08)", color: "#F5A524", border: "1px solid rgba(245,165,36,0.2)" }}>
                <code>{errorMsg}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Strip Pyodide's verbose JS stack from Python tracebacks
function cleanPythonError(msg: string): string {
  const pyStart = msg.indexOf("Traceback");
  if (pyStart !== -1) return msg.slice(pyStart);
  const errLine = msg.split("\n").find((l) => /Error:/.test(l));
  return errLine ?? msg.slice(0, 600);
}
