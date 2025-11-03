# Winning Product Finder

Winning Product Finder is a full-stack monorepo that helps Indian e-commerce sellers discover high-profit, low-competition opportunities across Amazon, Flipkart, and Meesho. The project ships with a Fastify + Prisma API, a Next.js 14 web app, and shared utilities packaged with npm workspaces — all written in modern JavaScript (no TypeScript required).

## Prerequisites

- Node.js 18+
- npm 9+
- Docker & Docker Compose
- PostgreSQL (local or Docker)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Copy environment templates**
   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   cp web/.env.example web/.env.local
   ```
3. **Start PostgreSQL** (Docker)
   ```bash
   docker compose up -d db
   ```
4. **Generate Prisma client & run migrations**
   ```bash
   npm run prisma:generate --workspace @winning-product-finder/server
   npm run prisma:migrate --workspace @winning-product-finder/server
   npm run seed --workspace @winning-product-finder/server
   ```
5. **Run the stack in development**
   ```bash
   npm run dev:server --workspace @winning-product-finder/server
   npm run dev --workspace @winning-product-finder/web
   ```
   The web app runs on `http://localhost:3000` and proxies API calls to `http://localhost:4000`.

## Amazon PA-API setup

1. Apply for [Amazon Product Advertising API](https://affiliate-program.amazon.in/assoc_credentials/home) access with an Indian marketplace associate account.
2. Create security credentials (Access Key & Secret Key) in the PA-API console.
3. Set your Partner Tag (Associate Tag) and ensure the host is `webservices.amazon.in` with region `eu-west-1`.
4. Update `server/.env` with:
   ```env
   AMAZON_PAAPI_ACCESS_KEY=...
   AMAZON_PAAPI_SECRET_KEY=...
   AMAZON_PAAPI_PARTNER_TAG=yourtag-21
   AMAZON_PAAPI_HOST=webservices.amazon.in
   AMAZON_PAAPI_REGION=eu-west-1
   ```

Without valid credentials the Amazon adapter safely skips live calls.

## First Search Demo

Once both server and web apps are running:

1. Visit `http://localhost:3000`.
2. Enter **"baby thermal"** in the search box.
3. Pick your target marketplaces, tweak filters, and click **Search**.
4. Explore opportunity scores, export CSV, and generate AI-powered keyword suggestions per product.

## Project Structure

```
packages/shared   // Reusable types & helpers
server            // Fastify API, Prisma, adapters
web               // Next.js 14 front-end (App Router)
```

Additional tooling includes Docker Compose for local orchestration, GitHub Actions CI (lint/build), and Prettier/ESLint configuration shared across workspaces.

