import { Tabs } from "expo-router";
import { colors, font } from "@/lib/theme";
import { View, Text, StyleSheet } from "react-native";
import { usePrepStore } from "@/lib/prepStore";

function TabIcon({ emoji, label, focused, badge }: { emoji: string; label: string; focused: boolean; badge?: number }) {
  return (
    <View style={styles.tabItem}>
      <View>
        <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
        {badge && badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.tabLabel, { color: focused ? colors.accent : colors.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

function DSATabIcon({ focused }: { focused: boolean }) {
  const { reviewDue } = usePrepStore();
  const today = new Date().toISOString().split("T")[0];
  const dueCount = Object.values(reviewDue).filter((d) => d <= today).length;
  return <TabIcon emoji="🧩" label="DSA" focused={focused} badge={dueCount} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgSecondary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="dsa"
        options={{
          tabBarIcon: ({ focused }) => <DSATabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="flashcards"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🃏" label="Cards" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📅" label="Plan" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="⋯" label="More" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    gap: 2,
  },
  tabLabel: {
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -8,
    backgroundColor: colors.orange,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#000",
  },
});
