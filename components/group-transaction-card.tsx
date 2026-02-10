import { Card } from "@/components/ui/card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GroupTransactionApiResponse } from "@/types/api.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface GroupTransactionCardProps {
  transaction: GroupTransactionApiResponse;
}

export const GroupTransactionCard: React.FC<GroupTransactionCardProps> = ({
  transaction,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(transaction.amount);

  const formattedDate = new Date(
    transaction.transactionDate,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View
            style={[styles.iconContainer, { backgroundColor: "#EF444420" }]}
          >
            <Text style={styles.icon}>💸</Text>
          </View>
          <View style={styles.info}>
            <Text
              style={[
                styles.description,
                { color: isDark ? "#F9FAFB" : "#111827" },
              ]}
            >
              {transaction.description}
            </Text>
            <Text
              style={[styles.paidBy, { color: isDark ? "#9CA3AF" : "#6B7280" }]}
            >
              Paid by {transaction.paidByMemberName}
            </Text>
            <View style={styles.participantsContainer}>
              <Text
                style={[
                  styles.participants,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                Split: {transaction.participantNames.join(", ")}
              </Text>
            </View>
            <Text
              style={[styles.date, { color: isDark ? "#9CA3AF" : "#6B7280" }]}
            >
              {formattedDate}
            </Text>
          </View>
        </View>
        <Text style={[styles.amount, { color: "#EF4444" }]}>
          {formattedAmount}
        </Text>
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
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  description: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  paidBy: {
    fontSize: 12,
    marginBottom: 2,
  },
  participantsContainer: {
    marginBottom: 4,
  },
  participants: {
    fontSize: 11,
  },
  date: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
