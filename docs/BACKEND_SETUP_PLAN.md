# 后端项目搭建计划

## 目标

搭建基于 **Hono + Prisma + tRPC** 的 Node.js 后端服务，实现类型安全的 API 层和数据持久化。

---

## 一、技术栈确认

| 技术             | 版本   | 用途                                  |
| ---------------- | ------ | ------------------------------------- |
| **Hono**         | ^4.x   | 轻量高性能 Web 框架，提供路由和中间件 |
| **Prisma**       | ^6.x   | 现代 ORM，类型安全的数据库操作        |
| **tRPC**         | ^11.x  | 端到端类型安全 API，无需手写类型定义  |
| **Zod**          | ^3.x   | 运行时 Schema 验证，配合 tRPC 使用    |
| **SQLite**       | (内置) | 轻量嵌入式数据库，开发阶段首选        |
| **tsx**          | ^4.x   | TypeScript 执行器，开发模式热重载     |
| **bcrypt**       | ^5.x   | 密码加密                              |
| **jsonwebtoken** | ^9.x   | JWT 认证                              |

---

## 二、项目结构设计

```
apps/server/
├── src/
│   ├── index.mts              # 主入口文件
│   ├── app.mts                # Hono 应用初始化
│   ├── config/
│   │   └── env.mts            # 环境变量配置
│   ├── middleware/
│   │   ├── auth.mts           # JWT 认证中间件
│   │   ├── cors.mts           # CORS 配置
│   │   └── logger.mts         # 日志中间件
│   ├── trpc/
│   │   ├── context.mts        # tRPC Context（包含 Prisma 客户端）
│   │   ├── router.mts         # tRPC 根路由
│   │   └── routers/
│   │       ├── auth.mts       # 认证路由
│   │       ├── user.mts       # 用户路由
│   │       └── health.mts     # 健康档案路由
│   ├── services/
│   │   ├── auth.service.mts   # 认证业务逻辑
│   │   └── user.service.mts   # 用户业务逻辑
│   └── utils/
│       ├── jwt.mts            # JWT 工具函数
│       └── device.mts         # 设备类型解析
├── package.json
└── tsconfig.json

prisma/
├── schema.prisma              # 数据库 Schema
└── migrations/                # 数据库迁移文件（自动生成）

packages/shared/               # 共享包（类型定义、工具函数）
├── src/
│   ├── types/
│   │   ├── user.mts           # 用户类型
│   │   └── health.mts         # 健康档案类型
│   └── schemas/
│       └── validation.mts     # Zod Schema 定义
├── package.json
└── tsconfig.json
```

---

## 三、搭建步骤清单

### Phase 1: 基础配置（第 1 步）

#### 1.1 初始化共享包 `packages/shared`

- [ ] 创建目录结构
- [ ] 配置 package.json（`@health-dietary/shared`）
- [ ] 配置 tsconfig.json（继承根配置）
- [ ] 定义基础类型（User、DeviceType）

#### 1.2 安装后端依赖

```bash
# 在 apps/server 中安装
pnpm add hono @hono/node-server
pnpm add @trpc/server @trpc/client zod
pnpm add @prisma/client
pnpm add bcrypt jsonwebtoken
pnpm add -D prisma @types/bcrypt @types/jsonwebtoken
```

#### 1.3 初始化 Prisma

- [ ] 运行 `pnpm prisma init --datasource-provider sqlite`
- [ ] 配置 `prisma/schema.prisma`
- [ ] 定义核心 Model（User、HealthProfile）

---

### Phase 2: 数据库设计（第 2 步）

#### 2.1 Prisma Schema 核心表

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

#### 2.2 数据库迁移

- [ ] 运行 `pnpm prisma migrate dev --name init`
- [ ] 生成 Prisma Client：`pnpm prisma generate`

---

### Phase 3: tRPC 配置（第 3 步）

#### 3.1 创建 tRPC Context

```typescript
// apps/server/src/trpc/context.mts
import { PrismaClient } from '@prisma/client';
import { inferAsyncReturnType } from '@trpc/server';

const prisma = new PrismaClient();

export const createContext = async () => {
  return {
    prisma,
    userId: null as string | null, // 认证后会填充
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
```

#### 3.2 初始化 tRPC Router

```typescript
// apps/server/src/trpc/router.mts
import { initTRPC } from '@trpc/server';
import { Context } from './context.mts';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
```

#### 3.3 定义路由

- [ ] 认证路由（注册、登录、登出）
- [ ] 用户路由（获取信息、更新资料）
- [ ] 健康档案路由（CRUD）

---

### Phase 4: Hono 集成（第 4 步）

#### 4.1 创建 Hono 应用

```typescript
// apps/server/src/app.mts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@trpc/server/adapters/fetch';
import { appRouter } from './trpc/router.mts';
import { createContext } from './trpc/context.mts';

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

#### 4.2 配置中间件

- [ ] CORS 中间件
- [ ] 日志中间件（可选：Pino 或自定义）
- [ ] JWT 认证中间件

---

### Phase 5: 认证系统实现（第 5 步）

#### 5.1 JWT 工具函数

- [ ] `generateToken(userId, deviceType)`
- [ ] `verifyToken(token)`
- [ ] 设备类型解析（User-Agent）

#### 5.2 认证路由实现

- [ ] 注册：密码加密（bcrypt）、创建用户
- [ ] 登录：验证密码、生成 JWT、存储 Session
- [ ] 登出：删除 Session

#### 5.3 设备感知单点登录逻辑

```typescript
// 登录时
const existingSession = await prisma.session.findUnique({
  where: { userId_deviceType: { userId, deviceType } },
});
if (existingSession) {
  await prisma.session.delete({ where: { id: existingSession.id } });
}
await prisma.session.create({ data: { userId, deviceType, token } });
```

---

## 四、验证与测试

### 4.1 手动测试清单

- [ ] 启动服务：`pnpm -F @health-dietary/server dev`
- [ ] 测试用户注册
- [ ] 测试用户登录（同设备踢出旧 token）
- [ ] 测试跨设备多会话
- [ ] 测试受保护路由（需 JWT）

### 4.2 数据库可视化

- [ ] 运行 `pnpm prisma studio` 查看数据

---

## 五、环境变量配置

创建 `.env` 文件：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000
NODE_ENV=development
```

添加到 `.gitignore`：

```
.env
```

---

## 六、下一步规划

完成后端基础搭建后，后续步骤：

1. **前端项目搭建**（React + Vue）
2. **前后端联调**（tRPC Client 配置）
3. **实现核心功能**（健康档案、食谱库、膳食计划）
4. **离线支持**（Service Worker + IndexedDB）
5. **部署优化**（Docker + CI/CD）

---

**文档版本**：v1.0  
**创建时间**：2025-11-01
