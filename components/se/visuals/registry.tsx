"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Lazy-loaded so each visual is code-split and only fetched when its chapter opens.
const load = (imp: () => Promise<{ default: ComponentType }>) => dynamic(imp, { ssr: false, loading: () => <div className="text-xs" style={{ color: "var(--text-muted)" }}>Loading visual…</div> });

// key: `${subjectId}/${chapterId}`
const REGISTRY: Record<string, ComponentType> = {
  // Operating Systems
  "operating-systems/processes-states-the-pcb-context-switching": load(() => import("./ProcessStateViz")),
  "operating-systems/threads-multithreading-models": load(() => import("./ThreadModelViz")),
  "operating-systems/cpu-scheduling-algorithms": load(() => import("./SchedulingGanttViz")),
  "operating-systems/process-synchronization": load(() => import("./MutexViz")),
  "operating-systems/deadlocks": load(() => import("./DeadlockViz")),
  "operating-systems/memory-management": load(() => import("./PagingViz")),
  "operating-systems/page-replacement-algorithms": load(() => import("./PageReplacementViz")),
  // DBMS
  "dbms/normalization": load(() => import("./NormalizationViz")),
  "dbms/sql-joins-subqueries-aggregation": load(() => import("./JoinViz")),
  "dbms/indexing": load(() => import("./BTreeIndexViz")),
  "dbms/transactions-acid-properties": load(() => import("./ACIDViz")),
  "dbms/isolation-levels-anomalies": load(() => import("./IsolationViz")),
  // Computer Networks
  "computer-networks/why-networking-is-layered": load(() => import("./OSIEncapsulationViz")),
  "computer-networks/addressing-mac-ip-subnetting": load(() => import("./SubnettingViz")),
  "computer-networks/transport-layer-tcp-vs-udp": load(() => import("./TCPHandshakeViz")),
  "computer-networks/dns-domain-name-system": load(() => import("./DNSResolutionViz")),
  "computer-networks/what-happens-when-you-type-a-url-and-hit-enter": load(() => import("./URLJourneyViz")),
  // OOP
  "oop/inheritance": load(() => import("./InheritanceTreeViz")),
  "oop/polymorphism": load(() => import("./PolymorphismViz")),
  "oop/solid-design-principles": load(() => import("./SOLIDViz")),
  // Linux & SE
  "linux-se/permissions-ownership": load(() => import("./PermissionViz")),
  "linux-se/git-version-control": load(() => import("./GitBranchViz")),
  "linux-se/sdlc-agile": load(() => import("./SDLCViz")),
  "linux-se/complexity-analysis-big-o": load(() => import("./BigOViz")),
};

export function getSEVisual(subjectId: string, chapterId: string): ComponentType | null {
  return REGISTRY[`${subjectId}/${chapterId}`] ?? null;
}
