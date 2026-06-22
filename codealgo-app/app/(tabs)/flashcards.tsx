import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
const RNStyleSheet = StyleSheet;
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useFlashcardStore } from "@/lib/flashcardStore";
import { PATTERNS } from "@/data/problems";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, Badge, Button } from "@/components/ui";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

const FLASHCARDS: Flashcard[] = PATTERNS.flatMap((p) => [
  {
    id: `${p.id}-what`,
    front: `What is the ${p.title} pattern?`,
    back: p.coreIntuition,
    category: p.title,
  },
  {
    id: `${p.id}-when`,
    front: `When do you use ${p.title}?`,
    back: p.recognitionSignals.slice(0, 3).map((s, i) => `${i + 1}. ${s}`).join("\n"),
    category: p.title,
  },
  {
    id: `${p.id}-complexity`,
    front: `${p.title}: Time & Space complexity?`,
    back: `⏱ Time: ${p.timeComplexity}\n💾 Space: ${p.spaceComplexity}`,
    category: p.title,
  },
]);

// ── FlipCard with 3D animation + swipe gestures ───────────────────────────────

function FlipCard({
  card,
  onKnow,
  onWeak,
}: {
  card: Flashcard;
  onKnow: () => void;
  onWeak: () => void;
}) {
  const flip = useSharedValue(0);
  const translateX = useSharedValue(0);
  const tiltZ = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset when card changes
  useEffect(() => {
    flip.value = 0;
    translateX.value = 0;
    tiltZ.value = 0;
    setIsFlipped(false);
  }, [card.id]);

  // Front face: 0° → 90° then hidden
  const frontStyle = useAnimatedStyle(() => {
    const rotY = interpolate(flip.value, [0, 0.5], [0, 90], Extrapolation.CLAMP);
    const opacity = interpolate(flip.value, [0, 0.44], [1, 0], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ perspective: 1200 }, { rotateY: `${rotY}deg` }],
    };
  });

  // Back face: –90° → 0° fading in
  const backStyle = useAnimatedStyle(() => {
    const rotY = interpolate(flip.value, [0.5, 1], [-90, 0], Extrapolation.CLAMP);
    const opacity = interpolate(flip.value, [0.56, 1], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ perspective: 1200 }, { rotateY: `${rotY}deg` }],
    };
  });

  // Card translates + tilts while swiping
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${tiltZ.value}deg` },
    ],
  }));

  // Color overlay (green right / red left)
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(translateX.value), [0, 100], [0, 0.45], Extrapolation.CLAMP),
    backgroundColor: translateX.value > 0 ? colors.green : colors.red,
  }));

  // "Got it ✓" badge fades in when swiping right
  const knowBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [20, 90], [0, 1], Extrapolation.CLAMP),
  }));
  // "Again ↩" badge fades in when swiping left
  const weakBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-20, -90], [0, 1], Extrapolation.CLAMP),
  }));

  const doKnow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onKnow();
  };
  const doWeak = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onWeak();
  };

  const tap = Gesture.Tap()
    .enabled(!isFlipped)
    .onStart(() => {
      flip.value = withTiming(1, { duration: 370 });
      runOnJS(setIsFlipped)(true);
    });

  const pan = Gesture.Pan()
    .enabled(isFlipped)
    .activeOffsetX([-12, 12])
    .onUpdate((e) => {
      translateX.value = e.translationX;
      tiltZ.value = e.translationX * 0.055;
    })
    .onEnd((e) => {
      if (e.translationX > 80) {
        translateX.value = withSpring(520, { damping: 18 }, (done) => {
          if (done) runOnJS(doKnow)();
        });
      } else if (e.translationX < -80) {
        translateX.value = withSpring(-520, { damping: 18 }, (done) => {
          if (done) runOnJS(doWeak)();
        });
      } else {
        translateX.value = withSpring(0);
        tiltZ.value = withSpring(0);
      }
    });

  const composed = Gesture.Exclusive(pan, tap);

  return (
    <View style={styles.cardWrapper}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.cardOuter, cardStyle]}>
          {/* Front face */}
          <Animated.View style={[RNStyleSheet.absoluteFill, styles.face, frontStyle]}>
            <Text style={styles.cardHint}>TAP TO FLIP</Text>
            <Text style={styles.cardText}>{card.front}</Text>
            <Badge label={card.category} size="sm" />
          </Animated.View>

          {/* Back face */}
          <Animated.View style={[RNStyleSheet.absoluteFill, styles.face, backStyle]}>
            <Text style={styles.cardHint}>ANSWER</Text>
            <Text style={styles.cardText}>{card.back}</Text>
            <Text style={styles.swipeHint}>← Again  ·  Got it →</Text>
          </Animated.View>

          {/* Swipe color overlay */}
          <Animated.View
            style={[RNStyleSheet.absoluteFill, styles.overlay, overlayStyle]}
            pointerEvents="none"
          >
            <Animated.Text style={[styles.swipeBadge, styles.swipeBadgeKnow, knowBadgeStyle]}>
              ✓ Got it!
            </Animated.Text>
            <Animated.Text style={[styles.swipeBadge, styles.swipeBadgeWeak, weakBadgeStyle]}>
              ↩ Again
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* Button fallback when flipped */}
      {isFlipped && (
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, styles.weakBtn, pressed && { opacity: 0.8 }]}
            onPress={doWeak}
          >
            <Text style={[styles.actionText, { color: colors.red }]}>😰 Again</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, styles.knowBtn, pressed && { opacity: 0.8 }]}
            onPress={doKnow}
          >
            <Text style={[styles.actionText, { color: colors.green }]}>✓ Got it</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function FlashcardsScreen() {
  const { markKnown, markWeak, isKnown, isWeak, isDue, getDueCount } = useFlashcardStore();
  const [mode, setMode] = useState<"due" | "all" | "weak">("due");
  const [idx, setIdx] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [started, setStarted] = useState(false);

  const deck = useMemo(() => {
    if (mode === "due") return FLASHCARDS.filter((c) => isDue(c.id));
    if (mode === "weak") return FLASHCARDS.filter((c) => isWeak(c.id));
    return FLASHCARDS;
  }, [mode, isKnown, isWeak]);

  const dueCount = getDueCount(FLASHCARDS.map((c) => c.id));
  const knownCount = FLASHCARDS.filter((c) => isKnown(c.id)).length;
  const weakCount = FLASHCARDS.filter((c) => isWeak(c.id)).length;

  const handleKnow = () => {
    markKnown(deck[idx].id);
    if (idx + 1 >= deck.length) setSessionDone(true);
    else setIdx(idx + 1);
  };

  const handleWeak = () => {
    markWeak(deck[idx].id);
    if (idx + 1 >= deck.length) setSessionDone(true);
    else setIdx(idx + 1);
  };

  const restart = () => {
    setIdx(0);
    setSessionDone(false);
    setStarted(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Flashcards</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { num: dueCount, label: "Due", color: colors.orange },
            { num: knownCount, label: "Known", color: colors.green },
            { num: weakCount, label: "Weak", color: colors.red },
            { num: FLASHCARDS.length, label: "Total", color: colors.accent },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard}>
              <Text style={[styles.statNum, { color: s.color }]}>{s.num}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Mode selector */}
        <View style={styles.modeRow}>
          {(
            [
              ["due", "Due Today"],
              ["weak", "Weak"],
              ["all", "All Cards"],
            ] as const
          ).map(([key, label]) => (
            <Pressable
              key={key}
              style={[styles.modeBtn, mode === key && styles.modeBtnActive]}
              onPress={() => {
                setMode(key);
                setIdx(0);
                setSessionDone(false);
                setStarted(false);
              }}
            >
              <Text style={[styles.modeBtnText, mode === key && styles.modeBtnTextActive]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Card area */}
        {deck.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>
              No {mode === "due" ? "cards due" : mode === "weak" ? "weak cards" : "cards"} right now.
            </Text>
            <Button
              label="Review All"
              onPress={() => { setMode("all"); setIdx(0); setSessionDone(false); setStarted(false); }}
              style={{ marginTop: spacing.md, alignSelf: "center" }}
            />
          </Card>
        ) : sessionDone ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>Session complete!</Text>
            <Text style={styles.emptySub}>{deck.length} cards reviewed.</Text>
            <Button label="Go Again" onPress={restart} style={{ marginTop: spacing.md, alignSelf: "center" }} />
          </Card>
        ) : !started ? (
          /* Pre-session overview */
          <Card style={styles.startCard}>
            <Text style={styles.startIcon}>{mode === "due" ? "⏰" : mode === "weak" ? "💪" : "📚"}</Text>
            <Text style={styles.startTitle}>
              {mode === "due" ? "Due Today" : mode === "weak" ? "Weak Cards" : "All Cards"}
            </Text>
            <Text style={styles.startCount}>{deck.length} card{deck.length !== 1 ? "s" : ""} in this session</Text>
            <View style={styles.startStats}>
              <View style={styles.startStat}>
                <Text style={[styles.startStatNum, { color: colors.orange }]}>{dueCount}</Text>
                <Text style={styles.startStatLbl}>Due</Text>
              </View>
              <View style={styles.startStatDivider} />
              <View style={styles.startStat}>
                <Text style={[styles.startStatNum, { color: colors.green }]}>{knownCount}</Text>
                <Text style={styles.startStatLbl}>Known</Text>
              </View>
              <View style={styles.startStatDivider} />
              <View style={styles.startStat}>
                <Text style={[styles.startStatNum, { color: colors.red }]}>{weakCount}</Text>
                <Text style={styles.startStatLbl}>Weak</Text>
              </View>
            </View>
            <Button label="Start Session →" onPress={() => setStarted(true)} fullWidth style={{ marginTop: spacing.sm }} />
          </Card>
        ) : (
          <View>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(idx / deck.length) * 100}%` as any }]} />
              </View>
              <Text style={styles.progressText}>{idx + 1}/{deck.length}</Text>
            </View>
            <FlipCard
              key={`${deck[idx].id}-${idx}`}
              card={deck[idx]}
              onKnow={handleKnow}
              onWeak={handleWeak}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  title: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.textPrimary },

  statsRow: { flexDirection: "row", gap: spacing.sm },
  statCard: { flex: 1, alignItems: "center", paddingVertical: 10, paddingHorizontal: 4 },
  statNum: { fontSize: font.size.lg, fontWeight: font.weight.bold },
  statLbl: { fontSize: font.size.xs, color: colors.textSecondary },

  modeRow: { flexDirection: "row", gap: spacing.sm },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.md,
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeBtnActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  modeBtnText: { fontSize: font.size.sm, color: colors.textSecondary, fontWeight: font.weight.medium },
  modeBtnTextActive: { color: colors.accent },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },
  progressText: { fontSize: font.size.sm, color: colors.textMuted, width: 40, textAlign: "right" },

  // Card
  cardWrapper: { gap: spacing.md },
  cardOuter: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 260,
    overflow: "hidden",
  },
  face: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  cardHint: {
    fontSize: font.size.xs,
    color: colors.textMuted,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  cardText: {
    fontSize: font.size.md,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 24,
  },
  swipeHint: {
    fontSize: font.size.sm,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  overlay: {
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  swipeBadge: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: radius.md,
    overflow: "hidden",
    position: "absolute",
  },
  swipeBadgeKnow: {
    color: colors.green,
    backgroundColor: colors.greenBg,
    right: 20,
    top: 20,
  },
  swipeBadgeWeak: {
    color: colors.red,
    backgroundColor: colors.redBg,
    left: 20,
    top: 20,
  },

  // Action buttons (fallback)
  actions: { flexDirection: "row", gap: spacing.md },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: "center",
    borderWidth: 1,
  },
  weakBtn: { backgroundColor: colors.redBg, borderColor: colors.red },
  knowBtn: { backgroundColor: colors.greenBg, borderColor: colors.green },
  actionText: { fontSize: font.size.base, fontWeight: font.weight.semibold },

  emptyCard: { alignItems: "center", paddingVertical: spacing.xxl, gap: spacing.sm },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.textPrimary },
  emptySub: { fontSize: font.size.base, color: colors.textSecondary, textAlign: "center" },

  // Pre-session start card
  startCard: { alignItems: "center", paddingVertical: spacing.xl, gap: spacing.md },
  startIcon: { fontSize: 40 },
  startTitle: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.textPrimary },
  startCount: { fontSize: font.size.base, color: colors.textSecondary },
  startStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md,
    width: "100%",
    justifyContent: "center",
  },
  startStat: { alignItems: "center", gap: 2 },
  startStatNum: { fontSize: font.size.xl, fontWeight: font.weight.extrabold },
  startStatLbl: { fontSize: font.size.xs, color: colors.textSecondary },
  startStatDivider: { width: 1, height: 32, backgroundColor: colors.border },
});
