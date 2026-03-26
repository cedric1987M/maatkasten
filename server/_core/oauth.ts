/**
 * Standalone Authentication Routes
 * No Manus OAuth - uses JWT-based authentication
 * Supports development mode (mock auth) and production mode
 */

import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  /**
   * Development login endpoint (for testing without real OAuth)
   * Usage: GET /api/dev/login?email=user@example.com&name=John
   */
  if (!ENV.isProduction) {
    app.get("/api/dev/login", async (req: Request, res: Response) => {
      const email = getQueryParam(req, "email") || "dev@example.com";
      const name = getQueryParam(req, "name") || "Developer";
      const userId = `dev-${Date.now()}`;

      try {
        const user = await db.upsertUser({
          userId,
          email,
          name,
          role: "user",
          lastSignedIn: new Date(),
        });

        if (!user) {
          res.status(500).json({ error: "Failed to create user" });
          return;
        }

        const sessionToken = await sdk.createSessionToken(userId, {
          email,
          name,
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        res.redirect(302, "/");
      } catch (error) {
        console.error("[Dev Auth] Login failed", error);
        res.status(500).json({ error: "Development login failed" });
      }
    });

    app.get("/api/dev/logout", (req: Request, res: Response) => {
      res.clearCookie(COOKIE_NAME);
      res.redirect(302, "/");
    });
  }

  /**
   * Generic OAuth callback endpoint
   * Can be used with any OAuth 2.0 provider
   * Expected query params: code, state
   */
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      // In production, you would exchange the code for a token here
      // using your OAuth provider's API
      // For now, we'll create a simple user session
      
      const userId = `oauth-${Date.now()}`;
      const user = await db.upsertUser({
        userId,
        email: null,
        name: null,
        role: "user",
        lastSignedIn: new Date(),
      });

      if (!user) {
        res.status(500).json({ error: "Failed to create user" });
        return;
      }

      const sessionToken = await sdk.createSessionToken(userId, {
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  /**
   * Logout endpoint
   */
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });

  /**
   * Session check endpoint
   */
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const user = await sdk.authenticateRequest(req);
      res.json({
        id: user.id,
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (error) {
      res.status(401).json({ error: "Not authenticated" });
    }
  });
}
