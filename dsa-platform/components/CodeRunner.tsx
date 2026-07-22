"use client";
import { useState, useRef } from "react";
import { getPyodide } from "@/lib/pyodide";

interface Props {
  starterCpp?: string;
  starterPython?: string;
  defaultLang?: "python" | "cpp";
}

// Wandbox is a free, no-key C++ runner. It can be flaky under load — we fall back gracefully.
const WANDBOX_URL = "https://wandbox.org/api/compile.json";

type Lang = "python" | "cpp";

export default function CodeRunner({ starterCpp, starterPython, defaultLang = "python" }: Props) {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [code, setCode] = useState(defaultLang === "python" ? (starterPython ?? "") : (starterCpp ?? ""));
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState<{ text: string; ok: boolean } | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const switchLang = (l: Lang) => {
    setLang(l);
    setCode(l === "python" ? (starterPython ?? "") : (starterCpp ?? ""));
    setOutput(null);
  };

  const runPython = async () => {
    const py = await getPyodide(setStatus);
    setStatus("");
    let out = "";
    py.setStdout({ batched: (s: string) => { out += s + "\n"; } });
    py.setStderr({ batched: (s: string) => { out += s + "\n"; } });
    try {
      if (stdin) py.runPython(`import sys, io\nsys.stdin = io.StringIO(${JSON.stringify(stdin)})`);
      await py.runPythonAsync(code);
      setOutput({ text: out.trim() || "(no output)", ok: true });
    } catch (e) {
      const msg = (e as Error).message || String(e);
      // Pyodide wraps the Python traceback in the error message
      setOutput({ text: (out + "\n" + msg).trim(), ok: false });
    }
  };

  const runCpp = async () => {
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
      if (data.status !== "0" && (compileErr || /Resource temporarily unavailable/.test(progOut + runErr))) {
        if (/Resource temporarily unavailable|OCI runtime/.test(compileErr + runErr)) {
          setOutput({ text: "The free C++ server is busy right now. Python runs instantly in your browser — switch to Python, or retry C++ in a moment.", ok: false });
          return;
        }
      }
      const text = [compileErr, progOut, runErr].filter(Boolean).join("\n").trim() || "(no output)";
      setOutput({ text, ok: data.status === "0" });
    } catch (e) {
      setOutput({ text: `Could not reach the C++ server: ${(e as Error).message}. Python runs offline in your browser — try Python instead.`, ok: false });
    } finally {
      setStatus("");
    }
  };

  const run = async () => {
    setRunning(true);
    setOutput(null);
    try {
      if (lang === "python") await runPython();
      else await runCpp();
    } catch (e) {
      setOutput({ text: `Error: ${(e as Error).message}`, ok: false });
    } finally {
      setRunning(false);
      setStatus("");
    }
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
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") run();
  };

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
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
          {lang === "python" && <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>runs in your browser</span>}
        </div>
        <button onClick={run} disabled={running} className="btn-primary px-3.5 py-1.5 text-xs" style={{ opacity: running ? 0.6 : 1 }}>
          {running ? "Running…" : "▶ Run"}
        </button>
      </div>

      {/* Editor */}
      <textarea
        ref={taRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        rows={Math.min(20, Math.max(8, code.split("\n").length + 1))}
        className="w-full px-4 py-3 outline-none resize-y"
        style={{ background: "#0d0d12", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "13px", lineHeight: "1.6", tabSize: 4 }}
      />

      {/* stdin */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <input
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="stdin (optional)"
          className="w-full px-4 py-2 outline-none"
          style={{ background: "var(--bg-card)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "12px" }}
        />
      </div>

      {/* Status while loading runtime */}
      {status && (
        <div className="px-4 py-2 text-xs" style={{ color: "var(--accent)", borderTop: "1px solid var(--border)" }}>{status}</div>
      )}

      {/* Output */}
      {output && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <div className="px-4 py-1.5 text-xs font-medium" style={{ color: output.ok ? "var(--accent-green)" : "var(--accent-red)" }}>
            {output.ok ? "● Output" : "● Error"}
          </div>
          <pre className="px-4 pb-3 m-0" style={{ background: "transparent", border: "none", borderRadius: 0, color: "var(--text-secondary)" }}>
            <code>{output.text}</code>
          </pre>
        </div>
      )}

      <div className="px-4 py-1.5 text-xs" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
        Cmd/Ctrl + Enter to run · Python runs offline via Pyodide · C++ via Wandbox
      </div>
    </div>
  );
}
