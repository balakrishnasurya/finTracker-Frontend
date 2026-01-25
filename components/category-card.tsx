import { Card } from "@/components/ui/card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Category } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  transactionCount?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  transactionCount = 0,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.content}>
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
          <View style={styles.info}>
            <Text
              style={[styles.name, { color: isDark ? "#F9FAFB" : "#111827" }]}
            >
              {category.name}
            </Text>
            <Text
              style={[styles.type, { color: isDark ? "#9CA3AF" : "#6B7280" }]}
            >
              {category.type === "income" ? "💰 Income" : "💸 Expense"}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text
              style={[styles.count, { color: isDark ? "#E5E7EB" : "#374151" }]}
            >
              {transactionCount}
            </Text>
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
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  type: {
    fontSize: 13,
  },
  badge: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  count: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
