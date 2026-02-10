import {
  categoryService,
  streakService,
  transactionService,
} from "@/services/api";
import { Category, FinanceSummary, Streak, Transaction } from "@/types";
import {
  loadCategories,
  loadTransactions,
  saveCategories,
  saveTransactions,
} from "@/utils/storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert, Vibration } from "react-native";

interface FinanceContextType {
  categories: Category[];
  transactions: Transaction[];
  streak: Streak | null;
  addCategory: (category: Omit<Category, "id" | "createdAt">) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt">,
  ) => Promise<void>;
  updateTransaction: (
    id: string,
    transaction: Partial<Transaction>,
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getFinanceSummary: () => FinanceSummary;
  updateStreak: () => Promise<void>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  error: string | null;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

// Encouraging messages for streak updates
const STREAK_MESSAGES = [
  {
    min: 1,
    max: 3,
    messages: [
      "🎉 Great start! You're building a healthy financial habit!",
      "💪 Awesome! Keep tracking your finances daily!",
      "🌟 You're on fire! Keep up the momentum!",
    ],
  },
  {
    min: 4,
    max: 7,
    messages: [
      "🔥 One week closer to financial mastery!",
      "🚀 Amazing dedication! Your consistency is paying off!",
      "⭐ You're unstoppable! Keep this streak alive!",
    ],
  },
  {
    min: 8,
    max: 14,
    messages: [
      "🏆 Incredible! You're a finance tracking champion!",
      "💎 Two weeks strong! Your financial discipline is impressive!",
      "🎯 You're crushing it! Every day counts!",
    ],
  },
  {
    min: 15,
    max: 30,
    messages: [
      "👑 Phenomenal! You're a financial wellness superstar!",
      "🌈 A full month incoming! Your future self will thank you!",
      "🎊 Outstanding commitment! You're setting an amazing example!",
    ],
  },
  {
    min: 31,
    max: 999,
    messages: [
      "🏅 Legendary! Your dedication to financial health is remarkable!",
      "💫 Elite status! You've mastered the art of consistency!",
      "🌟 Unbelievable! You're an inspiration to others!",
    ],
  },
];

const getEncouragingMessage = (streakCount: number): string => {
  const messageGroup = STREAK_MESSAGES.find(
    (group) => streakCount >= group.min && streakCount <= group.max,
  );
  if (messageGroup) {
    const randomIndex = Math.floor(
      Math.random() * messageGroup.messages.length,
    );
    return messageGroup.messages[randomIndex];
  }
  return "🎉 Keep going! You're doing amazing!";
};

const showStreakFeedback = (
  currentStreak: number,
  isNewRecord: boolean,
  wasStreakBroken: boolean,
) => {
  // Haptic feedback
  Vibration.vibrate([0, 50, 100, 50]);

  if (wasStreakBroken) {
    Alert.alert(
      "💪 Fresh Start!",
      "Don't worry about the break! Every streak starts with day 1. You're back on track now! 🚀",
      [{ text: "Let's Go!", style: "default" }],
    );
    return;
  }

  const message = getEncouragingMessage(currentStreak);
  const title = isNewRecord
    ? `🎊 New Record: ${currentStreak} Days! 🎊`
    : `🔥 ${currentStreak} Day Streak! 🔥`;

  const additionalMessage = isNewRecord
    ? "\n\n🏆 You've beaten your personal best! Keep going!"
    : "";

  Alert.alert(
    title,
    message + additionalMessage,
    [
      {
        text: "Keep Going! 💪",
        style: "default",
      },
    ],
    { cancelable: true },
  );
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount and update streak
  useEffect(() => {
    loadData();
    initializeStreak();
  }, []);

  const initializeStreak = async () => {
    try {
      // Get current streak before update
      const oldStreak = await streakService.getStreak().catch(() => null);

      // Update streak on app open
      const streakData = await streakService.updateStreak();
      setStreak(streakData);

      // Show feedback if streak increased or is new record
      if (oldStreak) {
        const streakIncreased =
          streakData.currentCount > oldStreak.currentCount;
        const isNewRecord = streakData.currentCount > streakData.longestCount;
        const wasStreakBroken =
          oldStreak.currentCount > 1 && streakData.currentCount === 1;

        if (streakIncreased || wasStreakBroken) {
          // Delay feedback slightly to ensure UI is ready
          setTimeout(() => {
            showStreakFeedback(
              streakData.currentCount,
              isNewRecord,
              wasStreakBroken,
            );
          }, 500);
        }
      } else if (streakData.currentCount === 1) {
        // First time user - welcome message
        setTimeout(() => {
          Alert.alert(
            "🎉 Welcome to FinTrackor!",
            "You've started your financial tracking journey! Open the app daily to build your streak and develop healthy money habits. 💰",
            [{ text: "Let's Go!", style: "default" }],
          );
        }, 500);
      }
    } catch (err) {
      console.error("Error initializing streak:", err);
      // Try to fetch current streak if update fails
      try {
        const streakData = await streakService.getStreak();
        setStreak(streakData);
      } catch (fetchErr) {
        console.error("Error fetching streak:", fetchErr);
      }
    }
  };

  const updateStreak = async () => {
    try {
      const oldStreak = streak;
      const streakData = await streakService.updateStreak();
      setStreak(streakData);

      // Show feedback if streak increased
      if (oldStreak && streakData.currentCount > oldStreak.currentCount) {
        const isNewRecord = streakData.currentCount > streakData.longestCount;
        showStreakFeedback(streakData.currentCount, isNewRecord, false);
      }
    } catch (err) {
      console.error("Error updating streak:", err);
      throw err;
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Try to fetch from API first
      const [apiCategories, apiTransactions] = await Promise.all([
        categoryService.getCategories().catch(() => null),
        transactionService.getTransactions().catch(() => null),
      ]);

      // If API fetch is successful, use API data
      if (apiCategories) {
        setCategories(apiCategories);
        // Cache in local storage for offline use
        await saveCategories(apiCategories);
      } else {
        // Fallback to local storage
        const localCategories = await loadCategories();
        setCategories(localCategories);
      }

      if (apiTransactions) {
        setTransactions(apiTransactions);
        await saveTransactions(apiTransactions);
      } else {
        const localTransactions = await loadTransactions();
        setTransactions(localTransactions);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");

      // Fallback to local storage on error
      try {
        const [localCategories, localTransactions] = await Promise.all([
          loadCategories(),
          loadTransactions(),
        ]);
        setCategories(localCategories);
        setTransactions(localTransactions);
      } catch (localErr) {
        console.error("Error loading local data:", localErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  // Category operations
  const addCategory = async (
    categoryData: Omit<Category, "id" | "createdAt">,
  ) => {
    try {
      // Try to create on backend
      const newCategory = await categoryService.createCategory({
        name: categoryData.name,
        icon: categoryData.icon,
        color: categoryData.color,
        type: categoryData.type,
      });

      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      await saveCategories(updatedCategories);
    } catch (err) {
      console.error("Error creating category on backend:", err);

      // Fallback to local creation
      const newCategory: Category = {
        ...categoryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      await saveCategories(updatedCategories);
    }
  };

  const updateCategory = async (
    id: string,
    categoryData: Partial<Category>,
  ) => {
    try {
      // Try to update on backend
      await categoryService.updateCategory(id, {
        name: categoryData.name,
        icon: categoryData.icon,
        color: categoryData.color,
        type: categoryData.type,
      });

      const updatedCategories = categories.map((cat) =>
        cat.id === id ? { ...cat, ...categoryData } : cat,
      );
      setCategories(updatedCategories);
      await saveCategories(updatedCategories);
    } catch (err) {
      console.error("Error updating category on backend:", err);

      // Fallback to local update
      const updatedCategories = categories.map((cat) =>
        cat.id === id ? { ...cat, ...categoryData } : cat,
      );
      setCategories(updatedCategories);
      await saveCategories(updatedCategories);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      // Try to delete on backend
      await categoryService.deleteCategory(id);

      const updatedCategories = categories.filter((cat) => cat.id !== id);
      const updatedTransactions = transactions.filter(
        (trans) => trans.categoryId !== id,
      );
      setCategories(updatedCategories);
      setTransactions(updatedTransactions);
      await Promise.all([
        saveCategories(updatedCategories),
        saveTransactions(updatedTransactions),
      ]);
    } catch (err) {
      console.error("Error deleting category on backend:", err);

      // Fallback to local delete
      const updatedCategories = categories.filter((cat) => cat.id !== id);
      const updatedTransactions = transactions.filter(
        (trans) => trans.categoryId !== id,
      );
      setCategories(updatedCategories);
      setTransactions(updatedTransactions);
      await Promise.all([
        saveCategories(updatedCategories),
        saveTransactions(updatedTransactions),
      ]);
    }
  };

  // Transaction operations
  const addTransaction = async (
    transactionData: Omit<Transaction, "id" | "createdAt">,
  ) => {
    try {
      // Try to create on backend
      const newTransaction = await transactionService.createTransaction(
        transactionData.amount,
        transactionData.description,
        transactionData.categoryId,
        transactionData.date,
        transactionData.type,
        transactionData.paymentType || "Upi",
      );

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      await saveTransactions(updatedTransactions);
    } catch (err) {
      console.error("Error creating transaction on backend:", err);

      // Fallback to local creation
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      await saveTransactions(updatedTransactions);
    }
  };

  const updateTransaction = async (
    id: string,
    transactionData: Partial<Transaction>,
  ) => {
    try {
      // Try to update on backend
      await transactionService.updateTransaction(id, {
        amount: transactionData.amount,
        categoryId: transactionData.categoryId,
        description: transactionData.description,
        date: transactionData.date,
        type: transactionData.type,
      });

      const updatedTransactions = transactions.map((trans) =>
        trans.id === id ? { ...trans, ...transactionData } : trans,
      );
      setTransactions(updatedTransactions);
      await saveTransactions(updatedTransactions);
    } catch (err) {
      console.error("Error updating transaction on backend:", err);

      // Fallback to local update
      const updatedTransactions = transactions.map((trans) =>
        trans.id === id ? { ...trans, ...transactionData } : trans,
      );
      setTransactions(updatedTransactions);
      await saveTransactions(updatedTransactions);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      // Try to delete on backend
      await transactionService.deleteTransaction(id);

      const updatedTransactions = transactions.filter(
        (trans) => trans.id !== id,
      );
      setTransactions(updatedTransactions);
      await saveTransactions(updatedTransactions);
    } catch (err) {
      console.error("Error deleting transaction on backend:", err);

      // Fallback to local delete
      const updatedTransactions = transactions.filter(
        (trans) => trans.id !== id,
      );
      setTransactions(updatedTransactions);
      await saveTransactions(updatedTransactions);
    }
  };

  // Calculate finance summary
  const getFinanceSummary = (): FinanceSummary => {
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: 0,
      totalExpense,
      balance: 0,
      transactionCount: transactions.length,
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        categories,
        transactions,
        streak,
        addCategory,
        updateCategory,
        deleteCategory,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getFinanceSummary,
        updateStreak,
        isLoading,
        refreshData,
        error,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
