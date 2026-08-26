# Multi-stage Dockerfile for One Mustard Seed Frontend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Pass build-time environment variables
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}

# Copy source code and build
COPY . .
RUN npm run build

# Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production runtime dependencies
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm install vite --no-audit --no-fund

# Copy build artifacts
COPY --from=builder /app/dist ./dist
COPY vite.config.ts ./

# Expose port
EXPOSE 3000

# Start production preview server
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
