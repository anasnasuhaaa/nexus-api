# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat openssl


FROM base AS deps

COPY package.json package-lock.json ./
COPY apps/nexus/package.json ./apps/nexus/package.json
COPY packages/database/package.json ./packages/database/package.json

RUN npm ci


FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL="postgresql://nexus:change_me_database_password@postgres:5432/nexus_prod?schema=public"
ARG NEXT_PUBLIC_APP_URL="http://localhost:3000"
ARG NEXT_PUBLIC_TEVO_URL="http://localhost:3001"

ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_TEVO_URL=$NEXT_PUBLIC_TEVO_URL
ENV BETTER_AUTH_URL=$NEXT_PUBLIC_APP_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate --schema packages/database/prisma/schema.prisma
RUN BETTER_AUTH_SECRET=build_only_placeholder_change_at_runtime_1234567890 \
  npm run build:nexus


FROM base AS migrator

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json prisma.config.ts ./
COPY packages/database/package.json ./packages/database/package.json
COPY packages/database/prisma ./packages/database/prisma


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat openssl \
  && addgroup -S nodejs \
  && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus/.next/static ./apps/nexus/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus/public ./apps/nexus/public

RUN mkdir -p /app/apps/nexus/public/uploads/media \
  && chown -R nextjs:nodejs /app/apps/nexus/public/uploads

USER nextjs

EXPOSE 3000

CMD ["node", "apps/nexus/server.js"]
