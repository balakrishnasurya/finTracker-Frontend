import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export function ChatBubble({ message, isUser, timestamp }: ChatBubbleProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? styles.userBubble
            : [
                styles.aiBubble,
                { backgroundColor: isDark ? "#374151" : "#F3F4F6" },
              ],
        ]}
      >
        <ThemedText
          style={[
            styles.message,
            isUser && styles.userMessage,
            !isUser && { color: isDark ? "#E5E7EB" : "#1F2937" },
          ]}
        >
          {message}
        </ThemedText>
        {timestamp && (
          <ThemedText
            style={[
              styles.timestamp,
              isUser && styles.userTimestamp,
              !isUser && { color: isDark ? "#9CA3AF" : "#6B7280" },
            ]}
          >
            {timestamp}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  aiContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: "#10B981",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessage: {
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
});
