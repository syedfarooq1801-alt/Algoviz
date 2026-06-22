import { useState, useMemo, useRef, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Linking, TextInput, AppState, AppStateStatus, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { PATTERNS } from "@/data/problems";
import { PROBLEM_CONTENT } from "@/data/problemContent";
import { useProgressStore } from "@/lib/store";
import { usePrepStore } from "@/lib/prepStore";
import { useNotesStore } from "@/lib/notesStore";
import { colors, font, spacing, radius, diffColor, diffBg } from "@/lib/theme";
import { CodeBlock, Badge, ScreenHeader, Card } from "@/components/ui";

const ALL_PROBLEMS = PATTERNS.flatMap((p) => p.problems);
const HIGH_FREQ = ALL_PROBLEMS.filter((p) => p.frequency === "High");

function getDailyChallengeId(dateStr: string, solvedSet: Set<string>): string {
  const unsolved = HIGH_FREQ.filter((p) => !solvedSet.has(p.id));
  const pool = unsolved.length > 0 ? unsolved : HIGH_FREQ;
  let hash = 0;
  for (const ch of dateStr) hash = ((hash * 31 + ch.charCodeAt(0)) | 0);
  return pool[Math.abs(hash) % pool.length].id;
}

const TABS = ["Overview", "Hints", "Solution", "Notes"] as const;
type Tab = typeof TABS[number];

const TIME_OPTIONS = [
  { label: "< 10 min", minutes: 8 },
  { label: "10–20 min", minutes: 15 },
  { label: "20–30 min", minutes: 25 },
  { label: "30–45 min", minutes: 37 },
  { label: "45–60 min", minutes: 52 },
  { label: "60+ min", minutes: 75 },
] as const;

export default function ProblemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("Overview");
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showBonusToast, setShowBonusToast] = useState(false);

  const prob = useMemo(() => ALL_PROBLEMS.find((p) => p.id === id), [id]);
  const content = PROBLEM_CONTENT[id ?? ""];

  const { isSolved, isBookmarked, toggleSolved, toggleBookmark, setSolveTime, solved: solvedSet, addXP } = useProgressStore();
  const { scheduleReview, setProblemState } = usePrepStore();
  const { getNote, setNote } = useNotesStore();

  // Track LeetCode session: store timestamp when user opens LeetCode
  const leetcodeSessionRef = useRef<{ problemId: string; openedAt: number } | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // AppState listener — detect return from LeetCode
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === "active") {
        // App came to foreground
        if (leetcodeSessionRef.current) {
          const elapsed = Date.now() - leetcodeSessionRef.current.openedAt;
          // Only show modal if user was away at least 60 seconds (actual session, not accidental)
          if (elapsed >= 60000) {
            setShowTimeModal(true);
          } else {
            leetcodeSessionRef.current = null;
          }
        }
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, []);

  // Celebration animation on first solve
  const solveScale = useSharedValue(1);
  const solveBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: solveScale.value }],
  }));

  if (!prob) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Problem" back />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Problem not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const solved = isSolved(prob.id);
  const bookmarked = isBookmarked(prob.id);
  const today = new Date().toISOString().split("T")[0];
  const dueDate = usePrepStore.getState().reviewDue[prob.id];
  const isDue = dueDate && dueDate <= today;

  const handleToggleSolved = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const isDaily = getDailyChallengeId(today, solvedSet) === prob.id;
    toggleSolved(prob.id);
    if (!solved) {
      setProblemState(prob.id, "solved");
      scheduleReview(prob.id, "solved");
      if (isDaily) {
        addXP(15); // +15 bonus on top of base +10 = +25 total
        setShowBonusToast(true);
        setTimeout(() => setShowBonusToast(false), 2500);
      }
      solveScale.value = withSequence(
        withSpring(1.25, { damping: 5, stiffness: 300 }),
        withSpring(1, { damping: 8 })
      );
    }
  };

  const handleToggleBookmark = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(prob.id);
  };

  const handleOpenLeetCode = () => {
    leetcodeSessionRef.current = { problemId: prob.id, openedAt: Date.now() };
    Linking.openURL(prob.leetcodeUrl);
  };

  const handleTimeSelect = (minutes: number) => {
    if (leetcodeSessionRef.current) {
      setSolveTime(leetcodeSessionRef.current.problemId, minutes);
      leetcodeSessionRef.current = null;
    }
    setShowTimeModal(false);
  };

  const handleTimeSkip = () => {
    leetcodeSessionRef.current = null;
    setShowTimeModal(false);
  };

  const approachSteps: string[] = content?.approach ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={prob.title}
        back
        right={
          <View style={styles.headerActions}>
            <Pressable onPress={handleToggleBookmark} hitSlop={10}>
              <Text style={{ fontSize: 20, opacity: bookmarked ? 1 : 0.4 }}>🔖</Text>
            </Pressable>
            <Animated.View style={solveBtnStyle}>
              <Pressable
                onPress={handleToggleSolved}
                style={[styles.solveBtn, solved && styles.solveBtnDone]}
                hitSlop={4}
              >
                <Text style={[styles.solveBtnText, solved && styles.solveBtnTextDone]}>
                  {solved ? "✓ Solved" : "Mark Solved"}
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        }
      />

      {/* Daily bonus toast */}
      {showBonusToast && (
        <View style={styles.bonusToast}>
          <Text style={styles.bonusToastText}>🎯 +25 XP Daily Challenge Bonus!</Text>
        </View>
      )}

      {/* Meta badges */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metaRow}>
        <Badge label={prob.difficulty} color={diffColor[prob.difficulty]} bg={diffBg[prob.difficulty]} />
        <Badge label={prob.pattern} />
        {prob.frequency && <Badge label={prob.frequency + " freq"} color={colors.purple} bg={colors.purpleBg} />}
        {isDue && <Badge label="Review Due" color={colors.orange} bg={colors.orangeBg} />}
        {prob.companies?.slice(0, 3).map((c) => (
          <Badge key={c} label={c} color={colors.textSecondary} bg={colors.bgHover} />
        ))}
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === "Overview" && (
          <View style={styles.section}>
            {content?.intuition && (
              <View>
                <Text style={styles.h3}>Intuition</Text>
                <Text style={styles.body}>{content.intuition}</Text>
              </View>
            )}
            {content?.memoryTrick && (
              <Card style={styles.trickCard}>
                <Text style={styles.trickLabel}>💡 Memory Trick</Text>
                <Text style={styles.trickText}>{content.memoryTrick}</Text>
              </Card>
            )}
            {content?.timeComplexity && (
              <View style={styles.complexityRow}>
                <View style={styles.complexityItem}>
                  <Text style={styles.complexityLabel}>Time</Text>
                  <Text style={styles.complexityValue}>{content.timeComplexity}</Text>
                  {content.timeExplanation && (
                    <Text style={styles.complexitySub}>{content.timeExplanation}</Text>
                  )}
                </View>
                <View style={styles.complexityItem}>
                  <Text style={styles.complexityLabel}>Space</Text>
                  <Text style={styles.complexityValue}>{content.spaceComplexity}</Text>
                  {content.spaceExplanation && (
                    <Text style={styles.complexitySub}>{content.spaceExplanation}</Text>
                  )}
                </View>
              </View>
            )}
            {content?.edgeCases && content.edgeCases.length > 0 && (
              <View>
                <Text style={styles.h3}>Edge Cases</Text>
                {content.edgeCases.map((e: string, i: number) => (
                  <Text key={i} style={styles.bullet}>• {e}</Text>
                ))}
              </View>
            )}
            {prob.leetcodeUrl && (
              <Pressable
                onPress={handleOpenLeetCode}
                style={({ pressed }) => [pressed && { opacity: 0.75 }]}
              >
                <Card style={styles.lcCardInner}>
                  <Text style={styles.lcText}>
                    🔗 {prob.leetcodeUrl.replace("https://leetcode.com/problems/", "").replace(/\/$/, "")}
                  </Text>
                  <Text style={styles.lcOpen}>Open ›</Text>
                </Card>
              </Pressable>
            )}
          </View>
        )}

        {tab === "Hints" && (
          <View style={styles.section}>
            <Text style={styles.h3}>Step-by-step Hints</Text>
            <Text style={styles.hintSubtitle}>
              Reveal one hint at a time before looking at the solution.
            </Text>

            {approachSteps.length === 0 ? (
              <View style={styles.noSolution}>
                <Text style={styles.noSolutionText}>No hints available for this problem.</Text>
              </View>
            ) : (
              <>
                {approachSteps.slice(0, hintsRevealed).map((step: string, i: number) => (
                  <Card key={i} style={styles.hintCard}>
                    <Text style={styles.hintNum}>Hint {i + 1}</Text>
                    <Text style={styles.hintText}>{step}</Text>
                  </Card>
                ))}

                {hintsRevealed < approachSteps.length ? (
                  <Pressable
                    style={({ pressed }) => [styles.showHintBtn, pressed && { opacity: 0.8 }]}
                    onPress={() => setHintsRevealed((h) => h + 1)}
                  >
                    <Text style={styles.showHintText}>
                      {hintsRevealed === 0 ? "Show first hint" : "Show next hint"}{" "}
                      <Text style={styles.showHintCount}>
                        ({approachSteps.length - hintsRevealed} remaining)
                      </Text>
                    </Text>
                  </Pressable>
                ) : (
                  <Card style={styles.allRevealedCard}>
                    <Text style={styles.allRevealedText}>
                      ✓ All {approachSteps.length} hints revealed. Check the Solution tab for the full code.
                    </Text>
                  </Card>
                )}
              </>
            )}
          </View>
        )}

        {tab === "Solution" && (
          <View style={styles.section}>
            {content?.approach && content.approach.length > 0 && (
              <View style={{ marginBottom: spacing.lg }}>
                <Text style={styles.h3}>Approach</Text>
                {content.approach.map((step: string, i: number) => (
                  <Text key={i} style={styles.step}>{i + 1}. {step}</Text>
                ))}
              </View>
            )}
            {content?.cppSolution ? (
              <CodeBlock code={content.cppSolution} language="C++" />
            ) : (
              <View style={styles.noSolution}>
                <Text style={styles.noSolutionText}>No solution available yet.</Text>
              </View>
            )}
          </View>
        )}

        {tab === "Notes" && (
          <NotesTab id={prob.id} note={getNote(prob.id)} setNote={setNote} />
        )}
      </ScrollView>

      {/* SRS review buttons */}
      {solved && (
        <View style={styles.reviewBar}>
          <Text style={styles.reviewLabel}>Review:</Text>
          <Pressable
            style={[styles.reviewBtn, { borderColor: colors.red }]}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              scheduleReview(prob.id, "failed");
            }}
          >
            <Text style={[styles.reviewBtnText, { color: colors.red }]}>😰 Hard</Text>
          </Pressable>
          <Pressable
            style={[styles.reviewBtn, { borderColor: colors.orange }]}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              scheduleReview(prob.id, "reviewed-fast");
            }}
          >
            <Text style={[styles.reviewBtnText, { color: colors.orange }]}>😐 OK</Text>
          </Pressable>
          <Pressable
            style={[styles.reviewBtn, { borderColor: colors.green }]}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              scheduleReview(prob.id, "mastered");
            }}
          >
            <Text style={[styles.reviewBtnText, { color: colors.green }]}>✓ Easy</Text>
          </Pressable>
        </View>
      )}

      {/* Solve time modal */}
      <Modal visible={showTimeModal} transparent animationType="fade" onRequestClose={handleTimeSkip}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>⏱ How long did it take?</Text>
            <Text style={styles.modalSub}>Log your solve time for analytics</Text>
            <View style={styles.timeGrid}>
              {TIME_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.label}
                  style={({ pressed }) => [styles.timeBtn, pressed && { opacity: 0.7 }]}
                  onPress={() => handleTimeSelect(opt.minutes)}
                >
                  <Text style={styles.timeBtnText}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.skipBtn} onPress={handleTimeSkip}>
              <Text style={styles.skipBtnText}>Skip</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function NotesTab({ id, note, setNote }: { id: string; note: string; setNote: (id: string, t: string) => void }) {
  const [text, setText] = useState(note);
  const [saved, setSaved] = useState(true);

  const handleChange = (val: string) => { setText(val); setSaved(false); };
  const handleSave = () => { setNote(id, text); setSaved(true); };

  return (
    <View style={styles.notes}>
      <View style={styles.notesHeader}>
        <Text style={styles.h3}>Personal Notes</Text>
        {!saved && (
          <Pressable onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
        )}
      </View>
      <TextInput
        style={styles.notesInput}
        value={text}
        onChangeText={handleChange}
        multiline
        placeholder="Write your approach, gotchas, or notes here..."
        placeholderTextColor={colors.textMuted}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { color: colors.textMuted, fontSize: font.size.base },
  headerActions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  solveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  solveBtnDone: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  solveBtnText: { fontSize: font.size.xs, color: colors.accent, fontWeight: font.weight.semibold },
  solveBtnTextDone: { color: colors.accent },
  metaRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm, flexDirection: "row" },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.border, marginHorizontal: spacing.lg },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: colors.accent },
  tabText: { fontSize: font.size.xs, color: colors.textMuted, fontWeight: font.weight.medium },
  tabTextActive: { color: colors.accent, fontSize: font.size.xs },
  content: { padding: spacing.lg, paddingBottom: 40 },
  section: { gap: spacing.lg },
  h3: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  body: { fontSize: font.size.base, color: colors.textSecondary, lineHeight: 22 },
  step: { fontSize: font.size.base, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.sm },
  bullet: { fontSize: font.size.base, color: colors.textSecondary, lineHeight: 22, marginBottom: 4 },
  trickCard: { backgroundColor: colors.accentSoft, borderColor: colors.accent, gap: spacing.sm },
  trickLabel: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.accent },
  trickText: { fontSize: font.size.base, color: colors.textPrimary, lineHeight: 22 },
  complexityRow: { flexDirection: "row", gap: spacing.md },
  complexityItem: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  complexityLabel: { fontSize: font.size.xs, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.6 },
  complexityValue: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.accent },
  complexitySub: { fontSize: font.size.xs, color: colors.textSecondary },
  lcCardInner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  lcText: { fontSize: font.size.sm, color: colors.accent, flex: 1 },
  lcOpen: { fontSize: font.size.sm, color: colors.accent, fontWeight: font.weight.semibold },

  // Hints tab
  hintSubtitle: { fontSize: font.size.sm, color: colors.textMuted, marginTop: -spacing.sm },
  hintCard: {
    backgroundColor: colors.bgCard,
    borderColor: colors.accent,
    borderWidth: 1,
    gap: spacing.sm,
  },
  hintNum: { fontSize: font.size.xs, color: colors.accent, fontWeight: font.weight.semibold, textTransform: "uppercase", letterSpacing: 0.6 },
  hintText: { fontSize: font.size.base, color: colors.textPrimary, lineHeight: 22 },
  showHintBtn: {
    paddingVertical: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.bgCard,
  },
  showHintText: { fontSize: font.size.base, color: colors.textPrimary, fontWeight: font.weight.medium },
  showHintCount: { color: colors.textMuted, fontWeight: font.weight.normal },
  allRevealedCard: { backgroundColor: colors.greenBg, borderColor: colors.green },
  allRevealedText: { fontSize: font.size.sm, color: colors.green },

  noSolution: { alignItems: "center", paddingTop: 60 },
  noSolutionText: { color: colors.textMuted },
  notes: { gap: spacing.md },
  notesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  notesInput: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontSize: font.size.base,
    padding: spacing.md,
    minHeight: 280,
    lineHeight: 22,
  },
  saveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  saveBtnText: { fontSize: font.size.sm, color: colors.accent, fontWeight: font.weight.semibold },
  reviewBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgSecondary,
  },
  reviewLabel: { fontSize: font.size.sm, color: colors.textMuted, marginRight: 4 },
  reviewBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  reviewBtnText: { fontSize: font.size.sm, fontWeight: font.weight.semibold },

  // Solve time modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalBox: {
    width: "100%",
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.textPrimary, textAlign: "center" },
  modalSub: { fontSize: font.size.sm, color: colors.textMuted, textAlign: "center", marginTop: -spacing.sm },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  timeBtn: {
    width: "30%",
    flex: 1,
    minWidth: "30%",
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSecondary,
    alignItems: "center",
  },
  timeBtnText: { fontSize: font.size.sm, color: colors.textPrimary, fontWeight: font.weight.medium },
  skipBtn: {
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  skipBtnText: { fontSize: font.size.sm, color: colors.textMuted },
  bonusToast: {
    backgroundColor: colors.orangeBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.orange,
    paddingVertical: 8,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  bonusToastText: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.orange },
});
