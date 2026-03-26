/**
 * Environment configuration for standalone deployment
 * No Manus dependencies - uses standard environment variables
 */

export const ENV = {
  // Application
  appId: process.env.APP_ID ?? "maatkast-configurator",
  cookieSecret: process.env.JWT_SECRET ?? "change-me-in-production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",

  // Authentication (optional - can be disabled)
  authEnabled: process.env.AUTH_ENABLED !== "false",
  authType: process.env.AUTH_TYPE ?? "jwt", // jwt, mock, or custom

  // Database
  dbMaxConnections: parseInt(process.env.DB_MAX_CONNECTIONS ?? "10", 10),
  dbTimeout: parseInt(process.env.DB_TIMEOUT ?? "30000", 10),

  // Server
  port: parseInt(process.env.PORT ?? "3000", 10),
  host: process.env.HOST ?? "0.0.0.0",

  // Logging
  logLevel: process.env.LOG_LEVEL ?? "info",
  enableDebugLogs: process.env.DEBUG === "true",
};

// Validate required environment variables
export function validateEnv() {
  const errors: string[] = [];

  if (!ENV.databaseUrl) {
    errors.push("DATABASE_URL is required");
  }

  if (!ENV.cookieSecret || ENV.cookieSecret === "change-me-in-production") {
    if (ENV.isProduction) {
      errors.push("JWT_SECRET must be set in production");
    }
  }

  if (errors.length > 0) {
    console.warn("[Env] Warnings:", errors);
    if (ENV.isProduction) {
      throw new Error(`Environment validation failed:\n${errors.join("\n")}`);
    }
  }
}
