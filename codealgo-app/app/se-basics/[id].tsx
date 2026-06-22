import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SE_SUBJECTS, Chapter } from "@/data/seBasics";
import { useSEStore } from "@/lib/seStore";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, ProgressBar, ScreenHeader } from "@/components/ui";

export default function SESubjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isComplete, toggleChapter, subjectDone } = useSEStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  const subject = SE_SUBJECTS.find((s) => s.id === id);
  if (!subject) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Subject" back />
        <View style={styles.center}><Text style={styles.muted}>Subject not found.</Text></View>
      </SafeAreaView>
    );
  }

  const chapterIds = subject.chapters.map((c) => c.id);
  const done = subjectDone(subject.id, chapterIds);
  const total = chapterIds.length;

  const handleToggle = async (chapterId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleChapter(`${subject.id}/${chapterId}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={subject.title} subtitle={`${done}/${total} complete`} back />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <Card style={styles.progressCard}>
          <ProgressBar value={done} max={total} color={colors.orange} height={6} />
          <Text style={styles.progressText}>{done}/{total} chapters done</Text>
        </Card>

        {/* Chapters */}
        {subject.chapters.map((chapter) => {
          const key = `${subject.id}/${chapter.id}`;
          const complete = isComplete(key);
          const isOpen = expanded === chapter.id;

          // Extract summary from blocks
          const para = chapter.blocks?.find((b) => b.type === "para");
          const questions = chapter.blocks?.filter((b) => b.type === "interview").flatMap((b) => b.qas ?? []);

          return (
            <View key={chapter.id} style={[styles.chapter, complete && styles.chapterDone]}>
              <Pressable
                style={styles.chapterHeader}
                onPress={() => setExpanded(isOpen ? null : chapter.id)}
              >
                <Pressable onPress={() => handleToggle(chapter.id)} hitSlop={12}>
                  <Text style={[styles.chapterCheck, { color: complete ? colors.green : colors.border }]}>
                    {complete ? "✓" : "○"}
                  </Text>
                </Pressable>
                <Text style={[styles.chapterTitle, complete && styles.chapterTitleDone]}>
                  {chapter.num}. {chapter.title}
                </Text>
                <Text style={styles.chevron}>{isOpen ? "∧" : "∨"}</Text>
              </Pressable>

              {isOpen && (
                <View style={styles.chapterContent}>
                  {para?.text && (
                    <Text style={styles.para}>{para.text}</Text>
                  )}
                  {questions && questions.length > 0 && (
                    <View style={styles.qaSection}>
                      <Text style={styles.qaLabel}>Interview Questions</Text>
                      {questions.slice(0, 3).map((qa, i) => (
                        <View key={i} style={styles.qa}>
                          <Text style={styles.q}>Q: {qa.q}</Text>
                          <Text style={styles.a}>{qa.a}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <Pressable
                    style={styles.markBtn}
                    onPress={() => handleToggle(chapter.id)}
                  >
                    <Text style={[styles.markBtnText, complete && { color: colors.textMuted }]}>
                      {complete ? "Mark Incomplete" : "Mark Complete ✓"}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { color: colors.textMuted, fontSize: font.size.base },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.md },
  progressCard: { gap: spacing.sm },
  progressText: { fontSize: font.size.sm, color: colors.textMuted },
  chapter: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  chapterDone: { borderColor: colors.green },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  chapterCheck: { fontSize: 16 },
  chapterTitle: { flex: 1, fontSize: font.size.base, fontWeight: font.weight.semibold, color: colors.textPrimary },
  chapterTitleDone: { color: colors.textSecondary },
  chevron: { fontSize: 14, color: colors.textMuted },
  chapterContent: {
    padding: spacing.md,
    paddingTop: 0,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  para: { fontSize: font.size.base, color: colors.textSecondary, lineHeight: 22 },
  qaSection: { gap: spacing.sm },
  qaLabel: { fontSize: font.size.xs, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: font.weight.semibold },
  qa: { gap: 4, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  q: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textPrimary },
  a: { fontSize: font.size.sm, color: colors.textSecondary, lineHeight: 20 },
  markBtn: {
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.green,
    alignItems: "center",
    backgroundColor: colors.greenBg,
  },
  markBtnText: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.green },
});
