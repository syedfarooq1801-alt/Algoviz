import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, ScreenHeader } from "@/components/ui";

interface Leader {
  uid: string;
  username: string | null;
  xp: number;
  streak: number;
  solvedCount: number;
}

type Tab = "xp" | "streak" | "solved";

function publicName(l: Leader): string {
  return l.username || "Anonymous";
}

function initials(name: string): string {
  return name.split(/[\s_]+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>("xp");

  // One-time fetch instead of a realtime listener (cost) — pull to refresh.
  const load = useCallback(async () => {
    const field = tab === "streak" ? "streak" : tab === "solved" ? "solvedCount" : "xp";
    const q = query(collection(db, "leaderboard"), orderBy(field, "desc"), limit(100));
    try {
      const snap = await getDocs(q);
      setLeaders(snap.docs.map((d) => ({
        uid: d.id,
        username: d.data().username ?? null,
        xp: d.data().xp ?? 0,
        streak: d.data().streak ?? 0,
        solvedCount: d.data().solvedCount ?? 0,
      })));
    } catch (err) {
      console.error("[leaderboard]", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tab]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  const myRank = user ? leaders.findIndex((l) => l.uid === user.uid) + 1 : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="🏆 Leaderboard" back />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} />}
      >

        {/* My rank */}
        {user && myRank > 0 && (
          <Card style={styles.myRankCard}>
            <Text style={styles.myRankLabel}>Your Rank</Text>
            <Text style={styles.myRankNum}>#{myRank}</Text>
            <Text style={styles.myRankSub}>
              {leaders[myRank - 1]?.xp.toLocaleString()} XP · {leaders[myRank - 1]?.solvedCount} solved
            </Text>
          </Card>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {(["xp", "streak", "solved"] as const).map((t) => (
            <Pressable
              key={t}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === "xp" ? "⚡ XP" : t === "streak" ? "🔥 Streak" : "✅ Solved"}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : leaders.length === 0 ? (
          <View style={styles.loadingBox}>
            <Text style={styles.emptyText}>No users yet. Be the first!</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {leaders.map((leader, i) => {
              const rank = i + 1;
              const isMe = user?.uid === leader.uid;
              const primaryVal =
                tab === "xp" ? leader.xp.toLocaleString()
                : tab === "streak" ? `${leader.streak}🔥`
                : `${leader.solvedCount}`;
              return (
                <View key={leader.uid} style={[styles.row, isMe && styles.rowMe]}>
                  <View style={styles.rankCol}>
                    {rank <= 3 ? (
                      <Text style={styles.medal}>{MEDALS[rank - 1]}</Text>
                    ) : (
                      <Text style={styles.rankNum}>{rank}</Text>
                    )}
                  </View>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials(publicName(leader))}</Text>
                  </View>
                  <View style={styles.nameCol}>
                    <Text style={[styles.name, isMe && { color: colors.accent }]} numberOfLines={1}>
                      {publicName(leader)}
                      {isMe ? "  (You)" : ""}
                    </Text>
                    <Text style={styles.subStat}>
                      {leader.xp.toLocaleString()} XP · {leader.solvedCount} solved
                    </Text>
                  </View>
                  <Text style={[styles.primaryVal, {
                    color: tab === "xp" ? colors.accent : tab === "streak" ? colors.orange : colors.green,
                  }]}>
                    {primaryVal}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.footer}>Top 100 · pull down to refresh</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  myRankCard: { alignItems: "center", gap: 2, borderColor: colors.accent, borderWidth: 1, backgroundColor: colors.accentSoft },
  myRankLabel: { fontSize: font.size.xs, color: colors.accent, fontWeight: font.weight.semibold, textTransform: "uppercase", letterSpacing: 0.6 },
  myRankNum: { fontSize: font.size.xxl, fontWeight: font.weight.extrabold, color: colors.textPrimary },
  myRankSub: { fontSize: font.size.sm, color: colors.textSecondary },
  tabs: { flexDirection: "row", gap: spacing.sm },
  tabBtn: {
    flex: 1, paddingVertical: 8, borderRadius: radius.md, alignItems: "center",
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard,
  },
  tabBtnActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  tabText: { fontSize: font.size.sm, color: colors.textSecondary, fontWeight: font.weight.medium },
  tabTextActive: { color: colors.accent },
  loadingBox: { paddingVertical: 60, alignItems: "center" },
  emptyText: { color: colors.textMuted, fontSize: font.size.base },
  list: { gap: spacing.sm },
  row: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
  },
  rowMe: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  rankCol: { width: 28, alignItems: "center" },
  medal: { fontSize: 18 },
  rankNum: { fontSize: font.size.base, fontWeight: font.weight.bold, color: colors.textMuted },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accentSoft,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: font.size.sm, fontWeight: font.weight.bold, color: colors.accent },
  nameCol: { flex: 1, minWidth: 0 },
  name: { fontSize: font.size.base, fontWeight: font.weight.semibold, color: colors.textPrimary },
  subStat: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 1 },
  primaryVal: { fontSize: font.size.md, fontWeight: font.weight.extrabold },
  footer: { fontSize: font.size.xs, color: colors.textMuted, textAlign: "center" },
});
