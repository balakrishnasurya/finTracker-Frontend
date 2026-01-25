/**
 * API Response Types
 * Type definitions for API requests and responses
 */

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API Error
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Category API types
export interface CategoryApiResponse {
  id: string | number;
  name: string;
  icon?: string;
  color?: string;
  type?: "income" | "expense";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
}

export interface UpdateCategoryDto {
  name?: string;
  icon?: string;
  color?: string;
  type?: "income" | "expense";
}

// Transaction API types
export interface TransactionApiResponse {
  id: string | number;
  amount: number;
  categoryId: string | number;
  merchant: string;
  txnDate: string;
  transactionType?: string;
  smsId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTransactionDto {
  smsId?: number;
  txnDate: string;
  amount: number;
  merchant: string;
  transactionType: string;
  categoryId: number;
}

export interface UpdateTransactionDto {
  amount?: number;
  categoryId?: number;
  merchant?: string;
  txnDate?: string;
  transactionType?: string;
}

// Streak API types
export interface StreakApiResponse {
  id: number;
  name: string;
  currentCount: number;
  longestCount: number;
  lastUpdated: string;
}
