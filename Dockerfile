# Install deps separately for cache efficiency
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./ 
RUN npm install --frozen-lockfile

# Copy source code
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables at build-time only (optional)
ENV NODE_ENV=production

# Build Next.js app
RUN --mount=type=secret,id=dotenv,target=/app/.env npm run build

# Final image to serve
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
