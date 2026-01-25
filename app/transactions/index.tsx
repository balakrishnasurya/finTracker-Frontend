import { TransactionCard } from "@/components/transaction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function TransactionsScreen() {
  const { transactions, categories } = useFinance();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filteredTransactions = transactions
    .filter((t) => filter === "all" || t.type === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
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
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, { color: "#10B981" }]}>
                ₹{totalIncome.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expense</Text>
              <Text style={[styles.summaryValue, { color: "#EF4444" }]}>
                ₹{totalExpense.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
            { backgroundColor: isDark ? "#374151" : "#FFFFFF" },
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              { color: isDark ? "#E5E7EB" : "#374151" },
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "income" && styles.filterButtonActive,
            { backgroundColor: isDark ? "#374151" : "#FFFFFF" },
          ]}
          onPress={() => setFilter("income")}
        >
          <Text
            style={[
              styles.filterText,
              { color: isDark ? "#E5E7EB" : "#374151" },
              filter === "income" && styles.filterTextActive,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "expense" && styles.filterButtonActive,
            { backgroundColor: isDark ? "#374151" : "#FFFFFF" },
          ]}
          onPress={() => setFilter("expense")}
        >
          <Text
            style={[
              styles.filterText,
              { color: isDark ? "#E5E7EB" : "#374151" },
              filter === "expense" && styles.filterTextActive,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
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
  },
  summaryItem: {
    flex: 1,
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
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#10B981",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#FFFFFF",
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
