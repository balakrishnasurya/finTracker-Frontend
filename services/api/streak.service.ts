/**
 * Streak Service
 * Handles API requests for streak tracking
 */

import { StreakApiResponse } from "@/types/api.types";
import { logger } from "@/utils/logger";
import { httpClient } from "./http.client";

export class StreakService {
  private readonly endpoint = "/streak";

  /**
   * Get current streak data
   */
  async getStreak(): Promise<StreakApiResponse> {
    try {
      logger.debug("Fetching streak data");
      const response = await httpClient.get<StreakApiResponse>(this.endpoint);
      logger.debug("Streak data fetched:", response);
      return response;
    } catch (error) {
      logger.error("Failed to fetch streak:", error);
      throw error;
    }
  }

  /**
   * Update streak (increment on app open)
   */
  async updateStreak(): Promise<StreakApiResponse> {
    try {
      logger.debug("Updating streak");
      const response = await httpClient.post<StreakApiResponse>(
        this.endpoint,
        {},
      );
      logger.debug("Streak updated:", response);
      return response;
    } catch (error) {
      logger.error("Failed to update streak:", error);
      throw error;
    }
  }
}

// Singleton instance
export const streakService = new StreakService();
