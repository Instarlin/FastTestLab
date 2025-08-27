FROM node:lts-alpine AS builder
WORKDIR /app

ARG SESSION_SECRET
ARG ENCRYPTION_SECRET

ENV SESSION_SECRET=${SESSION_SECRET}
ENV ENCRYPTION_SECRET=${ENCRYPTION_SECRET}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:lts-alpine AS runner
WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

COPY package.json package-lock.json entrypoint.sh ./
RUN if [ "$NODE_ENV" = "dev" ]; then npm ci; else npm ci --omit=dev; fi

COPY --from=builder   /app/build                 ./build
COPY --from=builder   /app/prisma                ./prisma
COPY --from=builder   /app/public                ./public
COPY --from=builder   /app/node_modules/prisma   ./node_modules/prisma
COPY --from=builder   /app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder   /app/node_modules/@prisma  ./node_modules/@prisma

RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

CMD ["npm", "run", "start"]