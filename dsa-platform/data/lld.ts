import lldPart1 from "./lldContent-part1";
import lldPart2 from "./lldContent-part2";
import lldPart3 from "./lldContent-part3";

export type BlockType =
  | "para" | "heading" | "analogy" | "memory-trick" | "example"
  | "common-mistake" | "placement" | "pre" | "interview";

export interface QA { q: string; a: string; }

export interface Block {
  type: BlockType;
  text?: string;
  topic?: string;
  content?: string;
  qas?: QA[];
}

export interface Chapter {
  id: string;
  num: number;
  title: string;
  blocks: Block[];
}

export interface LLDSubject {
  id: string;
  title: string;
  chapters: Chapter[];
}

const raw: Record<string, LLDSubject> = {
  ...lldPart1,
  ...lldPart2,
  ...lldPart3,
} as Record<string, LLDSubject>;

export const LLD_SUBJECT_META: Record<string, { blurb: string; accent: string; topics: string }> = {
  "solid-principles": {
    blurb: "SRP, OCP, LSP, ISP, DIP — the five principles behind every clean codebase. Essential for senior interviews.",
    accent: "var(--accent)",
    topics: "SRP · OCP · LSP · ISP · DIP",
  },
  "design-patterns-creational": {
    blurb: "Factory Method, Abstract Factory, Singleton, Builder, Prototype — patterns for flexible object creation.",
    accent: "var(--accent-orange)",
    topics: "Factory · Singleton · Builder · Prototype",
  },
  "design-patterns-structural": {
    blurb: "Adapter, Decorator, Proxy, Facade, Composite — patterns that compose objects and classes into larger structures.",
    accent: "var(--accent-green)",
    topics: "Adapter · Decorator · Proxy · Facade · Composite",
  },
  "design-patterns-behavioral": {
    blurb: "Observer, Strategy, Command, Template Method, State — patterns for object interaction and responsibility.",
    accent: "var(--accent-purple)",
    topics: "Observer · Strategy · Command · Template Method · State",
  },
  "lld-problems-classic": {
    blurb: "Parking Lot, LRU Cache, Elevator, Library, Chess — the canonical LLD interview problems with full class designs.",
    accent: "var(--accent-red)",
    topics: "Parking Lot · LRU Cache · Elevator · Library · Chess",
  },
  "lld-problems-realworld": {
    blurb: "Splitwise, BookMyShow, Swiggy, Uber, Twitter — design real products. Asked directly at Amazon, Flipkart, Uber, Swiggy.",
    accent: "#f59e0b",
    topics: "Splitwise · BookMyShow · Swiggy · Uber · Twitter",
  },
};

const SUBJECT_ORDER = [
  "solid-principles",
  "design-patterns-creational",
  "design-patterns-structural",
  "design-patterns-behavioral",
  "lld-problems-classic",
  "lld-problems-realworld",
];

export const LLD_SUBJECTS: LLDSubject[] = SUBJECT_ORDER
  .map((id) => raw[id])
  .filter(Boolean);

export function getLLDSubject(id: string): LLDSubject | undefined {
  return LLD_SUBJECTS.find((s) => s.id === id);
}

export function getTotalLLDChapters(): number {
  return LLD_SUBJECTS.reduce((n, s) => n + s.chapters.length, 0);
}

export interface LLDSearchHit {
  subjectId: string;
  subjectTitle: string;
  chapterId: string;
  chapterTitle: string;
  snippet: string;
}

function blockText(b: Block): string {
  if (b.type === "interview") return (b.qas ?? []).map((qa) => `${qa.q} ${qa.a}`).join(" ");
  if (b.type === "placement") return `${b.topic ?? ""} ${b.content ?? ""}`;
  return b.text ?? "";
}

export function searchLLD(query: string, limit = 30): LLDSearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: LLDSearchHit[] = [];
  for (const subject of LLD_SUBJECTS) {
    for (const ch of subject.chapters) {
      const titleMatch = ch.title.toLowerCase().includes(q);
      const bodyMatch = ch.blocks.some((b) => blockText(b).toLowerCase().includes(q));
      if (!titleMatch && !bodyMatch) continue;
      const snippet = ch.blocks
        .map(blockText)
        .join(" ")
        .toLowerCase()
        .split(q)[0]
        .slice(-60) + q + "...";
      hits.push({
        subjectId: subject.id,
        subjectTitle: subject.title,
        chapterId: ch.id,
        chapterTitle: ch.title,
        snippet: snippet.trim(),
      });
      if (hits.length >= limit) return hits;
    }
  }
  return hits;
}
