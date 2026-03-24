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
import * as DocumentPicker from "expo-document-picker";
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
    paymentType: string = "Upi",
    transactionDirection: "DEBIT" | "CREDIT" = "DEBIT",
  ): Promise<Transaction> {
    try {
      const requestBody: CreateTransactionDto = {
        smsId: 0,
        txnDate: date,
        amount: amount,
        merchant: description,
        paymentType,
        transactionType: paymentType,
        transactionDirection,
        categoryId: parseInt(categoryId, 10),
      };

      const response = await httpClient.post<TransactionApiResponse>(
        API_ENDPOINTS.TRANSACTIONS,
        requestBody,
      );
      const transaction = this.transformToTransaction(response);
      if (!transaction.paymentType) {
        return {
          ...transaction,
          paymentType,
          transactionType: transaction.transactionType || paymentType,
        };
      }
      return transaction;
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
   * Import transactions from CSV file
   */
  async importTransactionsCSV(
    file: DocumentPicker.DocumentPickerAsset,
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "text/csv",
      } as any);

      return await httpClient.post(API_ENDPOINTS.IMPORT_CSV, formData);
    } catch (error) {
      console.error("Error importing CSV:", error);
      throw error;
    }
  }

  /**
   * Transform API response to internal Transaction type
   */
  private transformToTransaction(
    apiTransaction: TransactionApiResponse,
  ): Transaction {
    return {
      id: String(apiTransaction.id),
      amount: apiTransaction.amount,
      categoryId: String(apiTransaction.categoryId),
      description: apiTransaction.merchant,
      date: apiTransaction.txnDate,
      paymentType:
        apiTransaction.paymentType || apiTransaction.transactionType || "Upi",
      transactionType: apiTransaction.transactionType,
      transactionDirection: apiTransaction.transactionDirection || "DEBIT",
      createdAt: apiTransaction.createdAt || new Date().toISOString(),
    };
  }
}

// Singleton instance
export const transactionService = new TransactionService();
