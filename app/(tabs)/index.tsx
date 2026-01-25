import { CategoryGrid } from "@/components/category-grid";
import { TransactionCard } from "@/components/transaction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { transactions, categories, streak, getFinanceSummary, refreshData } =
    useFinance();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const summary = getFinanceSummary();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  };

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#F3F4F6" },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? "#10B981" : "#059669"}
            colors={["#10B981"]}
          />
        }
      >
        <View style={styles.headerSection}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.titleIcon}>💰</Text>
                <Text
                  style={[
                    styles.title,
                    { color: isDark ? "#F9FAFB" : "#111827" },
                  ]}
                >
                  FinTrackor
                </Text>
              </View>
              <Text
                style={[
                  styles.subtitle,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                Track Your Wealth, Master Your Future
              </Text>
            </View>
            {streak && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <View style={styles.streakContent}>
                  <Text style={styles.streakCount}>{streak.currentCount}</Text>
                  <Text style={styles.streakLabel}>day streak</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text
            style={[
              styles.balanceAmount,
              {
                color: summary.balance >= 0 ? "#10B981" : "#EF4444",
              },
            ]}
          >
            {formatCurrency(summary.balance)}
          </Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Income</Text>
              <Text style={[styles.balanceItemValue, { color: "#10B981" }]}>
                {formatCurrency(summary.totalIncome)}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Expense</Text>
              <Text style={[styles.balanceItemValue, { color: "#EF4444" }]}>
                {formatCurrency(summary.totalExpense)}
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.quickActions}>
          <Button
            title="+ Add Transaction"
            onPress={() => router.push("/transactions/new")}
            variant="primary"
            style={styles.actionButton}
          />
          <Button
            title="📊 View All"
            onPress={() => router.push("/transactions")}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#F9FAFB" : "#111827" },
              ]}
            >
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => router.push("/transactions")}>
              <Text style={{ color: "#10B981", fontWeight: "600" }}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <Card>
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💰</Text>
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
                  Add your first transaction to start tracking your finances
                </Text>
              </View>
            </Card>
          ) : (
            recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                category={getCategory(transaction.categoryId)}
                onPress={() => router.push("/transactions")}
              />
            ))
          )}
        </View>

        <CategoryGrid
          categories={categories}
          maxItems={8}
          onSeeAll={() => router.push("/categories")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 28,
  },
  headerContainer: {
    paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  titleIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
    opacity: 0.8,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  streakBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: "#FCD34D",
    minWidth: 90,
  },
  streakEmoji: {
    fontSize: 32,
  },
  streakContent: {
    alignItems: "center",
  },
  streakCount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#DC2626",
    lineHeight: 28,
  },
  streakLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#92400E",
    textTransform: "uppercase",
  },
  balanceCard: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: "700",
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  balanceItem: {
    flex: 1,
    alignItems: "center",
  },
  balanceItemLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  balanceItemValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  balanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
});
