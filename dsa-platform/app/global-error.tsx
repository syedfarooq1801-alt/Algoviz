"use client";
import { useEffect } from "react";
import { logError } from "@/lib/logger";

// Root error boundary — catches errors in the root layout itself.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logError(error, { digest: error.digest, boundary: "global" });
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0B0D10", color: "#E6EDF3", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <div style={{ fontSize: 34, marginBottom: 12 }}>⚠️</div>
            <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>The app crashed</h1>
            <p style={{ fontSize: 13, color: "#9aa7b4", marginBottom: 20 }}>An unexpected error occurred. Please reload.</p>
            <button onClick={reset} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "#4F8CFF", color: "#fff", border: "none", cursor: "pointer" }}>
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
