import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { groupService } from "@/services/api";
import { CreateGroupTransactionDto, GroupApiResponse } from "@/types/api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddTransactionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const params = useLocalSearchParams();
  const groupId = Number(params.id);

  const [group, setGroup] = useState<GroupApiResponse | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidByMemberId, setPaidByMemberId] = useState<number | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAnimation] = useState(new Animated.Value(0));

  const fetchGroup = useCallback(async () => {
    try {
      const data = await groupService.getGroupById(groupId);
      setGroup(data);
      // Pre-select all members for splitting
      if (data.members) {
        setSelectedMemberIds(data.members.map((m) => m.memberId));
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch group data", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const toggleMemberSelection = (memberId: number) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!paidByMemberId) {
      Alert.alert("Error", "Please select who paid");
      return;
    }

    if (selectedMemberIds.length === 0) {
      Alert.alert("Error", "Please select at least one member to split with");
      return;
    }

    setSubmitting(true);
    try {
      const data: CreateGroupTransactionDto = {
        description: description.trim(),
        amount: parseFloat(amount),
        paidByMemberId,
        includedMemberIds: selectedMemberIds,
      };

      await groupService.addGroupTransaction(groupId, data);

      // Show success modal with animation
      setShowSuccessModal(true);
      Animated.spring(successAnimation, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Auto close and navigate back
      setTimeout(() => {
        setShowSuccessModal(false);
        successAnimation.setValue(0);
        router.back();
      }, 2000);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add transaction");
    } finally {
      setSubmitting(false);
    }
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
            Loading...
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? "#F9FAFB" : "#111827" }]}
          >
            Add Expense
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#9CA3AF" : "#6B7280" }]}
          >
            {group.name}
          </Text>
        </View>

        <Card style={styles.section}>
          <Input
            label="Description"
            placeholder="e.g., Dinner, Hotel, Cab"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
          />

          <Input
            label="Amount"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Paid By <Text style={{ color: "#EF4444" }}>*</Text>
          </Text>
          <View style={styles.memberGrid}>
            {group.members?.map((member) => (
              <TouchableOpacity
                key={member.memberId}
                style={[
                  styles.memberButton,
                  paidByMemberId === member.memberId &&
                    styles.memberButtonActive,
                  { backgroundColor: isDark ? "#374151" : "#F9FAFB" },
                ]}
                onPress={() => setPaidByMemberId(member.memberId)}
              >
                <View
                  style={[
                    styles.memberAvatar,
                    { backgroundColor: isDark ? "#1F2937" : "#E5E7EB" },
                  ]}
                >
                  <Text style={[styles.memberInitial, { color: "#10B981" }]}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.memberName,
                    { color: isDark ? "#E5E7EB" : "#374151" },
                    paidByMemberId === member.memberId &&
                      styles.memberNameActive,
                  ]}
                >
                  {member.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Split Between <Text style={{ color: "#EF4444" }}>*</Text>
          </Text>
          <Text
            style={[
              styles.helperText,
              { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            Select who should split this expense
          </Text>
          <View style={styles.memberGrid}>
            {group.members?.map((member) => (
              <TouchableOpacity
                key={member.memberId}
                style={[
                  styles.memberButton,
                  selectedMemberIds.includes(member.memberId) &&
                    styles.memberButtonActive,
                  { backgroundColor: isDark ? "#374151" : "#F9FAFB" },
                ]}
                onPress={() => toggleMemberSelection(member.memberId)}
              >
                <View
                  style={[
                    styles.memberAvatar,
                    { backgroundColor: isDark ? "#1F2937" : "#E5E7EB" },
                  ]}
                >
                  <Text style={[styles.memberInitial, { color: "#10B981" }]}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.memberName,
                    { color: isDark ? "#E5E7EB" : "#374151" },
                    selectedMemberIds.includes(member.memberId) &&
                      styles.memberNameActive,
                  ]}
                >
                  {member.name}
                </Text>
                {selectedMemberIds.includes(member.memberId) && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
          title="Add Expense"
          onPress={handleSubmit}
          variant="primary"
          loading={submitting}
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
              Expense Added!
            </Text>
            <Text
              style={[
                styles.successMessage,
                { color: isDark ? "#9CA3AF" : "#6B7280" },
              ]}
            >
              Your expense of ₹{amount} has been added to the group
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 12,
  },
  memberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  memberButton: {
    width: "30%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 80,
    position: "relative",
  },
  memberButtonActive: {
    backgroundColor: "#10B98120",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  memberInitial: {
    fontSize: 16,
    fontWeight: "700",
  },
  memberName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  memberNameActive: {
    color: "#10B981",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
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
