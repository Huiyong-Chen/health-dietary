import { z } from 'zod';
import { procedure, router } from '../trpc.mts';

const genderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);
const activityLevelEnum = z.enum([
  'SEDENTARY',
  'LIGHTLY_ACTIVE',
  'MODERATELY_ACTIVE',
  'VERY_ACTIVE',
  'EXTRA_ACTIVE',
]);
const goalEnum = z.enum(['WEIGHT_LOSS', 'WEIGHT_GAIN', 'MAINTAIN']);

export const healthProfileRouter = router({
  create: procedure
    .input(
      z.object({
        userId: z.string(),
        heightCm: z.number().positive().optional(),
        weightKg: z.number().positive().optional(),
        age: z.number().int().positive().optional(),
        gender: genderEnum.optional(),
        activityLevel: activityLevelEnum.optional(),
        goal: goalEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.healthProfile.create({
        data: input,
      });
      return profile;
    }),

  getByUserId: procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.healthProfile.findUnique({
        where: { userId: input.userId },
      });
      return profile;
    }),

  update: procedure
    .input(
      z.object({
        userId: z.string(),
        heightCm: z.number().positive().optional(),
        weightKg: z.number().positive().optional(),
        age: z.number().int().positive().optional(),
        gender: genderEnum.optional(),
        activityLevel: activityLevelEnum.optional(),
        goal: goalEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...data } = input;
      const profile = await ctx.db.healthProfile.update({
        where: { userId },
        data,
      });
      return profile;
    }),

  delete: procedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.healthProfile.delete({
        where: { userId: input.userId },
      });
      return { success: true };
    }),
});
