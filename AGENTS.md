# AGENTS.md

本文件为 Qoder (qoder.com) 在此仓库中工作时提供指导。

## 项目概述

**健康饮食 (Health-Dietary)** 是一个智能健康与膳食生活管理平台，使用 TypeScript 和 ESM 构建的 Monorepo 项目。项目当前处于"基础设施完备，待功能开发"阶段。

## 命令

### 根级别

- **代码检查**: `pnpm lint` (检查所有 `.{mjs,js,mts,ts}` 文件)
- **自动修复**: `pnpm lint:fix`
- **代码格式化**: `pnpm format` (格式化所有 `.{mjs,js,mts,ts,md,json}` 文件)
- **类型检查**: `pnpm typecheck` (并行运行所有包的类型检查)

### 后端 (`apps/server`)

- **开发模式**: `pnpm dev` (使用 tsx watch 运行)
- **构建**: `pnpm build` (使用 tsdown)
- **启动**: `pnpm start` (运行构建后的代码)
- **数据库迁移 (开发)**: `pnpm db:migrate:dev` (需要 .env 文件)
- **生成 Prisma 客户端**: `pnpm db:generate`
- **Prisma Studio**: `pnpm db:studio`

### 前端

- **React 应用** (`apps/client-react`):
  - 开发: `pnpm dev` (Vite)
  - 构建: `pnpm build` (TypeScript + Vite)
  - 预览: `pnpm preview`

- **Vue 应用** (`apps/client-vue`):
  - 开发: `pnpm dev` (Vite)
  - 构建: `pnpm build` (vue-tsc + Vite)
  - 预览: `pnpm preview`

## 架构

### Monorepo 结构

- **包管理器**: pnpm workspace，严格依赖管理
- **全局语言**: TypeScript，所有源文件使用 `.mts` 扩展名
- **模块系统**: 全局使用 ESM (`"type": "module"`)
- **代码质量**: 扁平化 ESLint 配置 + Prettier，采用"根配置 + 子项目扩展"模式
- **构建工具**:
  - `tsdown` - 库/后端编译
  - `tsx` - 开发时运行
  - `Vite` - 前端
  - `concurrently` - 总控
- **路径别名**: 通过根 `tsconfig.base.json` 和 `vite-tsconfig-paths` 插件配置 (如 `@api/*`)

### 工作空间布局

```
apps/
  server/          - 后端 (Hono + tRPC + Prisma)
  client-react/    - React 前端，使用 @trpc/react-query
  client-vue/      - Vue 前端，使用 @tanstack/vue-query
packages/
  api/             - 共享的 tRPC API 定义和类型 (前后端契约)
  config/          - (计划中) 集中式配置，使用 zod 验证
```

### 技术栈

**后端** (`@health-dietary/server`):

- **Web 框架**: Hono (轻量、快速)
- **API 层**: tRPC (端到端类型安全)
- **数据库 ORM**: Prisma
- **数据库**: SQLite (本地开发)
- **环境变量**: dotenv-cli

**共享库** (`@health-dietary/api`):

- **职责**: 定义 tRPC `appRouter` 和所有共享 API 类型
- **解耦方式**: 使用 tRPC `Context` 将 API 定义与后端实现分离
- **依赖**: @trpc/server, zod

**前端**:

- **React**: 使用 `@trpc/react-query` (官方与 @tanstack/react-query 深度集成)
- **Vue**: 使用 `@tanstack/vue-query` + `@trpc/client` 核心库

### 数据流架构

**关键**: 所有 API 功能必须遵循以下依赖流程:

1. **`packages/api`** - 定义 API 契约 (router, procedures, schemas)
2. **`apps/server`** - 使用 tRPC context 实现 API (`ctx.db` 访问 Prisma)
3. **`apps/client-*`** - 使用类型安全的客户端 hooks 消费 API

这种分离确保:

- API 定义与框架无关
- 后端实现通过 `Context` 使用 Prisma
- 前端无需代码生成即获得完整类型安全

### tRPC Context 模式

后端将 Prisma Client 注入到 tRPC context:

- `apps/server/src/context.mts` 创建包含 `{ db }` 的 context
- `packages/api` 定义期望此 context 的 procedures
- 所有数据库操作必须使用 `ctx.db` (API 层禁止直接导入 Prisma)

### 配置管理

**当前状态**: 存在一些硬编码配置 (端口、URL)
**计划**: 创建 `packages/config` 并使用 zod schema 验证，使用根 `.env` 作为唯一真实来源

## 开发指南

### 类型安全要求

- 所有函数、API 接口和组件 props 必须有明确的 TypeScript 类型
- 优先使用 Prisma 和 Zod 自动生成的类型
- 全局启用严格模式

### 代码规范

- 源文件使用 `.mts` 扩展名
- 所有代码必须通过 ESLint 和 Prettier 检查
- 除非特别要求，否则代码中不要添加注释
- 遵循相邻文件中的现有模式

### API 开发模式

1. 在 `packages/api/src/routers/` 中定义 schema 和 procedure
2. 在 `apps/server` 中使用 tRPC context 实现
3. 在前端中使用以下方式消费:
   - React: `@trpc/react-query` hooks
   - Vue: `@tanstack/vue-query` + 注入的 tRPC 客户端

### 数据库工作流

- Schema: `apps/server/prisma/schema.prisma`
- Schema 变更始终使用迁移
- 生成的客户端位于 `apps/server/src/generated/prisma/`
- 在 tRPC procedures 中通过 `ctx.db` 访问

### 文件扩展名

- TypeScript 源码: `.mts`
- 配置文件: `.mts` (如 `eslint.config.mts`)
- 生成的声明文件: `.d.mts`

## 重要提示

- 除非用户明确要求，否则不要提交更改
- 导入新依赖前，始终检查库是否已在使用中
- 创建新工具前，检查 `packages/*` 中是否已有现成的
- 有疑问时，参考 `ProjectMasterPlan.md` 了解架构原则
- 所有依赖环境的脚本使用 `dotenv-cli` 加载 `.env` 文件
