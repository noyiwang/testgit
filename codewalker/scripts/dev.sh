#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"

echo "========================================="
echo "  CodeWalker 开发环境启动"
echo "========================================="

check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "❌ 错误: 未找到 $1，请先安装"
        exit 1
    fi
}

check_command node
check_command npm
check_command go

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo "✅ Go: $(go version | awk '{print $3}')"

cd "$PROJECT_ROOT"
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 安装前端依赖..."
    npm install
fi

if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo ""
    echo "⚙️  创建后端环境配置..."
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    echo "✅ 已创建 $BACKEND_DIR/.env，请根据需要修改数据库配置"
fi

echo ""
echo "🔧 检查数据库连接..."
DB_HOST=$(grep DB_HOST "$BACKEND_DIR/.env" | cut -d= -f2)
DB_PORT=$(grep DB_PORT "$BACKEND_DIR/.env" | cut -d= -f2)
if ! nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
    echo "⚠️  警告: 无法连接到 MySQL ($DB_HOST:$DB_PORT)"
    echo "   请确保 MySQL 已启动并可访问，或使用 Docker 启动数据库:"
    echo "   cd $PROJECT_ROOT && docker-compose up -d mysql"
    echo ""
fi

cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true
    wait 2>/dev/null
    echo "👋 服务已停止"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo ""
echo "🚀 启动后端服务 (端口: 8080)..."
cd "$BACKEND_DIR"
go run ./cmd/server &
BACKEND_PID=$!

sleep 2

echo ""
echo "🚀 启动前端开发服务器 (端口: 5173)..."
cd "$PROJECT_ROOT"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================="
echo "  ✅ 开发环境启动完成!"
echo "========================================="
echo "  前端: http://localhost:5173"
echo "  后端 API: http://localhost:8080/api/v1"
echo "  管理后台: http://localhost:5173/admin/login"
echo "========================================="
echo "  按 Ctrl+C 停止所有服务"
echo "========================================="

wait
