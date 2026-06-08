"use client";
import { useState } from "react";
import { PROBLEM_CONTENT } from "@/data/problemContent";

interface Props {
  problemId: string;
}

export default function CodeExplanationPanel({ problemId }: Props) {
  const content = PROBLEM_CONTENT[problemId];
  const [copied, setCopied] = useState(false);
  const [codeTab, setCodeTab] = useState<"cpp">("cpp");

  if (!content) {
    return (
      <div className="rounded-xl p-6 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-2xl mb-2">🚧</div>
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>Code explanation coming soon for this problem.</div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content.cppSolution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">

      {/* Intuition */}
      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">💡</span>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Intuition</h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.intuition}</p>
      </div>

      {/* Approach */}
      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🗺️</span>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Step-by-Step Approach</h3>
        </div>
        <ol className="space-y-2">
          {content.approach.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "rgba(79,142,247,0.2)", color: "#4f8ef7" }}>
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Code */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>C++ Solution</span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>
              Optimal
            </span>
          </div>
          <button onClick={handleCopy}
            className="text-xs px-3 py-1 rounded-lg transition-all"
            style={{
              background: copied ? "rgba(34,197,94,0.15)" : "var(--bg-hover)",
              color: copied ? "#22c55e" : "var(--text-muted)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
            }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono"
          style={{ background: "rgba(0,0,0,0.3)", color: "#e2e8f0", margin: 0 }}>
          <code>{content.cppSolution}</code>
        </pre>
      </div>

      {/* Complexity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>⏱ Time Complexity</div>
          <div className="text-lg font-bold font-mono mb-1" style={{ color: "#4f8ef7" }}>{content.timeComplexity}</div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.timeExplanation}</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>🧠 Space Complexity</div>
          <div className="text-lg font-bold font-mono mb-1" style={{ color: "#a855f7" }}>{content.spaceComplexity}</div>
          <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.spaceExplanation}</div>
        </div>
      </div>

      {/* Edge Cases */}
      {content.edgeCases && content.edgeCases.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">⚠️</span>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Edge Cases</h3>
          </div>
          <ul className="space-y-2">
            {content.edgeCases.map((ec, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "#f97316" }}>•</span>
                <span className="leading-relaxed">{ec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Memory Trick */}
      {content.memoryTrick && (
        <div className="rounded-xl p-4" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.25)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🧩</span>
            <h3 className="text-sm font-semibold" style={{ color: "#a855f7" }}>Memory Trick</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.memoryTrick}</p>
        </div>
      )}

      {/* Why it works */}
      {content.whyItWorks && (
        <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔍</span>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Why It Works</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.whyItWorks}</p>
        </div>
      )}

      {/* Common Mistakes */}
      {content.commonMistakes && content.commonMistakes.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🚫</span>
            <h3 className="text-sm font-semibold" style={{ color: "#ef4444" }}>Common Mistakes</h3>
          </div>
          <ul className="space-y-2">
            {content.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "#ef4444" }}>✗</span>
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alternative Approaches */}
      {content.alternativeApproaches && content.alternativeApproaches.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔄</span>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Alternative Approaches</h3>
          </div>
          <ul className="space-y-2">
            {content.alternativeApproaches.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "#22c55e" }}>→</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
