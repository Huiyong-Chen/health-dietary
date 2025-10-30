import eslint from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 2. 使用 defineConfig 包裹整个配置数组
export default defineConfig([
  globalIgnores(['**/node_modules/**', '**/dist/**', '**/src/generated/**']),
  {
    files: ['**/*.{ts,mts}'],
    extends: [
      // ESLint 官方推荐的基础规则
      eslint.configs.recommended,
      // TypeScript-ESLint 的推荐规则
      ...tseslint.configs.recommended,
      // Prettier 配置，用来关闭和 ESLint 冲突的样式规则
      prettierRecommended,
    ],
    // 自定义规则配置（覆盖上述所有配置）
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node, // 根配置主要服务于 api 和 server，应使用 Node.js 全局变量
      },
      parser: tseslint.parser, // 声明全局的 TS 解析器
      parserOptions: {
        project: './tsconfig.eslint.json', // 开启全局的 project-aware linting
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]);
