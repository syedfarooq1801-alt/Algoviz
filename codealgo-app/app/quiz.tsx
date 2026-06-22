import { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { PATTERNS } from "@/data/problems";
import { colors, font, spacing, radius, diffColor } from "@/lib/theme";
import { Card, Badge, ScreenHeader, Button } from "@/components/ui";

const ALL_PATTERN_TITLES = PATTERNS.map((p) => p.title);

const ALL_QUIZ_ITEMS = PATTERNS.flatMap((p) =>
  p.problems.map((prob) => ({
    problemTitle: prob.title,
    difficulty: prob.difficulty,
    correctPattern: p.title,
    patternIntuition: p.coreIntuition,
  }))
);

interface Question {
  problemTitle: string;
  difficulty: string;
  correctPattern: string;
  patternIntuition: string;
  choices: string[];
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(count = 10): Question[] {
  const pool = shuffled(ALL_QUIZ_ITEMS).slice(0, Math.min(count, ALL_QUIZ_ITEMS.length));
  return pool.map((item) => {
    const wrongs = shuffled(ALL_PATTERN_TITLES.filter((t) => t !== item.correctPattern)).slice(0, 3);
    const choices = shuffled([item.correctPattern, ...wrongs]);
    return { ...item, choices };
  });
}

interface Answer {
  question: Question;
  selected: string;
  correct: boolean;
}

type Phase = "intro" | "quiz" | "result";

export default function QuizScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const startQuiz = useCallback(() => {
    setQuestions(generateQuestions(10));
    setIdx(0);
    setSelected(null);
    setAnswers([]);
    setPhase("quiz");
  }, []);

  const handleSelect = async (choice: string) => {
    if (selected) return;
    const q = questions[idx];
    const correct = choice === q.correctPattern;
    await Haptics.impactAsync(
      correct ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy
    );
    setSelected(choice);
    const newAnswers = [...answers, { question: q, selected: choice, correct }];
    setAnswers(newAnswers);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setPhase("result");
      } else {
        setIdx(idx + 1);
        setSelected(null);
      }
    }, 1400);
  };

  if (phase === "intro") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Pattern Diagnosis" back />
        <ScrollView contentContainerStyle={styles.introScroll}>
          <View style={styles.introIcon}>
            <Text style={{ fontSize: 52 }}>🎯</Text>
          </View>
          <Text style={styles.introTitle}>Pattern Recognition Quiz</Text>
          <Text style={styles.introSub}>
            See a problem — identify the DSA pattern. 10 questions, instant feedback.
          </Text>
          <View style={styles.introCards}>
            {[
              { icon: "🧩", text: "10 random problems from all patterns" },
              { icon: "⚡", text: "4 choices per question" },
              { icon: "📊", text: "Score report + weak pattern drill" },
            ].map((item) => (
              <Card key={item.text} style={styles.introCard}>
                <Text style={styles.introCardIcon}>{item.icon}</Text>
                <Text style={styles.introCardText}>{item.text}</Text>
              </Card>
            ))}
          </View>
          <Button label="Start Quiz" onPress={startQuiz} fullWidth />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === "result") {
    const correctCount = answers.filter((a) => a.correct).length;
    const pct = Math.round((correctCount / answers.length) * 100);
    const grade = pct >= 80 ? "🔥 Excellent" : pct >= 60 ? "👍 Good" : "📖 Keep Practicing";
    const wrongOnes = answers.filter((a) => !a.correct);
    const weakPatterns = [...new Set(wrongOnes.map((a) => a.question.correctPattern))];

    const drillWeakPatterns = () => {
      router.push({
        pathname: "/(tabs)/dsa",
        params: { drillPatterns: weakPatterns.join(",") },
      } as any);
    };

    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Quiz Results" back />
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <Card style={styles.scoreCard}>
            <Text style={styles.scoreEmoji}>{grade}</Text>
            <Text style={styles.scoreNum}>{correctCount}/{answers.length}</Text>
            <Text style={styles.scorePct}>{pct}% correct</Text>
          </Card>

          {wrongOnes.length > 0 && (
            <View style={styles.wrongSection}>
              <View style={styles.wrongHeader}>
                <Text style={styles.wrongTitle}>Review These</Text>
                <Pressable
                  style={({ pressed }) => [styles.drillBtn, pressed && { opacity: 0.8 }]}
                  onPress={drillWeakPatterns}
                >
                  <Text style={styles.drillBtnText}>Drill weak patterns →</Text>
                </Pressable>
              </View>

              {wrongOnes.map((a, i) => (
                <Card key={i} style={styles.wrongCard}>
                  <Text style={styles.wrongProblem}>{a.question.problemTitle}</Text>
                  <View style={styles.wrongRow}>
                    <Text style={styles.wrongLabel}>Your answer:</Text>
                    <Text style={[styles.wrongVal, { color: colors.red }]}>{a.selected}</Text>
                  </View>
                  <View style={styles.wrongRow}>
                    <Text style={styles.wrongLabel}>Correct:</Text>
                    <Text style={[styles.wrongVal, { color: colors.green }]}>{a.question.correctPattern}</Text>
                  </View>
                  <Text style={styles.wrongHint}>{a.question.patternIntuition}</Text>
                </Card>
              ))}

              <Pressable
                style={({ pressed }) => [styles.drillBtnLarge, pressed && { opacity: 0.8 }]}
                onPress={drillWeakPatterns}
              >
                <Text style={styles.drillBtnLargeText}>
                  🎯 Drill {weakPatterns.length} weak pattern{weakPatterns.length !== 1 ? "s" : ""} →
                </Text>
              </Pressable>
            </View>
          )}

          <Button label="Play Again" onPress={startQuiz} fullWidth />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const q = questions[idx];
  const progressPct = (idx / questions.length) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={`Question ${idx + 1}/${questions.length}`}
        back
        subtitle={`${Math.round(progressPct)}% complete`}
      />

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={styles.quizScroll}>
        <Card style={styles.problemCard}>
          <View style={styles.problemTop}>
            <Badge
              label={q.difficulty}
              color={diffColor[q.difficulty]}
              bg={`${diffColor[q.difficulty]}22`}
            />
            <Text style={styles.problemLabel}>What pattern applies?</Text>
          </View>
          <Text style={styles.problemTitle}>{q.problemTitle}</Text>
        </Card>

        <View style={styles.choices}>
          {q.choices.map((choice) => {
            const isSelected = selected === choice;
            const isCorrect = choice === q.correctPattern;
            const showResult = selected !== null;

            let borderColor = colors.border;
            let bg = colors.bgCard;
            let textColor = colors.textPrimary;
            let rightIcon = "";

            if (showResult) {
              if (isCorrect) {
                borderColor = colors.green; bg = colors.greenBg;
                textColor = colors.green; rightIcon = "✓";
              } else if (isSelected && !isCorrect) {
                borderColor = colors.red; bg = colors.redBg;
                textColor = colors.red; rightIcon = "✗";
              }
            }

            return (
              <Pressable
                key={choice}
                style={[styles.choice, { borderColor, backgroundColor: bg }]}
                onPress={() => handleSelect(choice)}
                disabled={selected !== null}
              >
                <Text style={[styles.choiceText, { color: textColor }]}>{choice}</Text>
                {rightIcon !== "" && (
                  <Text style={[styles.choiceIcon, { color: textColor }]}>{rightIcon}</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {selected && (
          <Card
            style={StyleSheet.flatten([
              styles.explanationCard,
              { borderColor: selected === q.correctPattern ? colors.green : colors.orange },
            ])}
          >
            <Text style={styles.explanationLabel}>
              {selected === q.correctPattern ? "✓ Correct!" : `Correct pattern: ${q.correctPattern}`}
            </Text>
            <Text style={styles.explanationText}>{q.patternIntuition}</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  introScroll: { padding: spacing.lg, paddingBottom: 48, gap: spacing.lg, alignItems: "center" },
  introIcon: { marginTop: spacing.xl, marginBottom: spacing.sm },
  introTitle: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.textPrimary, textAlign: "center" },
  introSub: { fontSize: font.size.base, color: colors.textSecondary, textAlign: "center", lineHeight: 20 },
  introCards: { width: "100%", gap: spacing.sm },
  introCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md },
  introCardIcon: { fontSize: 22, width: 28, textAlign: "center" },
  introCardText: { fontSize: font.size.base, color: colors.textSecondary, flex: 1 },
  progressTrack: { height: 3, backgroundColor: colors.border },
  progressFill: { height: 3, backgroundColor: colors.accent },
  quizScroll: { padding: spacing.lg, paddingBottom: 48, gap: spacing.lg },
  problemCard: { gap: spacing.md },
  problemTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  problemLabel: { fontSize: font.size.xs, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.7 },
  problemTitle: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.textPrimary, lineHeight: 26 },
  choices: { gap: spacing.sm },
  choice: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: spacing.md, borderRadius: radius.lg, borderWidth: 1,
  },
  choiceText: { fontSize: font.size.base, fontWeight: font.weight.medium, flex: 1 },
  choiceIcon: { fontSize: font.size.lg, fontWeight: font.weight.bold, marginLeft: spacing.sm },
  explanationCard: { borderWidth: 1, gap: spacing.sm },
  explanationLabel: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textPrimary },
  explanationText: { fontSize: font.size.sm, color: colors.textSecondary, lineHeight: 20 },
  resultScroll: { padding: spacing.lg, paddingBottom: 48, gap: spacing.lg },
  scoreCard: { alignItems: "center", paddingVertical: spacing.xl, gap: spacing.sm },
  scoreEmoji: { fontSize: font.size.lg, color: colors.textPrimary, fontWeight: font.weight.semibold },
  scoreNum: { fontSize: 48, fontWeight: font.weight.extrabold, color: colors.accent },
  scorePct: { fontSize: font.size.base, color: colors.textSecondary },
  wrongSection: { gap: spacing.sm },
  wrongHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  wrongTitle: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary },
  drillBtn: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm,
    backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent,
  },
  drillBtnText: { fontSize: font.size.xs, color: colors.accent, fontWeight: font.weight.semibold },
  wrongCard: { gap: spacing.sm },
  wrongProblem: { fontSize: font.size.base, fontWeight: font.weight.semibold, color: colors.textPrimary },
  wrongRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  wrongLabel: { fontSize: font.size.sm, color: colors.textMuted, width: 90 },
  wrongVal: { fontSize: font.size.sm, fontWeight: font.weight.medium, flex: 1 },
  wrongHint: { fontSize: font.size.xs, color: colors.textSecondary, lineHeight: 17, fontStyle: "italic" },
  drillBtnLarge: {
    paddingVertical: 13, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.accent, backgroundColor: colors.accentSoft, alignItems: "center",
  },
  drillBtnLargeText: { fontSize: font.size.base, color: colors.accent, fontWeight: font.weight.semibold },
});
