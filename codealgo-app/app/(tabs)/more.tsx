import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/authContext";
import { useProgressStore } from "@/lib/store";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card } from "@/components/ui";

const SECTIONS = [
  {
    title: "Practice",
    items: [
      { icon: "🎯", label: "Mock Interview", sub: "Timed problem sessions", href: "/mock" },
      { icon: "🧠", label: "Pattern Diagnosis", sub: "Identify the right approach", href: "/quiz" },
    ],
  },
  {
    title: "Learn",
    items: [
      { icon: "🏗️", label: "System Design", sub: "Architecture deep dives", href: "/system-design" },
      { icon: "📚", label: "SE Basics", sub: "OS, DB, Networking, OOPS", href: "/se-basics" },
      { icon: "💬", label: "Behavioral Prep", sub: "STAR stories & frameworks", href: "/behavioral" },
    ],
  },
  {
    title: "Track",
    items: [
      { icon: "📊", label: "Analytics", sub: "Patterns, streaks, weak spots", href: "/analytics" },
      { icon: "🏆", label: "Leaderboard", sub: "Global ranking, live", href: "/leaderboard" },
      { icon: "🔖", label: "Bookmarks", sub: "Saved problems", href: "/bookmarks" },
    ],
  },
  {
    title: "App",
    items: [
      { icon: "⚙️", label: "Settings", sub: "Study duration, track, notifications", href: "/settings" },
    ],
  },
];

function MoreItem({ icon, label, sub, href }: { icon: string; label: string; sub: string; href: string }) {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
      onPress={() => router.push(href as any)}
    >
      <Text style={styles.itemIcon}>{icon}</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemSub}>{sub}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export default function MoreScreen() {
  const { user, signOut } = useAuth();
  const { solved, xp, streak, username } = useProgressStore();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>More</Text>

        {/* Profile card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{(username || user?.displayName)?.[0]?.toUpperCase() ?? "?"}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{username ? `@${username}` : (user?.displayName ?? "Guest")}</Text>
              <Text style={styles.profileEmail}>{user?.email ?? ""}</Text>
            </View>
          </View>
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={[styles.profileStatNum, { color: colors.green }]}>{solved.size}</Text>
              <Text style={styles.profileStatLbl}>Solved</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={[styles.profileStatNum, { color: colors.accent }]}>{xp}</Text>
              <Text style={styles.profileStatLbl}>XP</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={[styles.profileStatNum, { color: colors.orange }]}>{streak}🔥</Text>
              <Text style={styles.profileStatLbl}>Streak</Text>
            </View>
          </View>
        </Card>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <View key={item.href + item.label}>
                  <MoreItem {...item} />
                  {i < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        {/* Sign out */}
        <Pressable
          style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.8 }]}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>Code Algo v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  title: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.textPrimary },
  profileCard: { gap: spacing.md },
  profileRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.accent },
  profileInfo: { flex: 1 },
  profileName: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary },
  profileEmail: { fontSize: font.size.sm, color: colors.textSecondary, marginTop: 2 },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  profileStat: { alignItems: "center", gap: 2 },
  profileStatNum: { fontSize: font.size.xl, fontWeight: font.weight.extrabold },
  profileStatLbl: { fontSize: font.size.xs, color: colors.textSecondary },
  profileStatDivider: { width: 1, backgroundColor: colors.border },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: font.size.sm, color: colors.textMuted, fontWeight: font.weight.semibold, textTransform: "uppercase", letterSpacing: 0.8 },
  sectionCard: { padding: 0, overflow: "hidden" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    gap: spacing.md,
  },
  itemIcon: { fontSize: 22, width: 28, textAlign: "center" },
  itemInfo: { flex: 1 },
  itemLabel: { fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.textPrimary },
  itemSub: { fontSize: font.size.xs, color: colors.textSecondary, marginTop: 1 },
  chevron: { fontSize: 18, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.borderSubtle, marginLeft: spacing.lg + 28 + spacing.md },
  signOutBtn: {
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.redBg,
  },
  signOutText: { fontSize: font.size.base, color: colors.red, fontWeight: font.weight.semibold },
  version: { fontSize: font.size.xs, color: colors.textMuted, textAlign: "center" },
});
