import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export async function registerForNotifications(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reviews", {
      name: "Daily Review Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyReviewNotification(dueCount: number): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (dueCount === 0) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Code Algo — Review Time",
      body: `${dueCount} problem${dueCount !== 1 ? "s" : ""} due for SRS review today.`,
      data: { screen: "/(tabs)/dsa" },
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    } as any,
  });
}

export async function scheduleDailyChallengeNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🎯 Daily Challenge Ready",
      body: "Your daily coding challenge is waiting. Stay consistent!",
      data: { screen: "/" },
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    } as any,
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
