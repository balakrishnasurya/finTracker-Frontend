import { Card } from "@/components/ui/card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GroupBalanceApiResponse } from "@/types/api.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BalanceCardProps {
  balance: GroupBalanceApiResponse;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const isPositive = balance.balance > 0;
  const balanceColor = isPositive ? "#10B981" : "#EF4444";
  const balanceText = isPositive
    ? "should receive"
    : balance.balance < 0
      ? "owes"
      : "settled";

  const formattedPaid = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(balance.totalPaid);

  const formattedShare = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(balance.totalShare);

  const formattedBalance = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Math.abs(balance.balance));

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: isDark ? "#374151" : "#F3F4F6" },
            ]}
          >
            <Text style={[styles.initial, { color: "#10B981" }]}>
              {balance.memberName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text
            style={[styles.name, { color: isDark ? "#F9FAFB" : "#111827" }]}
          >
            {balance.memberName}
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={[styles.balance, { color: balanceColor }]}>
            {formattedBalance}
          </Text>
          <Text
            style={[
              styles.balanceLabel,
              { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            {balanceText}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? "#374151" : "#E5E7EB" },
        ]}
      />
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            Paid
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: isDark ? "#F9FAFB" : "#111827" },
            ]}
          >
            {formattedPaid}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            Share
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: isDark ? "#F9FAFB" : "#111827" },
            ]}
          >
            {formattedShare}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  initial: {
    fontSize: 16,
    fontWeight: "700",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  balance: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  balanceLabel: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
