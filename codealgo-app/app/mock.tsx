import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { PATTERNS, Problem } from "@/data/problems";
import { usePrepStore, MockProblemReview } from "@/lib/prepStore";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, Badge, ScreenHeader, Button } from "@/components/ui";

const ALL_PROBLEMS = PATTERNS.flatMap((p) => p.problems);

type MockStep = "setup" | "problem" | "review" | "results";

interface MockConfig {
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  count: 1 | 2 | 3;
  durationMins: 30 | 45 | 60 | 90;
}

const DEFAULT_CONFIG: MockConfig = { difficulty: "Mixed", count: 2, durationMins: 60 };

const RING_SIZE = 96;
const STROKE_WIDTH = 7;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircularTimer({ elapsed, totalSecs }: { elapsed: number; totalSecs: number }) {
  const timeLeft = Math.max(0, totalSecs - elapsed);
  const progress = Math.min(1, elapsed / totalSecs);
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isLow = timeLeft < 300;

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const label = `${m}:${s.toString().padStart(2, "0")}`;

  const strokeColor = isLow ? colors.red : colors.accent;

  return (
    <View style={ringStyles.container}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        {/* Track */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={colors.bgHover}
          strokeWidth={STROKE_WIDTH}
        />
        {/* Progress */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
        />
      </Svg>
      <View style={ringStyles.label}>
        <Text style={[ringStyles.time, isLow && { color: colors.red }]}>{label}</Text>
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.textPrimary,
  },
});

function pickProblems(config: MockConfig): Problem[] {
  let pool = ALL_PROBLEMS;
  if (config.difficulty !== "Mixed") pool = pool.filter((p) => p.difficulty === config.difficulty);
  const highFreq = pool.filter((p) => p.frequency === "High");
  const source = highFreq.length >= config.count ? highFreq : pool;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, config.count);
}

export default function MockScreen() {
  const { addMockSession } = usePrepStore();
  const [step, setStep] = useState<MockStep>("setup");
  const [config, setConfig] = useState<MockConfig>(DEFAULT_CONFIG);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [probIdx, setProbIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [reviews, setReviews] = useState<Partial<MockProblemReview>[]>([]);
  const [currentReview, setCurrentReview] = useState<Partial<MockProblemReview>>({});
  const [sessionResult, setSessionResult] = useState<ReturnType<typeof addMockSession> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startMock = () => {
    const probs = pickProblems(config);
    setProblems(probs);
    setProbIdx(0);
    setElapsed(0);
    setReviews([]);
    setCurrentReview({
      problemId: probs[0].id,
      title: probs[0].title,
      pattern: probs[0].pattern,
      difficulty: probs[0].difficulty,
      solved: false,
      timeSpentSecs: 0,
      complexityStated: false,
      edgeCasesConsidered: false,
      solutionRevealed: false,
      selfExplainScore: 0,
      notes: "",
    });
    setStep("problem");
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  const goToReview = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentReview((r) => ({ ...r, timeSpentSecs: elapsed }));
    setStep("review");
  };

  const submitReview = () => {
    const completed = [...reviews, { ...currentReview, timeSpentSecs: elapsed }] as MockProblemReview[];
    if (probIdx + 1 < problems.length) {
      setReviews(completed);
      setProbIdx(probIdx + 1);
      const next = problems[probIdx + 1];
      setCurrentReview({
        problemId: next.id,
        title: next.title,
        pattern: next.pattern,
        difficulty: next.difficulty,
        solved: false,
        timeSpentSecs: 0,
        complexityStated: false,
        edgeCasesConsidered: false,
        solutionRevealed: false,
        selfExplainScore: 0,
        notes: "",
      });
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      setStep("problem");
    } else {
      const result = addMockSession({
        durationMins: Math.round(elapsed / 60),
        difficulty: config.difficulty,
        problems: completed,
      });
      setSessionResult(result);
      setStep("results");
    }
  };

  const toggle = (field: keyof MockProblemReview) => {
    setCurrentReview((r) => ({ ...r, [field]: !r[field as keyof typeof r] }));
  };

  if (step === "setup") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Mock Interview" back />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.hint}>Simulate real interview conditions. No looking things up.</Text>

          <Card style={styles.section}>
            <Text style={styles.h3}>Difficulty</Text>
            <View style={styles.optionRow}>
              {(["Easy", "Medium", "Hard", "Mixed"] as const).map((d) => (
                <Pressable
                  key={d}
                  style={[styles.optionBtn, config.difficulty === d && styles.optionBtnActive]}
                  onPress={() => setConfig((c) => ({ ...c, difficulty: d }))}
                >
                  <Text style={[styles.optionText, config.difficulty === d && styles.optionTextActive]}>{d}</Text>
                </Pressable>
              ))}
            </View>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.h3}>Number of Problems</Text>
            <View style={styles.optionRow}>
              {([1, 2, 3] as const).map((n) => (
                <Pressable
                  key={n}
                  style={[styles.optionBtn, config.count === n && styles.optionBtnActive]}
                  onPress={() => setConfig((c) => ({ ...c, count: n }))}
                >
                  <Text style={[styles.optionText, config.count === n && styles.optionTextActive]}>{n}</Text>
                </Pressable>
              ))}
            </View>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.h3}>Session Duration</Text>
            <View style={styles.optionRow}>
              {([30, 45, 60, 90] as const).map((m) => (
                <Pressable
                  key={m}
                  style={[styles.optionBtn, config.durationMins === m && styles.optionBtnActive]}
                  onPress={() => setConfig((c) => ({ ...c, durationMins: m }))}
                >
                  <Text style={[styles.optionText, config.durationMins === m && styles.optionTextActive]}>{m}m</Text>
                </Pressable>
              ))}
            </View>
          </Card>

          <Button label="Start Mock Interview" onPress={startMock} fullWidth size="lg" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === "problem" && problems[probIdx]) {
    const prob = problems[probIdx];
    const totalSecs = config.durationMins * 60;
    return (
      <SafeAreaView style={styles.safe}>
        {/* Timer bar with circular ring */}
        <View style={styles.timerBar}>
          <Text style={styles.timerProblem}>{probIdx + 1}/{problems.length}</Text>
          <CircularTimer elapsed={elapsed} totalSecs={totalSecs} />
          <Pressable onPress={goToReview} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>Done →</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <Badge label={prob.difficulty} color={colors.textSecondary} bg={colors.bgHover} />
          <Text style={styles.probTitle}>{prob.title}</Text>
          <Text style={styles.probPattern}>Pattern: {prob.pattern}</Text>

          <Card style={styles.warningCard}>
            <Text style={styles.warningText}>
              ⚠️ Solve this without looking at the solution. Jot approach on paper first.
              When done, tap "Done →"
            </Text>
          </Card>

          {elapsed > config.durationMins * 30 && (
            <Pressable
              style={styles.hintBtn}
              onPress={() =>
                Alert.alert(
                  "Hint",
                  "Think about: what data structure gives O(1) lookup? Work through a small example manually. Identify the pattern from the constraints."
                )
              }
            >
              <Text style={styles.hintBtnText}>💡 Get a nudge (costs points)</Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === "review" && problems[probIdx]) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Self Review" subtitle={problems[probIdx].title} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.reviewSubtitle}>Be honest — this is just for your own tracking.</Text>

          {[
            { field: "solved" as const, label: "I solved it correctly" },
            { field: "complexityStated" as const, label: "I stated time & space complexity" },
            { field: "edgeCasesConsidered" as const, label: "I handled edge cases" },
            { field: "solutionRevealed" as const, label: "I peeked at the solution" },
          ].map(({ field, label }) => (
            <Pressable key={field} style={styles.checkRow} onPress={() => toggle(field)}>
              <Text style={[styles.checkBox, currentReview[field] ? styles.checkBoxActive : null]}>
                {currentReview[field] ? "✓" : "○"}
              </Text>
              <Text style={styles.checkLabel}>{label}</Text>
            </Pressable>
          ))}

          <Card style={styles.section}>
            <Text style={styles.h3}>How well can you explain it? (0-5)</Text>
            <View style={styles.scoreRow}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <Pressable
                  key={n}
                  style={[styles.scoreBtn, currentReview.selfExplainScore === n && styles.scoreBtnActive]}
                  onPress={() => setCurrentReview((r) => ({ ...r, selfExplainScore: n }))}
                >
                  <Text style={[styles.scoreBtnText, currentReview.selfExplainScore === n && styles.scoreBtnTextActive]}>
                    {n}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card>

          <Button label="Submit Review →" onPress={submitReview} fullWidth size="lg" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === "results" && sessionResult) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Session Complete" back />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreBig}>{sessionResult.score}</Text>
            <Text style={styles.scoreOf}>/100</Text>
          </View>

          <Card style={styles.section}>
            <Text style={styles.h3}>Coaching Insights</Text>
            {sessionResult.insights.map((insight, i) => (
              <Text key={i} style={styles.insight}>• {insight}</Text>
            ))}
          </Card>

          <Card style={styles.section}>
            <Text style={styles.h3}>Problem Breakdown</Text>
            {sessionResult.problems.map((p) => (
              <View key={p.problemId} style={styles.probResult}>
                <Text style={styles.probResultTitle}>{p.title}</Text>
                <View style={styles.probResultBadges}>
                  <Badge
                    label={p.solved ? "Solved" : "Unsolved"}
                    color={p.solved ? colors.green : colors.red}
                    bg={p.solved ? colors.greenBg : colors.redBg}
                    size="sm"
                  />
                  <Badge
                    label={`${Math.round(p.timeSpentSecs / 60)}m`}
                    size="sm"
                    color={colors.textSecondary}
                    bg={colors.bgHover}
                  />
                </View>
              </View>
            ))}
          </Card>

          <Button label="New Session" onPress={() => setStep("setup")} fullWidth />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  hint: { fontSize: font.size.base, color: colors.textSecondary, textAlign: "center", paddingHorizontal: spacing.md },
  section: { gap: spacing.md },
  h3: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  optionBtnActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  optionText: { fontSize: font.size.base, color: colors.textSecondary },
  optionTextActive: { color: colors.accent },
  timerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgSecondary,
  },
  timerProblem: { fontSize: font.size.sm, color: colors.textMuted },
  doneBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: colors.accentSoft },
  doneBtnText: { fontSize: font.size.sm, color: colors.accent, fontWeight: font.weight.semibold },
  probTitle: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.textPrimary },
  probPattern: { fontSize: font.size.base, color: colors.textSecondary },
  warningCard: { backgroundColor: colors.orangeBg, borderColor: colors.orange },
  warningText: { fontSize: font.size.sm, color: colors.orange, lineHeight: 20 },
  hintBtn: {
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  hintBtnText: { fontSize: font.size.sm, color: colors.textSecondary },
  reviewSubtitle: { fontSize: font.size.base, color: colors.textMuted },
  checkRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: 10 },
  checkBox: { fontSize: 18, color: colors.border, width: 22 },
  checkBoxActive: { color: colors.green },
  checkLabel: { fontSize: font.size.base, color: colors.textPrimary, flex: 1 },
  scoreRow: { flexDirection: "row", gap: spacing.sm },
  scoreBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.bgCard,
  },
  scoreBtnActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  scoreBtnText: { fontSize: font.size.base, color: colors.textSecondary },
  scoreBtnTextActive: { color: colors.accent, fontWeight: font.weight.bold },
  scoreCircle: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accentSoft,
    borderWidth: 3,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreBig: { fontSize: 42, fontWeight: font.weight.extrabold, color: colors.accent },
  scoreOf: { fontSize: font.size.base, color: colors.textSecondary },
  insight: { fontSize: font.size.base, color: colors.textSecondary, lineHeight: 22, marginBottom: 4 },
  probResult: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, gap: 6 },
  probResultTitle: { fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.textPrimary },
  probResultBadges: { flexDirection: "row", gap: spacing.sm },
});
