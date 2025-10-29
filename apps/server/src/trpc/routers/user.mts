import { z } from 'zod';
import { db } from '../../db.mts';
import { publicProcedure, router } from '../index.mts';

export const userRouter = router({
  // 定义一个 "create" 的 "mutation" (用于创建/修改数据)
  create: publicProcedure
    // 1. 使用 Zod 定义输入校验
    .input(
      z.object({
        email: z.string().email(),
        nickname: z.string().min(2),
        // 稍后我们会处理密码哈希，现在暂时简化
        password: z.string().min(6),
      })
    )
    // 2. 定义处理该 API 请求的函数
    .mutation(async ({ input }) => {
      const user = await db.user.create({
        data: {
          email: input.email,
          nickname: input.nickname,
          password: input.password, // 警告：这里是明文密码，仅为演示
        },
      });
      return user;
    }),
});
