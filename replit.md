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
- **Fonts:** Space Grotesk (display) + Inter (body)
- **Design:** Dark theme, primary yellow (#FFCC00 / HSL 54 100% 50%), bg #0a0a0a

## Database Schema (PostgreSQL + Drizzle)
- `users` — all user types (client, driver, partner, admin, manager)
- `restaurants` — restaurant/store info, linked to partner user
- `menuItems` — items per restaurant
- `orders` — customer orders with status tracking
- `orderItems` — line items per order
- `deliveries` — delivery assignments for drivers

## Auth System
- Real bcrypt auth via `/api/auth/login` and `/api/auth/register`
- `AuthProvider` context in `client/src/lib/auth.tsx`
- User stored in `localStorage('volts_user')`
- Admin role in `localStorage('admin_role')`, city in `localStorage('admin_city')`
- Role-based routing: client→/home, driver→/operacional/motorista, partner→/operacional/parceiro, admin/manager→/admin/dashboard

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
- WebSocket at `/ws` for real-time updates

## File Structure
- `shared/schema.ts` — Drizzle schema + Zod validation
- `server/routes.ts` — API routes
- `server/storage.ts` — Storage interface + Drizzle implementation
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
