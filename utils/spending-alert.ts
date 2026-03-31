import AsyncStorage from "@react-native-async-storage/async-storage";

const ALERT_SETTINGS_KEY = "@fintrackor_alert_settings";
const ALERT_SENT_KEY = "@fintrackor_alert_sent_month";

export interface AlertSettings {
  monthlyLimit: number;
  email: string;
  enabled: boolean;
}

/**
 * Save alert settings to AsyncStorage
 */
export const saveAlertSettings = async (
  settings: AlertSettings,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(ALERT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving alert settings:", error);
    throw error;
  }
};

/**
 * Load alert settings from AsyncStorage
 */
export const loadAlertSettings = async (): Promise<AlertSettings | null> => {
  try {
    const data = await AsyncStorage.getItem(ALERT_SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading alert settings:", error);
    return null;
  }
};

/**
 * Get current month key (e.g., "2026-02")
 */
export const getCurrentMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

/**
 * Check if alert has been sent for current month
 */
export const hasAlertBeenSentThisMonth = async (): Promise<boolean> => {
  try {
    const sentMonth = await AsyncStorage.getItem(ALERT_SENT_KEY);
    const currentMonth = getCurrentMonthKey();
    console.log(`📅 [Storage] Checking if alert was sent:`);
    console.log(`   Current month: ${currentMonth}`);
    console.log(`   Sent month: ${sentMonth || "none"}`);
    console.log(`   Match: ${sentMonth === currentMonth}`);
    return sentMonth === currentMonth;
  } catch (error) {
    console.error("Error checking alert sent status:", error);
    return false;
  }
};

/**
 * Mark alert as sent for current month
 */
export const markAlertAsSent = async (): Promise<void> => {
  try {
    const currentMonth = getCurrentMonthKey();
    console.log(`✅ [Storage] Marking alert as sent for ${currentMonth}`);
    await AsyncStorage.setItem(ALERT_SENT_KEY, currentMonth);
  } catch (error) {
    console.error("Error marking alert as sent:", error);
    throw error;
  }
};

/**
 * Send alert email via backend API
 */
export const sendAlertEmail = async (
  amount: number,
  email: string,
  currentTotalAmount: number,
): Promise<boolean> => {
  console.log("📤 [API] Sending alert email...");
  console.log(`   Amount: ₹${amount}`);
  console.log(`   Email: ${email}`);
  console.log(`   Current Total Amount: ₹${currentTotalAmount}`);

  try {
    const url = "https://seal-app-wqxuo.ondigitalocean.app/send-alert";
    const body = JSON.stringify({ amount, email, currentTotalAmount });

    console.log(`   URL: ${url}`);
    console.log(`   Body: ${body}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body,
    });

    console.log(`   Response status: ${response.status}`);
    console.log(`   Response OK: ${response.ok}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`   Error response: ${errorText}`);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`,
      );
    }

    const text = await response.text();
    console.log("   ✅ Response:", text);
    console.log("📧 Alert email sent successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error sending alert email:", error);
    throw error;
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
