/**
 * Group Service
 * Business logic layer for group/split expense API operations
 */

import {
    CreateGroupDto,
    CreateGroupTransactionDto,
    GroupApiResponse,
    GroupBalanceApiResponse,
    GroupTransactionApiResponse,
    SettlementApiResponse,
} from "@/types/api.types";
import { HttpClient } from "./http.client";

// Create a custom HTTP client for group API with different base URL
const groupHttpClient = new HttpClient(
  "https://seal-app-wqxuo.ondigitalocean.app",
  {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  10000,
);

class GroupService {
  /**
   * Fetch all groups
   */
  async getGroups(): Promise<GroupApiResponse[]> {
    try {
      const response = await groupHttpClient.get<GroupApiResponse[]>("/groups");
      return response;
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  }

  /**
   * Fetch a single group by ID
   */
  async getGroupById(groupId: number): Promise<GroupApiResponse> {
    try {
      const response = await groupHttpClient.get<GroupApiResponse>(
        `/groups/${groupId}`,
      );
      return response;
    } catch (error) {
      console.error(`Error fetching group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new group
   */
  async createGroup(data: CreateGroupDto): Promise<GroupApiResponse> {
    try {
      const response = await groupHttpClient.post<GroupApiResponse>(
        "/groups",
        data,
      );
      return response;
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  }

  /**
   * Delete a group (soft delete)
   */
  async deleteGroup(groupId: number): Promise<void> {
    try {
      await groupHttpClient.delete(`/groups/${groupId}`);
    } catch (error) {
      console.error(`Error deleting group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Get member balances for a group
   */
  async getGroupBalances(groupId: number): Promise<GroupBalanceApiResponse[]> {
    try {
      const response = await groupHttpClient.get<GroupBalanceApiResponse[]>(
        `/groups/${groupId}/balances`,
      );
      return response;
    } catch (error) {
      console.error(`Error fetching balances for group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate settlement for a group
   */
  async getGroupSettlement(groupId: number): Promise<SettlementApiResponse[]> {
    try {
      const response = await groupHttpClient.get<SettlementApiResponse[]>(
        `/groups/${groupId}/settlement`,
      );
      return response;
    } catch (error) {
      console.error(
        `Error calculating settlement for group ${groupId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get all transactions for a group
   */
  async getGroupTransactions(
    groupId: number,
  ): Promise<GroupTransactionApiResponse[]> {
    try {
      const response = await groupHttpClient.get<GroupTransactionApiResponse[]>(
        `/groups/${groupId}/transactions`,
      );
      return response;
    } catch (error) {
      console.error(`Error fetching transactions for group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Add a transaction to a group
   */
  async addGroupTransaction(
    groupId: number,
    data: CreateGroupTransactionDto,
  ): Promise<GroupTransactionApiResponse> {
    try {
      const response = await groupHttpClient.post<GroupTransactionApiResponse>(
        `/groups/${groupId}/transactions`,
        data,
      );
      return response;
    } catch (error) {
      console.error(`Error adding transaction to group ${groupId}:`, error);
      throw error;
    }
  }
}

// Singleton instance
export const groupService = new GroupService();
