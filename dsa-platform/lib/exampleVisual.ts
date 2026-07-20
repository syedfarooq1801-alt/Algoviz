// Parses LeetCode-style example "input" strings and extracts a structure
// we can render as an inline SVG diagram — mirrors the static images
// LeetCode ships with its examples, generated on the fly from the same
// input text instead of copied image assets.

export interface TreeNode {
  val: string;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface TreeVisual {
  type: "tree";
  root: TreeNode | null;
}

export interface GridVisual {
  type: "grid";
  cells: string[][];
}

export interface ListVisual {
  type: "list";
  values: string[];
}

export interface IntervalsVisual {
  type: "intervals";
  intervals: [number, number][];
}

export interface GraphVisual {
  type: "graph";
  nodes: string[];
  edges: [string, string][];
}

export interface PointsVisual {
  type: "points";
  points: [number, number][];
}

export interface ArrayVisual {
  type: "array";
  values: string[];
}

export type ExampleVisual =
  | TreeVisual
  | GridVisual
  | ListVisual
  | IntervalsVisual
  | GraphVisual
  | PointsVisual
  | ArrayVisual
  | null;

// Splits a LeetCode-style bracketed list "3,9,20,null,null,15,7" respecting
// nested brackets and quoted strings (grids embed quoted single chars).
function splitTopLevel(inner: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let inStr = false;
  let cur = "";
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === '"' && inner[i - 1] !== "\\") inStr = !inStr;
    if (!inStr) {
      if (c === "[") depth++;
      if (c === "]") depth--;
    }
    if (c === "," && depth === 0 && !inStr) {
      parts.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function extractBracketed(input: string, varNames: string[]): string | null {
  for (const name of varNames) {
    const re = new RegExp(`\\b${name}\\s*=\\s*(\\[[\\s\\S]*?\\])(?:,\\s*[a-zA-Z]|;|$)`);
    const m = input.match(re);
    if (m) return m[1];
    const re2 = new RegExp(`\\b${name}\\s*=\\s*(\\[[\\s\\S]*\\])\\s*$`);
    const m2 = input.match(re2);
    if (m2) return m2[1];
  }
  return null;
}

function extractQuoted(input: string, varNames: string[]): string | null {
  for (const name of varNames) {
    const re = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`);
    const m = input.match(re);
    if (m) return m[1];
  }
  return null;
}

function buildTree(flatStr: string): TreeNode | null {
  const inner = flatStr.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner.trim()) return null;
  const tokens = splitTopLevel(inner).map((t) => t.replace(/^"|"$/g, ""));
  if (tokens.length === 0 || tokens[0] === "null") return null;

  const makeNode = (v: string): TreeNode => ({ val: v, left: null, right: null });
  const root = makeNode(tokens[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < tokens.length) {
    const node = queue.shift()!;
    if (i < tokens.length) {
      const v = tokens[i++];
      if (v !== "null" && v !== undefined) {
        node.left = makeNode(v);
        queue.push(node.left);
      }
    }
    if (i < tokens.length) {
      const v = tokens[i++];
      if (v !== "null" && v !== undefined) {
        node.right = makeNode(v);
        queue.push(node.right);
      }
    }
  }
  return root;
}

function buildGrid(flatStr: string): string[][] | null {
  try {
    const parsed = JSON.parse(flatStr);
    if (!Array.isArray(parsed) || !Array.isArray(parsed[0])) return null;
    return parsed.map((row: unknown[]) => row.map((cell) => String(cell)));
  } catch {
    return null;
  }
}

function buildFlatArray(flatStr: string): string[] | null {
  try {
    const parsed = JSON.parse(flatStr);
    if (!Array.isArray(parsed)) return null;
    if (parsed.some((v) => Array.isArray(v) || (v !== null && typeof v === "object"))) return null;
    return parsed.map((v) => (v === null ? "null" : String(v)));
  } catch {
    return null;
  }
}

function buildPairArray(flatStr: string): [number, number][] | null {
  try {
    const parsed = JSON.parse(flatStr);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const pairs: [number, number][] = [];
    for (const row of parsed) {
      if (!Array.isArray(row) || row.length < 2) return null;
      const a = Number(row[0]);
      const b = Number(row[1]);
      if (Number.isNaN(a) || Number.isNaN(b)) return null;
      pairs.push([a, b]);
    }
    return pairs;
  } catch {
    return null;
  }
}

// Like buildPairArray but keeps endpoints as strings — for graphs whose
// nodes are labels (airport codes) rather than plain numeric ids.
function buildStringPairArray(flatStr: string): [string, string][] | null {
  try {
    const parsed = JSON.parse(flatStr);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const pairs: [string, string][] = [];
    for (const row of parsed) {
      if (!Array.isArray(row) || row.length < 2) return null;
      pairs.push([String(row[0]), String(row[1])]);
    }
    return pairs;
  } catch {
    return null;
  }
}

const TREE_VARS = ["root", "subRoot", "p", "q"];
const GRID_VARS = ["grid", "matrix", "board", "heights", "rooms", "seats", "isConnected"];
const LIST_VARS = ["head", "l1", "l2", "list1", "list2"];
const LISTS_OF_LISTS_VARS = ["lists"];
const INTERVAL_VARS = ["intervals", "trips", "schedule"];
const GRAPH_EDGE_VARS = ["edges", "connections", "flights", "times", "prerequisites"];
const GRAPH_LABEL_VARS = ["tickets"];
const POINTS_VARS = ["points", "positions"];
const GRAPH_ADJ_VARS = ["graph"];
const ARRAY_VARS = [
  "nums", "nums1", "nums2", "arr", "prices", "weights", "values", "ratings", "coins",
  "height", "heights", "temperatures", "numbers", "strs", "asteroids", "piles", "gas",
  "cost", "hand", "bills", "candidates", "tasks", "tokens", "stones", "wordList", "words",
  "digits", "fruits", "position", "cardPoints",
];
const STRING_VARS = [
  "s", "s1", "s2", "word", "ransomNote", "magazine", "text1", "text2", "word1", "word2",
  "digits", "sentence",
];

export function parseExampleVisual(input: string): ExampleVisual {
  const treeStr = extractBracketed(input, TREE_VARS);
  if (treeStr) {
    const root = buildTree(treeStr);
    if (root) return { type: "tree", root };
  }

  const gridStr = extractBracketed(input, GRID_VARS);
  if (gridStr) {
    const cells = buildGrid(gridStr);
    if (cells && cells.length > 0 && cells.length <= 12 && cells[0].length <= 12) {
      return { type: "grid", cells };
    }
  }

  const listStr = extractBracketed(input, LIST_VARS);
  if (listStr) {
    const values = buildFlatArray(listStr);
    if (values && values.length > 0 && values.length <= 20) {
      return { type: "list", values };
    }
  }

  const pointsStr = extractBracketed(input, POINTS_VARS);
  if (pointsStr) {
    const pairs = buildPairArray(pointsStr);
    if (pairs && pairs.length > 0 && pairs.length <= 30) {
      return { type: "points", points: pairs };
    }
  }

  const intervalStr = extractBracketed(input, INTERVAL_VARS);
  if (intervalStr) {
    const pairs = buildPairArray(intervalStr);
    if (pairs && pairs.length > 0 && pairs.length <= 15) {
      return { type: "intervals", intervals: pairs };
    }
  }

  const edgeStr = extractBracketed(input, GRAPH_EDGE_VARS);
  if (edgeStr) {
    const pairs = buildPairArray(edgeStr);
    if (pairs && pairs.length > 0 && pairs.length <= 20) {
      const nodeSet = new Set<string>();
      const edges: [string, string][] = pairs.map(([a, b]) => {
        nodeSet.add(String(a));
        nodeSet.add(String(b));
        return [String(a), String(b)];
      });
      if (nodeSet.size <= 14) {
        return { type: "graph", nodes: [...nodeSet], edges };
      }
    }
  }

  const adjStr = extractBracketed(input, GRAPH_ADJ_VARS);
  if (adjStr) {
    try {
      const parsed = JSON.parse(adjStr);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.length <= 14 && parsed.every((r) => Array.isArray(r))) {
        const nodes = parsed.map((_, i) => String(i));
        const seen = new Set<string>();
        const edges: [string, string][] = [];
        parsed.forEach((neighbors: unknown[], i: number) => {
          neighbors.forEach((n) => {
            const a = String(i), b = String(n);
            const key = a < b ? `${a}-${b}` : `${b}-${a}`;
            if (!seen.has(key)) { seen.add(key); edges.push([a, b]); }
          });
        });
        return { type: "graph", nodes, edges };
      }
    } catch {
      /* ignore */
    }
  }

  const labeledEdgeStr = extractBracketed(input, GRAPH_LABEL_VARS);
  if (labeledEdgeStr) {
    const pairs = buildStringPairArray(labeledEdgeStr);
    if (pairs && pairs.length > 0 && pairs.length <= 20) {
      const nodeSet = new Set<string>();
      pairs.forEach(([a, b]) => { nodeSet.add(a); nodeSet.add(b); });
      if (nodeSet.size <= 14) {
        return { type: "graph", nodes: [...nodeSet], edges: pairs };
      }
    }
  }

  const listsOfListsStr = extractBracketed(input, LISTS_OF_LISTS_VARS);
  if (listsOfListsStr) {
    try {
      const parsed = JSON.parse(listsOfListsStr);
      if (Array.isArray(parsed) && parsed.every((r) => Array.isArray(r))) {
        const flat = parsed.filter((r) => r.length > 0)[0];
        if (flat && flat.length <= 20) return { type: "list", values: flat.map((v: unknown) => String(v)) };
      }
    } catch {
      /* ignore */
    }
  }

  const arrStr = extractBracketed(input, ARRAY_VARS);
  if (arrStr) {
    const values = buildFlatArray(arrStr);
    if (values && values.length > 0 && values.length <= 25) {
      return { type: "array", values };
    }
  }

  const strVal = extractQuoted(input, STRING_VARS);
  if (strVal !== null && strVal.length > 0 && strVal.length <= 30) {
    return { type: "array", values: strVal.split("") };
  }

  return null;
}
