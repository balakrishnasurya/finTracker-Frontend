import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const buttonColors = {
    primary: {
      background: isDark ? "#10B981" : "#059669",
      text: "#FFFFFF",
      disabled: isDark ? "#374151" : "#D1D5DB",
    },
    secondary: {
      background: isDark ? "#3B82F6" : "#2563EB",
      text: "#FFFFFF",
      disabled: isDark ? "#374151" : "#D1D5DB",
    },
    danger: {
      background: isDark ? "#EF4444" : "#DC2626",
      text: "#FFFFFF",
      disabled: isDark ? "#374151" : "#D1D5DB",
    },
    success: {
      background: isDark ? "#10B981" : "#059669",
      text: "#FFFFFF",
      disabled: isDark ? "#374151" : "#D1D5DB",
    },
  };

  const sizes = {
    small: { padding: 8, fontSize: 12 },
    medium: { padding: 12, fontSize: 14 },
    large: { padding: 16, fontSize: 16 },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled
            ? buttonColors[variant].disabled
            : buttonColors[variant].background,
          padding: sizes[size].padding,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={buttonColors[variant].text} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: buttonColors[variant].text,
              fontSize: sizes[size].fontSize,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  text: {
    fontWeight: "600",
  },
});
