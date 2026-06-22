import { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors, radius, spacing } from "@/lib/theme";

interface Props {
  width?: number | `${number}%` | "100%";
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function Skeleton({ width = "100%", height = 16, borderRadius = 6, style }: Props) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.25, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: colors.bgHover },
        animStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[skStyles.card, style]}>
      <Skeleton height={14} width="60%" />
      <Skeleton height={10} width="80%" />
      <Skeleton height={10} width="40%" />
    </View>
  );
}

export function SkeletonRow() {
  return (
    <View style={skStyles.row}>
      <Skeleton width={16} height={16} borderRadius={8} />
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton height={13} width="65%" />
        <Skeleton height={10} width="40%" />
      </View>
      <Skeleton width={10} height={10} borderRadius={5} />
    </View>
  );
}

export function SkeletonDashboard() {
  return (
    <View style={{ gap: spacing.lg, padding: spacing.lg }}>
      <View style={{ gap: spacing.sm }}>
        <Skeleton height={22} width="50%" />
        <Skeleton height={14} width="35%" />
      </View>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <SkeletonCard style={{ flex: 1 }} />
        <SkeletonCard style={{ flex: 1 }} />
      </View>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

const skStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    gap: spacing.md,
  },
});
