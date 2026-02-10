import { GroupCard } from "@/components/group-card";
import { Button } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { groupService } from "@/services/api";
import { GroupApiResponse } from "@/types/api.types";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SplitScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [groups, setGroups] = useState<GroupApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [fetchGroups]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGroups();
  };

  const handleGroupPress = (groupId: number) => {
    router.push(`/split/${groupId}`);
  };

  const handleCreateGroup = () => {
    router.push("/split/create");
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
            Loading groups...
          </Text>
        </View>
      </View>
    );
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
        <View style={styles.headerSection}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.titleIcon}>💸</Text>
                <Text
                  style={[
                    styles.title,
                    { color: isDark ? "#F9FAFB" : "#111827" },
                  ]}
                >
                  Split Expenses
                </Text>
              </View>
              <Text
                style={[
                  styles.subtitle,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                Manage group expenses and settlements
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Button
            title="Create New Group"
            onPress={handleCreateGroup}
            variant="primary"
          />
        </View>

        {groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text
              style={[
                styles.emptyTitle,
                { color: isDark ? "#F9FAFB" : "#111827" },
              ]}
            >
              No Groups Yet
            </Text>
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? "#9CA3AF" : "#6B7280" },
              ]}
            >
              Create a group to start splitting expenses
            </Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#F9FAFB" : "#111827" },
              ]}
            >
              Your Groups
            </Text>
            {groups.map((group) => (
              <View key={group.groupId}>
                <GroupCard
                  group={group}
                  onPress={() => handleGroupPress(group.groupId)}
                />
              </View>
            ))}
          </View>
        )}
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
    marginBottom: 28,
  },
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flex: 1,
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
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
