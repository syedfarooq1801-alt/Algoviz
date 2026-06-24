import raw1 from "./aiml-part1.json";
import raw2 from "./aiml-part2.json";
import raw3 from "./aiml-part3.json";

const raw = { ...raw1, ...raw2, ...raw3 } as Record<string, Subject>;

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

export const AIML_SUBJECT_META: Record<string, { blurb: string; accent: string; topics: string }> = {
  "ai-fundamentals":       { blurb: "What AI is, how it differs from ML and DL, types of learning, and the end-to-end AI workflow.", accent: "var(--accent)", topics: "AI · ML · DL · GenAI · Supervised · Unsupervised · RL" },
  "data-preprocessing":    { blurb: "The most important and most-asked phase: cleaning, encoding, scaling, engineering, and avoiding data leakage.", accent: "var(--accent-orange)", topics: "Cleaning · Scaling · Encoding · Feature Eng · Leakage" },
  "ml-basics":             { blurb: "Core theory every ML interview tests: bias-variance tradeoff, overfitting, regularization, and the curse of dimensionality.", accent: "var(--accent-green)", topics: "Bias-Variance · Overfitting · Regularization · Hyperparams" },
  "regression":            { blurb: "Linear, polynomial, Ridge, Lasso, and ElasticNet — intuition, math, interview angles, and when to use each.", accent: "var(--accent-purple)", topics: "Linear · Polynomial · Ridge · Lasso · ElasticNet" },
  "classification":        { blurb: "Logistic Regression, KNN, Naive Bayes, Decision Trees, SVM, and the full metrics toolkit.", accent: "var(--accent-red)", topics: "Logistic · KNN · Naive Bayes · Decision Tree · SVM · Metrics" },
  "clustering":            { blurb: "Unsupervised grouping: K-Means, hierarchical, DBSCAN, and how to evaluate clusters without labels.", accent: "var(--accent)", topics: "K-Means · Hierarchical · DBSCAN · Elbow · Silhouette" },
  "ensemble-learning":     { blurb: "Wisdom of many models: bagging, boosting, Random Forest, XGBoost, LightGBM — the most-used algorithms in production.", accent: "var(--accent-orange)", topics: "Bagging · Boosting · Random Forest · XGBoost · LightGBM" },
  "dimensionality-reduction": { blurb: "PCA, LDA, and t-SNE — how to compress features, visualise high-dimensional data, and reduce noise.", accent: "var(--accent-green)", topics: "PCA · LDA · t-SNE · Variance · Eigenvectors" },
  "deep-learning":         { blurb: "Neural networks from scratch: activations, backprop, CNNs, RNNs, LSTMs, and transfer learning.", accent: "var(--accent-purple)", topics: "ANN · Backprop · CNN · RNN · LSTM · Transfer Learning" },
  "nlp":                   { blurb: "Text preprocessing, embeddings, attention mechanism, Transformers, BERT, and GPT — the full NLP stack.", accent: "var(--accent-red)", topics: "Tokenization · Embeddings · Attention · Transformers · BERT · GPT" },
  "generative-ai":         { blurb: "LLMs, RAG, prompt engineering, fine-tuning, LoRA, AI agents, and function calling — the hottest interview topic in 2025.", accent: "var(--accent)", topics: "LLMs · RAG · Prompt Eng · Fine-tuning · Agents · MCP" },
  "model-evaluation":      { blurb: "Choosing the right metric, cross-validation strategies, hyperparameter tuning, and avoiding evaluation pitfalls.", accent: "var(--accent-orange)", topics: "Metrics · Cross-Val · Grid Search · Precision vs Recall" },
  "mlops":                 { blurb: "Taking models to production: deployment, pipelines, monitoring, drift detection, versioning, and CI/CD for ML.", accent: "var(--accent-green)", topics: "Deployment · Monitoring · Drift · MLflow · Docker · CI/CD" },
};

const SUBJECT_ORDER = [
  "ai-fundamentals", "data-preprocessing", "ml-basics", "regression",
  "classification", "clustering", "ensemble-learning", "dimensionality-reduction",
  "deep-learning", "nlp", "generative-ai", "model-evaluation", "mlops",
];

export const AIML_SUBJECTS: Subject[] = SUBJECT_ORDER
  .map((id) => raw[id])
  .filter(Boolean);

export function getAIMLSubject(id: string): Subject | undefined {
  return AIML_SUBJECTS.find((s) => s.id === id);
}

export function getTotalAIMLChapters(): number {
  return AIML_SUBJECTS.reduce((n, s) => n + s.chapters.length, 0);
}

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

export function searchAIML(query: string, limit = 30): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const subject of AIML_SUBJECTS) {
    for (const ch of subject.chapters) {
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
      hits.push({ subjectId: subject.id, subjectTitle: subject.title, chapterId: ch.id, chapterTitle: ch.title, snippet: snippet || subject.title });
      if (hits.length >= limit) return hits;
    }
  }
  return hits;
}
