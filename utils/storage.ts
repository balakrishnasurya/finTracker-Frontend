import { Category, Transaction } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CATEGORIES_KEY = "@fintrackor_categories";
const TRANSACTIONS_KEY = "@fintrackor_transactions";

// Category Storage
export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories:", error);
    throw error;
  }
};

export const loadCategories = async (): Promise<Category[]> => {
  try {
    const data = await AsyncStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
};

// Transaction Storage
export const saveTransactions = async (
  transactions: Transaction[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions:", error);
    throw error;
  }
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading transactions:", error);
    return [];
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([CATEGORIES_KEY, TRANSACTIONS_KEY]);
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
};
