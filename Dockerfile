# ---------- Base Stage ----------
FROM node:20-alpine AS base
WORKDIR /app

# Removed: ENV NODE_ENV=production (move to runner stage)
RUN apk add --no-cache libc6-compat

# ---------- Dependencies Stage ----------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Build Stage ----------
FROM base AS builder

COPY . .

# Make sure this includes tsconfig.json/jsconfig.json
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# ---------- Production Runner Stage ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]