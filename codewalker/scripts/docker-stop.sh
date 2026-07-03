#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "========================================="
echo "  CodeWalker Docker Compose 停止"
echo "========================================="

cd "$PROJECT_ROOT"

echo "🛑 停止所有服务..."
if docker compose version &> /dev/null; then
    docker compose down
else
    docker-compose down
fi

echo ""
echo "✅ 所有服务已停止"
echo ""
echo "💡 提示: 如果需要清除数据卷(数据库数据)，运行:"
echo "  cd $PROJECT_ROOT && docker compose down -v"
echo "========================================="
