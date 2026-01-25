import { Card } from "@/components/ui/card";
import { Streak } from "@/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StreakCardProps {
  streak: Streak | null;
  isDark?: boolean;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streak,
  isDark = false,
}) => {
  if (!streak) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🔥</Text>
        <Text style={[styles.title, { color: isDark ? "#F9FAFB" : "#111827" }]}>
          Your Streak
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{streak.currentCount}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statSubtext}>days in a row</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: "#F59E0B" }]}>
            {streak.longestCount}
          </Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
          <Text style={styles.statSubtext}>personal best</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(streak.lastUpdated).toLocaleDateString()}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  emoji: {
    fontSize: 28,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },
  lastUpdated: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
