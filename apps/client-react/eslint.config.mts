import rootConfig from '../../eslint.config.mts';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      rootConfig,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
  },
]);
