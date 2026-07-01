# 技术架构文档 - STUDIO NOVA 创意工作室官网

## 1. 架构设计

本项目为纯前端单页应用（SPA），无后端服务，所有数据使用 Mock 数据。

```mermaid
flowchart TD
    "用户浏览器" --> "React 应用"
    subgraph "前端层"
        "页面组件" --> "UI 组件库"
        "UI 组件库" --> "动画/Hooks"
        "动画/Hooks" --> "样式系统 (Tailwind)"
    end
    "样式系统 (Tailwind)" --> "静态资源"
    "Mock 数据" --> "页面组件"
```

## 2. 技术说明

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **样式方案**：Tailwind CSS 3
- **路由管理**：React Router DOM 6
- **状态管理**：Zustand
- **动画库**：Framer Motion（用于复杂动画和滚动触发）
- **图标库**：Lucide React
- **字体**：Google Fonts（Playfair Display, Space Grotesk, JetBrains Mono）

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 首页（包含所有区块：Hero、作品、服务、关于、联系） |

注：单页滚动式设计，所有内容在首页通过锚点导航。

## 4. 项目结构

```
/workspace/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── layout/         # 布局组件（Navigation, Footer, CustomCursor）
│   │   ├── sections/       # 页面区块组件
│   │   │   ├── Hero.tsx
│   │   │   ├── Works.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── About.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/             # 基础 UI 组件（Button, ProjectCard, etc.）
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useScrollAnimation.ts
│   │   ├── useMousePosition.ts
│   │   └── useCountUp.ts
│   ├── data/               # Mock 数据
│   │   ├── projects.ts
│   │   └── services.ts
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 5. 核心数据模型

### 5.1 项目数据类型
```typescript
interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  client?: string;
  tags: string[];
}
```

### 5.2 服务数据类型
```typescript
interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}
```

### 5.3 统计数据类型
```typescript
interface Stat {
  number: number;
  suffix: string;
  label: string;
}
```
