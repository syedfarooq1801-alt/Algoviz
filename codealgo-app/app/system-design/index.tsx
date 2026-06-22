import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SD_CHAPTERS } from "@/data/systemDesign";
import { useSDStore } from "@/lib/sdStore";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, ProgressBar, ScreenHeader, Badge } from "@/components/ui";

export default function SystemDesignIndex() {
  const router = useRouter();
  const { isMastered } = useSDStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="System Design" subtitle={`${SD_CHAPTERS.length} chapters`} back />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {SD_CHAPTERS.map((chapter) => {
          const masteredCount = chapter.concepts.filter((c) => isMastered(c.id)).length;
          const total = chapter.concepts.length;
          return (
            <Card key={chapter.id} style={styles.chapter}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <Text style={styles.chapterDesc} numberOfLines={2}>{chapter.description}</Text>
              <View style={styles.progressRow}>
                <ProgressBar value={masteredCount} max={total} color={colors.green} height={4} />
                <Text style={styles.progressText}>{masteredCount}/{total}</Text>
              </View>

              <View style={styles.concepts}>
                {chapter.concepts.slice(0, 6).map((concept) => (
                  <Pressable
                    key={concept.id}
                    style={({ pressed }) => [styles.conceptRow, pressed && { opacity: 0.7 }]}
                    onPress={() => router.push(`/system-design/${concept.id}` as any)}
                  >
                    <Text style={[styles.conceptCheck, { color: isMastered(concept.id) ? colors.green : colors.border }]}>
                      {isMastered(concept.id) ? "✓" : "○"}
                    </Text>
                    <Text style={styles.conceptTitle} numberOfLines={1}>{concept.title}</Text>
                    <Badge
                      label={concept.difficulty}
                      color={concept.difficulty === "Fundamental" ? colors.green : concept.difficulty === "Intermediate" ? colors.orange : colors.red}
                      bg={concept.difficulty === "Fundamental" ? colors.greenBg : concept.difficulty === "Intermediate" ? colors.orangeBg : colors.redBg}
                      size="sm"
                    />
                  </Pressable>
                ))}
                {chapter.concepts.length > 6 && (
                  <Text style={styles.moreText}>+{chapter.concepts.length - 6} more concepts</Text>
                )}
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  chapter: { gap: spacing.md },
  chapterTitle: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.textPrimary },
  chapterDesc: { fontSize: font.size.sm, color: colors.textSecondary },
  progressRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  progressText: { fontSize: font.size.xs, color: colors.textMuted, width: 36, textAlign: "right" },
  concepts: { gap: 2 },
  conceptRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: spacing.sm },
  conceptCheck: { fontSize: 13, width: 16 },
  conceptTitle: { flex: 1, fontSize: font.size.base, color: colors.textPrimary },
  moreText: { fontSize: font.size.xs, color: colors.textMuted, paddingLeft: 28, paddingTop: 4 },
});
