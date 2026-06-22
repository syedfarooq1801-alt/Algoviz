import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { colors, font, radius } from "@/lib/theme";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const BG: Record<string, string> = {
  primary: colors.accent,
  secondary: colors.bgHover,
  ghost: "transparent",
  danger: colors.red,
};
const TEXT_COLOR: Record<string, string> = {
  primary: "#fff",
  secondary: colors.textPrimary,
  ghost: colors.accent,
  danger: "#fff",
};

export default function Button({
  label, onPress, variant = "primary", size = "md",
  disabled, loading, style, fullWidth,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: BG[variant] },
        size === "sm" && styles.sm,
        size === "lg" && styles.lg,
        variant === "ghost" && styles.ghost,
        fullWidth && { alignSelf: "stretch" },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.75 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={TEXT_COLOR[variant]} size="small" />
      ) : (
        <Text style={[styles.text, { color: TEXT_COLOR[variant] }, size === "sm" && styles.textSm]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.md,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  sm: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: radius.sm },
  lg: { paddingVertical: 14, paddingHorizontal: 24 },
  ghost: { borderWidth: 1, borderColor: colors.accent },
  text: { fontSize: font.size.base, fontWeight: font.weight.semibold },
  textSm: { fontSize: font.size.sm },
});
