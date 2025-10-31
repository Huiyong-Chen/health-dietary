import { type Config } from 'prettier';
const config: Config = {
  // 基础格式
  semi: true, // 使用分号
  singleQuote: true, // 使用单引号
  trailingComma: 'all', // 所有可能的地方添加尾随逗号

  // 行宽和缩进
  printWidth: 100, // 单行最大 100 字符
  tabWidth: 2, // 2 个空格表示一级缩进
  useTabs: false, // 使用空格而非 Tab

  // 其他规则
  arrowParens: 'always', // 箭头函数参数始终使用括号
  endOfLine: 'lf', // 使用 LF 换行符 (Unix/Linux/macOS)
};

export default config;
