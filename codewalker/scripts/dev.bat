@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..
set BACKEND_DIR=%PROJECT_ROOT%\backend

echo =========================================
echo   CodeWalker 开发环境启动
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

cd /d "%PROJECT_ROOT%"
if not exist "node_modules" (
    echo 📦 安装前端依赖...
    call npm install
    echo.
)

if not exist "%BACKEND_DIR%\.env" (
    echo ⚙️  创建后端环境配置...
    copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
    echo ✅ 已创建 %BACKEND_DIR%\.env，请根据需要修改数据库配置
    echo.
)

echo 🚀 启动后端服务 (端口: 8080)...
start "CodeWalker Backend" cmd /k "cd /d %BACKEND_DIR% && go run ./cmd/server"

timeout /t 3 /nobreak >nul

echo 🚀 启动前端开发服务器 (端口: 5173)...
start "CodeWalker Frontend" cmd /k "cd /d %PROJECT_ROOT% && npm run dev"

echo.
echo =========================================
echo   ✅ 开发环境启动完成!
echo =========================================
echo   前端: http://localhost:5173
echo   后端 API: http://localhost:8080/api/v1
echo   管理后台: http://localhost:5173/admin/login
echo =========================================
echo   关闭两个命令行窗口即可停止服务
echo =========================================
echo.
pause
