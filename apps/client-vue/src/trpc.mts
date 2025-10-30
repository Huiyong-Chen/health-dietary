import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@health-dietary/api/router';

// 创建一个代理客户端实例
export const tRPCClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});
