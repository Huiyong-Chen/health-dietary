import { appRouter } from '@health-dietary/api/router';
import { serverConfig } from '@health-dietary/config/index.mts';
import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { createContext } from './context.mts';

const app = new Hono();

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
  }),
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

console.log(
  `Server is running on http://${serverConfig.host}:${serverConfig.port}`,
);

export default {
  port: serverConfig.port,
  fetch: app.fetch,
};
