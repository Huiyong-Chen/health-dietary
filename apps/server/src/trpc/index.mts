import { initTRPC } from '@trpc/server';

// 初始化 tRPC
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
