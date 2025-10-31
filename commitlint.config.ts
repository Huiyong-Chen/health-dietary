/**
 * Commitlint 配置文件 (CommonJS 格式，使用 TypeScript)
 * 用途：规范 Git 提交信息格式
 * 格式：[emoji] <type>(<scope>): <subject> 或 <type>(<scope>): <subject>
 */

import { type UserConfig } from '@commitlint/types';

const config: UserConfig = {
  // 继承预设
  extends: ['@commitlint/config-conventional'], // Conventional Commits 规范
  // 自定义解析器选项
  parserPreset: {
    parserOpts: {
      // 支持 emoji 前缀的正则表达式
      // 匹配格式：[emoji] type(scope): subject 或 type(scope): subject
      headerPattern:
        /^(?:(?<emoji>[\p{Emoji_Presentation}\p{Extended_Pictographic}]+)\s)?(?<type>\w+)(?:\((?<scope>[\w-]+)\))?:\s(?<subject>.+)$/u,
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
    },
  },
  // 自定义规则
  rules: {
    // 允许的提交类型
    'type-enum': [
      2, // 错误级别
      'always', // 始终应用
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档变更
        'style', // 代码格式（不影响功能）
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试相关
        'chore', // 构建/工具变动
        'revert', // 回滚提交
        'build', // 构建系统变更
        'ci', // CI/CD 配置
      ],
    ],

    // 主题大小写规则
    'subject-case': [0], // 禁用，允许任意大小写

    // 允许 emoji
    'header-max-length': [0], // 禁用标题长度限制（emoji 会增加字符数）
    'type-empty': [0], // 允许 type 为空（支持纯 emoji 开头）
  },
};

export default config;

// 提交信息格式示例
// ============================================================================
// 标准格式：
// feat(auth): 添加 JWT 认证功能
//
// 带 emoji 格式：
// ✨ feat(auth): 添加 JWT 认证功能
// 🐛 fix(api): 修复用户注册接口错误
// 📝 docs(readme): 更新安装说明
// 💄 style: 统一代码格式
// ♻️ refactor(user): 重构用户验证逻辑
// ⚡️ perf(db): 优化查询性能
// ✅ test(auth): 添加登录测试
// 🔧 chore(deps): 升级依赖版本
//
// 详细提交信息：
// ✨ feat(auth): 添加 JWT 认证功能
//
// 实现基于 JWT 的用户认证，支持设备类型检测和单点登录
//
// Closes #123
// ============================================================================
