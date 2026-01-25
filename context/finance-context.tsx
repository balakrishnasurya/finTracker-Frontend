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
      // Update streak on app open
      const streakData = await streakService.updateStreak();
      setStreak(streakData);
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
      const streakData = await streakService.updateStreak();
      setStreak(streakData);
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
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
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
