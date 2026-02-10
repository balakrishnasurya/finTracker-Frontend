/**
 * Chat Service
 * Handles chat/conversation API operations
 */

import type {
    ChatMessageApiResponse,
    SendChatMessageDto,
} from "@/types/api.types";
import { logger } from "@/utils/logger";
import { httpClient } from "./http.client";

export class ChatService {
  private readonly endpoint = "/chat/conversations";

  /**
   * Send a message to a conversation and get the updated message history
   * @param conversationId - The ID of the conversation
   * @param message - The message to send
   * @returns Array of all messages in the conversation including the response
   */
  async sendMessage(
    conversationId: number,
    message: string,
  ): Promise<ChatMessageApiResponse[]> {
    try {
      logger.info(`Sending message to conversation ${conversationId}`);

      const payload: SendChatMessageDto = { message };

      const response = await httpClient.post<ChatMessageApiResponse[]>(
        `${this.endpoint}/${conversationId}/messages`,
        payload,
      );

      logger.info(
        `Received ${response.length} messages from conversation ${conversationId}`,
      );

      return response;
    } catch (error) {
      logger.error("Failed to send message:", error);
      throw error;
    }
  }

  /**
   * Get conversation message history
   * @param conversationId - The ID of the conversation
   * @returns Array of all messages in the conversation
   */
  async getMessages(conversationId: number): Promise<ChatMessageApiResponse[]> {
    try {
      logger.info(`Fetching messages for conversation ${conversationId}`);

      const response = await httpClient.get<ChatMessageApiResponse[]>(
        `${this.endpoint}/${conversationId}/messages`,
      );

      logger.info(
        `Retrieved ${response.length} messages from conversation ${conversationId}`,
      );

      return response;
    } catch (error) {
      logger.error("Failed to get messages:", error);
      throw error;
    }
  }
}

// Singleton instance
export const chatService = new ChatService();
