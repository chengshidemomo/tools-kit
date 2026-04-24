# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (use bun lockfile if present, else npm)
COPY package.json package-lock.json* bun.lockb* bun.lock* ./

RUN if [ -f bun.lockb ] || [ -f bun.lock ]; then \
      npm install -g bun && bun install --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Copy source and build
COPY . .
RUN if [ -f bun.lockb ] || [ -f bun.lock ]; then bun run build; else npm run build; fi

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runner

# SPA-friendly nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Run as non-root for K8s security best practices
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
