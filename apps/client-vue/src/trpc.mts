import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@health-dietary/api/router';
import { clientConfig } from '@health-dietary/config/index.mts';

export const tRPCClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: clientConfig.apiUrl,
    }),
  ],
});
