import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { AuthProvider, useAuth } from "@/lib/authContext";
import { useProgressStore } from "@/lib/store";
import { useRouter, useSegments } from "expo-router";
import { View } from "react-native";
import { colors } from "@/lib/theme";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { hasCompletedOnboarding } = useProgressStore();
  const segments = useSegments();
  const router = useRouter();

  // Navigate to screen from notification tap
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const screen = response.notification.request.content.data?.screen as string | undefined;
      if (screen) router.push(screen as any);
    });
    return () => sub.remove();
  }, []);

  // Auth + onboarding guard
  useEffect(() => {
    if (loading) return;
    const inTabs = segments[0] === "(tabs)";
    const inSignIn = segments[0] === "sign-in";
    const inOnboarding = segments[0] === "onboarding";

    if (!user && inTabs) {
      router.replace("/sign-in");
    } else if (user && inSignIn) {
      router.replace(hasCompletedOnboarding ? "/(tabs)" : "/onboarding");
    } else if (user && inOnboarding && hasCompletedOnboarding) {
      router.replace("/(tabs)");
    } else if (user && inTabs && !hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [user, loading, segments, hasCompletedOnboarding]);

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: colors.bgPrimary }} />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RouteGuard>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bgPrimary } }}>
              <Stack.Screen name="sign-in" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="onboarding" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="problem/[id]" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="pattern/[id]" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="analytics" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="mock" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="behavioral" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="system-design/index" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="system-design/[id]" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="se-basics/index" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="se-basics/[id]" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="settings" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="quiz" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="bookmarks" options={{ presentation: "card", animation: "slide_from_right" }} />
              <Stack.Screen name="leaderboard" options={{ presentation: "card", animation: "slide_from_right" }} />
            </Stack>
          </RouteGuard>
          <StatusBar style="light" />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
