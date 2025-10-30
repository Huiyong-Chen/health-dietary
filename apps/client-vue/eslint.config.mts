import eslintPluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import rootConfig from '../../eslint.config.mts';
import tseslint from 'typescript-eslint';
import eslintParserVue from 'vue-eslint-parser';

export default defineConfig([
  {
    files: ['**/*.{ts,mts,tsx}'],
    extends: [...rootConfig, ...eslintPluginVue.configs['flat/recommended']],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: eslintParserVue,
      parserOptions: {
        parser: tseslint.parser,
        ecmaFeatures: { jsx: true },
      },
    },
  },
]);
