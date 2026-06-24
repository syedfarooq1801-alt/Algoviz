import rawOs from "./seBasics-os.json";
import rawDbms from "./seBasics-dbms.json";
import rawCn from "./seBasics-cn.json";
import rawOop from "./seBasics-oop.json";
import rawLinux from "./seBasics-linux.json";

const raw = { ...rawOs, ...rawDbms, ...rawCn, ...rawOop, ...rawLinux } as Record<string, Subject>;

export type BlockType =
  | "para" | "heading" | "analogy" | "memory-trick" | "example"
  | "common-mistake" | "placement" | "pre" | "interview";

export interface QA { q: string; a: string; }

export interface Block {
  type: BlockType;
  text?: string;
  qas?: QA[];
}

export interface Chapter {
  id: string;
  num: number;
  title: string;
  blocks: Block[];
}

export interface Subject {
  id: string;
  title: string;
  chapters: Chapter[];
}

// Per-subject display metadata (icon + accent + one-line blurb)
export const SUBJECT_META: Record<string, { blurb: string; accent: string; topics: string }> = {
  "operating-systems": { blurb: "Processes, scheduling, memory, deadlocks, file systems — from first principles to interview-ready.", accent: "var(--accent)", topics: "Kernel · Scheduling · Paging · Deadlocks" },
  "dbms": { blurb: "ER modeling, normalization, SQL, indexing, transactions, ACID and concurrency control.", accent: "var(--accent-orange)", topics: "Normalization · ACID · Indexing · Isolation" },
  "computer-networks": { blurb: "Layered networking, addressing, TCP/UDP, DNS, HTTP/HTTPS and security essentials.", accent: "var(--accent-green)", topics: "OSI · TCP/UDP · DNS · HTTP" },
  "oop": { blurb: "Classes, the four pillars, SOLID principles, design patterns and the Rule of Three/Five.", accent: "var(--accent-purple)", topics: "Inheritance · Polymorphism · SOLID · Patterns" },
  "linux-se": { blurb: "Linux internals, permissions, Git, SDLC, Agile, testing, Big-O and system design basics.", accent: "var(--accent-red)", topics: "Permissions · Git · Agile · Big-O" },
};

export const SE_SUBJECTS: Subject[] = (raw as { [k: string]: Subject }) &&
  ["operating-systems", "dbms", "computer-networks", "oop", "linux-se"]
    .map((id) => (raw as Record<string, Subject>)[id])
    .filter(Boolean);

export function getSubject(id: string): Subject | undefined {
  return SE_SUBJECTS.find((s) => s.id === id);
}

export function getSubjectChapterCount(id: string): number {
  return getSubject(id)?.chapters.length ?? 0;
}

export function getTotalSEChapters(): number {
  return SE_SUBJECTS.reduce((n, s) => n + s.chapters.length, 0);
}

// Plain-text of a block, for search indexing
export function blockText(b: Block): string {
  if (b.type === "interview") return (b.qas ?? []).map((qa) => `${qa.q} ${qa.a}`).join(" ");
  return b.text ?? "";
}

export interface SearchHit {
  subjectId: string;
  subjectTitle: string;
  chapterId: string;
  chapterTitle: string;
  snippet: string;
}

export function searchSE(query: string, limit = 30): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const subject of SE_SUBJECTS) {
    for (const ch of subject.chapters) {
      // chapter title match always counts
      const titleMatch = ch.title.toLowerCase().includes(q);
      let snippet = "";
      if (!titleMatch) {
        for (const b of ch.blocks) {
          const t = blockText(b);
          const idx = t.toLowerCase().indexOf(q);
          if (idx >= 0) {
            const start = Math.max(0, idx - 40);
            snippet = (start > 0 ? "…" : "") + t.slice(start, idx + 80).trim() + "…";
            break;
          }
        }
        if (!snippet) continue;
      }
      hits.push({
        subjectId: subject.id,
        subjectTitle: subject.title,
        chapterId: ch.id,
        chapterTitle: ch.title,
        snippet: snippet || subject.title,
      });
      if (hits.length >= limit) return hits;
    }
  }
  return hits;
}
