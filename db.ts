import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, configurations, orders, pricingRules, InsertConfiguration, InsertOrder, InsertPricingRules } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<any> {
  if (!user.userId) {
    throw new Error("User userId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return null;
  }

  try {
    const values: InsertUser = {
      userId: user.userId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });

    return await getUserByUserId(user.userId);
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByUserId(userId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.userId, userId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Deprecated: kept for backward compatibility
export async function getUserByOpenId(openId: string) {
  console.warn("[Database] getUserByOpenId is deprecated, use getUserByUserId instead");
  return undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users);
}

/**
 * Configuration helpers
 */
export async function getConfigurationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(configurations).where(eq(configurations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserConfigurations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(configurations).where(eq(configurations.userId, userId));
}

export async function createConfiguration(config: InsertConfiguration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(configurations).values(config);
  return result;
}

export async function updateConfiguration(id: number, updates: Partial<InsertConfiguration>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(configurations).set(updates).where(eq(configurations.id, id));
}

/**
 * Order helpers
 */
export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(orders.createdAt);
}

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return result;
}

export async function updateOrderStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
}

/**
 * Pricing helpers
 */
export async function getPricingRules() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(pricingRules).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePricingRules(updates: Partial<InsertPricingRules>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getPricingRules();
  if (!existing) {
    return db.insert(pricingRules).values(updates as InsertPricingRules);
  }
  return db.update(pricingRules).set(updates).where(eq(pricingRules.id, existing.id));
}
