/**
 * Logger Utility
 * Centralized logging with different log levels
 */

import { ENV } from "@/config/env.config";

enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

class Logger {
  private enabled: boolean;

  constructor(enabled: boolean = ENV.API_LOGGING_ENABLED) {
    this.enabled = enabled;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.enabled && level !== LogLevel.ERROR) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, ...args);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, ...args);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, ...args);
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, ...args);
        break;
    }
  }

  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }

  api(method: string, url: string, status?: number, duration?: number) {
    if (!this.enabled) return;

    const statusColor = status && status >= 200 && status < 300 ? "✅" : "❌";
    const durationText = duration ? `${duration}ms` : "";

    this.info(
      `${statusColor} API ${method.toUpperCase()} ${url}`,
      status ? `[${status}]` : "",
      durationText,
    );
  }
}

export const logger = new Logger();
