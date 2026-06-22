import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { usePrepStore, PREP_TRACKS, PrepTrackId } from "@/lib/prepStore";
import { useProgressStore } from "@/lib/store";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Button } from "@/components/ui";

const DURATIONS = [30, 60, 90] as const;

const DURATION_LABELS: Record<typeof DURATIONS[number], string> = {
  30: "Sprint — 30 days, highest ROI problems only",
  60: "Standard — 60 days, full DSA + system design",
  90: "Deep — 90 days, everything including SE basics",
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { setTrack, selectedTrack } = usePrepStore();
  const { setStudyPlanDuration, studyPlanDuration, setHasCompletedOnboarding } = useProgressStore();
  const [step, setStep] = useState<1 | 2>(1);

  const finish = () => {
    setHasCompletedOnboarding(true);
    router.replace("/(tabs)");
  };

  if (step === 1) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.top}>
            <Text style={styles.emoji}>🎯</Text>
            <Text style={styles.title}>What's your goal?</Text>
            <Text style={styles.sub}>Pick the track that fits your situation. You can change this later in Settings.</Text>
          </View>

          <View style={styles.list}>
            {(Object.entries(PREP_TRACKS) as [PrepTrackId, { title: string; focus: string }][]).map(
              ([id, track]) => (
                <Pressable
                  key={id}
                  style={[styles.card, selectedTrack === id && styles.cardActive]}
                  onPress={() => setTrack(id)}
                >
                  <View style={styles.cardRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cardTitle, selectedTrack === id && styles.cardTitleActive]}>
                        {track.title}
                      </Text>
                      <Text style={styles.cardSub}>{track.focus}</Text>
                    </View>
                    {selectedTrack === id && (
                      <Text style={styles.check}>✓</Text>
                    )}
                  </View>
                </Pressable>
              )
            )}
          </View>

          <Button label="Next →" onPress={() => setStep(2)} fullWidth />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Text style={styles.emoji}>📅</Text>
          <Text style={styles.title}>How long do you have?</Text>
          <Text style={styles.sub}>Sets your study plan length and daily task density.</Text>
        </View>

        <View style={styles.durationList}>
          {DURATIONS.map((d) => (
            <Pressable
              key={d}
              style={[styles.durationCard, studyPlanDuration === d && styles.durationCardActive]}
              onPress={() => setStudyPlanDuration(d)}
            >
              <View style={styles.durationRow}>
                <Text style={[styles.durationNum, studyPlanDuration === d && styles.durationNumActive]}>
                  {d} days
                </Text>
                {studyPlanDuration === d && <Text style={styles.check}>✓</Text>}
              </View>
              <Text style={[styles.durationDesc, studyPlanDuration === d && { color: colors.textSecondary }]}>
                {DURATION_LABELS[d]}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.btnRow}>
          <Pressable onPress={() => setStep(1)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </Pressable>
          <Button label="Let's start 🚀" onPress={finish} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 48, gap: spacing.xl },
  top: { gap: spacing.sm, alignItems: "center", paddingTop: spacing.xl },
  emoji: { fontSize: 48 },
  title: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  sub: {
    fontSize: font.size.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  list: { gap: spacing.sm },
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  cardActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  cardRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  cardTitle: { fontSize: font.size.base, fontWeight: font.weight.semibold, color: colors.textSecondary, marginBottom: 3 },
  cardTitleActive: { color: colors.accent },
  cardSub: { fontSize: font.size.xs, color: colors.textMuted, lineHeight: 16 },
  check: { fontSize: 16, color: colors.accent, fontWeight: font.weight.bold },
  durationList: { gap: spacing.sm },
  durationCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    gap: 6,
  },
  durationCardActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  durationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  durationNum: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.textSecondary },
  durationNumActive: { color: colors.accent },
  durationDesc: { fontSize: font.size.xs, color: colors.textMuted, lineHeight: 16 },
  btnRow: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backBtnText: { fontSize: font.size.base, color: colors.textSecondary },
});
