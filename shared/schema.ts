import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["client", "driver", "partner", "admin", "manager"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending", "accepted", "preparing", "ready_for_pickup",
  "driver_assigned", "on_the_way", "delivered", "cancelled"
]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  role: userRoleEnum("role").notNull().default("client"),
  city: text("city").default("Cuiabá"),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  isOnline: boolean("is_online").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const restaurants = pgTable("restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").default("Restaurante"),
  address: text("address"),
  city: text("city").default("Cuiabá"),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  isOpen: boolean("is_open").default(true),
  rating: decimal("rating").default("4.5"),
  deliveryFee: decimal("delivery_fee").default("5.99"),
  deliveryTime: text("delivery_time").default("30-45 min"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price").notNull(),
  category: text("category").default("Principal"),
  imageUrl: text("image_url"),
  available: boolean("available").default(true),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id).notNull(),
  driverId: varchar("driver_id").references(() => users.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  total: decimal("total").notNull(),
  deliveryFee: decimal("delivery_fee").default("5.99"),
  deliveryAddress: text("delivery_address"),
  deliveryLatitude: decimal("delivery_latitude"),
  deliveryLongitude: decimal("delivery_longitude"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  menuItemId: varchar("menu_item_id").references(() => menuItems.id),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price").notNull(),
});

export const deliveries = pgTable("deliveries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  driverId: varchar("driver_id").references(() => users.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  pickupLatitude: decimal("pickup_latitude"),
  pickupLongitude: decimal("pickup_longitude"),
  deliveryLatitude: decimal("delivery_latitude"),
  deliveryLongitude: decimal("delivery_longitude"),
  driverLatitude: decimal("driver_latitude"),
  driverLongitude: decimal("driver_longitude"),
  estimatedTime: text("estimated_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertRestaurantSchema = createInsertSchema(restaurants).omit({ id: true, createdAt: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertDeliverySchema = createInsertSchema(deliveries).omit({ id: true, createdAt: true, updatedAt: true });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
  phone: z.string().optional(),
  role: z.enum(["client", "driver", "partner", "admin", "manager"]).default("client"),
  city: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type Delivery = typeof deliveries.$inferSelect;
