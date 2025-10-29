import { userRouter } from './routers/user.mts';
import { router } from './trpc.mts';

export const appRouter = router({
  // 将 userRouter 挂载到 "user" 命名空间下
  // 未来的 API 调用路径会是 user.create
  user: userRouter,
});

// 导出 appRouter 的类型
export type AppRouter = typeof appRouter;
