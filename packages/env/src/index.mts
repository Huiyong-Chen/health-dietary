import arp from 'app-root-path';
import dotenv from 'dotenv';
import z from 'zod';

const isProduction = process.env.NODE_ENV === 'production';

const envFile = isProduction ? '.env.production' : '.env.development';
const envFilePath = arp.resolve(envFile);
console.log('🔧 加载环境变量文件:', envFilePath);
dotenv.config({
  path: envFilePath,
});

// Zod schema 验证
const envSchema = z.object({
  DATABASE_URL: z.string(),
  SERVER_HOST: z.string(),
  SERVER_PORT: z.coerce.number().default(3000),
  CLIENT_PORT: z.coerce.number().default(5173),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // JWT_SECRET
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ 环境变量验证失败:');
    console.error(z.treeifyError(parsed.error));
    console.error('\n💡 提示: 检查根目录的 .env.development 文件');
    throw new Error('环境变量配置错误');
  }

  // 开发环境下输出加载的配置（生产环境不输出避免泄漏）
  if (parsed.data.NODE_ENV === 'development') {
    console.log('✅ 环境变量加载成功:', envFile);
  }

  return parsed.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
