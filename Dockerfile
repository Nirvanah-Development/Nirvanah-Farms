FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm cache clean --force
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

# Sanity CMS Configuration
ENV NEXT_PUBLIC_SANITY_DATASET=production
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=v4yhiqrv
ENV NEXT_PUBLIC_SANITY_API_VERSION=2025-03-20
ENV SANITY_API_READ_TOKEN=skqkwhVSkDydD6aI0PY3ZmGhhN1TxdaA0TVXxueSa6Ydx41FSWYkKTHwjkxwaDbE1dWK8yNwyERbaTzXNZZdKVCyHlxtjj6Z9wpyjud7JgUjlZh2QG1cI05Sc2NuTvove8iPqFjvn0DUMPrU4QLTXVfdTxy6B4S1wVLDkonil224cHTVioCQ

# Email Configuration (Resend)
ENV RESEND_API_KEY=re_cuukGdp8_95LHuu4FTPynwMmF4fTDNPFa
ENV EMAIL_FROM="nirvanah550@gmail.com"

# SMTP Fallback Configuration
ENV SMTP_HOST=smtp.gmail.com
ENV SMTP_PORT=587
ENV SMTP_USER=nirvanah550@gmail.com
ENV SMTP_PASS="jwjy codd usof syii"

# App Configuration
ENV NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clerk Authentication (if needed)
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_b25lLW1hY2tlcmVsLTY4LmNsZXJrLmFjY291bnRzLmRldiQ
ENV CLERK_SECRET_KEY=sk_test_uubYDrwsxBlsjXLq4ZVwedHXjnX6kpq3bJBc4dn6rk

# Build the application with increased memory and timeout
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"] 