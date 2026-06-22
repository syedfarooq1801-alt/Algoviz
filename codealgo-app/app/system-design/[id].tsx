import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { SD_CHAPTERS } from "@/data/systemDesign";
import { useSDStore } from "@/lib/sdStore";
import { colors, font, spacing, radius } from "@/lib/theme";
import { Card, ScreenHeader, Badge, Button } from "@/components/ui";

export default function SDConceptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMastered, toggleMastered, isBookmarked, toggleBookmark } = useSDStore();

  const concept = SD_CHAPTERS.flatMap((c) => c.concepts).find((c) => c.id === id);
  const chapter = SD_CHAPTERS.find((c) => c.concepts.some((co) => co.id === id));

  if (!concept) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Concept" back />
        <View style={styles.center}><Text style={styles.muted}>Concept not found.</Text></View>
      </SafeAreaView>
    );
  }

  const mastered = isMastered(concept.id);
  const bookmarked = isBookmarked(concept.id);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={concept.title}
        subtitle={chapter?.title}
        back
        right={
          <Pressable onPress={() => toggleBookmark(concept.id)} hitSlop={10}>
            <Text style={{ fontSize: 20, opacity: bookmarked ? 1 : 0.4 }}>🔖</Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Meta */}
        <View style={styles.metaRow}>
          <Badge
            label={concept.difficulty}
            color={concept.difficulty === "Fundamental" ? colors.green : concept.difficulty === "Intermediate" ? colors.orange : colors.red}
            bg={concept.difficulty === "Fundamental" ? colors.greenBg : concept.difficulty === "Intermediate" ? colors.orangeBg : colors.redBg}
          />
          {concept.tags?.map((t) => (
            <Badge key={t} label={t} size="sm" color={colors.textSecondary} bg={colors.bgHover} />
          ))}
        </View>

        {/* Summary */}
        <Card>
          <Text style={styles.body}>{concept.summary}</Text>
        </Card>

        {/* Mastered button */}
        <Button
          label={mastered ? "✓ Mastered" : "Mark as Mastered"}
          onPress={() => toggleMastered(concept.id)}
          variant={mastered ? "secondary" : "primary"}
          fullWidth
        />

        <Text style={styles.hint}>Detailed content and visualizations available in the web app.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { color: colors.textMuted, fontSize: font.size.base },
  content: { padding: spacing.lg, paddingBottom: 40, gap: spacing.lg },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  body: { fontSize: font.size.base, color: colors.textSecondary, lineHeight: 22 },
  hint: { fontSize: font.size.sm, color: colors.textMuted, textAlign: "center" },
});
