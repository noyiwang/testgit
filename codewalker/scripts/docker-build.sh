#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "========================================="
echo "  CodeWalker Docker 镜像构建"
echo "========================================="

cd "$PROJECT_ROOT"

IMAGE_NAME=${1:-"codewalker:latest"}
echo "🔨 构建镜像: $IMAGE_NAME"
echo ""

docker build -t "$IMAGE_NAME" .

echo ""
echo "========================================="
echo "  ✅ Docker 镜像构建完成!"
echo "========================================="
echo "  镜像名称: $IMAGE_NAME"
echo ""
echo "  查看镜像:"
echo "  docker images | grep codewalker"
echo ""
echo "  运行容器:"
echo "  docker run -d -p 80:80 --name codewalker \\"
echo "    -e DB_HOST=host.docker.internal \\"
echo "    -e DB_PORT=3306 \\"
echo "    -e DB_USER=codewalker \\"
echo "    -e DB_PASSWORD=codewalker123 \\"
echo "    -e DB_NAME=codewalker \\"
echo "    $IMAGE_NAME"
echo "========================================="
