import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@health-dietary/api/router';

export const trpc = createTRPCReact<AppRouter>();
