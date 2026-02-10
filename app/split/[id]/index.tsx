import { BalanceCard } from "@/components/balance-card";
import { GroupTransactionCard } from "@/components/group-transaction-card";
import { SettlementCard } from "@/components/settlement-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { groupService } from "@/services/api";
import {
    GroupApiResponse,
    GroupBalanceApiResponse,
    GroupTransactionApiResponse,
    SettlementApiResponse,
} from "@/types/api.types";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function GroupDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const params = useLocalSearchParams();
  const groupId = Number(params.id);

  const [group, setGroup] = useState<GroupApiResponse | null>(null);
  const [balances, setBalances] = useState<GroupBalanceApiResponse[]>([]);
  const [settlements, setSettlements] = useState<SettlementApiResponse[]>([]);
  const [transactions, setTransactions] = useState<
    GroupTransactionApiResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroupData = useCallback(async () => {
    try {
      const [groupData, balancesData, settlementsData, transactionsData] =
        await Promise.all([
          groupService.getGroupById(groupId),
          groupService.getGroupBalances(groupId),
          groupService.getGroupSettlement(groupId),
          groupService.getGroupTransactions(groupId),
        ]);

      setGroup(groupData);
      setBalances(
        balancesData.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)),
      );
      setSettlements(settlementsData);
      setTransactions(transactionsData);
    } catch (error: any) {
      if (error.statusCode === 404) {
        Alert.alert("Error", "Group not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", error.message || "Failed to fetch group data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      fetchGroupData();
    }, [fetchGroupData]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGroupData();
  };

  const handleAddTransaction = () => {
    router.push(`/split/${groupId}/add-transaction`);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#111827" : "#F3F4F6" },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text
            style={[
              styles.loadingText,
              { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            Loading group details...
          </Text>
        </View>
      </View>
    );
  }

  if (!group) {
    return null;
  }

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
            onRefresh={handleRefresh}
            tintColor={isDark ? "#059669" : "#10B981"}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: isDark ? "#F9FAFB" : "#111827" }]}
            >
              {group.name}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? "#9CA3AF" : "#6B7280" },
              ]}
            >
              {group.description}
            </Text>
          </View>
        </View>

        {/* Members */}
        <Card style={styles.membersCard}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#F9FAFB" : "#111827" },
            ]}
          >
            Members ({group.members?.length || 0})
          </Text>
          <View style={styles.membersRow}>
            {group.members?.map((member) => (
              <View key={member.memberId} style={styles.memberItem}>
                <View
                  style={[
                    styles.memberAvatar,
                    { backgroundColor: isDark ? "#374151" : "#F3F4F6" },
                  ]}
                >
                  <Text style={[styles.memberInitial, { color: "#10B981" }]}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.memberName,
                    { color: isDark ? "#F9FAFB" : "#111827" },
                  ]}
                >
                  {member.name}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Add Transaction Button */}
        <View style={styles.actionSection}>
          <Button
            title="Add Expense"
            onPress={handleAddTransaction}
            variant="primary"
          />
        </View>

        {/* Balances */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#F9FAFB" : "#111827" },
            ]}
          >
            Balances
          </Text>
          {balances.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text
                style={[
                  styles.emptyText,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                No balances yet
              </Text>
            </Card>
          ) : (
            balances.map((balance) => (
              <BalanceCard key={balance.memberId} balance={balance} />
            ))
          )}
        </View>

        {/* Settlement */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#F9FAFB" : "#111827" },
            ]}
          >
            Settlement Summary
          </Text>
          {settlements.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.settledIcon}>🎉</Text>
              <Text
                style={[
                  styles.emptyText,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                All settled!
              </Text>
            </Card>
          ) : (
            settlements.map((settlement, index) => (
              <SettlementCard
                key={`${settlement.fromMember}-${settlement.toMember}-${index}`}
                settlement={settlement}
              />
            ))
          )}
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#F9FAFB" : "#111827" },
            ]}
          >
            Transactions
          </Text>
          {transactions.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text
                style={[
                  styles.emptyText,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                No transactions yet
              </Text>
            </Card>
          ) : (
            transactions.map((transaction) => (
              <GroupTransactionCard
                key={transaction.transactionId}
                transaction={transaction}
              />
            ))
          )}
        </View>
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
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  headerSection: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "600",
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  membersCard: {
    marginBottom: 24,
  },
  membersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  memberItem: {
    alignItems: "center",
    width: 60,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  memberInitial: {
    fontSize: 18,
    fontWeight: "700",
  },
  memberName: {
    fontSize: 11,
    textAlign: "center",
  },
  actionSection: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
  },
  settledIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
});
