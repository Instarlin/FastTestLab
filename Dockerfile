FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder   /app/build             ./build
COPY --from=builder   /app/node_modules      ./node_modules
COPY --from=builder   /app/prisma            ./prisma
COPY --from=builder   /app/public            ./public