import { getProblemById, getPatternById } from "@/data/problems";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { getConceptById } from "@/data/systemDesign";
import { SD_CONCEPT_CONTENT } from "@/data/systemDesignContent";
import { getSubject, blockText } from "@/data/seBasics";
import { getAIMLSubject, blockText as aimlBlockText } from "@/data/aiml";

export interface PageContext {
  kind: string;
  title: string;
  body: string;
}

const MAX = 4000;
const clip = (s: string) => (s.length > MAX ? s.slice(0, MAX) + "…" : s);

// Build grounding material for Axon from the page the user is viewing.
export function getPageContext(pathname: string, hash = ""): PageContext {
  // /problems/[id]
  let m = pathname.match(/^\/problems\/([^/]+)/);
  if (m) {
    const p = getProblemById(m[1]);
    const c = PROBLEM_CONTENT[m[1]];
    if (p) {
      const parts = [
        `Pattern: ${p.pattern}. Difficulty: ${p.difficulty}.`,
        c?.intuition && `Intuition: ${c.intuition}`,
        c?.approach?.length && `Approach:\n${c.approach.map((a, i) => `${i + 1}. ${a}`).join("\n")}`,
        c?.timeComplexity && `Time: ${c.timeComplexity}. Space: ${c.spaceComplexity ?? ""}`,
        c?.cppSolution && `Reference C++ solution:\n${c.cppSolution}`,
      ].filter(Boolean).join("\n\n");
      return { kind: "problem", title: p.title, body: clip(parts) };
    }
  }

  // /patterns/[slug]
  m = pathname.match(/^\/patterns\/([^/]+)/);
  if (m) {
    const pat = getPatternById(m[1]);
    if (pat) {
      const parts = [
        pat.description,
        pat.coreIntuition && `Core intuition: ${pat.coreIntuition}`,
        pat.keyInsights?.length && `Key insights:\n${pat.keyInsights.map((k) => `- ${k}`).join("\n")}`,
        pat.template && `Template:\n${pat.template}`,
      ].filter(Boolean).join("\n\n");
      return { kind: "pattern", title: pat.title, body: clip(parts) };
    }
  }

  // /system-design/concept/[id]
  m = pathname.match(/^\/system-design\/concept\/([^/]+)/);
  if (m) {
    const con = getConceptById(m[1]);
    const cc = SD_CONCEPT_CONTENT[m[1]];
    if (con) {
      const parts = [
        cc?.intuition,
        cc?.technicalDetail && `Detail: ${cc.technicalDetail}`,
        cc?.tradeoffs?.length && `Tradeoffs:\n${cc.tradeoffs.map((t) => `- ${t}`).join("\n")}`,
        cc?.realWorldExample && `Real world: ${cc.realWorldExample}`,
        cc?.interviewQuestion && `Interview Q: ${cc.interviewQuestion}\nModel answer: ${cc.modelAnswer ?? ""}`,
      ].filter(Boolean).join("\n\n");
      return { kind: "system-design", title: con.title, body: clip(parts) };
    }
  }

  // /se-basics/[subject]#chapter
  m = pathname.match(/^\/se-basics\/([^/]+)/);
  if (m) {
    const subject = getSubject(m[1]);
    if (subject) {
      const chId = hash.replace("#", "");
      const ch = subject.chapters.find((c) => c.id === chId) ?? subject.chapters[0];
      if (ch) {
        const body = ch.blocks.map(blockText).filter(Boolean).join("\n\n");
        return { kind: "se-basics", title: `${subject.title} — ${ch.title}`, body: clip(body) };
      }
    }
  }

  // /ai-ml/[subject]#chapter
  m = pathname.match(/^\/ai-ml\/([^/]+)/);
  if (m) {
    const subject = getAIMLSubject(m[1]);
    if (subject) {
      const chId = hash.replace("#", "");
      const ch = subject.chapters.find((c) => c.id === chId) ?? subject.chapters[0];
      if (ch) {
        const body = ch.blocks.map(aimlBlockText).filter(Boolean).join("\n\n");
        return { kind: "ai-ml", title: `${subject.title} — ${ch.title}`, body: clip(body) };
      }
    }
  }

  // /study-plan
  if (pathname.startsWith("/study-plan")) {
    return {
      kind: "study-plan",
      title: "Study Plan",
      body: "This is the user's personalized study plan: a day-by-day schedule (30/60/90-day options) of DSA problems, System Design concepts, and SE Basics chapters. It anchors to a chosen start date, marks TODAY on the real calendar, rolls missed days forward as catch-up (it never strands work in the past), makes Sundays review days, and tracks per-domain weekly progress. Answer questions about how it works, what to study next, pacing, and catching up.",
    };
  }

  return { kind: "general", title: "Code Algo", body: "" };
}
