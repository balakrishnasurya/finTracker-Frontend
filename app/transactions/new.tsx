import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/context/finance-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { TransactionDirection } from "@/types";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewTransactionScreen() {
  const { addTransaction, categories } = useFinance();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [transactionDirection, setTransactionDirection] =
    useState<TransactionDirection>("DEBIT");
  const [paymentType, setPaymentType] = useState("Upi");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAnimation] = useState(new Animated.Value(0));

  const transactionLabel =
    transactionDirection === "CREDIT" ? "income" : "expense";

  const availableCategories = categories;

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    setLoading(true);
    try {
      const selectedCategory = availableCategories.find(
        (c) => c.id === selectedCategoryId,
      );
      await addTransaction({
        amount: parseFloat(amount),
        description:
          description.trim() || selectedCategory?.name || "Transaction",
        categoryId: selectedCategoryId,
        date,
        paymentType,
        transactionDirection,
      });

      // Show success modal with animation
      setShowSuccessModal(true);
      Animated.spring(successAnimation, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Auto close after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        successAnimation.setValue(0);
        router.back();
      }, 2000);
    } catch (error) {
      Alert.alert("Error", "Failed to add transaction");
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
            New Transaction
          </Text>
        </View>

        <Card style={styles.section}>
          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Transaction Type
          </Text>
          <View style={styles.typeContainer}>
            {[
              { label: "Debit", value: "DEBIT", icon: "🔻" },
              { label: "Credit", value: "CREDIT", icon: "🔺" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.typeButton,
                  transactionDirection === option.value &&
                    styles.typeButtonActive,
                  { backgroundColor: isDark ? "#374151" : "#F9FAFB" },
                ]}
                onPress={() =>
                  setTransactionDirection(option.value as TransactionDirection)
                }
              >
                <Text
                  style={[
                    styles.typeIcon,
                    transactionDirection === option.value &&
                      styles.typeIconActive,
                  ]}
                >
                  {option.icon}
                </Text>
                <Text
                  style={[
                    styles.typeText,
                    { color: isDark ? "#E5E7EB" : "#374151" },
                    transactionDirection === option.value &&
                      styles.typeTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Payment Type
          </Text>
          <View style={styles.paymentTypeContainer}>
            {["Cash", "Upi", "Card", "Others"].map((payment) => (
              <TouchableOpacity
                key={payment}
                style={[
                  styles.paymentTypeButton,
                  paymentType === payment && styles.paymentTypeButtonActive,
                  { backgroundColor: isDark ? "#374151" : "#F9FAFB" },
                ]}
                onPress={() => setPaymentType(payment)}
              >
                <Text
                  style={[
                    styles.paymentTypeText,
                    { color: isDark ? "#E5E7EB" : "#374151" },
                    paymentType === payment && styles.paymentTypeTextActive,
                  ]}
                >
                  {payment === "Cash" && "💵"}
                  {payment === "Upi" && "📱"}
                  {payment === "Card" && "💳"}
                  {payment === "Others" && "🔄"}
                </Text>
                <Text
                  style={[
                    styles.paymentTypeLabel,
                    { color: isDark ? "#E5E7EB" : "#374151" },
                    paymentType === payment && styles.paymentTypeTextActive,
                  ]}
                >
                  {payment}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Amount"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Input
            label="Description (Optional)"
            placeholder="e.g., Coffee, Salary"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
          />

          <Input
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />

          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Category <Text style={{ color: "#EF4444" }}>*</Text>
          </Text>
          {availableCategories.length === 0 ? (
            <View style={styles.noCategoriesContainer}>
              <Text
                style={[
                  styles.noCategoriesText,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                No categories available
              </Text>
              <Button
                title="Create Category"
                onPress={() => router.push("/categories/new")}
                variant="secondary"
                size="small"
              />
            </View>
          ) : (
            <ScrollView
              style={styles.categoryScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <View style={styles.categoryGrid}>
                {availableCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategoryId === category.id &&
                        styles.categoryButtonActive,
                      { backgroundColor: isDark ? "#374151" : "#F9FAFB" },
                    ]}
                    onPress={() => setSelectedCategoryId(category.id)}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: category.color + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryEmoji,
                          { color: category.color },
                        ]}
                      >
                        {category.icon}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.categoryName,
                        { color: isDark ? "#E5E7EB" : "#374151" },
                      ]}
                      numberOfLines={1}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="secondary"
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="Add Transaction"
          onPress={handleSubmit}
          variant="primary"
          loading={loading}
          disabled={!selectedCategoryId || availableCategories.length === 0}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

      {/* Success Modal */}
      <Modal
        transparent
        visible={showSuccessModal}
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.successModal,
              {
                backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                transform: [
                  {
                    scale: successAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                  },
                ],
                opacity: successAnimation,
              },
            ]}
          >
            <View style={styles.successIconContainer}>
              <View style={styles.successIconCircle}>
                <Text style={styles.successIcon}>✓</Text>
              </View>
            </View>
            <Text
              style={[
                styles.successTitle,
                { color: isDark ? "#F9FAFB" : "#111827" },
              ]}
            >
              Transaction Added!
            </Text>
            <Text
              style={[
                styles.successMessage,
                { color: isDark ? "#9CA3AF" : "#6B7280" },
              ]}
            >
              Your {transactionLabel} of ₹{amount} has been recorded
              successfully
            </Text>
          </Animated.View>
        </View>
      </Modal>
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
  paymentTypeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  paymentTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
  },
  paymentTypeButtonActive: {
    backgroundColor: "#10B98120",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  paymentTypeText: {
    fontSize: 24,
    marginBottom: 4,
  },
  paymentTypeLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  paymentTypeTextActive: {
    color: "#10B981",
  },
  categoryScrollView: {
    maxHeight: 300,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 12,
  },
  categoryButton: {
    width: "23%",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 90,
  },
  categoryButtonActive: {
    backgroundColor: "#10B98120",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 13,
  },
  noCategoriesContainer: {
    alignItems: "center",
    padding: 20,
  },
  noCategoriesText: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successModal: {
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    fontSize: 48,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
