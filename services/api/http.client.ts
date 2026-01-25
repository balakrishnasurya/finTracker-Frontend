/**
 * HTTP Client
 * Low-level HTTP client for making API requests with error handling
 */

import { API_CONFIG } from "@/config/api.config";
import { ApiError } from "@/types/api.types";
import { logger } from "@/utils/logger";

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(
    baseUrl: string = API_CONFIG.BASE_URL,
    headers: Record<string, string> = API_CONFIG.HEADERS,
    timeout: number = API_CONFIG.TIMEOUT,
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = headers;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const startTime = Date.now();

    try {
      logger.debug(`API Request: ${options.method || "GET"} ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      logger.api(options.method || "GET", endpoint, response.status, duration);

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw this.createApiError(errorData, response.status);
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          logger.error("API Timeout:", endpoint);
          throw this.createApiError("Request timeout", 408);
        }

        // Network errors
        if (!navigator.onLine) {
          logger.error("No internet connection");
          throw this.createApiError("No internet connection", 0);
        }

        // Already an ApiError
        if ("statusCode" in error) {
          throw error;
        }

        logger.error("API Error:", error.message);
        throw this.createApiError(error.message);
      }

      logger.error("Unknown API Error");
      throw this.createApiError("Unknown error occurred");
    }
  }

  private async parseErrorResponse(response: Response): Promise<string> {
    try {
      const data = await response.json();
      return data.message || data.error || "Request failed";
    } catch {
      return response.statusText || "Request failed";
    }
  }

  private createApiError(message: string, statusCode?: number): ApiError {
    return {
      message,
      statusCode,
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// Singleton instance
export const httpClient = new HttpClient();
