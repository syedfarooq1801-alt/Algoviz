import { View, Text, StyleSheet } from "react-native";
import { colors, font, spacing } from "@/lib/theme";

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function Empty({ icon = "📭", title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  icon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: font.size.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
