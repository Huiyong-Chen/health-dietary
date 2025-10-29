import type { PrismaClient } from '@prisma/client/extension';
import { initTRPC } from '@trpc/server';

// tRPC Context 的类型
export interface Context {
  db: PrismaClient;
}

// 初始化 tRPC 时传入 Context 类型
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
