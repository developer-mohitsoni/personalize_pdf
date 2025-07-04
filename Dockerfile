# Specify Node.js version (can be overridden at build time)
ARG VERSION=lts

# Base image
FROM node:${VERSION}-alpine AS base
WORKDIR /app

RUN apk add --no-cache curl

# Install only required system packages
RUN apk add --no-cache ca-certificates

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Install only production dependencies for caching
COPY package*.json ./
RUN npm ci --omit=dev

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy all files and install full dependencies
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
COPY . .
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
RUN npm ci

# Build Next.js project
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Final runtime image
FROM base AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup --system nonroot && adduser --system --ingroup nonroot nonroot

# Copy only required files from builder
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

USER nonroot:nonroot

# Env and expose
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]