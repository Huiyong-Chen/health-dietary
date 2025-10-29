import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // 全局忽略配置
  {
    ignores: ['**/node_modules/**', '**/dist/**'],
  },

  // ESLint 官方推荐的基础规则
  js.configs.recommended,

  // TypeScript-ESLint 的推荐规则
  ...tseslint.configs.recommended,

  // Prettier 配置，用来关闭和 ESLint 冲突的样式规则
  prettierRecommended,

  // 自定义规则配置（覆盖上述所有配置）
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
];
