import { ChatBubble } from "@/components/chat-bubble";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { chatService } from "@/services/api";
import type { ApiError, ChatMessageApiResponse } from "@/types/api.types";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Conversation ID for the chat
const CONVERSATION_ID = 2;

function getChatErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as ApiError;

  if (apiError?.statusCode === 408) {
    return "The assistant is taking too long to respond. Please try again in a moment.";
  }

  if (apiError?.statusCode === 0) {
    return "No internet connection. Please check your network and try again.";
  }

  return fallback;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [messages, setMessages] = useState<ChatMessageApiResponse[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load initial messages on mount
  useEffect(() => {
    loadMessages();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const fetchedMessages = await chatService.getMessages(CONVERSATION_ID);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
      Alert.alert(
        "Error",
        getChatErrorMessage(
          error,
          "Failed to load conversation history. Please try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;

    const messageText = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      // Send message and get updated conversation
      const updatedMessages = await chatService.sendMessage(
        CONVERSATION_ID,
        messageText,
      );
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to send message:", error);
      Alert.alert(
        "Error",
        getChatErrorMessage(
          error,
          "Failed to send message. Please check your connection and try again.",
        ),
      );
      // Restore the input text so user can retry
      setInputText(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const formatTimestamp = (messageId: number) => {
    // Simple timestamp based on message order
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ThemedView style={styles.header}>
        <View style={styles.headerContent}>
          <IconSymbol
            size={32}
            name="sparkles"
            color="#10B981"
            style={styles.headerIcon}
          />
          <View>
            <ThemedText
              type="title"
              style={{
                fontFamily: Fonts.rounded,
                fontSize: 24,
              }}
            >
              Finance Assistant
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Your AI-powered finance advisor
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      <ScrollView
        ref={scrollViewRef}
        style={[
          styles.chatContainer,
          { backgroundColor: isDark ? "#111827" : "#FFFFFF" },
        ]}
        contentContainerStyle={styles.chatContent}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={isDark ? "#10B981" : "#059669"}
            />
            <ThemedText style={styles.loadingText}>
              Loading conversation...
            </ThemedText>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol
              size={64}
              name="sparkles"
              color={isDark ? "#4B5563" : "#D1D5DB"}
            />
            <ThemedText style={styles.emptyText}>
              Start a conversation
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Ask me anything about your finances!
            </ThemedText>
          </View>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.content}
              isUser={message.role === "user"}
              timestamp={formatTimestamp(message.id)}
            />
          ))
        )}
      </ScrollView>

      <ThemedView
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          },
        ]}
      >
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: isDark ? "#374151" : "#F9FAFB",
              borderColor: isDark ? "#4B5563" : "#E5E7EB",
            },
          ]}
        >
          <IconSymbol
            size={20}
            name="sparkles"
            color={isDark ? "#9CA3AF" : "#6B7280"}
            style={styles.inputIcon}
          />
          <TextInput
            style={[
              styles.input,
              {
                color: isDark ? "#FFFFFF" : "#000000",
              },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your finances..."
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() && !isSending
                ? styles.sendButtonActive
                : styles.sendButtonInactive,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
            activeOpacity={0.8}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <IconSymbol
                size={20}
                name="arrow.up"
                color="#FFFFFF"
                style={styles.sendIcon}
              />
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    marginTop: -4,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginBottom: 10,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonInactive: {
    backgroundColor: "#9CA3AF",
    opacity: 0.4,
  },
  sendIcon: {
    fontWeight: "bold",
  },
});
