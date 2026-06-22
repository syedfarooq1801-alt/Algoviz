import { View, Text, Pressable, StyleSheet, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/authContext";
import { colors, font, radius, spacing } from "@/lib/theme";
import { useState } from "react";
import Svg, { Circle, Line } from "react-native-svg";

function LogoBadge({ size = 48 }: { size?: number }) {
  const s = size;
  return (
    <View style={{ width: s, height: s, borderRadius: s * 0.22, backgroundColor: "#111620", alignItems: "center", justifyContent: "center" }}>
      <Svg width={s * 0.72} height={s * 0.72} viewBox="0 0 24 24">
        <Line x1="12" y1="5" x2="6" y2="13" stroke="#4F8CFF" strokeWidth="1.2" />
        <Line x1="12" y1="5" x2="18" y2="13" stroke="#4F8CFF" strokeWidth="1.2" strokeOpacity="0.5" />
        <Line x1="6" y1="13" x2="3.5" y2="20.5" stroke="#4F8CFF" strokeWidth="1.2" strokeOpacity="0.48" />
        <Line x1="6" y1="13" x2="8.5" y2="20.5" stroke="#4F8CFF" strokeWidth="1.2" strokeOpacity="0.32" />
        <Circle cx="12" cy="5" r="3" fill="#4F8CFF" />
        <Circle cx="6" cy="13" r="2.4" fill="#4F8CFF" fillOpacity="0.85" />
        <Circle cx="18" cy="13" r="2.4" fill="#4F8CFF" fillOpacity="0.5" />
        <Circle cx="3.5" cy="20.5" r="1.7" fill="#4F8CFF" fillOpacity="0.48" />
        <Circle cx="8.5" cy="20.5" r="1.7" fill="#4F8CFF" fillOpacity="0.32" />
      </Svg>
    </View>
  );
}

const FEATURES = [
  { icon: "⚡", text: "300+ curated DSA problems" },
  { icon: "🧠", text: "SRS flashcard review system" },
  { icon: "📋", text: "60-day adaptive study plan" },
  { icon: "🎯", text: "Mock interviews with scoring" },
  { icon: "🏗️", text: "System design deep dives" },
];

export default function SignIn() {
  const { signIn, signInError, loading } = useAuth();
  const [signing, setSigning] = useState(false);

  const handleSignIn = async () => {
    setSigning(true);
    await signIn();
    setSigning(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.hero}>
          <LogoBadge size={72} />
          <Text style={styles.appName}>Code Algo</Text>
          <Text style={styles.tagline}>Your complete interview prep — in your pocket.</Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {signInError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{signInError}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.googleBtn, pressed && { opacity: 0.8 }]}
          onPress={handleSignIn}
          disabled={signing || loading}
        >
          {signing ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleText}>Continue with Google</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.disclaimer}>Free forever. No credit card required.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    gap: spacing.xl,
  },
  hero: {
    alignItems: "center",
    gap: spacing.md,
  },
  appName: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: font.size.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  features: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 18,
    width: 26,
    textAlign: "center",
  },
  featureText: {
    fontSize: font.size.base,
    color: colors.textPrimary,
    fontWeight: font.weight.medium,
  },
  errorBox: {
    backgroundColor: colors.redBg,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: font.size.sm,
    textAlign: "center",
  },
  googleBtn: {
    backgroundColor: "#fff",
    borderRadius: radius.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4285F4",
  },
  googleText: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: "#1a1a1a",
  },
  disclaimer: {
    fontSize: font.size.sm,
    color: colors.textMuted,
    textAlign: "center",
  },
});
