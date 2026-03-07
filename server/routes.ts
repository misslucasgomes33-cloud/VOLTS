import type { Express } from "express";
import { type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { loginSchema, registerSchema } from "@shared/schema";

const connectedClients = new Map<string, Set<WebSocket>>();

function broadcastToRoom(room: string, data: any) {
  const clients = connectedClients.get(room);
  if (clients) {
    const message = JSON.stringify(data);
    clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
}

function broadcastOrderUpdate(order: any) {
  broadcastToRoom(`customer:${order.customerId}`, { type: "order_update", order });
  broadcastToRoom(`restaurant:${order.restaurantId}`, { type: "order_update", order });
  if (order.driverId) {
    broadcastToRoom(`driver:${order.driverId}`, { type: "order_update", order });
  }
  broadcastToRoom("admin", { type: "order_update", order });
  broadcastToRoom("drivers_available", { type: "new_delivery", order });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    let rooms: string[] = [];

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "join") {
          const room = msg.room;
          rooms.push(room);
          if (!connectedClients.has(room)) {
            connectedClients.set(room, new Set());
          }
          connectedClients.get(room)!.add(ws);
        }
      } catch {}
    });

    ws.on("close", () => {
      rooms.forEach(room => {
        connectedClients.get(room)?.delete(ws);
      });
    });
  });

  // AUTH
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.errors });
      }

      const existing = await storage.getUserByEmail(parsed.data.email);
      if (existing) {
        return res.status(409).json({ message: "E-mail já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
      const user = await storage.createUser({
        ...parsed.data,
        password: hashedPassword,
      });

      const { password, ...safeUser } = user;
      return res.status(201).json(safeUser);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
      }

      const user = await storage.getUserByEmail(parsed.data.email);
      if (!user) {
        return res.status(401).json({ message: "E-mail ou senha incorretos" });
      }

      const validPassword = await bcrypt.compare(parsed.data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "E-mail ou senha incorretos" });
      }

      const { password, ...safeUser } = user;
      return res.json(safeUser);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // USERS
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    const { password, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.patch("/api/users/:id", async (req, res) => {
    const user = await storage.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    const { password, ...safeUser } = user;
    return res.json(safeUser);
  });

  // RESTAURANTS
  app.get("/api/restaurants", async (req, res) => {
    const city = req.query.city as string | undefined;
    const restaurants = await storage.getRestaurants(city);
    return res.json(restaurants);
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    const restaurant = await storage.getRestaurant(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurante não encontrado" });
    return res.json(restaurant);
  });

  app.get("/api/restaurants/owner/:ownerId", async (req, res) => {
    const restaurant = await storage.getRestaurantByOwner(req.params.ownerId);
    if (!restaurant) return res.status(404).json({ message: "Restaurante não encontrado" });
    return res.json(restaurant);
  });

  app.post("/api/restaurants", async (req, res) => {
    try {
      const restaurant = await storage.createRestaurant(req.body);
      return res.status(201).json(restaurant);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/restaurants/:id", async (req, res) => {
    const restaurant = await storage.updateRestaurant(req.params.id, req.body);
    if (!restaurant) return res.status(404).json({ message: "Restaurante não encontrado" });
    return res.json(restaurant);
  });

  // MENU ITEMS
  app.get("/api/restaurants/:id/menu", async (req, res) => {
    const items = await storage.getMenuItems(req.params.id);
    return res.json(items);
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const item = await storage.createMenuItem(req.body);
      return res.status(201).json(item);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/menu-items/:id", async (req, res) => {
    const item = await storage.updateMenuItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: "Item não encontrado" });
    return res.json(item);
  });

  // ORDERS
  app.get("/api/orders", async (req, res) => {
    const filters: any = {};
    if (req.query.customerId) filters.customerId = req.query.customerId;
    if (req.query.restaurantId) filters.restaurantId = req.query.restaurantId;
    if (req.query.driverId) filters.driverId = req.query.driverId;
    if (req.query.status) filters.status = req.query.status;
    const ordersList = await storage.getOrders(filters);
    return res.json(ordersList);
  });

  app.get("/api/orders/:id", async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    if (!order) return res.status(404).json({ message: "Pedido não encontrado" });
    const items = await storage.getOrderItems(order.id);
    return res.json({ ...order, items });
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      const order = await storage.createOrder(orderData);

      if (items && Array.isArray(items)) {
        for (const item of items) {
          await storage.createOrderItem({
            orderId: order.id,
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          });
        }
      }

      broadcastOrderUpdate(order);
      return res.status(201).json(order);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status, driverId } = req.body;
      if (!status) return res.status(400).json({ message: "Status é obrigatório" });

      const order = await storage.updateOrderStatus(req.params.id, status, driverId);
      if (!order) return res.status(404).json({ message: "Pedido não encontrado" });

      if (status === "driver_assigned" && driverId) {
        const restaurant = await storage.getRestaurant(order.restaurantId);
        await storage.createDelivery({
          orderId: order.id,
          driverId,
          status: "driver_assigned",
          pickupLatitude: restaurant?.latitude || null,
          pickupLongitude: restaurant?.longitude || null,
          deliveryLatitude: order.deliveryLatitude,
          deliveryLongitude: order.deliveryLongitude,
          estimatedTime: "15-25 min",
        });
      }

      if (["on_the_way", "delivered"].includes(status)) {
        const delivery = await storage.getDelivery(order.id);
        if (delivery) {
          await storage.updateDelivery(delivery.id, { status: status as any });
        }
      }

      broadcastOrderUpdate(order);
      return res.json(order);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // DELIVERIES
  app.get("/api/deliveries/available", async (req, res) => {
    const city = req.query.city as string | undefined;
    const deliveries = await storage.getAvailableDeliveries(city);
    return res.json(deliveries);
  });

  app.get("/api/deliveries/:orderId", async (req, res) => {
    const delivery = await storage.getDelivery(req.params.orderId);
    if (!delivery) return res.status(404).json({ message: "Entrega não encontrada" });
    return res.json(delivery);
  });

  app.patch("/api/deliveries/:id/location", async (req, res) => {
    const { latitude, longitude } = req.body;
    const delivery = await storage.updateDelivery(req.params.id, {
      driverLatitude: latitude,
      driverLongitude: longitude,
    });
    if (!delivery) return res.status(404).json({ message: "Entrega não encontrada" });
    broadcastToRoom(`customer:${delivery.orderId}`, { type: "driver_location", latitude, longitude });
    return res.json(delivery);
  });

  // DRIVERS
  app.get("/api/drivers", async (req, res) => {
    const city = req.query.city as string | undefined;
    const online = req.query.online === "true";
    const drivers = await storage.getDrivers(city, online);
    const safeDrivers = drivers.map(({ password, ...d }) => d);
    return res.json(safeDrivers);
  });

  app.patch("/api/drivers/:id/online", async (req, res) => {
    const { isOnline } = req.body;
    const user = await storage.updateUser(req.params.id, { isOnline });
    if (!user) return res.status(404).json({ message: "Motorista não encontrado" });
    const { password, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.patch("/api/drivers/:id/location", async (req, res) => {
    const { latitude, longitude } = req.body;
    const user = await storage.updateUser(req.params.id, { latitude, longitude });
    if (!user) return res.status(404).json({ message: "Motorista não encontrado" });
    const { password, ...safeUser } = user;
    return res.json(safeUser);
  });

  // SEED DATA
  app.post("/api/seed", async (req, res) => {
    try {
      const existingAdmin = await storage.getUserByEmail("lucas@volts.com.br");
      if (existingAdmin) {
        return res.json({ message: "Dados já existem", seeded: false });
      }

      const adminPassword = await bcrypt.hash("admin123", 10);
      const admin = await storage.createUser({
        name: "Lucas",
        email: "lucas@volts.com.br",
        password: adminPassword,
        phone: "(65) 99999-0001",
        role: "admin",
        city: "Cuiabá",
      });

      const customerPassword = await bcrypt.hash("cliente123", 10);
      const customer = await storage.createUser({
        name: "Test Customer",
        email: "cliente@volts.com.br",
        password: customerPassword,
        phone: "(65) 99999-0002",
        role: "client",
        city: "Cuiabá",
        latitude: "-15.6014",
        longitude: "-56.0979",
      });

      const driverPassword = await bcrypt.hash("motoboy123", 10);
      const driver = await storage.createUser({
        name: "Admin Driver",
        email: "motoboy@volts.com.br",
        password: driverPassword,
        phone: "(65) 99999-0003",
        role: "driver",
        city: "Cuiabá",
        latitude: "-15.5989",
        longitude: "-56.0949",
        isOnline: true,
      });

      const partnerPassword = await bcrypt.hash("parceiro123", 10);
      const partner = await storage.createUser({
        name: "Dono Restaurante",
        email: "parceiro@volts.com.br",
        password: partnerPassword,
        phone: "(65) 99999-0004",
        role: "partner",
        city: "Cuiabá",
      });

      const managerPassword = await bcrypt.hash("gerencia123", 10);
      await storage.createUser({
        name: "Gerente VG",
        email: "gerencia@volts.com.br",
        password: managerPassword,
        phone: "(65) 99999-0005",
        role: "manager",
        city: "Várzea Grande",
      });

      const restaurant = await storage.createRestaurant({
        ownerId: partner.id,
        name: "Test Restaurant",
        description: "O melhor hambúrguer artesanal de Cuiabá",
        category: "Hamburgueria",
        address: "Av. do CPA, 1234 - Centro",
        city: "Cuiabá",
        latitude: "-15.5936",
        longitude: "-56.0968",
        isOpen: true,
        rating: "4.7",
        deliveryFee: "5.99",
        deliveryTime: "30-45 min",
      });

      await storage.createMenuItem({
        restaurantId: restaurant.id,
        name: "Smash Burger Clássico",
        description: "Pão brioche, 2x blend 90g, cheddar, bacon, alface e tomate",
        price: "29.90",
        category: "Burgers",
      });
      await storage.createMenuItem({
        restaurantId: restaurant.id,
        name: "Smash Burger Duplo",
        description: "Pão brioche, 3x blend 90g, cheddar duplo, bacon crocante",
        price: "39.90",
        category: "Burgers",
      });
      await storage.createMenuItem({
        restaurantId: restaurant.id,
        name: "Batata Frita Grande",
        description: "Porção de batata frita crocante com cheddar e bacon",
        price: "19.90",
        category: "Acompanhamentos",
      });
      await storage.createMenuItem({
        restaurantId: restaurant.id,
        name: "Coca-Cola 350ml",
        description: "Lata gelada",
        price: "6.00",
        category: "Bebidas",
      });
      await storage.createMenuItem({
        restaurantId: restaurant.id,
        name: "Milkshake Nutella",
        description: "Milkshake cremoso de Nutella com chantilly",
        price: "18.90",
        category: "Bebidas",
      });

      return res.json({
        message: "Dados de teste criados com sucesso!",
        seeded: true,
        accounts: {
          admin: { email: "lucas@volts.com.br", password: "admin123" },
          customer: { email: "cliente@volts.com.br", password: "cliente123" },
          driver: { email: "motoboy@volts.com.br", password: "motoboy123" },
          partner: { email: "parceiro@volts.com.br", password: "parceiro123" },
          manager: { email: "gerencia@volts.com.br", password: "gerencia123" },
        },
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
