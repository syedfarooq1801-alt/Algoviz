import { useMemo } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProgressStore } from "@/lib/store";
import { usePrepStore } from "@/lib/prepStore";
import { PATTERNS } from "@/data/problems";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, ProgressBar, ScreenHeader } from "@/components/ui";

const ALL_PROBLEMS = PATTERNS.flatMap((p) => p.problems);

// 90-day heatmap: 13 weeks × 7 days
const GRID_WEEKS = 13;
const CELL = 13;
const CELL_GAP = 3;

function heatColor(count: number): string {
  if (count === 0) return colors.bgHover;
  if (count === 1) return "rgba(79,140,255,0.35)";
  if (count === 2) return "rgba(79,140,255,0.6)";
  return colors.accent;
}

function Heatmap({ dateCounts }: { dateCounts: Record<string, number> }) {
  const weeks = useMemo(() => {
    const total = GRID_WEEKS * 7;
    const cells: string[] = [];
    for (let i = total - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
      cells.push(d);
    }
    const result: string[][] = [];
    for (let w = 0; w < GRID_WEEKS; w++) {
      result.push(cells.slice(w * 7, w * 7 + 7));
    }
    return result;
  }, []);

  // Month labels: find first day of each month in the grid
  const monthLabels = useMemo(() => {
    const seen = new Set<string>();
    const labels: { col: number; label: string }[] = [];
    weeks.forEach((week, col) => {
      const firstDay = week[0];
      const month = firstDay.slice(0, 7); // YYYY-MM
      if (!seen.has(month)) {
        seen.add(month);
        const d = new Date(firstDay);
        labels.push({ col, label: d.toLocaleDateString("en", { month: "short" }) });
      }
    });
    return labels;
  }, [weeks]);

  return (
    <View style={heatStyles.container}>
      {/* Month labels */}
      <View style={heatStyles.monthRow}>
        {monthLabels.map(({ col, label }) => (
          <View key={label + col} style={[heatStyles.monthLabel, { left: col * (CELL + CELL_GAP) }]}>
            <Text style={heatStyles.monthText}>{label}</Text>
          </View>
        ))}
      </View>
      {/* Grid */}
      <View style={heatStyles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={heatStyles.weekCol}>
            {week.map((date, di) => (
              <View
                key={date}
                style={[
                  heatStyles.cell,
                  { backgroundColor: heatColor(dateCounts[date] ?? 0) },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      {/* Legend */}
      <View style={heatStyles.legend}>
        <Text style={heatStyles.legendText}>Less</Text>
        {[0, 1, 2, 3].map((n) => (
          <View key={n} style={[heatStyles.cell, { backgroundColor: heatColor(n) }]} />
        ))}
        <Text style={heatStyles.legendText}>More</Text>
      </View>
    </View>
  );
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const { solved, xp, streak, solvedDates, solveTimes } = useProgressStore();
  const { reviewDue, mockSessions, problemStates } = usePrepStore();

  const today = new Date().toISOString().split("T")[0];
  const dueCount = Object.values(reviewDue).filter((d) => d <= today).length;
  const masteredCount = Object.values(problemStates).filter((s) => s === "mastered").length;
  const reviewingCount = Object.values(problemStates).filter((s) => s === "reviewing").length;

  // Solved by difficulty
  const easy = ALL_PROBLEMS.filter((p) => p.difficulty === "Easy");
  const medium = ALL_PROBLEMS.filter((p) => p.difficulty === "Medium");
  const hard = ALL_PROBLEMS.filter((p) => p.difficulty === "Hard");
  const easyDone = easy.filter((p) => solved.has(p.id)).length;
  const medDone = medium.filter((p) => solved.has(p.id)).length;
  const hardDone = hard.filter((p) => solved.has(p.id)).length;

  // Solved by pattern
  const byPattern = PATTERNS.map((pat) => ({
    name: pat.title,
    done: pat.problems.filter((p) => solved.has(p.id)).length,
    total: pat.problems.length,
  })).sort((a, b) => b.done / b.total - a.done / a.total);

  // 90-day heatmap data
  const dateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(solvedDates ?? {}).forEach((d) => {
      counts[d] = (counts[d] ?? 0) + 1;
    });
    return counts;
  }, [solvedDates]);

  // SRS forecast — next 7 days
  const forecast = useMemo(() => {
    const result: { date: string; label: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.now() + i * 86400000);
      const iso = d.toISOString().split("T")[0];
      const label = i === 0 ? "Today" : d.toLocaleDateString("en", { weekday: "short" });
      const count = Object.values(reviewDue).filter((due) => due === iso).length;
      result.push({ date: iso, label, count });
    }
    return result;
  }, [reviewDue]);

  const forecastMax = Math.max(...forecast.map((f) => f.count), 1);

  const avgMockScore = mockSessions.length
    ? Math.round(mockSessions.reduce((s, m) => s + m.score, 0) / mockSessions.length)
    : 0;

  // Solve time analytics
  const solveTimeEntries = useMemo(() => Object.entries(solveTimes ?? {}), [solveTimes]);
  const avgSolveTime = useMemo(() => {
    if (!solveTimeEntries.length) return 0;
    return Math.round(solveTimeEntries.reduce((s, [, m]) => s + m, 0) / solveTimeEntries.length);
  }, [solveTimeEntries]);

  const slowestProblems = useMemo(() => {
    return solveTimeEntries
      .map(([id, mins]) => ({ id, mins, title: ALL_PROBLEMS.find((p) => p.id === id)?.title ?? id }))
      .sort((a, b) => b.mins - a.mins)
      .slice(0, 5);
  }, [solveTimeEntries]);

  const avgTimeByPattern = useMemo(() => {
    return PATTERNS.map((pat) => {
      const times = pat.problems
        .filter((p) => solveTimes?.[p.id] != null)
        .map((p) => solveTimes![p.id]);
      if (!times.length) return null;
      return {
        id: pat.id,
        name: pat.title,
        avg: Math.round(times.reduce((s, t) => s + t, 0) / times.length),
        count: times.length,
      };
    })
      .filter((x): x is { id: string; name: string; avg: number; count: number } => x !== null)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  }, [solveTimes]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Analytics" back />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Summary stats */}
        <View style={styles.statsGrid}>
          {[
            { label: "Problems Solved", value: solved.size, color: colors.green },
            { label: "XP Earned", value: xp, color: colors.accent },
            { label: "Day Streak", value: streak, color: colors.orange },
            { label: "Reviews Due", value: dueCount, color: dueCount > 0 ? colors.red : colors.green },
            { label: "Mastered", value: masteredCount, color: colors.purple },
            { label: "In Review", value: reviewingCount, color: colors.orange },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard}>
              <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* 90-day activity heatmap */}
        <Card style={styles.section}>
          <Text style={styles.h3}>Activity (last 90 days)</Text>
          <Heatmap dateCounts={dateCounts} />
        </Card>

        {/* SRS forecast — next 7 days */}
        <Card style={styles.section}>
          <Text style={styles.h3}>Review Forecast</Text>
          <Text style={styles.sectionSub}>Problems due for SRS review each day</Text>
          <View style={styles.forecastRow}>
            {forecast.map((f) => {
              const barHeight = f.count === 0 ? 6 : Math.max(12, (f.count / forecastMax) * 60);
              const isToday = f.label === "Today";
              return (
                <View key={f.date} style={styles.forecastCol}>
                  <Text style={styles.forecastCount}>{f.count || ""}</Text>
                  <View style={[
                    styles.forecastBar,
                    {
                      height: barHeight,
                      backgroundColor: f.count > 0 ? (isToday ? colors.orange : colors.accent) : colors.border,
                    },
                  ]} />
                  <Text style={[styles.forecastLabel, isToday && { color: colors.orange }]}>{f.label}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* By difficulty */}
        <Card style={styles.section}>
          <Text style={styles.h3}>By Difficulty</Text>
          {[
            { label: "Easy", done: easyDone, total: easy.length, color: colors.green },
            { label: "Medium", done: medDone, total: medium.length, color: colors.orange },
            { label: "Hard", done: hardDone, total: hard.length, color: colors.red },
          ].map((d) => (
            <View key={d.label} style={styles.diffRow}>
              <View style={styles.diffLabel}>
                <Text style={[styles.diffText, { color: d.color }]}>{d.label}</Text>
                <Text style={styles.diffCount}>{d.done}/{d.total}</Text>
              </View>
              <ProgressBar value={d.done} max={d.total} color={d.color} height={6} />
            </View>
          ))}
        </Card>

        {/* Pattern coverage */}
        <Card style={styles.section}>
          <Text style={styles.h3}>Pattern Coverage</Text>
          {byPattern.map((p) => (
            <View key={p.name} style={styles.patternRow}>
              <Text style={styles.patternName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.patternCount}>{p.done}/{p.total}</Text>
              <View style={{ width: 80 }}>
                <ProgressBar value={p.done} max={p.total} color={colors.accent} height={4} />
              </View>
            </View>
          ))}
        </Card>

        {/* Solve times */}
        {solveTimeEntries.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.h3}>Solve Times</Text>
            <Text style={styles.sectionSub}>Logged when you return from LeetCode</Text>

            {/* Summary */}
            <View style={styles.timeRow}>
              <View style={styles.timeCard}>
                <Text style={[styles.timeNum, { color: colors.accent }]}>{avgSolveTime}</Text>
                <Text style={styles.timeLbl}>Avg (min)</Text>
              </View>
              <View style={styles.timeCard}>
                <Text style={[styles.timeNum, { color: colors.green }]}>{solveTimeEntries.length}</Text>
                <Text style={styles.timeLbl}>Logged</Text>
              </View>
              <View style={styles.timeCard}>
                <Text style={[styles.timeNum, { color: colors.orange }]}>
                  {solveTimeEntries.length ? Math.min(...solveTimeEntries.map(([, m]) => m)) : 0}
                </Text>
                <Text style={styles.timeLbl}>Fastest (min)</Text>
              </View>
            </View>

            {/* Slowest problems */}
            {slowestProblems.length > 0 && (
              <View style={{ marginTop: spacing.sm }}>
                <Text style={styles.subheading}>Slowest Problems</Text>
                {slowestProblems.map((p) => (
                  <View key={p.id} style={styles.timeItemRow}>
                    <Text style={styles.timeItemTitle} numberOfLines={1}>{p.title}</Text>
                    <View style={[styles.timePill, p.mins >= 45 ? styles.timePillSlow : p.mins >= 25 ? styles.timePillMed : styles.timePillFast]}>
                      <Text style={[styles.timePillText, { color: p.mins >= 45 ? colors.red : p.mins >= 25 ? colors.orange : colors.green }]}>
                        {p.mins} min
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Slowest patterns */}
            {avgTimeByPattern.length > 1 && (
              <View style={{ marginTop: spacing.sm }}>
                <Text style={styles.subheading}>Avg by Pattern</Text>
                {avgTimeByPattern.map((p) => (
                  <View key={p.name} style={styles.timeItemRow}>
                    <Text style={styles.timeItemTitle} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.timeItemSub}>{p.count} logged</Text>
                    <Text style={[styles.timeAvg, { color: p.avg >= 45 ? colors.red : p.avg >= 25 ? colors.orange : colors.green }]}>
                      {p.avg}m
                    </Text>
                    {p.avg >= 35 && (
                      <Pressable
                        style={styles.drillBtn}
                        onPress={() => router.push({ pathname: "/(tabs)/dsa", params: { drillPatterns: p.id } } as any)}
                      >
                        <Text style={styles.drillBtnText}>Drill →</Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* Mock interview stats */}
        {mockSessions.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.h3}>Mock Interview History</Text>
            <View style={styles.mockSummary}>
              <Text style={styles.mockStat}>
                <Text style={[styles.mockNum, { color: colors.accent }]}>{mockSessions.length}</Text>
                {" sessions"}
              </Text>
              <Text style={styles.mockStat}>
                <Text style={[styles.mockNum, { color: colors.green }]}>{avgMockScore}</Text>
                {" avg score"}
              </Text>
            </View>
            {mockSessions.slice(0, 5).map((s) => (
              <View key={s.id} style={styles.mockRow}>
                <Text style={styles.mockDate}>{s.date}</Text>
                <Text style={styles.mockDifficulty}>{s.difficulty}</Text>
                <View style={[styles.mockScore, {
                  backgroundColor: s.score >= 70 ? colors.greenBg : s.score >= 50 ? colors.orangeBg : colors.redBg,
                }]}>
                  <Text style={[styles.mockScoreText, {
                    color: s.score >= 70 ? colors.green : s.score >= 50 ? colors.orange : colors.red,
                  }]}>
                    {s.score}%
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const heatStyles = StyleSheet.create({
  container: { gap: spacing.sm },
  monthRow: { height: 14, position: "relative" },
  monthLabel: { position: "absolute", top: 0 },
  monthText: { fontSize: 8, color: colors.textMuted },
  grid: { flexDirection: "row", gap: CELL_GAP },
  weekCol: { gap: CELL_GAP },
  cell: { width: CELL, height: CELL, borderRadius: 2 },
  legend: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-end" },
  legendText: { fontSize: 8, color: colors.textMuted },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  statCard: { width: "47%", alignItems: "center", paddingVertical: 12 },
  statNum: { fontSize: font.size.xl, fontWeight: font.weight.extrabold },
  statLbl: { fontSize: font.size.xs, color: colors.textSecondary, textAlign: "center", marginTop: 2 },
  section: { gap: spacing.md },
  h3: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary },
  sectionSub: { fontSize: font.size.xs, color: colors.textMuted, marginTop: -spacing.sm },

  // SRS forecast
  forecastRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 90 },
  forecastCol: { alignItems: "center", gap: 4, flex: 1 },
  forecastBar: { width: 22, borderRadius: 4, minHeight: 6 },
  forecastCount: { fontSize: 9, color: colors.textMuted, height: 12 },
  forecastLabel: { fontSize: 9, color: colors.textMuted },

  diffRow: { gap: 6 },
  diffLabel: { flexDirection: "row", justifyContent: "space-between" },
  diffText: { fontSize: font.size.sm, fontWeight: font.weight.medium },
  diffCount: { fontSize: font.size.sm, color: colors.textMuted },
  patternRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: 4 },
  patternName: { flex: 1, fontSize: font.size.sm, color: colors.textSecondary },
  patternCount: { fontSize: font.size.xs, color: colors.textMuted, width: 32, textAlign: "right" },
  // Solve times
  timeRow: { flexDirection: "row", gap: spacing.sm },
  timeCard: { flex: 1, backgroundColor: colors.bgSecondary, borderRadius: radius.md, padding: spacing.md, alignItems: "center", gap: 2 },
  timeNum: { fontSize: font.size.xl, fontWeight: font.weight.extrabold },
  timeLbl: { fontSize: font.size.xs, color: colors.textMuted, textAlign: "center" },
  subheading: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.textSecondary, marginBottom: spacing.sm },
  timeItemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 5, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  timeItemTitle: { flex: 1, fontSize: font.size.sm, color: colors.textSecondary },
  timeItemSub: { fontSize: font.size.xs, color: colors.textMuted },
  timeAvg: { fontSize: font.size.sm, fontWeight: font.weight.semibold, minWidth: 44, textAlign: "right" },
  timePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  timePillFast: { backgroundColor: colors.greenBg },
  timePillMed: { backgroundColor: colors.orangeBg },
  timePillSlow: { backgroundColor: colors.redBg },
  timePillText: { fontSize: font.size.xs, fontWeight: font.weight.semibold },
  drillBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  drillBtnText: { fontSize: font.size.xs, color: colors.accent, fontWeight: font.weight.semibold },

  mockSummary: { flexDirection: "row", gap: spacing.xl },
  mockStat: { fontSize: font.size.base, color: colors.textSecondary },
  mockNum: { fontWeight: font.weight.bold, fontSize: font.size.xl },
  mockRow: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle,
  },
  mockDate: { flex: 1, fontSize: font.size.sm, color: colors.textSecondary },
  mockDifficulty: { fontSize: font.size.sm, color: colors.textMuted },
  mockScore: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  mockScoreText: { fontSize: font.size.sm, fontWeight: font.weight.bold },
});
