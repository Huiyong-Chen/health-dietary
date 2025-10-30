import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().default('file:./apps/server/prisma-db/dev.db'),
  SERVER_PORT: z.coerce.number().default(3000),
  SERVER_HOST: z.string().default('localhost'),
  VITE_API_URL: z.string().default('http://localhost:3000/trpc'),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('环境变量验证失败:', parsed.error.format());
    throw new Error('环境变量配置错误');
  }
  return parsed.data;
};

export const env = parseEnv();

export const serverConfig = {
  port: env.SERVER_PORT,
  host: env.SERVER_HOST,
  databaseUrl: env.DATABASE_URL,
};

export const clientConfig = {
  apiUrl: env.VITE_API_URL,
};
