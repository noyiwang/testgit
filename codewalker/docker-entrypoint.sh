#!/bin/bash
set -e

if [ -n "$DB_HOST" ]; then
    cat > /app/.env << EOF
SERVER_PORT=8080
DB_HOST=${DB_HOST:-mysql}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-codewalker}
DB_PASSWORD=${DB_PASSWORD:-codewalker123}
DB_NAME=${DB_NAME:-codewalker}
DB_CHARSET=utf8mb4
EOF
fi

cd /app
./server &
BACKEND_PID=$!

nginx -g 'daemon off;' &
NGINX_PID=$!

trap "kill $BACKEND_PID $NGINX_PID" SIGTERM SIGINT

wait -n $BACKEND_PID $NGINX_PID
