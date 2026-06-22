import { View, StyleSheet } from "react-native";
import { colors, radius } from "@/lib/theme";

interface Props {
  value: number;
  max?: number;
  color?: string;
  height?: number;
}

export default function ProgressBar({ value, max = 100, color = colors.accent, height = 5 }: Props) {
  const pct = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0));
  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color, borderRadius: height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.border,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
  },
});
