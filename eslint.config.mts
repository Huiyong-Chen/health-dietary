/**
 * ESLint 配置文件 (ESM 格式，使用 TypeScript)
 * 用途：代码质量检查和规范约束
 * 格式：ESLint v9+ Flat Config
 */

import eslint from '@eslint/js';
import eslintPrettierConfig from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // 忽略配置
  globalIgnores([
    'node_modules/**', // 第三方依赖
    'dist/**', // 编译输出
    'build/**', // 构建产物
    '.qoder/**', // 工具目录
  ]),
  {
    // 仅对 .ts, .mts 文件生效
    files: ['**/*.{ts,mts}'],
    // 基础规则集
    extends: [
      eslint.configs.recommended, // ESLint 官方推荐规则
      ...tseslint.configs.recommendedTypeChecked, // TypeScript 类型检查规则
      eslintPrettierConfig, // 禁用与 Prettier 冲突的规则
    ],
    // 语言选项
    languageOptions: {
      parserOptions: {
        projectService: true, // 自动发现 tsconfig.json
        tsconfigRootDir: import.meta.dirname, // TypeScript 配置根目录
      },
    },
    // 文件级规则
    rules: {
      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // 允许 _开头的参数
          varsIgnorePattern: '^_', // 允许 _开头的变量
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off', // 允许类型推断
      '@typescript-eslint/no-explicit-any': 'warn', // 警告使用 any
    },
  },
);
