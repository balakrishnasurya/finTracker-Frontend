import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSpendingAlert } from "@/hooks/use-spending-alert";
import { transactionService } from "@/services/api/transaction.service";
import {
  AlertSettings,
  isValidEmail,
  loadAlertSettings,
  saveAlertSettings,
} from "@/utils/spending-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isAlertTriggered, resetAlertFlag } = useSpendingAlert();

  // Spending Alert state
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [isAlertSaving, setIsAlertSaving] = useState(false);
  const [alertErrors, setAlertErrors] = useState({
    amount: "",
    email: "",
  });
  // Data Import state
  const [isImporting, setIsImporting] = useState(false);

  // Load alert settings on mount
  useEffect(() => {
    loadSavedAlertSettings();
  }, []);

  const loadSavedAlertSettings = async () => {
    try {
      const settings = await loadAlertSettings();
      if (settings) {
        setAlertEnabled(settings.enabled);
        setMonthlyLimit(settings.monthlyLimit.toString());
        setAlertEmail(settings.email);
      }
    } catch (error) {
      console.error("Failed to load alert settings:", error);
    }
  };

  const validateAlertForm = (): boolean => {
    const errors = { amount: "", email: "" };
    let isValid = true;

    // Validate amount
    const amount = parseFloat(monthlyLimit);
    if (!monthlyLimit || isNaN(amount) || amount <= 0) {
      errors.amount = "Amount must be greater than 0";
      isValid = false;
    }

    // Validate email
    if (!alertEmail.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(alertEmail.trim())) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    setAlertErrors(errors);
    return isValid;
  };

  const handleSaveAlert = async () => {
    if (!validateAlertForm()) {
      return;
    }

    setIsAlertSaving(true);
    try {
      const settings: AlertSettings = {
        monthlyLimit: parseFloat(monthlyLimit),
        email: alertEmail.trim(),
        enabled: alertEnabled,
      };

      await saveAlertSettings(settings);
      Alert.alert(
        "Success",
        "Spending alert settings saved successfully! 📧\n\nYou'll receive an email when your monthly expenses reach the limit.",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save alert settings. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsAlertSaving(false);
    }
  };

  const isAlertFormValid =
    monthlyLimit.trim() !== "" &&
    parseFloat(monthlyLimit) > 0 &&
    alertEmail.trim() !== "" &&
    isValidEmail(alertEmail.trim());

  const handleResetAlert = async () => {
    try {
      // Clear the month-based flag in AsyncStorage
      await AsyncStorage.removeItem("@fintrackor_alert_sent_month");
      // Reset the session flag
      await resetAlertFlag();
      Alert.alert(
        "Reset Complete",
        "Alert trigger has been reset. You can now send the alert again.",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to reset alert. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handleImportCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "text/csv",
          "application/vnd.ms-excel",
          "text/comma-separated-values",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setIsImporting(true);
      const output = await transactionService.importTransactionsCSV(
        result.assets[0],
      );

      Alert.alert(
        "Success",
        (output as any)?.message ||
          "Transactions imported successfully! Your dashboard will update shortly.",
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Failed to import CSV. Please ensure the file format is correct.",
      );
    } finally {
      setIsImporting(false);
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
        <View style={styles.headerSection}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.titleIcon}>⚙️</Text>
                <Text
                  style={[
                    styles.title,
                    { color: isDark ? "#F9FAFB" : "#111827" },
                  ]}
                >
                  Settings
                </Text>
              </View>
              <Text
                style={[
                  styles.subtitle,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                Manage your monthly spending alerts
              </Text>
            </View>
          </View>
        </View>

        {/* Spending Alert */}
        <Card style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertEmoji}>📧</Text>
            <View style={styles.alertHeaderText}>
              <Text
                style={[
                  styles.alertTitle,
                  { color: isDark ? "#F9FAFB" : "#111827" },
                ]}
              >
                Monthly Spending Alert
              </Text>
              <Text
                style={[
                  styles.alertDescription,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                Get notified when you reach your monthly limit
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: isDark ? "#374151" : "#E5E7EB" },
            ]}
          />

          <View style={styles.alertToggleRow}>
            <View style={styles.settingLeft}>
              <Text
                style={[
                  styles.toggleLabel,
                  { color: isDark ? "#F9FAFB" : "#111827" },
                ]}
              >
                Enable Alert
              </Text>
              <Text
                style={[
                  styles.toggleSubtext,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                Receive email notifications
              </Text>
            </View>
            <Switch
              value={alertEnabled}
              onValueChange={setAlertEnabled}
              trackColor={{ false: "#9CA3AF", true: "#10B981" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {alertEnabled && (
            <View style={styles.alertFormContainer}>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: isDark ? "#374151" : "#E5E7EB" },
                ]}
              />
              <View style={styles.alertForm}>
                <Input
                  label="Monthly Limit (₹)"
                  placeholder="e.g., 50000"
                  value={monthlyLimit}
                  onChangeText={(text) => {
                    setMonthlyLimit(text);
                    if (alertErrors.amount) {
                      setAlertErrors({ ...alertErrors, amount: "" });
                    }
                  }}
                  keyboardType="decimal-pad"
                  error={alertErrors.amount}
                />
                <Input
                  label="Alert Email"
                  placeholder="your.email@example.com"
                  value={alertEmail}
                  onChangeText={(text) => {
                    setAlertEmail(text);
                    if (alertErrors.email) {
                      setAlertErrors({ ...alertErrors, email: "" });
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={alertErrors.email}
                />
                <View
                  style={[
                    styles.infoBox,
                    { backgroundColor: isDark ? "#1F2937" : "#F0FDF4" },
                  ]}
                >
                  <Text style={styles.infoIcon}>💡</Text>
                  <Text
                    style={[
                      styles.infoText,
                      { color: isDark ? "#9CA3AF" : "#166534" },
                    ]}
                  >
                    You'll receive an email when your monthly expenses reach
                    this limit. Alert is sent once per month and resets
                    automatically.
                  </Text>
                </View>
                <Button
                  title="Save Alert Settings"
                  onPress={handleSaveAlert}
                  variant="primary"
                  disabled={!isAlertFormValid}
                  loading={isAlertSaving}
                  size="large"
                />
              </View>
            </View>
          )}
        </Card>

        {isAlertTriggered && (
          <Button
            title="Reset Alert (For Testing)"
            onPress={handleResetAlert}
            variant="secondary"
            size="small"
            style={[
              styles.resetButton,
              { backgroundColor: isDark ? "#DC2626" : "#EF4444" },
            ]}
          />
        )}

        {/* Data Management Section */}
        <Card style={[styles.alertCard, { marginTop: 24 }]}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertEmoji}>📂</Text>
            <View style={styles.alertHeaderText}>
              <Text
                style={[
                  styles.alertTitle,
                  { color: isDark ? "#F9FAFB" : "#111827" },
                ]}
              >
                Data Management
              </Text>
              <Text
                style={[
                  styles.alertDescription,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                Import transactions from CSV files
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: isDark ? "#374151" : "#E5E7EB" },
            ]}
          />

          <Button
            title="Import Transactions via CSV"
            onPress={handleImportCSV}
            variant="secondary"
            loading={isImporting}
            size="large"
          />
        </Card>

        <View style={{ height: 40 }} />
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
  headerSection: {
    marginBottom: 32,
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
  alertCard: {
    paddingVertical: 20,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  alertEmoji: {
    fontSize: 48,
  },
  alertHeaderText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  alertToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  settingLeft: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  toggleSubtext: {
    fontSize: 13,
  },
  alertFormContainer: {
    marginTop: 4,
  },
  alertForm: {
    paddingTop: 8,
  },
  infoBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: -8,
    gap: 10,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 20,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
});
