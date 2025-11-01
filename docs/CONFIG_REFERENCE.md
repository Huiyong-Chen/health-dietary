# 配置文件详解

本文档详细说明项目中所有配置文件的每个配置项及其作用与影响。

---

## package.json

### 根 package.json

| 配置项            | 值                   | 作用             | 影响                                         |
| ----------------- | -------------------- | ---------------- | -------------------------------------------- |
| `name`            | `"health-dietary"`   | 项目名称         | 用于包管理和识别                             |
| `version`         | `"0.1.0"`            | 版本号           | 遵循语义化版本规范（主.次.修订）             |
| `private`         | `true`               | 私有包标记       | 防止意外发布到 npm 仓库                      |
| `type`            | `"module"`           | 模块系统类型     | 启用 ES 模块，允许使用 import/export         |
| `packageManager`  | `"pnpm@10.12.1"`     | 包管理器版本锁定 | 确保团队使用相同版本的 pnpm                  |
| `engines.node`    | `">=18.0.0"`         | Node.js 版本要求 | 要求 Node.js >= 18（支持原生 ESM、fetch 等） |
| `engines.pnpm`    | `">=9.0.0"`          | pnpm 版本要求    | 要求 pnpm >= 9（支持最新 workspace 特性）    |
| `scripts.prepare` | `"husky"`            | Git hooks 初始化 | 安装依赖后自动初始化 Husky                   |
| `scripts.lint`    | `"eslint ."`         | 运行 ESLint 检查 | 检测代码质量问题                             |
| `scripts.format`  | `"prettier --write"` | 格式化代码       | 自动修复格式问题                             |

### 子包 package.json (apps/server)

| 配置项          | 值                         | 作用             | 影响                           |
| --------------- | -------------------------- | ---------------- | ------------------------------ |
| `name`          | `"@health-dietary/server"` | 包名（命名空间） | 使用 `@` 前缀防止冲突          |
| `main`          | `"dist/index.js"`          | 主入口文件       | 其他包 import 此包时加载的文件 |
| `scripts.dev`   | `"tsx watch"`              | 开发模式         | 监听文件变化自动重启           |
| `scripts.build` | `"tsc"`                    | 编译生产代码     | 将 src/_.mts 编译为 dist/_.js  |
| `scripts.start` | `"node dist/index.js"`     | 生产环境启动     | 运行编译后的 JS 文件           |

---

## tsconfig.json

### 根 tsconfig.json

| 分类             | 配置项                             | 值           | 作用                          | 影响                                                       |
| ---------------- | ---------------------------------- | ------------ | ----------------------------- | ---------------------------------------------------------- |
| **语言和环境**   | `target`                           | `"ES2022"`   | 编译后的 JavaScript 版本      | 决定可使用的语法（如 top-level await）                     |
|                  | `lib`                              | `["ES2022"]` | 包含的标准库类型定义          | 决定可使用的全局 API（如 Array.at）                        |
| **模块系统**     | `module`                           | `"ESNext"`   | 生成的模块系统类型            | 使用最新 ES 模块标准（import/export）                      |
|                  | `moduleResolution`                 | `"node"`     | 模块解析策略                  | Node.js 风格解析，后端环境适用（前端项目可覆盖为 Bundler） |
|                  | `resolveJsonModule`                | `true`       | 允许导入 JSON 文件            | 可以 `import config from './config.json'`                  |
|                  | `allowJs`                          | `false`      | 是否允许编译 JS 文件          | 强制使用 TypeScript，确保类型安全                          |
| **类型检查**     | `strict`                           | `true`       | 启用所有严格检查              | 包含 strictNullChecks、noImplicitAny 等                    |
|                  | `noUnusedLocals`                   | `true`       | 禁止未使用的局部变量          | 强制清理无用代码                                           |
|                  | `noUnusedParameters`               | `true`       | 禁止未使用的函数参数          | 避免参数冗余                                               |
|                  | `noImplicitReturns`                | `true`       | 函数必须明确返回              | 避免部分代码路径缺少 return                                |
|                  | `noFallthroughCasesInSwitch`       | `true`       | 禁止 switch case 穿透         | 强制使用 break/return                                      |
| **互操作性约束** | `esModuleInterop`                  | `true`       | ES 模块与 CommonJS 互操作     | 允许 `import express from 'express'`                       |
|                  | `allowSyntheticDefaultImports`     | `true`       | 允许合成默认导入              | 改善模块导入体验                                           |
|                  | `isolatedModules`                  | `true`       | 确保每个文件可独立编译        | 兼容 Babel、esbuild 等工具                                 |
|                  | `forceConsistentCasingInFileNames` | `true`       | 强制文件名大小写一致          | 避免跨平台导入路径错误                                     |
| **生成文件**     | `declaration`                      | `true`       | 生成 .d.ts 类型声明           | 其他项目引用时获得类型提示                                 |
|                  | `declarationMap`                   | `true`       | 生成类型声明的 source map     | 调试时可跳转到 TS 源码                                     |
|                  | `sourceMap`                        | `true`       | 生成 JavaScript 的 source map | 调试器可显示 TS 源码                                       |
| **其他**         | `skipLibCheck`                     | `true`       | 跳过 .d.ts 文件检查           | 加快编译，避免第三方库类型错误                             |

### 子项目 tsconfig.json (apps/server)

| 配置项      | 值                 | 作用             | 影响                                       |
| ----------- | ------------------ | ---------------- | ------------------------------------------ |
| `extends`   | `"../../tsconfig"` | 继承根配置       | 避免重复配置，统一编译规则                 |
| `outDir`    | `"./dist"`         | 编译输出目录     | 源码和产物分离，便于 .gitignore            |
| `rootDir`   | `"./src"`          | 源代码根目录     | 保留源码目录结构                           |
| `composite` | `true`             | 启用项目引用     | 生成 .tsbuildinfo 用于增量编译             |
| `types`     | `["node"]`         | 包含的类型声明包 | 提供 Node.js API 类型，排除浏览器 DOM 类型 |

---

## eslint.config.mts

| 配置                                      | 作用                              | 影响                                                    |
| ----------------------------------------- | --------------------------------- | ------------------------------------------------------- |
| `eslint.configs.recommended`              | ESLint 官方推荐规则               | 检测常见 JavaScript 错误（no-unused-vars、no-undef 等） |
| `tseslint.configs.recommendedTypeChecked` | TypeScript 推荐规则（类型检查）   | 利用 TS 类型信息深度检查（如 no-floating-promises）     |
| `eslintPrettierConfig`                    | Prettier 配置                     | 禁用与 Prettier 冲突的 ESLint 规则                      |
| `eslintPrettierrecommended`               | Prettier 推荐配置                 | 将 Prettier 规则集成到 ESLint                           |
| `projectService: true`                    | 自动发现 tsconfig.json            | 启用类型感知的 lint 规则                                |
| `tsconfigRootDir`                         | tsconfig 搜索根目录               | 确保 ESLint 正确找到 TypeScript 配置                    |
| `prettier/prettier: 'error'`              | Prettier 格式错误                 | 格式不符合时报错                                        |
| `no-unused-vars`                          | 禁止未使用的变量（允许 `_` 前缀） | 以 `_` 开头的变量/参数不报错                            |
| `explicit-function-return-type: 'off'`    | 关闭返回类型声明要求              | 允许类型推断，减少冗余注解                              |
| `no-explicit-any: 'warn'`                 | 警告使用 any                      | 鼓励精确类型，但不强制                                  |

---

## prettier.config.mjs

| 配置项          | 值         | 作用           | 示例                  | 影响                             |
| --------------- | ---------- | -------------- | --------------------- | -------------------------------- |
| `semi`          | `true`     | 添加分号       | `const x = 1;`        | 避免 ASI 自动分号插入问题        |
| `trailingComma` | `'all'`    | 尾随逗号       | `{ a: 1, b: 2, }`     | 减少 Git diff 噪音，便于重排元素 |
| `singleQuote`   | `true`     | 使用单引号     | `const s = 'hello'`   | 统一字符串引号风格               |
| `printWidth`    | `100`      | 单行最大字符数 | 超过 100 字符自动换行 | 提高可读性，适应宽屏             |
| `tabWidth`      | `2`        | 缩进空格数     | 一级缩进 = 2 空格     | 紧凑的缩进风格                   |
| `useTabs`       | `false`    | 使用空格缩进   | 不使用 Tab 字符       | 跨编辑器显示一致                 |
| `arrowParens`   | `'always'` | 箭头函数括号   | `(x) => x`            | 与 TS 类型注解兼容               |
| `endOfLine`     | `'lf'`     | 换行符类型     | 使用 LF（\n）         | 跨平台统一，避免 Git 换行符冲突  |

---

## commitlint.config.ts

| 配置                | 值                                    | 作用                      | 影响                                   |
| ------------------- | ------------------------------------- | ------------------------- | -------------------------------------- |
| `extends`           | `['@commitlint/config-conventional']` | 继承 Conventional Commits | 强制 `<type>(<scope>): <subject>` 格式 |
| `parserPreset`      | 支持 emoji 前缀                       | 解析 gitemoji 格式        | 允许 `✨ feat: 新功能` 格式            |
| `type-enum`         | 限制提交类型                          | 规范提交分类              | 只允许 feat、fix、docs 等类型          |
| `subject-case`      | `[0]` 禁用                            | 允许任意大小写            | 不限制提交主题的大小写格式             |
| `header-max-length` | `[2, 'always', 100]`                  | 标题长度限制              | 最大 100 字符（包含 emoji）            |

**允许的提交类型**：feat, fix, docs, style, refactor, perf, test, chore, revert, build, ci

---

**最后更新**：2025-11-01
