# syntax=docker/dockerfile:1
FROM node:18-bullseye AS builder
WORKDIR /app

COPY package.json ./
COPY server/package.json ./server/package.json
COPY web/package.json ./web/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm install

COPY . .
RUN npm run build --workspace @winning-product-finder/web

FROM node:18-bullseye-slim AS production
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/web/package.json ./web/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/web/.next ./web/.next
COPY --from=builder /app/web/public ./web/public
COPY --from=builder /app/packages/shared ./packages/shared

RUN npm prune --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start", "--workspace", "@winning-product-finder/web"]

