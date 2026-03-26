import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Unique user identifier (can be from any auth provider) */
  userId: varchar("userId", { length: 255 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cabinet configurations - stores customer's cabinet design specifications
 */
export const configurations = mysqlTable("configurations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  // Dimensions in cm
  width: int("width").notNull(), // breedte
  height: int("height").notNull(), // hoogte
  depth: int("depth").notNull(), // diepte
  // Structure options
  numberOfCompartments: int("numberOfCompartments").notNull().default(1), // aantal vakken
  numberOfShelves: int("numberOfShelves").notNull().default(2), // aantal legplanken per vak
  numberOfDoors: int("numberOfDoors").notNull().default(1),
  numberOfDrawers: int("numberOfDrawers").notNull().default(0),
  hasClothingRail: int("hasClothingRail").notNull().default(0), // 0 or 1 for boolean
  // Material and finish
  material: varchar("material", { length: 100 }).notNull().default("white_melamine"), // white_melamine, oak_decor, black_decor
  // Pricing
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  // JSON storage for detailed configuration data
  configData: json("configData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Configuration = typeof configurations.$inferSelect;
export type InsertConfiguration = typeof configurations.$inferInsert;

/**
 * Orders - customer orders for cabinet configurations
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  configurationId: int("configurationId").notNull(),
  // Customer info (for guest orders)
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  // Order details
  status: mysqlEnum("status", ["pending", "confirmed", "in_production", "completed", "cancelled"]).default("pending").notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  // Stored configuration snapshot
  configSnapshot: json("configSnapshot").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Pricing rules - material prices and additional costs
 */
export const pricingRules = mysqlTable("pricingRules", {
  id: int("id").autoincrement().primaryKey(),
  // Material pricing (per m²)
  whiteMelaminePrice: decimal("whiteMelaminePrice", { precision: 10, scale: 2 }).notNull().default("25.00"),
  oakDecorPrice: decimal("oakDecorPrice", { precision: 10, scale: 2 }).notNull().default("35.00"),
  blackDecorPrice: decimal("blackDecorPrice", { precision: 10, scale: 2 }).notNull().default("30.00"),
  // Additional costs
  pricePerShelf: decimal("pricePerShelf", { precision: 10, scale: 2 }).notNull().default("5.00"),
  pricePerDrawer: decimal("pricePerDrawer", { precision: 10, scale: 2 }).notNull().default("15.00"),
  pricePerDoor: decimal("pricePerDoor", { precision: 10, scale: 2 }).notNull().default("20.00"),
  clothingRailPrice: decimal("clothingRailPrice", { precision: 10, scale: 2 }).notNull().default("10.00"),
  hardwarePrice: decimal("hardwarePrice", { precision: 10, scale: 2 }).notNull().default("15.00"),
  installationPrice: decimal("installationPrice", { precision: 10, scale: 2 }).notNull().default("50.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PricingRules = typeof pricingRules.$inferSelect;
export type InsertPricingRules = typeof pricingRules.$inferInsert;