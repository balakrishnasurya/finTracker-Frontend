import { CategoryGrid } from "@/components/category-grid";
import { TransactionCard } from "@/components/transaction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFinance } from "@/context/finance-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSpendingAlert } from "@/hooks/use-spending-alert";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const { transactions, categories, streak, getFinanceSummary, refreshData } =
    useFinance();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const summary = getFinanceSummary();
  const [refreshing, setRefreshing] = useState(false);

  // Spending alert monitoring
  const { monthlyTotal, alertSettings, isAlertTriggered, reloadSettings } =
    useSpendingAlert();
  const [showAlertBanner, setShowAlertBanner] = useState(false);

  // Show alert banner when alert is triggered
  useEffect(() => {
    if (isAlertTriggered && alertSettings?.enabled) {
      setShowAlertBanner(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowAlertBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAlertTriggered, alertSettings]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      await reloadSettings();
    } finally {
      setRefreshing(false);
    }
  };

  // Get current month spending from actual transaction data
  const getCurrentMonthSpending = () => {
    if (!transactions || transactions.length === 0) {
      return 0;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthExpenses = transactions
      .filter((t) => {
        if (t.transactionDirection !== "DEBIT") return false;

        try {
          // Parse the transaction date
          const transactionDate = new Date(t.date);

          // Check if date is valid
          if (isNaN(transactionDate.getTime())) {
            console.warn(`Invalid date for transaction ${t.id}: ${t.date}`);
            return false;
          }

          return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        } catch (error) {
          console.error(`Error parsing date for transaction ${t.id}:`, error);
          return false;
        }
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return monthExpenses;
  };

  // Get last month spending
  const getLastMonthSpending = () => {
    if (!transactions || transactions.length === 0) {
      return 0;
    }

    const now = new Date();
    let lastMonth = now.getMonth() - 1;
    let lastMonthYear = now.getFullYear();

    if (lastMonth < 0) {
      lastMonth = 11;
      lastMonthYear -= 1;
    }

    const lastMonthExpenses = transactions
      .filter((t) => {
        try {
          if (t.transactionDirection !== "DEBIT") return false;
          const transactionDate = new Date(t.date);
          if (isNaN(transactionDate.getTime())) return false;

          return (
            transactionDate.getMonth() === lastMonth &&
            transactionDate.getFullYear() === lastMonthYear
          );
        } catch (error) {
          return false;
        }
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return lastMonthExpenses;
  };

  // Sort all transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const monthSpending = getCurrentMonthSpending();
  const lastMonthSpending = getLastMonthSpending();
  // Prediction: Last month + 5% variation (simulating a small increase)
  const predictedNextMonthSpending = lastMonthSpending * 1.05;

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
                  FinTracker
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

        {/* Alert Banner */}
        {showAlertBanner && alertSettings && (
          <Card
            style={[
              styles.alertBanner,
              {
                backgroundColor: isDark ? "#7C2D12" : "#FEF3C7",
                borderColor: "#F59E0B",
              },
            ]}
          >
            <View style={styles.alertBannerContent}>
              <Text style={styles.alertBannerIcon}>📧</Text>
              <View style={styles.alertBannerText}>
                <Text
                  style={[
                    styles.alertBannerTitle,
                    { color: isDark ? "#FCD34D" : "#92400E" },
                  ]}
                >
                  Spending Alert Sent!
                </Text>
                <Text
                  style={[
                    styles.alertBannerMessage,
                    { color: isDark ? "#FDE68A" : "#78350F" },
                  ]}
                >
                  Your monthly expenses reached ₹
                  {alertSettings.monthlyLimit.toLocaleString("en-IN")}. Email
                  sent to {alertSettings.email}
                </Text>
              </View>
            </View>
          </Card>
        )}

        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Spending This Month</Text>
          <Text
            style={[
              styles.balanceAmount,
              {
                color: "#EF4444",
              },
            ]}
          >
            {formatCurrency(monthSpending)}
          </Text>
        </Card>

        <Card style={styles.predictionCard}>
          <View style={styles.predictionRow}>
            <View style={styles.predictionItem}>
              <Text style={styles.predictionLabel}>Last Month</Text>
              <Text
                style={[
                  styles.predictionValue,
                  { color: isDark ? "#D1D5DB" : "#4B5563" },
                ]}
              >
                {formatCurrency(lastMonthSpending)}
              </Text>
            </View>
            <View
              style={[
                styles.predictionDivider,
                { backgroundColor: isDark ? "#374151" : "#E5E7EB" },
              ]}
            />
            <View style={styles.predictionItem}>
              <Text style={styles.predictionLabel}>Next Month (Est.)</Text>
              <Text
                style={[
                  styles.predictionValue,
                  { color: isDark ? "#D1D5DB" : "#4B5563" },
                ]}
              >
                {formatCurrency(predictedNextMonthSpending)}
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
              All Transactions
            </Text>
            {sortedTransactions.length > 0 && (
              <Text
                style={{ color: isDark ? "#9CA3AF" : "#6B7280", fontSize: 14 }}
              >
                {sortedTransactions.length} total
              </Text>
            )}
          </View>

          {sortedTransactions.length === 0 ? (
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
            sortedTransactions.map((transaction) => (
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
    justifyContent: "center",
    width: "100%",
  },
  balanceItem: {
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
  predictionCard: {
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  predictionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  predictionItem: {
    alignItems: "center",
    flex: 1,
  },
  predictionLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  predictionDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  },
  alertBanner: {
    marginBottom: 20,
    borderWidth: 2,
    paddingVertical: 12,
  },
  alertBannerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  alertBannerIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  alertBannerText: {
    flex: 1,
  },
  alertBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  alertBannerMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
});
