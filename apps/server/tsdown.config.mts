import { defineConfig } from 'tsdown';

export default defineConfig({
  // 定义所有的入口文件
  entry: './src/index.mts',
  // 开启 .d.ts 类型定义文件的生成
  dts: true,
  format: ['esm'], // 明确指定输出 ESM 格式
});
