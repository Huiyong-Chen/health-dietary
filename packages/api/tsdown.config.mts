import { defineConfig } from 'tsdown';

export default defineConfig({
  // 定义所有的入口文件
  entry: {
    router: './src/router.mts',
    trpc: './src/trpc.mts',
  },
  // 开启 .d.ts 类型定义文件的生成
  dts: true,
  clean: true,
});
