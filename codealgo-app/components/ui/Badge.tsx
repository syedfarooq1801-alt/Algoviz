import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, font, radius } from "@/lib/theme";

interface Props {
  label: string;
  color?: string;
  bg?: string;
  style?: ViewStyle;
  size?: "sm" | "md";
}

export default function Badge({ label, color = colors.accent, bg = colors.accentSoft, style, size = "md" }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color }, size === "sm" && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
  },
  textSm: {
    fontSize: font.size.xs,
  },
});
