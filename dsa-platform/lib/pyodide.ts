"use client";
// Shared Pyodide singleton — loads once, cached on window for the session.

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<unknown>;
    __pyodide?: unknown;
    __pyodideLoading?: Promise<unknown>;
  }
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

export async function getPyodide(onProgress?: (msg: string) => void): Promise<any> {
  if (typeof window === "undefined") throw new Error("Pyodide only runs in browser");
  if (window.__pyodide) return window.__pyodide;
  if (window.__pyodideLoading) return window.__pyodideLoading;
  window.__pyodideLoading = (async () => {
    onProgress?.("Loading Python runtime (first run only, ~5s)…");
    if (!window.loadPyodide) await injectScript(`${PYODIDE_BASE}pyodide.js`);
    const py = await window.loadPyodide!({ indexURL: PYODIDE_BASE });
    window.__pyodide = py;
    return py;
  })();
  return window.__pyodideLoading;
}

export async function runPython(
  code: string,
  onProgress?: (msg: string) => void
): Promise<{ output: string; error?: string }> {
  const py = await getPyodide(onProgress);
  let out = "";
  py.setStdout({ batched: (s: string) => { out += s + "\n"; } });
  py.setStderr({ batched: (s: string) => { out += s + "\n"; } });
  try {
    await py.runPythonAsync(code);
    return { output: out.trim() };
  } catch (e) {
    const msg = (e as Error).message ?? String(e);
    return { output: out.trim(), error: msg };
  }
}
