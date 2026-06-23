"use client";
import { useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { generateStudyPlan } from "@/lib/studyPlan";
import { useProgressStore } from "@/lib/store";

type Target = { href: string; label: string } | null;

// useSearchParams must sit under a Suspense boundary for static rendering.
export default function NextNav(props: { currentHref: string; fallback?: Target }) {
  return (
    <Suspense fallback={null}>
      <NextNavInner {...props} />
    </Suspense>
  );
}

/**
 * Bottom "Next" button with context-aware destination.
 * - Opened from the Study Plan (?src=plan): goes to the next task in the plan
 *   sequence (across domains), carrying ?src=plan so the chain continues.
 * - Opened from anywhere else: goes to `fallback` (the next item in that
 *   domain's own sheet).
 */
function NextNavInner({
  currentHref,
  fallback = null,
}: {
  currentHref: string;
  fallback?: Target;
}) {
  const params = useSearchParams();
  const fromPlan = params.get("src") === "plan";
  const { studyPlanDuration, planStartDate } = useProgressStore();

  const planTarget = useMemo<Target>(() => {
    if (!fromPlan) return null;
    const start = planStartDate || new Date().toISOString().slice(0, 10);
    const plan = generateStudyPlan(studyPlanDuration, start);
    const tasks = plan.days.flatMap((d) => d.tasks);
    const idx = tasks.findIndex((t) => t.href === currentHref);
    if (idx < 0 || idx + 1 >= tasks.length) return null;
    const n = tasks[idx + 1];
    return { href: n.href, label: n.title };
  }, [fromPlan, planStartDate, studyPlanDuration, currentHref]);

  const target = planTarget ?? fallback;
  if (!target) return null;

  // Continue the plan chain when navigating within the plan.
  const href = fromPlan && planTarget
    ? appendSrc(target.href, "plan")
    : target.href;

  return (
    <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "flex-end" }}>
      <Link
        href={href}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: "var(--accent)", color: "#fff", textDecoration: "none",
          maxWidth: "100%",
        }}
      >
        <span style={{ opacity: 0.85, fontWeight: 400 }}>{fromPlan && planTarget ? "Next in plan" : "Next"}</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{target.label}</span>
        <span>→</span>
      </Link>
    </div>
  );
}

// Insert ?src=... before any #hash in the href.
function appendSrc(href: string, src: string): string {
  const hashIdx = href.indexOf("#");
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : "";
  const base = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}src=${src}${hash}`;
}
