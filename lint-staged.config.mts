/**
 * Lint-staged 配置文件 (ESM 格式，使用 TypeScript)
 * 用途：对 Git 暂存文件运行 linters
 * 时机：Git commit 前自动执行（通过 Husky pre-commit hook）
 */
import { type Configuration } from 'lint-staged';

const config: Configuration = {
  // TypeScript 模块文件：先 lint 修复，再格式化
  '**/*.{ts,mts}': ['eslint --fix', 'prettier --write'],

  // 配置和文档文件：仅格式化
  '**/*.{json,yaml,yml,md}': ['prettier --write'],
};

export default config;
