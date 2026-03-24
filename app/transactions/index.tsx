import { TransactionCard } from "@/components/transaction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TransactionsScreen() {
  const { transactions, categories } = useFinance();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const totalExpense = transactions
    .filter((t) => t.transactionDirection === "DEBIT")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#F3F4F6" },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#F9FAFB" : "#111827" }]}>
          Transactions
        </Text>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Expense</Text>
              <Text style={[styles.summaryValue, { color: "#EF4444" }]}>
                ₹{totalExpense.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            category={getCategory(item.categoryId)}
            onPress={() => {}}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? "#9CA3AF" : "#6B7280" },
              ]}
            >
              No transactions yet
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { color: isDark ? "#6B7280" : "#9CA3AF" },
              ]}
            >
              Add your first transaction to start tracking
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button
          title="+ Add Transaction"
          onPress={() => router.push("/transactions/new")}
          variant="primary"
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 16,
  },
  summaryCard: {
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
});
