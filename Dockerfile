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

# Production Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install all dependencies needed for vite preview
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy build artifacts, source tree, public assets & configs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY vite.config.ts tsconfig.json ./

ENV NODE_ENV=production

EXPOSE 3000

# Start production preview server on port 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
