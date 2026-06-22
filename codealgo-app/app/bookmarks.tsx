import { useState, useMemo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PATTERNS, Problem } from "@/data/problems";
import { useProgressStore } from "@/lib/store";
import { usePrepStore } from "@/lib/prepStore";
import { colors, font, spacing, radius, diffColor } from "@/lib/theme";
import { ScreenHeader } from "@/components/ui";

const ALL_PROBLEMS = PATTERNS.flatMap((p) => p.problems);

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
        <View style={[styles.dot, { backgroundColor: diffColor[prob.difficulty] ?? colors.textMuted }]} />
        <Text style={[styles.diffText, { color: diffColor[prob.difficulty] ?? colors.textMuted }]}>
          {prob.difficulty[0]}
        </Text>
      </View>
    </Pressable>
  );
}

export default function BookmarksScreen() {
  const [search, setSearch] = useState("");
  const { solved, bookmarked } = useProgressStore();
  const { reviewDue } = usePrepStore();
  const today = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_PROBLEMS.filter((p) => {
      if (!bookmarked.has(p.id)) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.pattern.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, bookmarked]);

  const renderItem = useCallback(({ item }: { item: Problem }) => (
    <ProblemRow
      prob={item}
      solved={solved.has(item.id)}
      due={!!(reviewDue[item.id] && reviewDue[item.id] <= today)}
    />
  ), [solved, reviewDue, today]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bookmarks</Text>
          <Text style={styles.count}>{filtered.length}</Text>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.search}
            placeholder="Search bookmarks..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlashList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              {bookmarked.size === 0 ? (
                <>
                  <Text style={styles.emptyIcon}>🔖</Text>
                  <Text style={styles.emptyTitle}>No bookmarks yet</Text>
                  <Text style={styles.emptySub}>Tap 🔖 on any problem to save it here.</Text>
                </>
              ) : (
                <Text style={styles.emptySub}>No bookmarks match your search.</Text>
              )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.textPrimary },
  count: { fontSize: font.size.sm, color: colors.textMuted },
  searchRow: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  search: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontSize: font.size.base,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
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
  empty: { alignItems: "center", paddingTop: 80, gap: spacing.sm },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.textPrimary },
  emptySub: { fontSize: font.size.base, color: colors.textMuted, textAlign: "center", paddingHorizontal: spacing.xl },
});
