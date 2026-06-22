import { useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/authContext";
import { useProgressStore } from "@/lib/store";
import { usePrepStore } from "@/lib/prepStore";
import { useFlashcardStore } from "@/lib/flashcardStore";
import { PATTERNS } from "@/data/problems";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, ProgressBar, Badge, SkeletonDashboard } from "@/components/ui";

const ALL_PROBLEMS = PATTERNS.flatMap((p) => p.problems);
const TOTAL = ALL_PROBLEMS.length;
const HIGH_FREQ = ALL_PROBLEMS.filter((p) => p.frequency === "High");

function getDailyChallenge(dateStr: string, solved: Set<string>) {
  const unsolved = HIGH_FREQ.filter((p) => !solved.has(p.id));
  const pool = unsolved.length > 0 ? unsolved : HIGH_FREQ;
  let hash = 0;
  for (const ch of dateStr) hash = ((hash * 31 + ch.charCodeAt(0)) | 0);
  return pool[Math.abs(hash) % pool.length];
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).setHours(0, 0, 0, 0);
  const now = new Date().setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}

function StatCard({ label, value, sub, color = colors.accent }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <Card style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </Card>
  );
}

export default function Dashboard() {
  const { user, loading, refreshData } = useAuth();
  const { solved, xp, streak, interviewDate } = useProgressStore();
  const { reviewDue } = usePrepStore();
  const { getDueCount } = useFlashcardStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const dueCount = Object.values(reviewDue).filter((d) => d <= today).length;
  const solvedCount = solved.size;
  const easyDone = ALL_PROBLEMS.filter((p) => p.difficulty === "Easy" && solved.has(p.id)).length;
  const medDone = ALL_PROBLEMS.filter((p) => p.difficulty === "Medium" && solved.has(p.id)).length;
  const hardDone = ALL_PROBLEMS.filter((p) => p.difficulty === "Hard" && solved.has(p.id)).length;
  const easyTotal = ALL_PROBLEMS.filter((p) => p.difficulty === "Easy").length;
  const medTotal = ALL_PROBLEMS.filter((p) => p.difficulty === "Medium").length;
  const hardTotal = ALL_PROBLEMS.filter((p) => p.difficulty === "Hard").length;

  const name = user?.displayName?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const interviewDaysLeft = interviewDate ? daysUntil(interviewDate) : null;
  const showCountdown = interviewDate && interviewDaysLeft !== null && interviewDaysLeft >= 0;

  const dailyChallenge = getDailyChallenge(today, solved);
  const dailySolved = solved.has(dailyChallenge.id);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <SkeletonDashboard />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}, {name} 👋</Text>
            <Text style={styles.subGreeting}>Keep grinding. You got this.</Text>
          </View>
          {user?.photoURL && (
            <View style={styles.avatar}>
              <Text style={{ fontSize: 18 }}>👤</Text>
            </View>
          )}
        </View>

        {/* Interview countdown banner */}
        {showCountdown && (
          <Pressable
            style={[
              styles.countdownBanner,
              interviewDaysLeft! <= 7 && { borderColor: colors.red, backgroundColor: colors.redBg },
            ]}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.countdownIcon}>🎯</Text>
            <View style={{ flex: 1 }}>
              <Text style={[
                styles.countdownText,
                interviewDaysLeft! <= 7 && { color: colors.red },
              ]}>
                {interviewDaysLeft === 0
                  ? "Interview is today! You got this 💪"
                  : `Interview in ${interviewDaysLeft} day${interviewDaysLeft !== 1 ? "s" : ""}`}
              </Text>
              <Text style={styles.countdownSub}>{interviewDate}</Text>
            </View>
            <Text style={styles.countdownChevron}>›</Text>
          </Pressable>
        )}

        {/* Daily Challenge */}
        <Pressable
          onPress={() => router.push(`/problem/${dailyChallenge.id}` as any)}
          style={({ pressed }) => [styles.dailyCard, dailySolved && styles.dailyCardDone, pressed && { opacity: 0.85 }]}
        >
          <View style={styles.dailyHeader}>
            <Text style={styles.dailyLabel}>🎯 Daily Challenge</Text>
            {dailySolved && <Text style={styles.dailyDoneTag}>✓ Done</Text>}
          </View>
          <Text style={styles.dailyTitle} numberOfLines={2}>{dailyChallenge.title}</Text>
          <View style={styles.dailyMeta}>
            <Text style={[styles.dailyDiff, {
              color: dailyChallenge.difficulty === "Easy" ? colors.green
                : dailyChallenge.difficulty === "Medium" ? colors.orange : colors.red
            }]}>
              {dailyChallenge.difficulty}
            </Text>
            <Text style={styles.dailyPattern}>{dailyChallenge.pattern}</Text>
          </View>
        </Pressable>

        {/* XP + Streak row */}
        <View style={styles.statsRow}>
          <StatCard label="XP Earned" value={xp.toLocaleString()} color={colors.accent} />
          <StatCard label="Day Streak" value={`${streak}🔥`} color={colors.orange} />
          {dueCount > 0 && (
            <Pressable onPress={() => router.push("/(tabs)/dsa")} style={styles.dueCard}>
              <Card style={{ ...styles.statCard, borderColor: colors.orange, borderWidth: 1 }}>
                <Text style={[styles.statValue, { color: colors.orange }]}>{dueCount}</Text>
                <Text style={styles.statLabel}>Due Today</Text>
              </Card>
            </Pressable>
          )}
        </View>

        {/* Progress */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DSA Progress</Text>
            <Badge label={`${solvedCount}/${TOTAL}`} />
          </View>
          <ProgressBar value={solvedCount} max={TOTAL} color={colors.accent} height={6} />

          <View style={styles.diffRow}>
            {[
              { done: easyDone, total: easyTotal, color: colors.green, label: "Easy" },
              { done: medDone, total: medTotal, color: colors.orange, label: "Medium" },
              { done: hardDone, total: hardTotal, color: colors.red, label: "Hard" },
            ].map((d) => (
              <View key={d.label} style={styles.diffItem}>
                <View style={styles.diffTop}>
                  <Text style={[styles.diffNum, { color: d.color }]}>{d.done}</Text>
                  <Text style={styles.diffOf}>/{d.total}</Text>
                </View>
                <ProgressBar value={d.done} max={d.total} color={d.color} height={3} />
                <Text style={[styles.diffLabel, { color: d.color }]}>{d.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Quick actions */}
        <Text style={styles.quickTitle}>Quick Access</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable
              key={a.label}
              style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.75 }]}
              onPress={() => router.push(a.href as any)}
            >
              <Text style={styles.quickIcon}>{a.icon}</Text>
              <Text style={styles.quickLabel}>{a.label}</Text>
              {a.sub && <Text style={styles.quickSub}>{a.sub}</Text>}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const QUICK_ACTIONS = [
  { icon: "🧩", label: "DSA Problems", sub: "Solve & review", href: "/(tabs)/dsa" },
  { icon: "🃏", label: "Flashcards", sub: "SRS review", href: "/(tabs)/flashcards" },
  { icon: "📅", label: "Study Plan", sub: "Today's tasks", href: "/(tabs)/plan" },
  { icon: "🎯", label: "Mock Interview", sub: "Timed drill", href: "/mock" },
  { icon: "🏗️", label: "System Design", sub: "Architecture", href: "/system-design" },
  { icon: "💬", label: "Behavioral", sub: "STAR stories", href: "/behavioral" },
  { icon: "📚", label: "SE Basics", sub: "OS, DB, Network", href: "/se-basics" },
  { icon: "📊", label: "Analytics", sub: "Your stats", href: "/analytics" },
  { icon: "🏆", label: "Leaderboard", sub: "Global rank", href: "/leaderboard" },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.textPrimary },
  subGreeting: { fontSize: font.size.sm, color: colors.textSecondary, marginTop: 2 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgCard,
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border,
  },
  countdownBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.orangeBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.orange,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  countdownIcon: { fontSize: 22 },
  countdownText: { fontSize: font.size.base, fontWeight: font.weight.semibold, color: colors.orange },
  countdownSub: { fontSize: font.size.xs, color: colors.textSecondary, marginTop: 1 },
  countdownChevron: { fontSize: 18, color: colors.textMuted },
  // Daily challenge
  dailyCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacing.md,
    gap: spacing.sm,
  },
  dailyCardDone: { borderColor: colors.green, backgroundColor: colors.greenBg },
  dailyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dailyLabel: { fontSize: font.size.xs, color: colors.accent, fontWeight: font.weight.semibold, textTransform: "uppercase", letterSpacing: 0.6 },
  dailyDoneTag: { fontSize: font.size.xs, color: colors.green, fontWeight: font.weight.semibold },
  dailyTitle: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.textPrimary },
  dailyMeta: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  dailyDiff: { fontSize: font.size.sm, fontWeight: font.weight.semibold },
  dailyPattern: { fontSize: font.size.sm, color: colors.textMuted },

  statsRow: { flexDirection: "row", gap: spacing.sm },
  statCard: { flex: 1, alignItems: "center", gap: 2, paddingVertical: 14, paddingHorizontal: 8 },
  dueCard: { flex: 1 },
  statValue: { fontSize: font.size.xl, fontWeight: font.weight.extrabold },
  statLabel: { fontSize: font.size.xs, color: colors.textSecondary, textAlign: "center" },
  statSub: { fontSize: font.size.xs, color: colors.textMuted },
  section: { gap: spacing.md },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary },
  diffRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  diffItem: { flex: 1, gap: 4 },
  diffTop: { flexDirection: "row", alignItems: "baseline", gap: 1 },
  diffNum: { fontSize: font.size.md, fontWeight: font.weight.bold },
  diffOf: { fontSize: font.size.xs, color: colors.textMuted },
  diffLabel: { fontSize: font.size.xs, fontWeight: font.weight.medium },
  quickTitle: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  quickCard: {
    width: "47%", backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, padding: 14, gap: 4,
  },
  quickIcon: { fontSize: 22 },
  quickLabel: { fontSize: font.size.base, fontWeight: font.weight.semibold, color: colors.textPrimary },
  quickSub: { fontSize: font.size.xs, color: colors.textSecondary },
});
