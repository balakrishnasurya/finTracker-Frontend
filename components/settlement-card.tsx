import { Card } from "@/components/ui/card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SettlementApiResponse } from "@/types/api.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SettlementCardProps {
  settlement: SettlementApiResponse;
}

export const SettlementCard: React.FC<SettlementCardProps> = ({
  settlement,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(settlement.amount);

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.nameContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: isDark ? "#374151" : "#F3F4F6" },
            ]}
          >
            <Text style={[styles.initial, { color: "#EF4444" }]}>
              {settlement.fromMember.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text
            style={[styles.name, { color: isDark ? "#F9FAFB" : "#111827" }]}
          >
            {settlement.fromMember}
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
          <Text
            style={[styles.amount, { color: isDark ? "#F9FAFB" : "#111827" }]}
          >
            {formattedAmount}
          </Text>
        </View>

        <View style={styles.nameContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: isDark ? "#374151" : "#F3F4F6" },
            ]}
          >
            <Text style={[styles.initial, { color: "#10B981" }]}>
              {settlement.toMember.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text
            style={[styles.name, { color: isDark ? "#F9FAFB" : "#111827" }]}
          >
            {settlement.toMember}
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
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  initial: {
    fontSize: 14,
    fontWeight: "700",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  arrowContainer: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  arrow: {
    fontSize: 20,
    color: "#10B981",
    marginBottom: 2,
  },
  amount: {
    fontSize: 12,
    fontWeight: "700",
  },
});
