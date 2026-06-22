import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Switch, Alert, TextInput, ViewStyle, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePrepStore, PREP_TRACKS, PrepTrackId } from "@/lib/prepStore";
import { useProgressStore } from "@/lib/store";
import { useAuth } from "@/lib/authContext";
import { validateUsername, isUsernameAvailable, claimUsername } from "@/lib/username";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, ScreenHeader } from "@/components/ui";
import { registerForNotifications, scheduleDailyReviewNotification, scheduleDailyChallengeNotification, cancelAllNotifications } from "@/lib/notifications";

const DURATIONS = [30, 60, 90] as const;

const DATE_PRESETS = [
  { label: "2 wks", days: 14 },
  { label: "1 mo", days: 30 },
  { label: "2 mo", days: 60 },
  { label: "3 mo", days: 90 },
] as const;

function addDays(days: number): string {
  const d = new Date(Date.now() + days * 86400000);
  return d.toISOString().split("T")[0];
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}

function isValidDate(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(new Date(str).getTime());
}

export default function SettingsScreen() {
  const { studyPlanDuration, setStudyPlanDuration, interviewDate, setInterviewDate, username, setUsername } = useProgressStore();
  const { selectedTrack, setTrack, reviewDue } = usePrepStore();
  const { user } = useAuth();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [dateInput, setDateInput] = useState(interviewDate);
  const [nameInput, setNameInput] = useState(username);
  const [nameError, setNameError] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const dueCount = Object.values(reviewDue).filter((d) => d <= today).length;

  const saveUsername = async () => {
    if (!user) return;
    setNameError(null);
    const v = nameInput.trim();
    const invalid = validateUsername(v);
    if (invalid) { setNameError(invalid); return; }
    if (v.toLowerCase() === username.toLowerCase()) return;
    setSavingName(true);
    try {
      const free = await isUsernameAvailable(v, user.uid);
      if (!free) { setNameError("That username is taken."); setSavingName(false); return; }
      await claimUsername(user.uid, v, username);
      setUsername(v);
      Alert.alert("Saved", `Username updated to @${v}`);
    } catch (e) {
      setNameError((e as Error).message ?? "Could not save.");
    } finally {
      setSavingName(false);
    }
  };

  const handleNotifToggle = async (val: boolean) => {
    if (val) {
      const granted = await registerForNotifications();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Enable notifications in your device Settings to get daily review reminders."
        );
        return;
      }
      await scheduleDailyReviewNotification(dueCount);
      await scheduleDailyChallengeNotification();
    } else {
      await cancelAllNotifications();
    }
    setNotifEnabled(val);
  };

  const applyDate = (str: string) => {
    if (!str.trim()) {
      setInterviewDate("");
      setDateInput("");
      return;
    }
    if (!isValidDate(str)) {
      Alert.alert("Invalid Date", "Enter date as YYYY-MM-DD, e.g. 2025-09-15");
      return;
    }
    setInterviewDate(str);
    setDateInput(str);
  };

  const daysLeft = interviewDate ? daysUntil(interviewDate) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Settings" back />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Username */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Username</Text>
          <Text style={styles.sectionSub}>Shown on the leaderboard and public profile</Text>
          <View style={styles.dateRow}>
            <View style={[styles.unameWrap, nameError ? { borderColor: colors.red } : null]}>
              <Text style={styles.unameAt}>@</Text>
              <TextInput
                style={styles.unameInput}
                value={nameInput}
                onChangeText={(t) => { setNameInput(t); setNameError(null); }}
                placeholder="your_handle"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
              />
            </View>
            {savingName ? (
              <View style={styles.dateSetBtn}><ActivityIndicator color={colors.accent} size="small" /></View>
            ) : (
              <Pressable style={styles.dateSetBtn} onPress={saveUsername}>
                <Text style={styles.dateSetText}>Save</Text>
              </Pressable>
            )}
          </View>
          {nameError ? <Text style={styles.unameErr}>{nameError}</Text> : null}
        </View>

        {/* Interview Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interview Date</Text>
          <Text style={styles.sectionSub}>Dashboard shows countdown when set</Text>

          {/* Quick presets */}
          <View style={styles.presetRow}>
            {DATE_PRESETS.map((p) => (
              <Pressable
                key={p.label}
                style={styles.presetBtn}
                onPress={() => { const d = addDays(p.days); setDateInput(d); setInterviewDate(d); }}
              >
                <Text style={styles.presetText}>{p.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.dateRow}>
            <TextInput
              style={styles.dateInput}
              value={dateInput}
              onChangeText={setDateInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              maxLength={10}
              onBlur={() => applyDate(dateInput)}
              onSubmitEditing={() => applyDate(dateInput)}
            />
            <Pressable
              style={styles.dateSetBtn}
              onPress={() => applyDate(dateInput)}
            >
              <Text style={styles.dateSetText}>Set</Text>
            </Pressable>
            {interviewDate ? (
              <Pressable style={styles.dateClearBtn} onPress={() => { setInterviewDate(""); setDateInput(""); }}>
                <Text style={styles.dateClearText}>✕</Text>
              </Pressable>
            ) : null}
          </View>

          {interviewDate && daysLeft !== null && (
            <Card style={StyleSheet.flatten([styles.countdownCard, daysLeft <= 7 && { borderColor: colors.red }]) as ViewStyle}>
              <Text style={styles.countdownEmoji}>🎯</Text>
              <View>
                <Text style={StyleSheet.flatten([styles.countdownDays, daysLeft <= 7 && { color: colors.red }])}>
                  {daysLeft > 0 ? `${daysLeft} days` : daysLeft === 0 ? "Today!" : "Past"}
                </Text>
                <Text style={styles.countdownDate}>{interviewDate}</Text>
              </View>
            </Card>
          )}
        </View>

        {/* Study Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Plan Duration</Text>
          <Text style={styles.sectionSub}>How many days to complete your preparation</Text>
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => (
              <Pressable
                key={d}
                style={[styles.durationBtn, studyPlanDuration === d && styles.durationBtnActive]}
                onPress={() => setStudyPlanDuration(d)}
              >
                <Text style={[styles.durationNum, studyPlanDuration === d && styles.durationNumActive]}>
                  {d}
                </Text>
                <Text style={[styles.durationLabel, studyPlanDuration === d && { color: colors.accent }]}>
                  days
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Prep Track */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparation Track</Text>
          <Text style={styles.sectionSub}>Shapes your study plan and priorities</Text>
          <View style={styles.trackList}>
            {(Object.entries(PREP_TRACKS) as [PrepTrackId, { title: string; focus: string }][]).map(
              ([id, track]) => (
                <Pressable
                  key={id}
                  style={[styles.trackCard, selectedTrack === id && styles.trackCardActive]}
                  onPress={() => setTrack(id)}
                >
                  <View style={styles.trackRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.trackTitle, selectedTrack === id && { color: colors.accent }]}>
                        {track.title}
                      </Text>
                      <Text style={styles.trackFocus}>{track.focus}</Text>
                    </View>
                    {selectedTrack === id && (
                      <Text style={styles.trackCheck}>✓</Text>
                    )}
                  </View>
                </Pressable>
              )
            )}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Card style={styles.notifCard}>
            <View style={styles.notifRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifLabel}>Daily Review Reminder</Text>
                <Text style={styles.notifSub}>
                  Remind at 9 AM when you have SRS reviews due
                </Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={handleNotifToggle}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.textPrimary}
              />
            </View>
          </Card>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: spacing.lg, paddingBottom: 48, gap: spacing.xl },
  section: { gap: spacing.md },
  sectionTitle: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary },
  sectionSub: { fontSize: font.size.sm, color: colors.textMuted },

  // Username
  unameWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  unameAt: { fontSize: font.size.base, color: colors.textMuted },
  unameInput: { flex: 1, color: colors.textPrimary, fontSize: font.size.base, paddingVertical: 10 },
  unameErr: { fontSize: font.size.xs, color: colors.red },

  // Interview date
  presetRow: { flexDirection: "row", gap: spacing.sm },
  presetBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    alignItems: "center",
  },
  presetText: { fontSize: font.size.sm, color: colors.textSecondary, fontWeight: font.weight.medium },
  dateRow: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  dateInput: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontSize: font.size.base,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  dateSetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  dateSetText: { fontSize: font.size.sm, color: colors.accent, fontWeight: font.weight.semibold },
  dateClearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  dateClearText: { fontSize: font.size.sm, color: colors.textMuted },
  countdownCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderColor: colors.orange,
    borderWidth: 1,
    backgroundColor: colors.orangeBg,
  },
  countdownEmoji: { fontSize: 24 },
  countdownDays: { fontSize: font.size.md, fontWeight: font.weight.bold, color: colors.orange },
  countdownDate: { fontSize: font.size.xs, color: colors.textSecondary, marginTop: 2 },

  // Duration
  durationRow: { flexDirection: "row", gap: spacing.md },
  durationBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: radius.lg,
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  durationBtnActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  durationNum: { fontSize: font.size.xxl, fontWeight: font.weight.extrabold, color: colors.textSecondary },
  durationNumActive: { color: colors.accent },
  durationLabel: { fontSize: font.size.xs, color: colors.textMuted },

  // Track
  trackList: { gap: spacing.sm },
  trackCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  trackCardActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  trackRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  trackTitle: { fontSize: font.size.base, fontWeight: font.weight.semibold, color: colors.textSecondary, marginBottom: 3 },
  trackFocus: { fontSize: font.size.xs, color: colors.textMuted, lineHeight: 16 },
  trackCheck: { fontSize: 16, color: colors.accent, fontWeight: font.weight.bold },

  // Notifications
  notifCard: { padding: 0 },
  notifRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  notifLabel: { fontSize: font.size.base, fontWeight: font.weight.medium, color: colors.textPrimary, marginBottom: 3 },
  notifSub: { fontSize: font.size.xs, color: colors.textSecondary },
});
