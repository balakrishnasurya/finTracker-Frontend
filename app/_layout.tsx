import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { FinanceProvider } from "@/context/finance-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FinanceProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen
            name="categories/index"
            options={{ presentation: "modal", title: "Categories" }}
          />
          <Stack.Screen
            name="categories/new"
            options={{ presentation: "modal", title: "New Category" }}
          />
          <Stack.Screen
            name="transactions/index"
            options={{ presentation: "modal", title: "Transactions" }}
          />
          <Stack.Screen
            name="transactions/new"
            options={{ presentation: "modal", title: "New Transaction" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </FinanceProvider>
  );
}
