"use client";
import { useEffect } from "react";
import { logError } from "@/lib/logger";

// Route-segment error boundary — catches render/runtime errors in pages.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logError(error, { digest: error.digest, boundary: "segment" });
  }, [error]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 34, marginBottom: 12 }}>⚠️</div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
          This page hit an unexpected error. You can retry or head back.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={reset} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer" }}>
            Try again
          </button>
          <a href="/" style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)", textDecoration: "none" }}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
