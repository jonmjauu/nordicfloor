import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  dimensions: varchar("dimensions", { length: 120 }).notNull(),
  sqmPerPackage: numeric("sqm_per_package", { precision: 8, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  customerEmail: varchar("customer_email", { length: 200 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
  address: text("address").notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  country: varchar("country", { length: 120 }).notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull().default(0),
  total: integer("total").notNull(),
  paymentProvider: varchar("payment_provider", { length: 40 }).notNull().default("stripe"),
  stripeSessionId: varchar("stripe_session_id", { length: 200 }),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 200 }),
  stripePaymentId: varchar("stripe_payment_id", { length: 200 }),
  statusHistory: jsonb("status_history").$type<{ status: string; at: string; note: string }[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  productName: varchar("product_name", { length: 200 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  lineTotal: integer("line_total").notNull()
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  orderItems: many(orderItems)
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type NewOrder = typeof orders.$inferInsert;
export type NewOrderItem = typeof orderItems.$inferInsert;
