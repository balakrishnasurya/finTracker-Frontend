/**
 * Environment Configuration
 * Centralized environment variables and configuration
 */

// API Configuration
export const ENV = {
  // API Base URL
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_URL ||
    "https://plankton-app-v4el9.ondigitalocean.app/api/v1",

  // API Timeout (milliseconds)
  API_TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "10000", 10),

  // Enable API Logging
  API_LOGGING_ENABLED: process.env.EXPO_PUBLIC_API_LOGGING === "true",

  // Development Mode
  IS_DEV: process.env.NODE_ENV === "development",
} as const;

// Validate required environment variables
export function validateEnv() {
  const required: (keyof typeof ENV)[] = ["API_BASE_URL"];
  const missing = required.filter((key) => !ENV[key]);

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`);
  }
}
