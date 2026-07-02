#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/build"
BACKEND_DIR="$PROJECT_ROOT/backend"

echo "========================================="
echo "  CodeWalker 生产环境启动"
echo "========================================="

if [ ! -f "$BUILD_DIR/server" ]; then
    echo "❌ 错误: 未找到构建产物 $BUILD_DIR/server"
    echo "   请先运行 ./scripts/build.sh 进行打包"
    exit 1
fi

cd "$BUILD_DIR"

if [ ! -f ".env" ]; then
    echo "⚙️  创建环境配置..."
    cp .env.example .env
    echo "✅ 已创建 .env，请检查数据库配置"
fi

echo ""
echo "🔧 检查数据库连接..."
DB_HOST=$(grep DB_HOST .env | cut -d= -f2)
DB_PORT=$(grep DB_PORT .env | cut -d= -f2)
if ! nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
    echo "❌ 错误: 无法连接到 MySQL ($DB_HOST:$DB_PORT)"
    echo "   请确保 MySQL 已启动并可访问"
    exit 1
fi
echo "✅ 数据库连接正常"

echo ""
echo "🚀 启动后端服务..."
chmod +x ./server
./server
