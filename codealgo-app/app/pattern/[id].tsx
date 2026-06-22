import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PATTERNS } from "@/data/problems";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, ScreenHeader, CodeBlock } from "@/components/ui";

const TABS = ["Overview", "Template", "Problems"] as const;
type Tab = typeof TABS[number];

export default function PatternScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");

  const pattern = PATTERNS.find((p) => p.id === id);
  if (!pattern) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Pattern" back />
        <View style={styles.center}><Text style={styles.muted}>Pattern not found.</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={pattern.title} subtitle="Pattern Theory" back />

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === "Overview" && (
          <View style={styles.section}>
            <Card>
              <Text style={styles.h3}>Core Intuition</Text>
              <Text style={styles.body}>{pattern.coreIntuition}</Text>
            </Card>

            <View>
              <Text style={styles.h3}>When to use this pattern</Text>
              {pattern.recognitionSignals.map((s, i) => (
                <Text key={i} style={styles.bullet}>• {s}</Text>
              ))}
            </View>

            <View style={styles.complexityRow}>
              <Card style={styles.complexityCard}>
                <Text style={styles.complexityLabel}>Time</Text>
                <Text style={styles.complexityValue}>{pattern.timeComplexity}</Text>
              </Card>
              <Card style={styles.complexityCard}>
                <Text style={styles.complexityLabel}>Space</Text>
                <Text style={styles.complexityValue}>{pattern.spaceComplexity}</Text>
              </Card>
            </View>

            {pattern.realWorldAnalogy && (
              <Card style={styles.analogyCard}>
                <Text style={styles.analogyLabel}>🌍 Real World Analogy</Text>
                <Text style={styles.body}>{pattern.realWorldAnalogy}</Text>
              </Card>
            )}

            {pattern.keyInsights && pattern.keyInsights.length > 0 && (
              <View>
                <Text style={styles.h3}>Key Insights</Text>
                {pattern.keyInsights.map((k, i) => (
                  <Text key={i} style={styles.bullet}>• {k}</Text>
                ))}
              </View>
            )}

            {pattern.commonMistakes && pattern.commonMistakes.length > 0 && (
              <View>
                <Text style={[styles.h3, { color: colors.red }]}>Common Mistakes</Text>
                {pattern.commonMistakes.map((m, i) => (
                  <Text key={i} style={styles.bullet}>• {m}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {tab === "Template" && (
          <View style={styles.section}>
            {pattern.template ? (
              <CodeBlock code={pattern.template} language="C++" />
            ) : (
              <Text style={styles.muted}>No template available.</Text>
            )}
            <Text style={styles.body}>{pattern.description}</Text>
          </View>
        )}

        {tab === "Problems" && (
          <View style={styles.section}>
            {pattern.problems.map((p) => (
              <Pressable
                key={p.id}
                style={({ pressed }) => [styles.probRow, pressed && { opacity: 0.7 }]}
                onPress={() => router.push(`/problem/${p.id}` as any)}
              >
                <Text style={styles.probTitle}>{p.title}</Text>
                <Text style={[styles.probDiff, { color: colors.textMuted }]}>{p.difficulty}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { color: colors.textMuted, fontSize: font.size.base },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.border, marginHorizontal: spacing.lg },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: colors.accent },
  tabText: { fontSize: font.size.base, color: colors.textMuted, fontWeight: font.weight.medium },
  tabTextActive: { color: colors.accent },
  content: { padding: spacing.lg, paddingBottom: 40 },
  section: { gap: spacing.lg },
  h3: { fontSize: font.size.md, fontWeight: font.weight.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  body: { fontSize: font.size.base, color: colors.textSecondary, lineHeight: 22 },
  bullet: { fontSize: font.size.base, color: colors.textSecondary, lineHeight: 22, marginBottom: 4 },
  complexityRow: { flexDirection: "row", gap: spacing.sm },
  complexityCard: { flex: 1 },
  complexityLabel: { fontSize: font.size.xs, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.6 },
  complexityValue: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: colors.accent, marginTop: 4 },
  analogyCard: { backgroundColor: colors.bgHover },
  analogyLabel: { fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.orange, marginBottom: spacing.sm },
  probRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  probTitle: { fontSize: font.size.base, color: colors.textPrimary, flex: 1 },
  probDiff: { fontSize: font.size.sm },
});
