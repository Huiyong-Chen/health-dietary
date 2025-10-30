import { appRouter } from '@health-dietary/api/router';
import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { createContext } from './context.mts';

const app = new Hono();

// 1. 设置 tRPC 中间件
// 所有 /trpc/* 的请求都会被 tRPC 处理
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
  })
);

// 2. 一个简单的欢迎路由
app.get('/', (c) => {
  return c.text('Hello Hono!');
});
console.log('Server is running on http://localhost:3000');

export default {
  port: 3000,
  fetch: app.fetch,
};
