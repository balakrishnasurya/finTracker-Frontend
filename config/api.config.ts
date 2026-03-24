/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: "https://seal-app-wqxuo.ondigitalocean.app/api/v1",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
} as const;

export const API_ENDPOINTS = {
  CATEGORIES: "/categories",
  TRANSACTIONS: "/transactions",
  IMPORT_CSV: "/import/transactions/csv",
} as const;
