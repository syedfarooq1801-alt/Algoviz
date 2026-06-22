import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useProgressStore } from "@/lib/store";
import { usePrepStore } from "@/lib/prepStore";
import { generateStudyPlan, PlanTask, DayPlan, PHASE_COLOR } from "@/lib/studyPlan";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, Badge, ProgressBar } from "@/components/ui";

function isTaskDone(task: PlanTask, solved: Set<string>, reviewDue: Record<string, string>): boolean {
  if (task.domain === "behavioral") return true;
  if (task.kind === "theory") return true;
  return solved.has(task.id);
}

export default function PlanScreen() {
  const { solved, studyPlanDuration } = useProgressStore();
  const { reviewDue } = usePrepStore();
  const router = useRouter();

  const plan = useMemo(
    () => generateStudyPlan(studyPlanDuration, new Date().toISOString().split("T")[0]),
    [studyPlanDuration]
  );

  const [activeWeek, setActiveWeek] = useState(0);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    for (let i = 0; i < plan.days.length; i++) {
      const d = plan.days[i];
      if (d.type === "rest") continue;
      if (d.tasks.some((t) => t.domain !== "behavioral" && !solved.has(t.id))) {
        setActiveWeek(Math.floor(i / 7));
        setActiveDayIdx(i % 7);
        return;
      }
    }
  }, []);

  const weeks = useMemo(() => {
    const w: DayPlan[][] = [];
    for (let i = 0; i < plan.days.length; i += 7) {
      w.push(plan.days.slice(i, i + 7));
    }
    return w;
  }, [plan]);

  const currentWeek = weeks[activeWeek] ?? [];
  const activeDay = currentWeek[activeDayIdx] ?? null;
  const totalWeeks = weeks.length;

  const completedTasks = activeDay?.tasks.filter((t) => isTaskDone(t, solved, reviewDue)).length ?? 0;
  const totalTasks = activeDay?.tasks.length ?? 0;

  const renderTask = useCallback(({ item: task }: { item: PlanTask }) => {
    const done = isTaskDone(task, solved, reviewDue);
    return (
      <Pressable
        style={({ pressed }) => [styles.taskRow, pressed && { opacity: 0.7 }]}
        onPress={() => {
          if (task.href.startsWith("/problems/")) router.push(`/problem/${task.id}` as any);
          else if (task.href.startsWith("/patterns/")) router.push(`/pattern/${task.id}` as any);
          else if (task.href.startsWith("/system-design/")) router.push(`/system-design/${task.id}` as any);
          else if (task.href.startsWith("/se-basics/")) router.push(`/se-basics/${task.id}` as any);
        }}
      >
        <Text style={[styles.taskCheck, { color: done ? colors.green : colors.border }]}>
          {done ? "✓" : "○"}
        </Text>
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, done && styles.taskDone]} numberOfLines={2}>
            {task.title}
          </Text>
          {task.meta && <Text style={styles.taskMeta}>{task.meta}</Text>}
        </View>
        {task.tag && <Badge label={task.tag} size="sm" />}
      </Pressable>
    );
  }, [solved, reviewDue]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{studyPlanDuration}-Day Plan</Text>
          <View style={styles.weekNav}>
            <Pressable
              onPress={() => { if (activeWeek > 0) { setActiveWeek(activeWeek - 1); setActiveDayIdx(0); } }}
              style={styles.navBtn}
              disabled={activeWeek === 0}
            >
              <Text style={[styles.navArrow, activeWeek === 0 && styles.navDisabled]}>‹</Text>
            </Pressable>
            <Text style={styles.weekLabel}>Week {activeWeek + 1}/{totalWeeks}</Text>
            <Pressable
              onPress={() => { if (activeWeek < totalWeeks - 1) { setActiveWeek(activeWeek + 1); setActiveDayIdx(0); } }}
              style={styles.navBtn}
              disabled={activeWeek === totalWeeks - 1}
            >
              <Text style={[styles.navArrow, activeWeek === totalWeeks - 1 && styles.navDisabled]}>›</Text>
            </Pressable>
          </View>
        </View>

        {/* Day selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
          {currentWeek.map((day, i) => {
            const dayDone = day.tasks.length > 0 && day.tasks.every((t) => isTaskDone(t, solved, reviewDue));
            const isToday = day.date === new Date().toISOString().split("T")[0];
            return (
              <Pressable
                key={day.day}
                style={[
                  styles.dayPill,
                  activeDayIdx === i && styles.dayPillActive,
                  { borderColor: PHASE_COLOR[day.phase] ?? colors.border },
                ]}
                onPress={() => setActiveDayIdx(i)}
              >
                <Text style={[styles.dayNum, isToday && { color: colors.accent }]}>
                  {day.type === "rest" ? "🛌" : `D${day.day}`}
                </Text>
                {dayDone && <Text style={styles.dayCheck}>✓</Text>}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Active day info */}
        {activeDay && (
          <View style={styles.dayHeader}>
            <View>
              <Text style={styles.dayTitle}>
                Day {activeDay.day} — {activeDay.label}
              </Text>
              <Text style={styles.dayDate}>{activeDay.date}</Text>
            </View>
            {activeDay.type !== "rest" && (
              <Text style={styles.dayProgress}>{completedTasks}/{totalTasks} done</Text>
            )}
          </View>
        )}

        {activeDay && activeDay.type !== "rest" && (
          <View style={styles.progressBar}>
            <ProgressBar value={completedTasks} max={totalTasks} color={PHASE_COLOR[activeDay.phase] ?? colors.accent} />
          </View>
        )}

        {/* Task list */}
        {activeDay?.type === "rest" ? (
          <View style={styles.restDay}>
            <Text style={styles.restIcon}>🛌</Text>
            <Text style={styles.restTitle}>Rest Day</Text>
            <Text style={styles.restSub}>Recovery is part of the plan. Take a break.</Text>
          </View>
        ) : (
          <FlashList
            data={activeDay?.tasks ?? []}
            renderItem={renderTask}
            keyExtractor={(t) => t.id}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
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
  weekNav: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  navBtn: { padding: 4 },
  navArrow: { fontSize: 22, color: colors.textPrimary },
  navDisabled: { color: colors.textMuted },
  weekLabel: { fontSize: font.size.sm, color: colors.textSecondary, minWidth: 60, textAlign: "center" },
  dayRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  dayPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    alignItems: "center",
    minWidth: 52,
  },
  dayPillActive: { backgroundColor: colors.bgHover },
  dayNum: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textPrimary },
  dayCheck: { fontSize: 10, color: colors.green, marginTop: 1 },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  dayTitle: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary },
  dayDate: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 2 },
  dayProgress: { fontSize: font.size.sm, color: colors.textSecondary },
  progressBar: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  taskCheck: { fontSize: 14, marginTop: 1, width: 18 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: font.size.base, color: colors.textPrimary, fontWeight: font.weight.medium },
  taskDone: { color: colors.textMuted, textDecorationLine: "line-through" },
  taskMeta: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 2 },
  restDay: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md },
  restIcon: { fontSize: 48 },
  restTitle: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.textPrimary },
  restSub: { fontSize: font.size.base, color: colors.textSecondary, textAlign: "center", paddingHorizontal: spacing.xl },
});
