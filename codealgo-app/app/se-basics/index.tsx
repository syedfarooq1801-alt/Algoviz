import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SE_SUBJECTS } from "@/data/seBasics";
import { useSEStore } from "@/lib/seStore";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, ProgressBar, ScreenHeader } from "@/components/ui";

const SUBJECT_ICONS: Record<string, string> = {
  "operating-systems": "🖥️",
  "databases": "🗄️",
  "networking": "🌐",
  "object-oriented": "🧩",
  "concurrency": "⚡",
  "data-structures": "📊",
  "algorithms": "🔢",
  "system-design-basics": "🏗️",
};

export default function SEBasicsIndex() {
  const router = useRouter();
  const { subjectDone, isComplete } = useSEStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="SE Basics" subtitle={`${SE_SUBJECTS.length} subjects`} back />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {SE_SUBJECTS.map((subject) => {
          const chapterIds = subject.chapters.map((c) => c.id);
          const done = subjectDone(subject.id, chapterIds);
          const total = chapterIds.length;
          return (
            <Pressable
              key={subject.id}
              style={({ pressed }) => [styles.subjectCard, pressed && { opacity: 0.8 }]}
              onPress={() => router.push(`/se-basics/${subject.id}` as any)}
            >
              <View style={styles.subjectLeft}>
                <Text style={styles.subjectIcon}>{SUBJECT_ICONS[subject.id] ?? "📖"}</Text>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectTitle}>{subject.title}</Text>
                  <Text style={styles.subjectDesc} numberOfLines={1}>{total} chapters</Text>
                  <View style={styles.progressRow}>
                    <ProgressBar value={done} max={total} color={colors.orange} height={3} />
                    <Text style={styles.progressText}>{done}/{total}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.sm },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  subjectLeft: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  subjectIcon: { fontSize: 24, marginTop: 2 },
  subjectInfo: { flex: 1, gap: 4 },
  subjectTitle: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary },
  subjectDesc: { fontSize: font.size.sm, color: colors.textSecondary },
  progressRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 4 },
  progressText: { fontSize: font.size.xs, color: colors.textMuted },
  chevron: { fontSize: 18, color: colors.textMuted },
});
