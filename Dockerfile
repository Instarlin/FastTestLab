ARG SESSION_SECRET
ARG ENCRYPTION_SECRET

ENV SESSION_SECRET=${SESSION_SECRET}
ENV ENCRYPTION_SECRET=${ENCRYPTION_SECRET}

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder   /app/build             ./build
COPY --from=builder   /app/node_modules      ./node_modules
COPY --from=builder   /app/prisma            ./prisma
COPY --from=builder   /app/public            ./public

EXPOSE 3000