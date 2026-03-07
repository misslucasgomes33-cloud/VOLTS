# VOLTS - Mobile Food Delivery App Ecosystem

## Overview
VOLTS is a food delivery platform for Cuiabá and Várzea Grande, Brazil. Three isolated apps:
1. **VOLTS Cliente** — Customer ordering app
2. **VOLTS Operacional** — Driver and restaurant partner dashboards
3. **VOLTS Gestão** — Admin app with ADM (Lucas, full access) and Gerência (city-scoped) roles

Owner: **Lucas**

## Tech Stack
- **Frontend:** React + TypeScript, Vite, Tailwind CSS v4, shadcn/ui, wouter (routing)
- **Backend:** Express.js + TypeScript, PostgreSQL + Drizzle ORM, bcrypt auth, WebSocket
- **Payments:** Mercado Pago API (PIX + Credit Card)
- **Fonts:** Space Grotesk (display) + Inter (body)
- **Design:** Dark theme, primary yellow (#FFCC00 / HSL 54 100% 50%), bg #0a0a0a

## Database Schema (PostgreSQL + Drizzle)
- `users` — all user types (client, driver, partner, admin, manager)
- `restaurants` — restaurant/store info, linked to partner user
- `menuItems` — items per restaurant
- `orders` — customer orders with status tracking
- `orderItems` — line items per order
- `deliveries` — delivery assignments for drivers
- `subscriptions` — restaurant subscription plans (free/premium/pro) with expiration
- `transactions` — all payment transactions (PIX/card), linked to Mercado Pago

## Auth System
- Real bcrypt auth via `/api/auth/login` and `/api/auth/register`
- `AuthProvider` context in `client/src/lib/auth.tsx`
- User stored in `localStorage('volts_user')`
- Admin role in `localStorage('admin_role')`, city in `localStorage('admin_city')`
- Role-based routing: client→/home, driver→/operacional/motorista, partner→/operacional/parceiro, admin/manager→/admin/dashboard

## Mercado Pago Integration
- **Env var:** `MERCADO_PAGO_ACCESS_TOKEN` — set in Secrets
- **Service:** `server/mercadopago.ts` — PIX and card payment creation, payment status queries
- **Webhook:** `POST /api/webhooks/mercadopago` — auto-updates payment status on callback
- **Subscription payments:** Partners pay for Premium (R$49.99/mo) or PRO (R$109.99/mo) plans
- **Order payments:** Customers pay for orders via PIX or credit card
- **Simulate mode:** `POST /api/payments/simulate-approve` — for testing without real payments
- When payment is approved: subscriptions activate (30 days), orders move to "accepted"

## Partner Plans
| Plan | Monthly | Tax per order |
|------|---------|---------------|
| PRO | R$ 109,99 | 10% |
| PREMIUM | R$ 49,99 | 13% |
| Básico | Grátis | 15% |

## Test Credentials
- Admin: `lucas@volts.com.br` / `admin123`
- Customer: `cliente@volts.com.br` / `cliente123`
- Driver: `motoboy@volts.com.br` / `motoboy123`
- Partner: `parceiro@volts.com.br` / `parceiro123`
- Manager: `gerencia@volts.com.br` / `gerencia123`

## Key API Endpoints
- `POST /api/auth/login` — Login with email/password
- `POST /api/auth/register` — Register new user
- `POST /api/seed` — Seed test data (idempotent)
- `GET /api/restaurants` — List restaurants
- `GET /api/orders?customerId=X` — User's orders
- `POST /api/orders` — Create order
- `PATCH /api/orders/:id/status` — Update order status
- `GET /api/deliveries/driver/:driverId` — Driver's deliveries
- `POST /api/payments/subscription` — Create subscription payment
- `POST /api/payments/order` — Create order payment
- `POST /api/payments/card` — Process card payment with token
- `POST /api/webhooks/mercadopago` — Webhook for payment notifications
- `GET /api/subscriptions/:restaurantId` — Get active subscription
- `GET /api/transactions` — List transactions
- WebSocket at `/ws` for real-time updates

## File Structure
- `shared/schema.ts` — Drizzle schema + Zod validation
- `server/routes.ts` — API routes
- `server/storage.ts` — Storage interface + Drizzle implementation
- `server/mercadopago.ts` — Mercado Pago API service
- `client/src/lib/auth.tsx` — Auth context provider
- `client/src/lib/websocket.ts` — WebSocket hook
- `client/src/pages/` — All page components
- `client/src/assets/videos/` — promo-volts.mp4, partner-promo.mp4, driver-promo.mp4

## Key Libraries
- `qrcode.react` — QR code generation (admin dashboard)
- `recharts` — Financial charts (admin dashboard)
- `leaflet` / `react-leaflet` — Maps

## Admin Dashboard Tabs
`ai`, `orders`, `financial`(adm only), `qr`(adm only), `capacity`, `support`, `logs`(adm only), `map`

## Guardian AI
Built-in AI assistant in admin dashboard with 10+ response categories (strategy, competition, financial, clients, marketing, region/map, team, bugs) addressing Lucas as "Senhor Lucas".
