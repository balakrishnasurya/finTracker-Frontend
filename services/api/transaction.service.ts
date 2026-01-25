/**
 * Transaction Service
 * Business logic layer for transaction-related API operations
 */

import { API_ENDPOINTS } from "@/config/api.config";
import { Transaction } from "@/types";
import {
    CreateTransactionDto,
    TransactionApiResponse,
    UpdateTransactionDto,
} from "@/types/api.types";
import { httpClient } from "./http.client";

class TransactionService {
  /**
   * Fetch all transactions from the backend
   */
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await httpClient.get<TransactionApiResponse[]>(
        API_ENDPOINTS.TRANSACTIONS,
      );
      return response.map(this.transformToTransaction);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  /**
   * Fetch a single transaction by ID
   */
  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await httpClient.get<TransactionApiResponse>(
        `${API_ENDPOINTS.TRANSACTIONS}/${id}`,
      );
      return this.transformToTransaction(response);
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new transaction
   */
  async createTransaction(
    amount: number,
    description: string,
    categoryId: string,
    date: string,
    type: "income" | "expense",
    paymentType: string = "Upi",
  ): Promise<Transaction> {
    try {
      const requestBody: CreateTransactionDto = {
        smsId: 0,
        txnDate: date,
        amount: amount,
        merchant: description,
        transactionType: paymentType,
        categoryId: parseInt(categoryId, 10),
      };

      const response = await httpClient.post<TransactionApiResponse>(
        API_ENDPOINTS.TRANSACTIONS,
        requestBody,
      );
      return this.transformToTransaction(response, type, paymentType);
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  /**
   * Update an existing transaction
   */
  async updateTransaction(
    id: string,
    data: UpdateTransactionDto,
  ): Promise<Transaction> {
    try {
      const response = await httpClient.put<TransactionApiResponse>(
        `${API_ENDPOINTS.TRANSACTIONS}/${id}`,
        data,
      );
      return this.transformToTransaction(response);
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    try {
      await httpClient.delete(`${API_ENDPOINTS.TRANSACTIONS}/${id}`);
    } catch (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Transform API response to internal Transaction type
   */
  private transformToTransaction(
    apiTransaction: TransactionApiResponse,
    type?: "income" | "expense",
    paymentType?: string,
  ): Transaction {
    return {
      id: String(apiTransaction.id),
      amount: apiTransaction.amount,
      categoryId: String(apiTransaction.categoryId),
      description: apiTransaction.merchant,
      date: apiTransaction.txnDate,
      type: type || "expense", // Default to expense if not provided
      paymentType: paymentType || apiTransaction.transactionType || "Upi",
      createdAt: apiTransaction.createdAt || new Date().toISOString(),
    };
  }
}

// Singleton instance
export const transactionService = new TransactionService();
