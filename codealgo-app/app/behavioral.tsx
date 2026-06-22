import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { usePrepStore, BehavioralDraft } from "@/lib/prepStore";
import { COMMON_QUESTIONS, COMPANY_VALUES } from "@/data/behavioral";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, Badge, ScreenHeader, Button } from "@/components/ui";

function makeId() {
  return `beh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const COMPANIES = (COMPANY_VALUES ?? []).map((cv) => cv.company);

const STAR_HINTS: Record<string, string> = {
  situation: "Set the scene. What was the context?",
  task: "What was your responsibility or challenge?",
  action: "What specific steps did YOU take?",
  result: "What was the outcome? Quantify if possible.",
};

function PracticeTimer({ onDone }: { onDone: () => void }) {
  const [secs, setSecs] = useState(120);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warnedRef = useRef(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecs((s) => {
        const next = s - 1;
        if (next === 15 && !warnedRef.current) {
          warnedRef.current = true;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          onDone();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const pct = secs / 120;
  const isLow = secs <= 15;

  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const label = `${m}:${s.toString().padStart(2, "0")}`;

  return (
    <View style={[timerStyles.bar, isLow && timerStyles.barLow]}>
      <View style={[timerStyles.fill, { width: `${pct * 100}%` as any, backgroundColor: isLow ? colors.red : colors.green }]} />
      <View style={timerStyles.content}>
        <Text style={[timerStyles.label, isLow && { color: colors.red }]}>
          {isLow ? "⚠️ " : "⏱ "}Practice timer: {label}
        </Text>
        <Pressable onPress={() => { clearInterval(intervalRef.current!); onDone(); }}>
          <Text style={timerStyles.stop}>Stop</Text>
        </Pressable>
      </View>
    </View>
  );
}

const timerStyles = StyleSheet.create({
  bar: {
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.green,
    backgroundColor: colors.greenBg,
    position: "relative",
  },
  barLow: { borderColor: colors.red, backgroundColor: colors.redBg },
  fill: { position: "absolute", top: 0, left: 0, bottom: 0, opacity: 0.25 },
  content: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12 },
  label: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.green },
  stop: { fontSize: font.size.sm, color: colors.textSecondary },
});

export default function BehavioralScreen() {
  const { behavioralDrafts, saveBehavioralDraft } = usePrepStore();
  const [view, setView] = useState<"list" | "edit">("list");
  const [editing, setEditing] = useState<BehavioralDraft | null>(null);
  const [form, setForm] = useState<Omit<BehavioralDraft, "updatedAt">>({
    id: makeId(),
    question: "",
    company: "",
    situation: "",
    task: "",
    action: "",
    result: "",
    rubric: {},
  });
  const [timerActive, setTimerActive] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const drafts = Object.values(behavioralDrafts);

  const startNew = (q?: string) => {
    setForm({
      id: makeId(),
      question: q ?? "",
      company: "",
      situation: "",
      task: "",
      action: "",
      result: "",
      rubric: {},
    });
    setEditing(null);
    setTimerActive(false);
    setTimedOut(false);
    setView("edit");
  };

  const startEdit = (draft: BehavioralDraft) => {
    setForm({ ...draft });
    setEditing(draft);
    setTimerActive(false);
    setTimedOut(false);
    setView("edit");
  };

  const handleSave = () => {
    if (!form.question.trim()) {
      Alert.alert("Missing Question", "Please enter a behavioral question.");
      return;
    }
    saveBehavioralDraft(form);
    setTimerActive(false);
    setView("list");
  };

  const update = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleTimerDone = () => {
    setTimerActive(false);
    setTimedOut(true);
  };

  if (view === "edit") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader
          title={editing ? "Edit Story" : "New Story"}
          back
          right={
            <Pressable onPress={() => { setTimerActive(false); setView("list"); }} hitSlop={10}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          }
        />
        <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
          {/* Practice timer */}
          {timerActive ? (
            <PracticeTimer onDone={handleTimerDone} />
          ) : (
            <View>
              <Pressable
                style={[styles.practiceBtn, timedOut && styles.practiceBtnDone]}
                onPress={() => { setTimedOut(false); setTimerActive(true); }}
              >
                <Text style={[styles.practiceBtnText, timedOut && { color: colors.green }]}>
                  {timedOut ? "✓ Done! Practice again" : "⏱ Practice Answer (2 min)"}
                </Text>
              </Pressable>
              {timedOut && (
                <Text style={styles.timedOutLabel}>Time's up! Keep your answer under 2 minutes.</Text>
              )}
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Question *</Text>
            <TextInput
              style={styles.input}
              value={form.question}
              onChangeText={(v) => update("question", v)}
              placeholder="e.g. Tell me about a time you led a team..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Company</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companyRow}>
              {COMPANIES.slice(0, 8).map((c) => (
                <Pressable
                  key={c}
                  style={[styles.companyChip, form.company === c && styles.companyChipActive]}
                  onPress={() => update("company", form.company === c ? "" : c)}
                >
                  <Text style={[styles.companyText, form.company === c && styles.companyTextActive]}>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {(["situation", "task", "action", "result"] as const).map((field) => (
            <View key={field} style={styles.formGroup}>
              <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)} (STAR)</Text>
              <TextInput
                style={[styles.input, styles.inputTall]}
                value={form[field]}
                onChangeText={(v) => update(field, v)}
                placeholder={STAR_HINTS[field]}
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
              />
            </View>
          ))}

          <Button label="Save Story" onPress={handleSave} fullWidth style={styles.saveBtn} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Behavioral Prep" subtitle="STAR Stories" back />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Common questions */}
        <View>
          <Text style={styles.sectionTitle}>Common Questions</Text>
          <Text style={styles.sectionSub}>Tap to create a STAR story</Text>
          {(COMMON_QUESTIONS ?? []).slice(0, 12).map((q) => (
            <Pressable
              key={q.question}
              style={({ pressed }) => [styles.questionRow, pressed && { opacity: 0.7 }]}
              onPress={() => startNew(q.question)}
            >
              <Text style={styles.questionText}>{q.question}</Text>
              <Text style={styles.questionChevron}>+</Text>
            </Pressable>
          ))}
        </View>

        {/* My stories */}
        <View>
          <View style={styles.storiesHeader}>
            <Text style={styles.sectionTitle}>My Stories ({drafts.length})</Text>
            <Pressable onPress={() => startNew()} style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ New</Text>
            </Pressable>
          </View>
          {drafts.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No stories yet. Create your first STAR response above.</Text>
            </Card>
          ) : (
            drafts.map((draft) => (
              <Pressable
                key={draft.id}
                style={({ pressed }) => [styles.storyCard, pressed && { opacity: 0.7 }]}
                onPress={() => startEdit(draft)}
              >
                <View style={styles.storyTop}>
                  <Text style={styles.storyQuestion} numberOfLines={2}>{draft.question}</Text>
                  {draft.company && <Badge label={draft.company} size="sm" />}
                </View>
                {draft.situation && (
                  <Text style={styles.storySituation} numberOfLines={2}>{draft.situation}</Text>
                )}
                <Text style={styles.storyDate}>Updated {draft.updatedAt?.slice(0, 10) ?? "recently"}</Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  formScroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  sectionTitle: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary, marginBottom: 4 },
  sectionSub: { fontSize: font.size.sm, color: colors.textMuted, marginBottom: spacing.md },
  questionRow: {
    flexDirection: "row", alignItems: "center", paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, gap: spacing.sm,
  },
  questionText: { flex: 1, fontSize: font.size.base, color: colors.textSecondary },
  questionChevron: { fontSize: 18, color: colors.accent },
  storiesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  addBtn: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.sm,
    backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent,
  },
  addBtnText: { fontSize: font.size.sm, color: colors.accent, fontWeight: font.weight.semibold },
  emptyCard: { alignItems: "center", paddingVertical: spacing.xl },
  emptyText: { fontSize: font.size.base, color: colors.textMuted, textAlign: "center" },
  storyCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, gap: spacing.sm, marginBottom: spacing.sm,
  },
  storyTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.sm },
  storyQuestion: { flex: 1, fontSize: font.size.base, fontWeight: font.weight.semibold, color: colors.textPrimary },
  storySituation: { fontSize: font.size.sm, color: colors.textSecondary },
  storyDate: { fontSize: font.size.xs, color: colors.textMuted },
  // Edit form
  practiceBtn: {
    paddingVertical: 12, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, alignItems: "center", backgroundColor: colors.bgCard,
  },
  practiceBtnDone: { borderColor: colors.green, backgroundColor: colors.greenBg },
  practiceBtnText: { fontSize: font.size.base, color: colors.accent, fontWeight: font.weight.semibold },
  timedOutLabel: { fontSize: font.size.xs, color: colors.textMuted, textAlign: "center", marginTop: 4 },
  formGroup: { gap: spacing.sm },
  label: {
    fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.6,
  },
  input: {
    backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, color: colors.textPrimary, fontSize: font.size.base,
    paddingHorizontal: spacing.md, paddingVertical: 10,
  },
  inputTall: { minHeight: 96, textAlignVertical: "top", paddingTop: 10 },
  companyRow: { gap: spacing.sm },
  companyChip: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard,
  },
  companyChipActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  companyText: { fontSize: font.size.sm, color: colors.textSecondary },
  companyTextActive: { color: colors.accent },
  cancelText: { fontSize: font.size.base, color: colors.textSecondary },
  saveBtn: { marginTop: spacing.md },
});
