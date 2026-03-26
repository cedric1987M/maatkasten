/**
 * Standalone Authentication SDK
 * No Manus dependencies - uses JWT-based authentication
 * Supports both mock auth (development) and real JWT verification
 */

import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

class AuthService {
  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    if (!secret || secret === "change-me-in-production") {
      console.warn("[Auth] WARNING: Using default JWT secret. Set JWT_SECRET in production!");
    }
    return new TextEncoder().encode(secret);
  }

  /**
   * Create a session token for a user
   */
  async createSessionToken(
    userId: string,
    options: { expiresInMs?: number; email?: string; name?: string } = {}
  ): Promise<string> {
    return this.signSession(
      {
        userId,
        email: options.email || "",
        name: options.name || "",
      },
      options
    );
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<{ userId: string; email: string; name: string } | null> {
    if (!cookieValue) {
      if (ENV.enableDebugLogs) {
        console.warn("[Auth] Missing session cookie");
      }
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { userId, email, name } = payload as Record<string, unknown>;

      if (!isNonEmptyString(userId)) {
        console.warn("[Auth] Session payload missing userId");
        return null;
      }

      return {
        userId,
        email: isNonEmptyString(email) ? email : "",
        name: isNonEmptyString(name) ? name : "",
      };
    } catch (error) {
      if (ENV.enableDebugLogs) {
        console.warn("[Auth] Session verification failed", String(error));
      }
      return null;
    }
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  /**
   * Authenticate a request using session cookie
   */
  async authenticateRequest(req: Request): Promise<User> {
    // If auth is disabled, create a mock user
    if (!ENV.authEnabled) {
      const mockUser = await db.getUserByUserId("mock-user");
      if (!mockUser) {
        const newUser = await db.upsertUser({
          userId: "mock-user",
          email: "dev@example.com",
          name: "Developer",
          role: "user",
          lastSignedIn: new Date(),
        });
        if (!newUser) {
          throw ForbiddenError("Failed to create mock user");
        }
        return newUser;
      }
      return mockUser;
    }

    // Regular authentication flow
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const signedInAt = new Date();
    let user = await db.getUserByUserId(session.userId);

    // If user not in DB, create them
    if (!user) {
      user = await db.upsertUser({
        userId: session.userId,
        email: session.email || null,
        name: session.name || null,
        role: "user",
        lastSignedIn: signedInAt,
      });
    } else {
      // Update last signed in
      await db.upsertUser({
        userId: user.userId,
        lastSignedIn: signedInAt,
      });
    }

    if (!user) {
      throw ForbiddenError("User not found");
    }

    return user;
  }
}

export const sdk = new AuthService();
