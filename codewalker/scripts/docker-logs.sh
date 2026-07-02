#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

SERVICE=$1

if [ -z "$SERVICE" ]; then
    echo "📋 查看所有服务日志 (按 Ctrl+C 退出)..."
    echo ""
    if docker compose version &> /dev/null; then
        docker compose logs -f --tail=100
    else
        docker-compose logs -f --tail=100
    fi
else
    echo "📋 查看 $SERVICE 服务日志 (按 Ctrl+C 退出)..."
    echo ""
    if docker compose version &> /dev/null; then
        docker compose logs -f --tail=100 "$SERVICE"
    else
        docker-compose logs -f --tail=100 "$SERVICE"
    fi
fi
