import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 2. 使用 defineConfig 包裹整个配置数组
export default defineConfig([
  // 全局忽略配置
  globalIgnores(['**/node_modules/**', '**/dist/**']),
  {
    files: ['**/*.{ts,mts}'],
    extends: [
      // ESLint 官方推荐的基础规则
      js.configs.recommended,
      // TypeScript-ESLint 的推荐规则
      tseslint.configs.recommended,
      // Prettier 配置，用来关闭和 ESLint 冲突的样式规则
      prettierRecommended,
    ],
    // 自定义规则配置（覆盖上述所有配置）
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]);
