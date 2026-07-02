# CodeWalker API 后端

基于 Go + Gin + GORM + MySQL 开发的博客网站后端 API 服务。

## 技术栈

- Web 框架: Gin v1.12
- ORM: GORM v1.31
- 数据库: MySQL 8.0
- 配置: godotenv

## 目录结构

```
backend/
├── cmd/server/          # 主入口
├── internal/
│   ├── config/          # 配置管理
│   ├── handler/         # HTTP 处理器
│   ├── middleware/      # 中间件
│   ├── model/           # 数据模型
│   ├── repository/      # 数据访问层
│   └── router/          # 路由配置
├── migrations/          # 数据库迁移和种子
├── pkg/response/        # 统一响应
├── .env.example         # 环境变量示例
├── Dockerfile           # 后端Dockerfile
└── go.mod
```

## API 接口

### 公共接口
- `GET /api/v1/health` - 健康检查
- `GET /api/v1/stats` - 站点统计

### 文章
- `GET /api/v1/articles` - 文章列表（分页、分类、搜索）
- `GET /api/v1/articles/featured` - 精选文章
- `GET /api/v1/articles/:id` - 文章详情
- `GET /api/v1/articles/slug/:slug` - 通过Slug获取文章
- `GET /api/v1/articles/:id/related` - 相关文章
- `POST /api/v1/articles/:id/like` - 点赞文章
- `GET /api/v1/articles/categories` - 分类列表
- `GET /api/v1/articles/tags` - 标签统计

### 课程
- `GET /api/v1/courses` - 课程列表
- `GET /api/v1/courses/hot` - 热门课程
- `GET /api/v1/courses/:id` - 课程详情
- `GET /api/v1/courses/categories` - 分类列表

### 开源项目
- `GET /api/v1/projects` - 项目列表
- `GET /api/v1/projects/featured` - 精选项目
- `GET /api/v1/projects/:id` - 项目详情
- `GET /api/v1/projects/languages` - 编程语言列表

### 评论
- `GET /api/v1/comments/article/:article_id` - 获取文章评论
- `POST /api/v1/comments` - 发表评论

### 订阅
- `POST /api/v1/subscribers` - 邮件订阅

## 本地开发

1. 复制环境变量:
```bash
cp .env.example .env
```

2. 修改 `.env` 中的数据库配置

3. 运行服务:
```bash
go run ./cmd/server
```

## Docker 部署

### 方式一：单独部署后端（需要MySQL）

```bash
# 构建镜像
docker build -t codewalker-api -f Dockerfile .

# 运行容器
docker run -d \
  --name codewalker-api \
  -p 8080:8080 \
  -e DB_HOST=mysql-host \
  -e DB_PORT=3306 \
  -e DB_USER=codewalker \
  -e DB_PASSWORD=your-password \
  -e DB_NAME=codewalker \
  codewalker-api
```

### 方式二：使用 docker-compose 完整部署（前端+后端+MySQL）

在项目根目录运行：
```bash
docker-compose up -d --build
```

服务启动后访问 http://localhost 即可。

### 初始化测试数据

连接到MySQL后，运行种子脚本：
```bash
cd backend
go run ./migrations/seed.go
```
