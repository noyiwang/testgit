#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "========================================="
echo "  CodeWalker Docker Compose 启动"
echo "========================================="

check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "❌ 错误: 未找到 $1，请先安装 Docker"
        exit 1
    fi
}

check_command docker

if ! docker compose version &> /dev/null && ! docker-compose version &> /dev/null; then
    echo "❌ 错误: 未找到 docker compose，请先安装 Docker Compose"
    exit 1
fi

cd "$PROJECT_ROOT"

if [ ! -f ".env" ]; then
    echo "⚙️  创建 Docker 环境配置..."
    cat > .env << 'EOF'
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=codewalker
MYSQL_USER=codewalker
MYSQL_PASSWORD=codewalker123
TZ=Asia/Shanghai
EOF
    echo "✅ 已创建 .env"
fi

echo ""
echo "🚀 构建并启动所有服务..."
if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

echo ""
echo "⏳ 等待服务启动..."
sleep 5

echo ""
echo "📊 服务状态:"
if docker compose version &> /dev/null; then
    docker compose ps
else
    docker-compose ps
fi

echo ""
echo "========================================="
echo "  ✅ 服务启动完成!"
echo "========================================="
echo "  应用访问: http://localhost"
echo "  管理后台: http://localhost/admin/login"
echo "  后端 API: http://localhost/api/v1"
echo "  MySQL: localhost:3306"
echo ""
echo "  查看日志:"
echo "  cd $PROJECT_ROOT && ./scripts/docker-logs.sh"
echo ""
echo "  停止服务:"
echo "  cd $PROJECT_ROOT && ./scripts/docker-stop.sh"
echo "========================================="
