import { useFinance } from "@/context/finance-context";
import { Transaction } from "@/types";
import {
  AlertSettings,
  hasAlertBeenSentThisMonth,
  loadAlertSettings,
  markAlertAsSent,
  sendAlertEmail,
} from "@/utils/spending-alert";
import { useEffect, useState } from "react";

/**
 * Calculate total expenses for the current month
 */
const calculateMonthlyExpenses = (transactions: Transaction[]): number => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  console.log(
    `💰 [Alert Hook] Calculating monthly expenses for ${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`,
  );
  console.log(`   Total transactions: ${transactions.length}`);

  const filtered = transactions.filter((t) => {
    try {
      const transactionDate = new Date(t.date);
      if (isNaN(transactionDate.getTime())) return false;

      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    } catch (error) {
      return false;
    }
  });

  console.log(`   Transactions this month: ${filtered.length}`);

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  console.log(`   Monthly total: ₹${total}`);

  return total;
};

/**
 * Hook to monitor spending and trigger alerts
 */
export const useSpendingAlert = () => {
  const { transactions } = useFinance();
  const [alertSettings, setAlertSettings] = useState<AlertSettings | null>(
    null,
  );
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [isAlertTriggered, setIsAlertTriggered] = useState<boolean>(false);

  // Load alert settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Calculate monthly total when transactions change
  useEffect(() => {
    const total = calculateMonthlyExpenses(transactions);
    setMonthlyTotal(total);
  }, [transactions]);

  // Check and trigger alert when monthly total or settings change
  useEffect(() => {
    if (monthlyTotal > 0 || alertSettings) {
      checkAndTriggerAlert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyTotal, alertSettings, isAlertTriggered]);

  const loadSettings = async () => {
    const settings = await loadAlertSettings();
    console.log("🔧 [Alert Hook] Settings loaded:", settings);
    setAlertSettings(settings);
  };

  const checkAndTriggerAlert = async () => {
    console.log("🔍 [Alert Hook] Checking conditions...");
    console.log("  - Alert Settings:", alertSettings);
    console.log("  - Monthly Total:", monthlyTotal);
    console.log("  - Already Triggered:", isAlertTriggered);

    // Guard clauses
    if (!alertSettings) {
      console.log("  ❌ No alert settings found");
      return;
    }

    if (!alertSettings.enabled) {
      console.log("  ❌ Alert is disabled");
      return;
    }

    console.log(`  ✓ Alert enabled with limit: ₹${alertSettings.monthlyLimit}`);

    if (monthlyTotal < alertSettings.monthlyLimit) {
      console.log(
        `  ❌ Monthly total (₹${monthlyTotal}) is below limit (₹${alertSettings.monthlyLimit})`,
      );
      return;
    }

    console.log(
      `  ✓ Monthly total (₹${monthlyTotal}) exceeds or equals limit (₹${alertSettings.monthlyLimit})`,
    );

    if (isAlertTriggered) {
      console.log("  ❌ Alert already triggered in this session");
      return;
    }

    // Check if alert was already sent this month
    const alreadySent = await hasAlertBeenSentThisMonth();
    console.log("  - Already sent this month:", alreadySent);

    if (alreadySent) {
      console.log("  ❌ Alert already sent this month");
      setIsAlertTriggered(true);
      return;
    }

    // Trigger alert
    console.log("  ✅ ALL CONDITIONS MET - Sending alert email...");
    try {
      await sendAlertEmail(
        alertSettings.monthlyLimit,
        alertSettings.email,
        monthlyTotal,
      );
      await markAlertAsSent();
      setIsAlertTriggered(true);
      console.log("📧 Monthly spending alert email sent successfully");
    } catch (error) {
      console.error("❌ Failed to send alert email:", error);
      // Don't mark as sent if failed, will retry later
    }
  };

  const resetAlertFlag = async () => {
    console.log("🔄 [Alert Hook] Manually resetting alert flag");
    setIsAlertTriggered(false);
  };

  return {
    monthlyTotal,
    alertSettings,
    isAlertTriggered,
    reloadSettings: loadSettings,
    resetAlertFlag,
  };
};
