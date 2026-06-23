"use client";
import { ChevronRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useSidebarStore } from "@/lib/sidebarStore";

// Grid wrapper that reacts to the collapsible sidebar. When collapsed, the
// sidebar column shrinks to 0 and a reopen tab appears on the left edge.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed, toggle } = useSidebarStore();
  return (
    <div className="lg:grid min-h-screen" style={{ gridTemplateColumns: collapsed ? "0px 1fr" : "220px 1fr" }}>
      <Sidebar />
      <div className="pb-16 lg:pb-0 min-h-screen">{children}</div>

      {collapsed && (
        <button
          onClick={toggle}
          aria-label="Show sidebar"
          className="hidden lg:flex"
          style={{
            position: "fixed", left: 0, top: "50%", transform: "translateY(-50%)", zIndex: 40,
            width: 26, height: 46, alignItems: "center", justifyContent: "center",
            borderRadius: "0 10px 10px 0", border: "1px solid var(--border)", borderLeft: "none",
            background: "var(--bg-card)", color: "var(--text-secondary)", cursor: "pointer",
            boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
