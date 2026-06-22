import { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { PATTERNS, Problem } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import { usePrepStore } from "@/lib/prepStore";
import { colors, font, spacing, radius, diffColor, companyColors } from "@/lib/theme";

const ALL_PROBLEMS = PATTERNS.flatMap((p) => p.problems);
const ALL_TOPICS = ["All", ...PATTERNS.map((p) => p.title)];
const ALL_COMPANIES: string[] = [];
ALL_PROBLEMS.forEach((p) => {
  p.companies?.forEach((c) => { if (!ALL_COMPANIES.includes(c)) ALL_COMPANIES.push(c); });
});

type SortKey = "default" | "freq" | "easy-hard" | "hard-easy" | "az";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "freq", label: "High Freq" },
  { key: "easy-hard", label: "Easy→Hard" },
  { key: "hard-easy", label: "Hard→Easy" },
  { key: "az", label: "A→Z" },
];

const DIFF_ORDER: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };

function applySort(arr: Problem[], sort: SortKey): Problem[] {
  if (sort === "default") return arr;
  const copy = [...arr];
  if (sort === "freq") {
    return copy.sort((a, b) => {
      const fa = a.frequency === "High" ? 0 : a.frequency === "Medium" ? 1 : 2;
      const fb = b.frequency === "High" ? 0 : b.frequency === "Medium" ? 1 : 2;
      return fa - fb;
    });
  }
  if (sort === "easy-hard") return copy.sort((a, b) => (DIFF_ORDER[a.difficulty] ?? 1) - (DIFF_ORDER[b.difficulty] ?? 1));
  if (sort === "hard-easy") return copy.sort((a, b) => (DIFF_ORDER[b.difficulty] ?? 1) - (DIFF_ORDER[a.difficulty] ?? 1));
  if (sort === "az") return copy.sort((a, b) => a.title.localeCompare(b.title));
  return arr;
}

function DiffDot({ diff }: { diff: string }) {
  return <View style={[styles.dot, { backgroundColor: diffColor[diff] ?? colors.textMuted }]} />;
}

function ProblemRow({ prob, solved, due }: { prob: Problem; solved: boolean; due: boolean }) {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
      onPress={() => router.push(`/problem/${prob.id}` as any)}
    >
      <View style={styles.rowLeft}>
        <Text style={[styles.check, { color: solved ? colors.green : colors.border }]}>
          {solved ? "✓" : "○"}
        </Text>
        <View style={styles.rowInfo}>
          <Text style={styles.rowTitle} numberOfLines={1}>{prob.title}</Text>
          <Text style={styles.rowPattern}>{prob.pattern}</Text>
        </View>
      </View>
      <View style={styles.rowRight}>
        {due && <View style={styles.dueDot} />}
        <DiffDot diff={prob.difficulty} />
        <Text style={[styles.diffText, { color: diffColor[prob.difficulty] ?? colors.textMuted }]}>
          {prob.difficulty[0]}
        </Text>
      </View>
    </Pressable>
  );
}

export default function DSAScreen() {
  const params = useLocalSearchParams<{ drillPatterns?: string }>();

  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unsolved" | "solved" | "bookmarked" | "review">("all");
  const [sort, setSort] = useState<SortKey>("default");
  const [drillPatterns, setDrillPatterns] = useState<string[] | null>(null);

  // Handle drill mode from quiz result
  useEffect(() => {
    if (params.drillPatterns) {
      const patterns = params.drillPatterns.split(",").map((s) => s.trim()).filter(Boolean);
      if (patterns.length > 0) {
        setDrillPatterns(patterns);
        setActiveTopic("All");
        setFilter("all");
      }
    }
  }, [params.drillPatterns]);

  const { solved, bookmarked } = useProgressStore();
  const { reviewDue } = usePrepStore();
  const today = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const base = ALL_PROBLEMS.filter((p) => {
      if (drillPatterns && !drillPatterns.includes(p.pattern)) return false;
      if (!drillPatterns && activeTopic !== "All" && p.pattern !== activeTopic) return false;
      if (activeCompany && !p.companies?.includes(activeCompany)) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.pattern.toLowerCase().includes(q)) return false;
      if (filter === "solved" && !solved.has(p.id)) return false;
      if (filter === "unsolved" && solved.has(p.id)) return false;
      if (filter === "bookmarked" && !bookmarked.has(p.id)) return false;
      if (filter === "review" && (!reviewDue[p.id] || reviewDue[p.id] > today)) return false;
      return true;
    });
    return applySort(base, sort);
  }, [search, activeTopic, activeCompany, filter, sort, solved, bookmarked, reviewDue, today, drillPatterns]);

  const dueCount = Object.values(reviewDue).filter((d) => d <= today).length;

  const renderItem = useCallback(({ item }: { item: Problem }) => (
    <ProblemRow
      prob={item}
      solved={solved.has(item.id)}
      due={!!(reviewDue[item.id] && reviewDue[item.id] <= today)}
    />
  ), [solved, reviewDue, today]);

  const FILTERS: Array<{ key: typeof filter; label: string }> = [
    { key: "all", label: "All" },
    { key: "unsolved", label: "Unsolved" },
    { key: "solved", label: "Solved" },
    { key: "bookmarked", label: "Bookmarked" },
    { key: "review", label: `Review (${dueCount})` },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>DSA Problems</Text>
          <Text style={styles.count}>{filtered.length}/{ALL_PROBLEMS.length}</Text>
        </View>

        {/* Drill mode banner */}
        {drillPatterns && (
          <Pressable
            style={styles.drillBanner}
            onPress={() => setDrillPatterns(null)}
          >
            <Text style={styles.drillBannerText}>
              🎯 Drilling {drillPatterns.length} weak pattern{drillPatterns.length !== 1 ? "s" : ""} — tap to clear
            </Text>
          </Pressable>
        )}

        {/* Search */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.search}
            placeholder="Search problems..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              style={[styles.chip, filter === f.key && styles.chipActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Sort row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
          {SORT_OPTIONS.map((o) => (
            <Pressable
              key={o.key}
              style={[styles.sortBtn, sort === o.key && styles.sortBtnActive]}
              onPress={() => setSort(o.key)}
            >
              <Text style={[styles.sortText, sort === o.key && styles.sortTextActive]}>{o.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Topic pills */}
        {!drillPatterns && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topicRow}>
            {ALL_TOPICS.map((t) => (
              <Pressable
                key={t}
                style={[styles.topicPill, activeTopic === t && styles.topicPillActive]}
                onPress={() => setActiveTopic(t)}
              >
                <Text style={[styles.topicText, activeTopic === t && styles.topicTextActive]}>{t}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Company filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companyRow}>
          {ALL_COMPANIES.slice(0, 10).map((c) => (
            <Pressable
              key={c}
              style={[styles.companyChip, activeCompany === c && { borderColor: companyColors[c] ?? colors.accent }]}
              onPress={() => setActiveCompany(activeCompany === c ? null : c)}
            >
              <Text style={[styles.companyText, activeCompany === c && { color: companyColors[c] ?? colors.accent }]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* List */}
        <FlashList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No problems match your filters.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flex: 1 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm,
  },
  title: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.textPrimary },
  count: { fontSize: font.size.sm, color: colors.textMuted },
  drillBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
  },
  drillBannerText: { fontSize: font.size.sm, color: colors.accent, fontWeight: font.weight.medium },
  searchRow: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  search: {
    backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, color: colors.textPrimary, fontSize: font.size.base,
    paddingHorizontal: spacing.md, paddingVertical: 10,
  },
  filterRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  chipText: { fontSize: font.size.sm, color: colors.textSecondary, fontWeight: font.weight.medium },
  chipTextActive: { color: colors.accent },
  sortRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  sortBtn: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
  },
  sortBtnActive: { backgroundColor: colors.bgHover, borderColor: colors.accent },
  sortText: { fontSize: font.size.xs, color: colors.textMuted, fontWeight: font.weight.medium },
  sortTextActive: { color: colors.accent },
  topicRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  topicPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm, backgroundColor: colors.bgCard },
  topicPillActive: { backgroundColor: colors.bgHover },
  topicText: { fontSize: font.size.xs, color: colors.textMuted },
  topicTextActive: { color: colors.textPrimary },
  companyRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  companyChip: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard,
  },
  companyText: { fontSize: font.size.xs, color: colors.textSecondary },
  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.lg, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  check: { fontSize: 14, width: 18 },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.textPrimary },
  rowPattern: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 2 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  dueDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.orange },
  dot: { width: 8, height: 8, borderRadius: 4 },
  diffText: { fontSize: font.size.xs, fontWeight: font.weight.semibold, width: 12 },
  empty: { flex: 1, alignItems: "center", paddingTop: 80 },
  emptyText: { color: colors.textMuted, fontSize: font.size.base },
});
