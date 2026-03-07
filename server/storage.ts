import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, restaurants, menuItems, orders, orderItems, deliveries,
  subscriptions, transactions,
  type User, type InsertUser,
  type Restaurant, type InsertRestaurant,
  type MenuItem, type InsertMenuItem,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Delivery, type InsertDelivery,
  type Subscription, type InsertSubscription,
  type Transaction, type InsertTransaction,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  getRestaurants(city?: string): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getRestaurantByOwner(ownerId: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant | undefined>;

  getMenuItems(restaurantId: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem | undefined>;

  getOrders(filters?: { customerId?: string; restaurantId?: string; driverId?: string; status?: string }): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string, driverId?: string): Promise<Order | undefined>;

  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  getDelivery(orderId: string): Promise<Delivery | undefined>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDelivery(id: string, data: Partial<Delivery>): Promise<Delivery | undefined>;
  getAvailableDeliveries(city?: string): Promise<any[]>;

  getDrivers(city?: string, online?: boolean): Promise<User[]>;

  getSubscription(restaurantId: string): Promise<Subscription | undefined>;
  getSubscriptionById(id: string): Promise<Subscription | undefined>;
  createSubscription(sub: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription | undefined>;

  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionByMercadoPagoId(mpId: string): Promise<Transaction | undefined>;
  getTransactionByReference(refId: string): Promise<Transaction | undefined>;
  getTransactions(filters?: { userId?: string; type?: string }): Promise<Transaction[]>;
  createTransaction(tx: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async getRestaurants(city?: string): Promise<Restaurant[]> {
    if (city && city !== "Global") {
      return db.select().from(restaurants).where(eq(restaurants.city, city));
    }
    return db.select().from(restaurants);
  }

  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant;
  }

  async getRestaurantByOwner(ownerId: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.ownerId, ownerId));
    return restaurant;
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [r] = await db.insert(restaurants).values(restaurant).returning();
    return r;
  }

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant | undefined> {
    const [r] = await db.update(restaurants).set(data).where(eq(restaurants.id, id)).returning();
    return r;
  }

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [mi] = await db.insert(menuItems).values(item).returning();
    return mi;
  }

  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const [mi] = await db.update(menuItems).set(data).where(eq(menuItems.id, id)).returning();
    return mi;
  }

  async getOrders(filters?: { customerId?: string; restaurantId?: string; driverId?: string; status?: string }): Promise<Order[]> {
    const conditions = [];
    if (filters?.customerId) conditions.push(eq(orders.customerId, filters.customerId));
    if (filters?.restaurantId) conditions.push(eq(orders.restaurantId, filters.restaurantId));
    if (filters?.driverId) conditions.push(eq(orders.driverId, filters.driverId));
    if (filters?.status) conditions.push(eq(orders.status, filters.status as any));

    if (conditions.length > 0) {
      return db.select().from(orders).where(and(...conditions)).orderBy(desc(orders.createdAt));
    }
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [o] = await db.insert(orders).values(order).returning();
    return o;
  }

  async updateOrderStatus(id: string, status: string, driverId?: string): Promise<Order | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (driverId) updateData.driverId = driverId;
    const [o] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return o;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [oi] = await db.insert(orderItems).values(item).returning();
    return oi;
  }

  async getDelivery(orderId: string): Promise<Delivery | undefined> {
    const [d] = await db.select().from(deliveries).where(eq(deliveries.orderId, orderId));
    return d;
  }

  async createDelivery(delivery: InsertDelivery): Promise<Delivery> {
    const [d] = await db.insert(deliveries).values(delivery).returning();
    return d;
  }

  async updateDelivery(id: string, data: Partial<Delivery>): Promise<Delivery | undefined> {
    const updateData = { ...data, updatedAt: new Date() };
    const [d] = await db.update(deliveries).set(updateData).where(eq(deliveries.id, id)).returning();
    return d;
  }

  async getAvailableDeliveries(city?: string): Promise<any[]> {
    const result = await db
      .select({
        order: orders,
        restaurant: restaurants,
      })
      .from(orders)
      .innerJoin(restaurants, eq(orders.restaurantId, restaurants.id))
      .where(eq(orders.status, "ready_for_pickup"))
      .orderBy(desc(orders.createdAt));

    if (city && city !== "Global") {
      return result.filter(r => r.restaurant.city === city);
    }
    return result;
  }

  async getDrivers(city?: string, online?: boolean): Promise<User[]> {
    const conditions = [eq(users.role, "driver")];
    if (online) conditions.push(eq(users.isOnline, true));
    if (city && city !== "Global") conditions.push(eq(users.city, city));
    return db.select().from(users).where(and(...conditions));
  }

  async getSubscription(restaurantId: string): Promise<Subscription | undefined> {
    const [sub] = await db.select().from(subscriptions)
      .where(and(eq(subscriptions.restaurantId, restaurantId), eq(subscriptions.active, true)))
      .orderBy(desc(subscriptions.createdAt));
    return sub;
  }

  async getSubscriptionById(id: string): Promise<Subscription | undefined> {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return sub;
  }

  async createSubscription(sub: InsertSubscription): Promise<Subscription> {
    const [s] = await db.insert(subscriptions).values(sub).returning();
    return s;
  }

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription | undefined> {
    const [s] = await db.update(subscriptions).set(data).where(eq(subscriptions.id, id)).returning();
    return s;
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [tx] = await db.select().from(transactions).where(eq(transactions.id, id));
    return tx;
  }

  async getTransactionByMercadoPagoId(mpId: string): Promise<Transaction | undefined> {
    const [tx] = await db.select().from(transactions).where(eq(transactions.mercadoPagoId, mpId));
    return tx;
  }

  async getTransactionByReference(refId: string): Promise<Transaction | undefined> {
    const [tx] = await db.select().from(transactions).where(eq(transactions.referenceId, refId));
    return tx;
  }

  async getTransactions(filters?: { userId?: string; type?: string }): Promise<Transaction[]> {
    const conditions = [];
    if (filters?.userId) conditions.push(eq(transactions.userId, filters.userId));
    if (filters?.type) conditions.push(eq(transactions.type, filters.type));
    if (conditions.length > 0) {
      return db.select().from(transactions).where(and(...conditions)).orderBy(desc(transactions.createdAt));
    }
    return db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(tx: InsertTransaction): Promise<Transaction> {
    const [t] = await db.insert(transactions).values(tx).returning();
    return t;
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction | undefined> {
    const [t] = await db.update(transactions).set(data).where(eq(transactions.id, id)).returning();
    return t;
  }
}

export const storage = new DatabaseStorage();
