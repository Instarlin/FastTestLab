#!/bin/sh

npm run prisma:push
npm run prisma:prod
exec "$@"