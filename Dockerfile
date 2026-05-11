FROM node:20-bookworm-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
WORKDIR /app
ARG NPM_REGISTRY=https://registry.npmmirror.com
COPY package.json package-lock.json ./
RUN npm config set registry ${NPM_REGISTRY} && npm ci

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=6 \
  CMD node -e "fetch('http://127.0.0.1:3000').then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
