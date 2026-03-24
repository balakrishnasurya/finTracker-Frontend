import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/context/finance-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const CATEGORY_ICONS = [
  "🏠",
  "🍕",
  "🚗",
  "💼",
  "🎮",
  "🏥",
  "📚",
  "✈️",
  "🛍️",
  "💰",
  "📱",
  "⚡",
];
const CATEGORY_COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

export default function NewCategoryScreen() {
  const { addCategory } = useFinance();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { type } = useLocalSearchParams<{ type?: string }>();
  const initialType =
    type === "income" || type === "expense" ? type : "expense";

  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState<"income" | "expense">(
    initialType,
  );
  const [selectedIcon, setSelectedIcon] = useState(CATEGORY_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    setLoading(true);
    try {
      await addCategory({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type: categoryType,
      });
      Alert.alert("Success", "Category created successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#F3F4F6" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? "#F9FAFB" : "#111827" }]}
          >
            New Category
          </Text>
        </View>

        <Card style={styles.section}>
          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Category Type
          </Text>
          <View style={styles.typeContainer}>
            {[
              { label: "Expense", value: "expense", icon: "🔻" },
              { label: "Income", value: "income", icon: "🔺" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.typeButton,
                  categoryType === option.value && styles.typeButtonActive,
                  { backgroundColor: isDark ? "#374151" : "#F9FAFB" },
                ]}
                onPress={() =>
                  setCategoryType(option.value as "income" | "expense")
                }
              >
                <Text
                  style={[
                    styles.typeIcon,
                    categoryType === option.value && styles.typeIconActive,
                  ]}
                >
                  {option.icon}
                </Text>
                <Text
                  style={[
                    styles.typeText,
                    { color: isDark ? "#E5E7EB" : "#374151" },
                    categoryType === option.value && styles.typeTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Category Name"
            placeholder="e.g., Groceries, Shopping"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Icon
          </Text>
          <View style={styles.iconGrid}>
            {CATEGORY_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconButton,
                  selectedIcon === icon && styles.iconButtonActive,
                  { backgroundColor: isDark ? "#374151" : "#F9FAFB" },
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Text style={styles.iconEmoji}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Color
          </Text>
          <View style={styles.colorGrid}>
            {CATEGORY_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorButtonActive,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </Card>

        <View style={styles.preview}>
          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Preview
          </Text>
          <Card>
            <View style={styles.previewContent}>
              <View
                style={[
                  styles.previewIcon,
                  { backgroundColor: selectedColor + "20" },
                ]}
              >
                <Text style={[styles.previewEmoji, { color: selectedColor }]}>
                  {selectedIcon}
                </Text>
              </View>
              <Text
                style={[
                  styles.previewText,
                  { color: isDark ? "#F9FAFB" : "#111827" },
                ]}
              >
                {name || "Category Name"}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="secondary"
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="Create"
          onPress={handleSubmit}
          variant="primary"
          loading={loading}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
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
  header: {
    paddingTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  typeButtonActive: {
    borderColor: "#10B981",
    backgroundColor: "#10B98110",
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  typeIconActive: {
    transform: [{ scale: 1.1 }],
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  typeTextActive: {
    color: "#10B981",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonActive: {
    backgroundColor: "#10B98120",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  iconEmoji: {
    fontSize: 28,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  colorButtonActive: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
    transform: [{ scale: 1.1 }],
  },
  preview: {
    marginBottom: 20,
  },
  previewContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  previewEmoji: {
    fontSize: 24,
  },
  previewText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 32,
  },
});
