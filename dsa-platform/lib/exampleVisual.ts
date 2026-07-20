// Parses LeetCode-style example "input" strings and extracts a tree or
// grid structure we can render as an inline SVG diagram, mirroring the
// static images LeetCode ships with its examples — generated on the fly
// from the same data instead of copied image assets.

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

export type ExampleVisual = TreeVisual | GridVisual | null;

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
    // fallback: variable is the last thing in the string
    const re2 = new RegExp(`\\b${name}\\s*=\\s*(\\[[\\s\\S]*\\])\\s*$`);
    const m2 = input.match(re2);
    if (m2) return m2[1];
  }
  return null;
}

function buildTree(flatStr: string): TreeNode | null {
  // Strip one level of outer brackets, split on commas (no nesting expected).
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
    // Normalize to valid JSON: quote bare words like true/false stay, numbers
    // stay, existing quotes stay — LeetCode grid literals are already
    // JSON-ish (numbers or double-quoted single chars).
    const parsed = JSON.parse(flatStr);
    if (!Array.isArray(parsed) || !Array.isArray(parsed[0])) return null;
    return parsed.map((row: unknown[]) => row.map((cell) => String(cell)));
  } catch {
    return null;
  }
}

const TREE_VARS = ["root", "head"];
const GRID_VARS = ["grid", "matrix", "board", "heights", "rooms", "seats", "isConnected"];

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
  return null;
}
