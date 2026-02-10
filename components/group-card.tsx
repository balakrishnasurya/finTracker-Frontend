import { Card } from "@/components/ui/card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GroupApiResponse } from "@/types/api.types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GroupCardProps {
  group: GroupApiResponse;
  onPress: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const formattedDate = new Date(group.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: isDark ? "#374151" : "#F3F4F6" },
              ]}
            >
              <Text style={styles.icon}>👥</Text>
            </View>
            <View style={styles.info}>
              <Text
                style={[styles.name, { color: isDark ? "#F9FAFB" : "#111827" }]}
              >
                {group.name}
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                {group.description}
              </Text>
              <View style={styles.metaRow}>
                <Text
                  style={[
                    styles.metaText,
                    { color: isDark ? "#9CA3AF" : "#6B7280" },
                  ]}
                >
                  {group.memberCount || group.members?.length || 0} members
                </Text>
                <Text
                  style={[
                    styles.metaText,
                    { color: isDark ? "#9CA3AF" : "#6B7280" },
                  ]}
                >
                  {" • "}
                </Text>
                <Text
                  style={[
                    styles.metaText,
                    { color: isDark ? "#9CA3AF" : "#6B7280" },
                  ]}
                >
                  {formattedDate}
                </Text>
              </View>
            </View>
          </View>
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
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
  },
});
