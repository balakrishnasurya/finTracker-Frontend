import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { groupService } from "@/services/api";
import { CreateGroupDto } from "@/types/api.types";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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

interface MemberInput {
  id: string;
  name: string;
  userId: number | null;
}

export default function CreateGroupScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<MemberInput[]>([
    { id: "1", name: "", userId: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAnimation] = useState(new Animated.Value(0));
  const [createdGroupId, setCreatedGroupId] = useState<number | null>(null);

  const handleAddMember = () => {
    setMembers([
      ...members,
      { id: Date.now().toString(), name: "", userId: null },
    ]);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const handleMemberNameChange = (id: string, value: string) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, name: value } : m)));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    const validMembers = members.filter((m) => m.name.trim());
    if (validMembers.length === 0) {
      Alert.alert("Error", "Please add at least one member");
      return;
    }

    setLoading(true);
    try {
      const data: CreateGroupDto = {
        name: name.trim(),
        description: description.trim() || "",
        members: validMembers.map((m) => ({
          name: m.name.trim(),
          userId: m.userId,
        })),
      };

      const result = await groupService.createGroup(data);
      setCreatedGroupId(result.groupId);

      // Show success modal with animation
      setShowSuccessModal(true);
      Animated.spring(successAnimation, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Auto close and navigate
      setTimeout(() => {
        setShowSuccessModal(false);
        successAnimation.setValue(0);
        router.replace(`/split/${result.groupId}`);
      }, 2000);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create group");
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
            Create Group
          </Text>
        </View>

        <Card style={styles.section}>
          <Input
            label="Group Name"
            placeholder="e.g., Goa Trip 2026"
            value={name}
            onChangeText={setName}
            autoCapitalize="sentences"
          />

          <Input
            label="Description"
            placeholder="e.g., Beach vacation expenses"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
            multiline
          />

          <Text
            style={[styles.label, { color: isDark ? "#E5E7EB" : "#374151" }]}
          >
            Members <Text style={{ color: "#EF4444" }}>*</Text>
          </Text>
          <Text
            style={[
              styles.helperText,
              { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            Add people who will split expenses in this group
          </Text>

          {members.map((member, index) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberInput}>
                <Input
                  placeholder={`Member ${index + 1} name`}
                  value={member.name}
                  onChangeText={(value) =>
                    handleMemberNameChange(member.id, value)
                  }
                  autoCapitalize="words"
                />
              </View>
              {members.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveMember(member.id)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <Button
            title="+ Add Member"
            onPress={handleAddMember}
            variant="secondary"
            size="small"
          />
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
          title="Create Group"
          onPress={handleSubmit}
          variant="primary"
          loading={loading}
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
              Group Created!
            </Text>
            <Text
              style={[
                styles.successMessage,
                { color: isDark ? "#9CA3AF" : "#6B7280" },
              ]}
            >
              Your group "{name}" has been created successfully
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
    paddingTop: Platform.OS === "ios" ? 60 : 40,
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
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  memberInput: {
    flex: 1,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EF444420",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 18,
    color: "#EF4444",
    fontWeight: "700",
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
