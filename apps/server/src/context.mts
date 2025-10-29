import { db } from './db.mts';

// 创建 Context，这个函数在每个请求中被调用
export const createContext = () => {
  return {
    db, // 把我们的 Prisma Client 实例放到 Context 中
  };
};
