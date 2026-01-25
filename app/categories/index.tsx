import { CategoryCard } from "@/components/category-card";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/finance-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

export default function CategoriesScreen() {
  const { categories, transactions, deleteCategory } = useFinance();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getCategoryTransactionCount = (categoryId: string) => {
    return transactions.filter((t) => t.categoryId === categoryId).length;
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const count = getCategoryTransactionCount(id);
    const message =
      count > 0
        ? `Are you sure you want to delete "${name}"? This will also delete ${count} transaction(s).`
        : `Are you sure you want to delete "${name}"?`;

    Alert.alert("Delete Category", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteCategory(id),
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#F3F4F6" },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#F9FAFB" : "#111827" }]}>
          Categories
        </Text>
        <Text
          style={[styles.subtitle, { color: isDark ? "#9CA3AF" : "#6B7280" }]}
        >
          Manage your income and expense categories
        </Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            transactionCount={getCategoryTransactionCount(item.id)}
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
              No categories yet
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { color: isDark ? "#6B7280" : "#9CA3AF" },
              ]}
            >
              Create your first category to start tracking
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button
          title="+ Create Category"
          onPress={() => router.push("/categories/new")}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
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
