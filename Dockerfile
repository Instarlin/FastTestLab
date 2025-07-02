FROM node:24-alpine AS builder
WORKDIR /usr/src/app

ARG SESSION_SECRET
ARG ENCRYPTION_SECRET

ENV SESSION_SECRET=${SESSION_SECRET}
ENV ENCRYPTION_SECRET=${ENCRYPTION_SECRET}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

COPY package.json package-lock.json entrypoint.sh ./
RUN if [ "$NODE_ENV" = "dev" ]; then npm ci; else npm ci --omit=dev; fi

COPY --from=builder   /usr/src/app/build                 ./build
COPY --from=builder   /usr/src/app/prisma                ./prisma
COPY --from=builder   /usr/src/app/public                ./public
COPY --from=builder   /usr/src/app/node_modules/prisma   ./node_modules/prisma
COPY --from=builder   /usr/src/app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder   /usr/src/app/node_modules/@prisma  ./node_modules/@prisma

EXPOSE 3000
