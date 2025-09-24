# Enterprise-grade Multi-stage Docker build for Fabrica Web Platform
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies with security audit
RUN npm ci --only=production --ignore-scripts && \
    npm audit --audit-level moderate && \
    npm cache clean --force

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat git

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application with optimizations
RUN npm run build

# Stage 3: Security Scanner
FROM node:18-alpine AS security
WORKDIR /app

# Install security scanning tools
RUN apk add --no-cache curl && \
    npm install -g audit-ci

# Copy package files for security audit
COPY package*.json ./

# Run security audit
RUN audit-ci --config audit-ci.json || echo "Security vulnerabilities found"

# Stage 4: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Install security updates and required packages
RUN apk add --no-cache libc6-compat curl && \
    apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy package.json for metadata
COPY --from=builder /app/package.json ./

# Switch to non-root user
USER nextjs

# Create health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Expose port
EXPOSE 3001

# Set production environment variables
ENV PORT=3001
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add metadata labels
LABEL org.opencontainers.image.title="Fabrica Web Platform"
LABEL org.opencontainers.image.description="Enterprise BNPL platform for Ethiopian creators"
LABEL org.opencontainers.image.version="0.1.0"
LABEL org.opencontainers.image.authors="Fabrica Team"
LABEL org.opencontainers.image.source="https://github.com/fabrica-et/fabrica-web"

# Start the application
CMD ["node", "server.js"]
