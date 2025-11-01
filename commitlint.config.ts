/**
 * Commitlint 配置文件 (ESM 格式，使用 TypeScript)
 * 用途：规范 Git 提交信息格式
 * 格式：[emoji] <type>(<scope>): <subject>
 */

import { type UserConfig } from '@commitlint/types';

const config: UserConfig = {
  // 继承预设
  extends: ['@commitlint/config-conventional'],

  // 自定义解析器选项（支持 gitemoji 前缀）
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

    // 标题长度限制（考虑 emoji 占用字符）
    'header-max-length': [2, 'always', 100], // 限制标题最大 100 字符
  },
};

export default config;

// 提交信息格式示例
// ============================================================================
// 标准格式（推荐带 gitemoji）：
// [emoji] <type>(<scope>): <subject>
//
// 示例：
// ✨ feat(auth): 添加 JWT 认证功能
// 🐛 fix(api): 修复用户注册接口错误
// 📝 docs(readme): 更新安装说明
// 💄 style: 统一代码格式
// ♻️ refactor(user): 重构用户验证逻辑
// ⚡️ perf(db): 优化查询性能
// ✅ test(auth): 添加登录测试
// 🔧 chore(deps): 升级依赖版本
// 🎨 style(ui): 优化界面布局
// 🔥 chore: 移除废弃代码
//
// 不带 emoji 也支持：
// feat(auth): 添加 JWT 认证功能
//
// 详细提交信息：
// ✨ feat(auth): 添加 JWT 认证功能
//
// 实现基于 JWT 的用户认证，支持设备类型检测和单点登录
//
// Closes #123
//
// 常用 Gitemoji 参考：
// ✨ :sparkles: 新功能
// 🐛 :bug: Bug 修复
// 📝 :memo: 文档更新
// 💄 :lipstick: UI/样式更新
// ♻️ :recycle: 代码重构
// ⚡️ :zap: 性能优化
// ✅ :white_check_mark: 添加测试
// 🔧 :wrench: 配置文件修改
// 🎨 :art: 代码结构/格式优化
// 🔥 :fire: 移除代码/文件
// ============================================================================
