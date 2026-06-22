import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { colors, font, radius, spacing } from "@/lib/theme";

interface Props {
  code: string;
  language?: string;
}

// ── Syntax Highlighting ───────────────────────────────────────────────────────

type TokType = "kw" | "type" | "str" | "num" | "comment" | "pre" | "op" | "plain";

const TOKEN_COLORS: Record<TokType, string> = {
  kw: "#C792EA",    // purple  – keywords
  type: "#82AAFF",  // blue    – types
  str: "#C3E88D",   // green   – string/char literals
  num: "#F78C6C",   // orange  – numbers
  comment: "#546E7A", // gray  – comments
  pre: "#F07178",   // coral   – preprocessor
  op: "#89DDFF",    // cyan    – operators & punctuation
  plain: "#E8EAF0", // white   – identifiers, everything else
};

const KEYWORDS = new Set([
  "auto", "bool", "break", "case", "catch", "class", "const", "constexpr",
  "continue", "default", "delete", "do", "else", "enum", "explicit", "extern",
  "false", "for", "friend", "goto", "if", "inline", "mutable", "namespace",
  "new", "noexcept", "nullptr", "operator", "override", "private", "protected",
  "public", "register", "return", "sizeof", "static", "struct", "switch",
  "template", "this", "throw", "true", "try", "typedef", "typename", "union",
  "using", "virtual", "void", "volatile", "while",
]);

const TYPES = new Set([
  "int", "long", "short", "char", "double", "float", "unsigned", "signed",
  "string", "vector", "map", "unordered_map", "set", "unordered_set",
  "multimap", "multiset", "pair", "queue", "stack", "deque",
  "priority_queue", "list", "array", "tuple", "optional", "variant",
  "shared_ptr", "unique_ptr", "weak_ptr", "size_t", "int8_t", "int16_t",
  "int32_t", "int64_t", "uint8_t", "uint16_t", "uint32_t", "uint64_t",
  "ptrdiff_t", "TreeNode", "ListNode", "Node",
]);

interface Token { text: string; type: TokType; }

function tokenizeLine(line: string): Token[] {
  const trimmed = line.trimStart();

  if (trimmed.startsWith("#")) return [{ text: line, type: "pre" }];
  if (trimmed.startsWith("//")) return [{ text: line, type: "comment" }];
  if (trimmed.startsWith("*") || trimmed.startsWith("/*")) return [{ text: line, type: "comment" }];

  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    // Line comment
    if (ch === "/" && line[i + 1] === "/") {
      tokens.push({ text: line.slice(i), type: "comment" });
      break;
    }

    // String literal "..."
    if (ch === '"') {
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === '"' && line[j - 1] !== "\\") break;
        j++;
      }
      tokens.push({ text: line.slice(i, j + 1), type: "str" });
      i = j + 1;
      continue;
    }

    // Char literal '...'
    if (ch === "'") {
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === "'" && line[j - 1] !== "\\") break;
        j++;
      }
      tokens.push({ text: line.slice(i, j + 1), type: "str" });
      i = j + 1;
      continue;
    }

    // Number
    if (/\d/.test(ch)) {
      let j = i;
      while (j < line.length && /[\d.xXabcdefABCDEF]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: "num" });
      i = j;
      continue;
    }

    // Identifier / keyword / type
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < line.length && /\w/.test(line[j])) j++;
      const word = line.slice(i, j);
      const type: TokType = KEYWORDS.has(word) ? "kw" : TYPES.has(word) ? "type" : "plain";
      tokens.push({ text: word, type });
      i = j;
      continue;
    }

    // Operators & punctuation
    if (/[{}[\]();:<>=+\-*&|!~^%?,.@]/.test(ch)) {
      tokens.push({ text: ch, type: "op" });
      i++;
      continue;
    }

    // Whitespace and everything else
    tokens.push({ text: ch, type: "plain" });
    i++;
  }

  return tokens;
}

function highlightCode(code: string): Token[][] {
  return code.split("\n").map(tokenizeLine);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CodeBlock({ code, language = "C++" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lines = highlightCode(code);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.lang}>{language}</Text>
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [styles.copyBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.copyText}>{copied ? "Copied!" : "Copy"}</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <View style={styles.codeBody}>
            {lines.map((lineTokens, li) => (
              <Text key={li} style={styles.codeLine}>
                {lineTokens.map((tok, ti) => (
                  <Text key={ti} style={{ color: TOKEN_COLORS[tok.type] }}>
                    {tok.text}
                  </Text>
                ))}
              </Text>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0e14",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lang: {
    fontSize: font.size.xs,
    color: colors.textMuted,
    fontWeight: font.weight.medium,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  copyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.bgHover,
  },
  copyText: {
    fontSize: font.size.xs,
    color: colors.accent,
    fontWeight: font.weight.medium,
  },
  codeBody: { padding: spacing.md },
  codeLine: {
    fontFamily: "monospace",
    fontSize: font.size.sm,
    lineHeight: 21,
  },
});
