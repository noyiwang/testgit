FROM node:20-bookworm-slim AS frontend-builder

WORKDIR /app/frontend

COPY package*.json ./
RUN npm ci

COPY index.html ./
COPY public/ ./public/
COPY src/ ./src/
COPY tailwind.config.js postcss.config.js vite.config.js ./
RUN npm run build

FROM golang:1.25-bookworm AS backend-builder

WORKDIR /app/backend

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./cmd/server

FROM nginx:1.27-bookworm AS production

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend-builder /app/backend/server /app/server
COPY --from=backend-builder /app/backend/.env.example /app/.env

COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /sbin/nologin appuser && \
    mkdir -p /app/uploads && \
    chown -R appuser:appuser /app && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/cache/nginx /var/run /var/log/nginx

EXPOSE 80

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/api/v1/health || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
