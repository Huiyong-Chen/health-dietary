import { z } from 'zod';
import { procedure, router } from '../trpc.mts';
import * as bcrypt from 'bcryptjs';

export const userRouter = router({
  create: procedure
    .input(
      z.object({
        email: z.string().email(),
        nickname: z.string().min(2),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          nickname: input.nickname,
          password: hashedPassword,
        },
      });
      return user;
    }),
});
