# AGENTS.md

本文件为 Qoder (qoder.com) 在此仓库中工作时提供指导。

## 项目概述

Health-Dietary 是一个健康生活管理平台的个人学习项目。详细规划参见 `PROJECT_PLAN.md`。

## 常用命令

- `pnpm install`：安装所有依赖
- `pnpm lint`：运行 ESLint 检查
- `pnpm format`：格式化所有代码
- `pnpm format:check`：检查代码格式
- `pnpm -F @health-dietary/server dev`：运行后端开发模式

## 架构设计

### Monorepo 结构

使用 pnpm workspaces 管理：

```
health-dietary/
├── apps/
│   ├── web-react/        # React 前端
│   ├── web-vue/          # Vue 前端
│   └── server/           # Node.js 后端
├── packages/
│   ├── shared/           # 共享类型、工具函数
│   ├── trpc/             # tRPC 路由定义
│   └── ui/               # 共享 UI 组件
├── prisma/               # 数据库 Schema
├── docs/                 # 项目文档
└── pnpm-workspace.yaml
```

### 技术栈

- 前端：React/Vue + Framework7 + Tailwind CSS + TypeScript + Vite
- 后端：Node.js + Hono + Prisma + SQLite
- 类型安全：tRPC + Zod（端到端类型共享）
- 工具：pnpm + ESLint + Prettier + Husky

### 编码规范

- **所有源代码文件使用 .mts 扩展名**（TypeScript ESM 模块）
- **配置文件格式**：
  - TypeScript 配置优先使用 .mts（eslint.config.mts、lint-staged.config.mts 等）
  - Prettier 配置使用 .mjs（macOS 兼容性）
- **TypeScript 模块解析**：
  - 根配置使用 `moduleResolution: "node"`（适配 Node.js 后端）
  - 前端项目可覆盖为 `"Bundler"`（适配 Vite 打包）
- 严格遵循 TypeScript strict 模式
- Git 提交信息遵循 Conventional Commits 规范，支持 gitemoji 前缀

## 关键技术实现

### 设备感知的单点登录

- 解析 User-Agent 获取设备类型，存入 JWT payload
- 同设备类型单一会话，跨设备类型多会话
- 存储映射：`userId_deviceType -> token`

### 文件导入适配器模式

- 统一接口 + 多格式解析器（JSON、Apple Health XML、华为 JSON 等）

### 离线支持

- Service Worker + IndexedDB + Background Sync API

## 项目文档

- 完整搭建流程和配置说明：`docs/SETUP_GUIDE.md`
- 配置文件详解（所有配置项说明）：`docs/CONFIG_REFERENCE.md`
- 项目详细规划：`PROJECT_PLAN.md`
