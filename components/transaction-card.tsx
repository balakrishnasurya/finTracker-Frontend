import { Card } from "@/components/ui/card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Category, Transaction } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TransactionCardProps {
  transaction: Transaction;
  category?: Category;
  onPress: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  category,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(transaction.amount);

  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            {category && (
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: category.color + "20" },
                ]}
              >
                <Text style={[styles.icon, { color: category.color }]}>
                  {category.icon}
                </Text>
              </View>
            )}
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
                style={[styles.date, { color: isDark ? "#9CA3AF" : "#6B7280" }]}
              >
                {formattedDate}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.amount,
              {
                color: transaction.type === "income" ? "#10B981" : "#EF4444",
              },
            ]}
          >
            {transaction.type === "income" ? "+" : "-"}
            {formattedAmount}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
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
  date: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
