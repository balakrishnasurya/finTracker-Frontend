import { Card } from "@/components/ui/card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Category } from "@/types";
import { router } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface CategoryGridProps {
  categories: Category[];
  maxItems?: number;
  onSeeAll?: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  maxItems = 8,
  onSeeAll,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const displayCategories = categories.slice(0, maxItems);
  const hasMore = categories.length > maxItems;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#F9FAFB" : "#111827" }]}>
          Categories
        </Text>
        {hasMore && onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.grid}>
        {displayCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => router.push("/transactions/new")}
            activeOpacity={0.7}
          >
            <Card style={styles.categoryCard}>
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
              <Text
                style={[
                  styles.categoryName,
                  { color: isDark ? "#E5E7EB" : "#374151" },
                ]}
                numberOfLines={2}
              >
                {category.name}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  seeAllText: {
    color: "#10B981",
    fontWeight: "600",
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  categoryItem: {
    width: "25%",
    padding: 6,
  },
  categoryCard: {
    padding: 12,
    alignItems: "center",
    minHeight: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
});
