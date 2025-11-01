# 后端项目搭建计划

## 目标

搭建基于 **Hono + Prisma + tRPC** 的 Node.js 后端服务，采用分层架构实现职责分离和类型安全。

---

## 一、架构设计原则

### 1.1 分层职责

```
┌─────────────────────────────────────────────────────┐
│  packages/env    → 环境变量管理（跨前后端共享）      │
└─────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────┐
│  packages/db     → 数据层（Prisma Schema + Client） │
└─────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────┐
│  packages/trpc   → API 层（路由定义 + 业务逻辑）     │
└─────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────┐
│  apps/server     → HTTP 层（Hono 服务 + 中间件）    │
└─────────────────────────────────────────────────────┘
```

**依赖关系**:

```
server  ──→  trpc  ──→  db  ──→  env
  └────────────────────────────→  env
```

### 1.2 核心特性

- **类型安全**: tRPC 端到端类型推导，前后端无需手写 API 类型
- **环境隔离**: 统一的环境变量管理，支持多环境配置
- **职责分离**: 数据层、API 层、HTTP 层清晰解耦
- **开发体验**: 热重载 + Prisma Studio + TypeScript strict 模式

---

## 二、技术栈确认

| 技术             | 版本   | 用途                                  |
| ---------------- | ------ | ------------------------------------- |
| **Hono**         | ^4.x   | 轻量高性能 Web 框架，提供路由和中间件 |
| **Prisma**       | ^6.x   | 现代 ORM，类型安全的数据库操作        |
| **tRPC**         | ^11.x  | 端到端类型安全 API，无需手写类型定义  |
| **Zod**          | ^3.x   | 运行时 Schema 验证，配合 tRPC 使用    |
| **SQLite**       | (内置) | 轻量嵌入式数据库，开发阶段首选        |
| **tsx**          | ^4.x   | TypeScript 执行器，开发模式热重载     |
| **dotenv**       | ^16.x  | 环境变量加载                          |
| **bcrypt**       | ^5.x   | 密码加密                              |
| **jsonwebtoken** | ^9.x   | JWT 认证                              |

---

## 三、项目结构设计

```
health-dietary/
├── .env.development              # 开发环境配置
├── .env.production               # 生产环境配置
├── .env.example                  # 配置模板（提交到 git）
│
├── packages/
│   ├── env/                      # 环境变量共享包
│   │   ├── src/
│   │   │   └── index.mts         # 加载并导出类型化的环境变量
│   │   ├── package.json          # @health-dietary/env
│   │   └── tsconfig.json
│   │
│   ├── db/                       # 数据层
│   │   ├── prisma/
│   │   │   └── schema.prisma     # 数据库模型定义
│   │   ├── src/
│   │   │   ├── client.mts        # 导出 PrismaClient 实例
│   │   │   └── index.mts         # 统一导出（类型 + 客户端）
│   │   ├── package.json          # @health-dietary/db (依赖 @health-dietary/env)
│   │   └── tsconfig.json
│   │
│   └── trpc/                     # API 层
│       ├── src/
│       │   ├── context.mts       # tRPC Context（注入 prisma）
│       │   ├── index.mts         # 导出 router 和类型
│       │   ├── router.mts        # 根路由
│       │   └── routers/
│       │       ├── auth.mts      # 认证路由
│       │       ├── user.mts      # 用户路由
│       │       └── health.mts    # 健康档案路由
│       ├── package.json          # @health-dietary/trpc (依赖 @health-dietary/db)
│       └── tsconfig.json
│
└── apps/
    └── server/                   # HTTP 服务层
        ├── src/
        │   ├── index.mts         # 入口（启动 Hono 服务）
        │   ├── app.mts           # Hono 应用配置
        │   ├── middleware/       # HTTP 中间件
        │   │   ├── cors.mts      # CORS 配置
        │   │   └── logger.mts    # 日志中间件
        │   └── data/
        │       └── dev.db        # SQLite 数据库文件（.gitignore）
        ├── package.json          # 依赖 @health-dietary/trpc, @health-dietary/env
        └── tsconfig.json
```

---

## 四、环境变量配置

### 4.1 根目录配置文件

**.env.development**

```env
# 数据库配置
DATABASE_URL=file:./apps/server/data/dev.db

# 服务端配置
SERVER_PORT=3000
SERVER_HOST=localhost

# 客户端配置
CLIENT_PORT=5173

# 其他配置
NODE_ENV=development
JWT_SECRET=your-dev-secret-key-change-me
```

**.env.production**

```env
DATABASE_URL=file:./apps/server/data/prod.db
SERVER_PORT=8080
SERVER_HOST=0.0.0.0
CLIENT_PORT=80
NODE_ENV=production
JWT_SECRET=your-production-secret-key-from-env
```

**.env.example** (提交到 git)

```env
DATABASE_URL=file:./apps/server/data/dev.db
SERVER_PORT=3000
SERVER_HOST=localhost
CLIENT_PORT=5173
NODE_ENV=development
JWT_SECRET=change-me-in-production
```

### 4.2 packages/env 实现

```typescript
// packages/env/src/index.mts
import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// 根据 NODE_ENV 加载对应的 .env 文件
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

// Zod Schema 验证
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SERVER_PORT: z.coerce.number().default(3000),
  SERVER_HOST: z.string().default('localhost'),
  CLIENT_PORT: z.coerce.number().default(5173),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```

---

## 五、搭建步骤清单

### Phase 1: 环境变量包初始化 ✅

#### 1.1 创建 packages/env

- [x] 创建目录结构：`packages/env/src/`
- [x] 配置 `package.json`（`@health-dietary/env`）
  - 添加 `"type": "module"`
  - 配置 `"main"` 和 `"types"` 指向 `dist/`
  - 添加现代化 `"exports"` 配置
  - 配置 `"files": ["dist"]`
- [x] 配置 `tsconfig.json`（继承根配置，添加 `"types": ["node"]`）
- [x] 安装依赖：`pnpm add zod dotenv app-root-path`
- [x] 实现环境变量加载逻辑
  - 使用 `app-root-path` 智能路径解析
  - Zod Schema 类型验证（`z.coerce.number()` 自动类型转换）
  - 友好的错误提示（`z.treeifyError`）
  - 开发环境日志输出，生产环境静默
- [x] 创建根目录配置文件：`.env.development`
- [x] 更新 `.gitignore`：精确忽略 `.env`、`.env.development`、`.env.production`、`.env.test`
- [x] 配置 `tsdown` 构建工具（ESM 格式 + 类型声明 + Source Map）
- [x] 验证通过：构建成功、类型检查通过、运行时加载正常

**实际实现亮点**：

- ✅ 使用 `app-root-path` 替代 `process.cwd()`，更可靠
- ✅ `CLIENT_PORT` 使用 `z.coerce.number()` 确保类型一致性
- ✅ 添加 `test` 脚本验证环境变量加载
- ✅ 移除冗余的 `serverConfig/clientConfig`，简化设计

### Phase 2: 数据层包初始化 (packages/db)

#### 2.1 创建基础结构

- [ ] 创建目录结构：`packages/db/src/`、`packages/db/prisma/`
- [ ] 配置 `package.json`（`@health-dietary/db`）
- [ ] 配置 `tsconfig.json`（继承根配置）
- [ ] 安装依赖：`pnpm add @prisma/client` 和 `pnpm add -D prisma`
- [ ] 添加依赖：`@health-dietary/env`

#### 2.2 初始化 Prisma

- [ ] 在 `packages/db` 中运行 `pnpm prisma init --datasource-provider sqlite`
- [ ] 配置 `prisma/schema.prisma`（datasource 使用 env.DATABASE_URL）
- [ ] 定义核心 Model（User、Session、HealthProfile）

#### 2.3 实现 Prisma Client 封装

```typescript
// packages/db/src/client.mts
import { PrismaClient } from '@prisma/client';
import { env } from '@health-dietary/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

```typescript
// packages/db/src/index.mts
export { prisma } from './client.mts';
export * from '@prisma/client';
```

### Phase 3: API 层包初始化 (packages/trpc)

#### 3.1 创建基础结构

- [ ] 创建目录结构：`packages/trpc/src/routers/`
- [ ] 配置 `package.json`（`@health-dietary/trpc`）
- [ ] 配置 `tsconfig.json`（继承根配置）
- [ ] 安装依赖：`pnpm add @trpc/server zod`
- [ ] 添加依赖：`@health-dietary/db`

#### 3.2 实现 tRPC 基础配置

```typescript
// packages/trpc/src/context.mts
import { prisma } from '@health-dietary/db';
import { inferAsyncReturnType } from '@trpc/server';

export const createContext = async () => {
  return {
    prisma,
    userId: null as string | null,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
```

```typescript
// packages/trpc/src/router.mts
import { initTRPC } from '@trpc/server';
import { Context } from './context.mts';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

```typescript
// packages/trpc/src/index.mts
import { router } from './router.mts';

export const appRouter = router({});

export type AppRouter = typeof appRouter;
export { createContext } from './context.mts';
```

### Phase 4: HTTP 服务层配置 (apps/server)

#### 4.1 安装依赖

```bash
# 在 apps/server 中安装
pnpm add hono @hono/node-server
pnpm add -D tsx
```

#### 4.2 添加包依赖

- [ ] 在 `apps/server/package.json` 中添加依赖：`@health-dietary/trpc`、`@health-dietary/env`

#### 4.3 实现 Hono 应用

```typescript
// apps/server/src/app.mts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@trpc/server/adapters/fetch';
import { appRouter, createContext } from '@health-dietary/trpc';

const app = new Hono();

app.use('/trpc/*', cors());
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
  }),
);

export default app;
```

```typescript
// apps/server/src/index.mts
import { serve } from '@hono/node-server';
import { env } from '@health-dietary/env';
import app from './app.mts';

console.log(`🚀 Server starting on http://${env.SERVER_HOST}:${env.SERVER_PORT}`);

serve({
  fetch: app.fetch,
  port: env.SERVER_PORT,
  hostname: env.SERVER_HOST,
});
```

### Phase 5: 验证与测试

- [ ] 在 `packages/db` 中运行 `pnpm prisma migrate dev --name init`
- [ ] 在 `packages/db` 中运行 `pnpm prisma generate`
- [ ] 启动服务：`pnpm -F @health-dietary/server dev`
- [ ] 验证服务启动成功
- [ ] 运行 `pnpm prisma studio` 验证数据库连接

---

## 六、数据库设计

### 6.1 Prisma Schema 核心表

**User 表**

```prisma
model User {
  id            String          @id @default(cuid())
  email         String          @unique
  passwordHash  String
  nickname      String?
  avatar        String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  healthProfile HealthProfile?
  sessions      Session[]
}
```

**Session 表（设备感知的单点登录）**

```prisma
model Session {
  id          String   @id @default(cuid())
  userId      String
  deviceType  String   // 'mobile' | 'tablet' | 'desktop'
  token       String   @unique
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, deviceType]) // 同设备类型单一会话
}
```

**HealthProfile 表**

```prisma
model HealthProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  height          Float?   // 身高（cm）
  weight          Float?   // 体重（kg）
  age             Int?
  gender          String?  // 'male' | 'female' | 'other'
  activityLevel   String?  // 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  dietPreference  String?  // 饮食偏好
  allergies       String?  // 过敏信息（JSON）
  healthGoal      String?  // 健康目标

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 七、后续开发计划

完成基础搭建后的开发步骤：

### Phase 6: 认证系统实现

- [ ] 安装依赖：`bcrypt`、`jsonwebtoken`、`@types/bcrypt`、`@types/jsonwebtoken`
- [ ] 实现 JWT 工具函数（生成、验证 token）
- [ ] 实现设备类型解析（User-Agent）
- [ ] 实现认证路由（注册、登录、登出）
- [ ] 实现设备感知单点登录逻辑
- [ ] 创建 tRPC 认证中间件（protectedProcedure）

### Phase 7: 核心业务功能

- [ ] 用户路由（获取信息、更新资料）
- [ ] 健康档案路由（CRUD）
- [ ] 数据可视化接口（体重、卡路里趋势）

### Phase 8: 前端项目搭建

- [ ] React 前端项目（Vite + Framework7）
- [ ] Vue 前端项目（Vite + Framework7）
- [ ] tRPC Client 配置
- [ ] 前后端联调

### Phase 9: 高级功能

- [ ] 食谱库与推荐系统
- [ ] 膳食计划管理
- [ ] 运动追踪
- [ ] 提醒系统
- [ ] 离线支持（Service Worker + IndexedDB）

---

## 八、开发与调试

### 8.1 常用命令

```bash
# 安装所有依赖
pnpm install

# 运行后端开发模式
pnpm -F @health-dietary/server dev

# 数据库迁移
pnpm -F @health-dietary/db prisma migrate dev

# 生成 Prisma Client
pnpm -F @health-dietary/db prisma generate

# 打开 Prisma Studio
pnpm -F @health-dietary/db prisma studio

# 代码检查与格式化
pnpm lint
pnpm format
```

### 8.2 开发调试清单

- [ ] 验证环境变量加载（各包能正确读取 env）
- [ ] 验证包引用关系（TypeScript 类型推导正常）
- [ ] 测试数据库连接（Prisma Studio 可访问）
- [ ] 测试 tRPC 端点（使用 curl 或 Postman）

---

## 九、注意事项

### 9.1 路径解析

- **DATABASE_URL**: 使用相对路径 `file:./apps/server/data/dev.db`，Prisma 会基于项目根目录解析
- **monorepo 依赖**: 确保 `pnpm-workspace.yaml` 正确配置，使用 `workspace:*` 引用本地包

### 9.2 TypeScript 配置

- **packages/\*** 的 `tsconfig.json` 必须设置 `"composite": true` 以支持项目引用
- **moduleResolution**: 根配置使用 `"node"`，前端项目可覆盖为 `"bundler"`

### 9.3 .gitignore 补充

```
# 环境变量
.env.development
.env.production

# 数据库文件
apps/server/data/*.db
apps/server/data/*.db-journal

# Prisma 生成文件
node_modules/.prisma/
```

---

**文档版本**：v2.0  
**最后更新**：2025-11-01
