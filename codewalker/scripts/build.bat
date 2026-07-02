@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..
set BACKEND_DIR=%PROJECT_ROOT%\backend
set DIST_DIR=%PROJECT_ROOT%\dist
set BUILD_DIR=%PROJECT_ROOT%\build

echo =========================================
echo   CodeWalker 项目打包
echo =========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 npm，请先安装
    pause
    exit /b 1
)

where go >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Go，请先安装
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('go version') do set GO_VER=%%i
echo ✅ Node.js: %NODE_VER%
echo ✅ Go: %GO_VER%
echo.

echo 📦 安装前端依赖...
cd /d "%PROJECT_ROOT%"
call npm ci
if errorlevel 1 (
    echo ❌ 前端依赖安装失败
    pause
    exit /b 1
)
echo.

echo 🔨 构建前端...
call npm run build
if errorlevel 1 (
    echo ❌ 前端构建失败
    pause
    exit /b 1
)
echo.

echo 🔨 构建后端...
cd /d "%BACKEND_DIR%"
go mod download
set CGO_ENABLED=0
set GOOS=windows
set GOARCH=amd64
go build -ldflags="-s -w" -o "%BUILD_DIR%\server.exe" ./cmd/server
if errorlevel 1 (
    echo ❌ 后端构建失败
    pause
    exit /b 1
)
echo.

echo 📁 整理构建产物...
if exist "%BUILD_DIR%" rmdir /s /q "%BUILD_DIR%"
mkdir "%BUILD_DIR%"
mkdir "%BUILD_DIR%\public"
xcopy /e /i /q "%DIST_DIR%\*" "%BUILD_DIR%\public\"
copy "%BACKEND_DIR%\.env.example" "%BUILD_DIR%\.env" >nul
mkdir "%BUILD_DIR%\migrations"
copy "%BACKEND_DIR%\migrations\init.sql" "%BUILD_DIR%\migrations\" >nul
mkdir "%BUILD_DIR%\uploads"

echo @echo off > "%BUILD_DIR%\start.bat"
echo chcp 65001 ^>nul 2^>^&1 >> "%BUILD_DIR%\start.bat"
echo set SCRIPT_DIR=%%~dp0 >> "%BUILD_DIR%\start.bat"
echo cd /d "%%SCRIPT_DIR%%" >> "%BUILD_DIR%\start.bat"
echo. >> "%BUILD_DIR%\start.bat"
echo if not exist ".env" ( >> "%BUILD_DIR%\start.bat"
echo     copy .env.example .env ^>nul >> "%BUILD_DIR%\start.bat"
echo     echo ⚠️  已创建默认 .env 文件，请根据需要修改数据库配置 >> "%BUILD_DIR%\start.bat"
echo ^) >> "%BUILD_DIR%\start.bat"
echo. >> "%BUILD_DIR%\start.bat"
echo echo 🚀 启动 CodeWalker 服务... >> "%BUILD_DIR%\start.bat"
echo server.exe >> "%BUILD_DIR%\start.bat"
echo pause >> "%BUILD_DIR%\start.bat"

echo.
echo =========================================
echo   ✅ 打包完成!
echo =========================================
echo   构建产物目录: %BUILD_DIR%
echo.
echo   部署步骤:
echo   1. 将 build 目录上传到服务器
echo   2. 配置 .env 中的数据库连接信息
echo   3. 确保 MySQL 已启动并执行 init.sql 初始化
echo   4. 双击 start.bat 启动服务
echo =========================================
echo.
pause
