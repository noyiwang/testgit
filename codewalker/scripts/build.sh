#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
DIST_DIR="$PROJECT_ROOT/dist"
BUILD_DIR="$PROJECT_ROOT/build"

echo "========================================="
echo "  CodeWalker 项目打包"
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

echo ""
echo "📦 安装前端依赖..."
cd "$PROJECT_ROOT"
npm ci

echo ""
echo "🔨 构建前端..."
npm run build

echo ""
echo "🔨 构建后端..."
cd "$BACKEND_DIR"
go mod download
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /tmp/codewalker-server ./cmd/server

echo ""
echo "📁 整理构建产物..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/migrations" "$BUILD_DIR/uploads"
mv "$DIST_DIR" "$BUILD_DIR/public"
mv /tmp/codewalker-server "$BUILD_DIR/server"
cp "$BACKEND_DIR/.env.example" "$BUILD_DIR/.env.example"
cp "$PROJECT_ROOT/nginx.conf" "$BUILD_DIR/"
cp "$BACKEND_DIR/migrations/init.sql" "$BUILD_DIR/migrations/"

echo ""
echo "📝 生成启动脚本..."
cat > "$BUILD_DIR/start.sh" << 'STARTSCRIPT'
#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  已创建默认 .env 文件，请根据需要修改数据库配置"
fi

echo "🚀 启动 CodeWalker 服务..."
chmod +x ./server
./server
STARTSCRIPT
chmod +x "$BUILD_DIR/start.sh"

echo ""
echo "========================================="
echo "  ✅ 打包完成!"
echo "========================================="
echo "  构建产物目录: $BUILD_DIR"
echo "  包含文件:"
ls -lh "$BUILD_DIR/"
echo ""
echo "  部署步骤:"
echo "  1. 将 build 目录上传到服务器"
echo "  2. 配置 .env 中的数据库连接信息"
echo "  3. 确保 MySQL 已启动并执行 init.sql 初始化"
echo "  4. 运行 ./start.sh 启动服务"
echo "========================================="
