#!/bin/sh
set -e

if [ "${NODE_ENV}" = "development" ] || [ "${NODE_ENV}" = "dev" ]; then
  npx prisma db push
  exec npm run dev
else
  npx prisma migrate deploy
  npx prisma db push
  exec npm run start
fi