# 项目搭建指南

本文档记录 Health-Dietary 项目的完整搭建流程。

## 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 9.0.0
- **Git**: >= 2.0.0

## 项目结构

```
health-dietary/
├── apps/
│   └── server/               # 后端服务
│       ├── src/
│       │   └── index.mts
│       ├── package.json
│       └── tsconfig.json
├── packages/                 # 共享包（待添加）
├── prisma/                   # 数据库 Schema
├── docs/                     # 文档目录
├── .husky/                   # Git hooks
├── commitlint.config.ts      # Commitlint 配置
├── eslint.config.mts         # ESLint 配置
├── lint-staged.config.ts     # Lint-staged 配置
├── prettier.config.mts       # Prettier 配置
├── tsconfig.json             # TypeScript 根配置
├── pnpm-workspace.yaml       # pnpm 工作空间配置
└── package.json              # 根配置
```

## 搭建步骤

### 1. 创建目录结构

```bash
mkdir -p apps/server/src packages prisma docs
```

### 2. 配置 pnpm Workspace

创建 `pnpm-workspace.yaml`：

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 3. 配置根 package.json

```json
{
  "name": "health-dietary",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.12.1",
  "scripts": {
    "prepare": "husky",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

### 4. 配置 TypeScript

#### 根 tsconfig.json

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "allowJs": false,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true
  },
  "exclude": ["node_modules", "dist", "build"]
}
```

#### 子项目 tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "types": ["node"]
  },
  "include": ["src/**/*.mts"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. 安装开发依赖

```bash
pnpm add -D -w typescript @types/node tsx
pnpm add -D -w eslint @eslint/js typescript-eslint
pnpm add -D -w prettier eslint-config-prettier eslint-plugin-prettier
pnpm add -D -w husky lint-staged
pnpm add -D -w @commitlint/cli @commitlint/config-conventional @commitlint/types
pnpm add -D -w jiti
```

### 6. 配置 ESLint

创建 `eslint.config.mts`：

```typescript
import eslint from '@eslint/js';
import eslintPrettierConfig from 'eslint-config-prettier/flat';
import eslintPrettierrecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['node_modules/**', 'dist/**', 'build/**', '.qoder/**']),
  {
    files: ['**/*.{ts,mts}'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      eslintPrettierConfig,
      eslintPrettierrecommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
```

### 7. 配置 Prettier

创建 `prettier.config.mts`：

```typescript
import { type Config } from 'prettier';

const config: Config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
};

export default config;
```

### 8. 配置 Husky 和 lint-staged

```bash
# 安装依赖后会自动初始化 husky
pnpm install

# 创建 pre-commit hook
echo "pnpm lint-staged" > .husky/pre-commit
```

创建 `lint-staged.config.ts`：

```typescript
import { Configuration } from 'lint-staged';

const config: Configuration = {
  '**/*.{ts,mts}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,yaml,yml,md}': ['prettier --write'],
};

export default config;
```

### 9. 配置 Commitlint

创建 `commitlint.config.ts`：

```typescript
import { type UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
        'ci',
      ],
    ],
    'subject-case': [0],
  },
};

export default config;
```

```bash
# 创建 commit-msg hook
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### 10. 配置 .gitignore

```
.qoder/*

node_modules/
dist/
build/
*.log
.DS_Store
.env
.env.local
.env.*.local

*.tsbuildinfo

.vscode/
.idea/
```

### 11. 验证配置

```bash
pnpm format
pnpm lint
pnpm format:check
```

## 常用命令

| 命令                                   | 说明             |
| -------------------------------------- | ---------------- |
| `pnpm install`                         | 安装所有依赖     |
| `pnpm lint`                            | 运行 ESLint 检查 |
| `pnpm format`                          | 格式化所有代码   |
| `pnpm -F @health-dietary/server dev`   | 运行 server 开发 |
| `pnpm -F @health-dietary/server build` | 编译 server      |

## 提交规范

格式：`<type>(<scope>): <subject>`

**示例**：`feat(auth): 添加 JWT 认证功能`

**类型**：feat, fix, docs, style, refactor, perf, test, chore, revert, build, ci

---

**最后更新**：2025-10-31
