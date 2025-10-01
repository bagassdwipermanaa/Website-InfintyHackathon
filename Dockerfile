# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy server files
COPY --from=builder /app/server ./server
COPY --from=builder /app/node_modules ./node_modules

# Create uploads directory
RUN mkdir -p uploads/artworks uploads/avatars uploads/certificates
RUN chown -R nextjs:nodejs uploads

USER nextjs

EXPOSE 3000
EXPOSE 5000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start both frontend and backend
CMD ["sh", "-c", "cd server && npm start & cd .. && npm start"]
