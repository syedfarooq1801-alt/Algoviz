"use client";
import { useEffect, useState } from "react";
import { Copy, MessageCircle, Check } from "lucide-react";
import { useTutorStore } from "@/lib/tutorStore";

interface Pos { x: number; y: number; text: string }

// Select text anywhere in reading content → floating Copy / Ask Axon popover.
export default function SelectionPopover() {
  const askAbout = useTutorStore((s) => s.askAbout);
  const [pos, setPos] = useState<Pos | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? "";
      // Ignore tiny selections, or selections inside inputs/the chat panel.
      if (!sel || text.length < 4 || text.length > 600) { setPos(null); return; }
      const node = sel.anchorNode as HTMLElement | null;
      const el = node?.nodeType === 1 ? (node as HTMLElement) : node?.parentElement;
      if (el?.closest("aside, input, textarea, button")) { setPos(null); return; }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width) { setPos(null); return; }
      setCopied(false);
      setPos({ x: rect.left + rect.width / 2, y: rect.top, text });
    };
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest("[data-selpop]")) setPos(null);
    };
    const onScroll = () => setPos(null);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  if (!pos) return null;

  return (
    <div
      data-selpop
      style={{
        position: "fixed", left: pos.x, top: pos.y - 44, transform: "translateX(-50%)",
        zIndex: 90, display: "flex", gap: 2, padding: 3, borderRadius: 9,
        background: "var(--bg-elevated, var(--bg-card))", border: "1px solid var(--border)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
      }}
    >
      <button
        onClick={() => { navigator.clipboard.writeText(pos.text); setCopied(true); setTimeout(() => setPos(null), 700); }}
        style={btn}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
      </button>
      <button onClick={() => { askAbout(pos.text); setPos(null); window.getSelection()?.removeAllRanges(); }} style={{ ...btn, color: "var(--accent)" }}>
        <MessageCircle size={13} /> Ask Axon
      </button>
    </div>
  );
}

const btn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 5,
  padding: "6px 10px", borderRadius: 7, fontSize: 12, fontWeight: 600,
  background: "transparent", color: "var(--text-secondary)", border: "none", cursor: "pointer",
  whiteSpace: "nowrap",
};
