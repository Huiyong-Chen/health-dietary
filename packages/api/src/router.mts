import { healthProfileRouter } from './routers/healthProfile.mts';
import { userRouter } from './routers/user.mts';
import { router } from './trpc.mts';

export const appRouter = router({
  user: userRouter,
  healthProfile: healthProfileRouter,
});

export type AppRouter = typeof appRouter;
