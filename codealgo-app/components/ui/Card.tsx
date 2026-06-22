import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, radius } from "@/lib/theme";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated";
}

export default function Card({ children, style, variant = "default" }: Props) {
  return (
    <View style={[styles.card, variant === "elevated" && styles.elevated, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
