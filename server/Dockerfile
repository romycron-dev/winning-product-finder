# syntax=docker/dockerfile:1
FROM node:18-bullseye AS deps
WORKDIR /app

COPY package.json ./
COPY server/package.json ./server/package.json
COPY web/package.json ./web/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm install

FROM node:18-bullseye AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate --workspace @winning-product-finder/server

FROM node:18-bullseye-slim AS production
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server ./server
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=deps /app/node_modules ./node_modules

RUN npm prune --omit=dev

EXPOSE 4000
CMD ["node", "server/src/index.js"]

