import superjson from 'superjson';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'web/server/trpc/router/_app';
import * as users from './users';

// Where is the API deployed
const WALDO_URI = process.env.WALDO_URI || 'http://localhost:3000';

/**
 * Create tRPC clients for each of the test users.
 */
export const basicClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${WALDO_URI}/api/trpc`,
      // You can pass any HTTP headers you wish here
      headers: {
        Cookie: users.createUserCookie(users.testUserBasic),
      },
    }),
  ],
  transformer: superjson,
});

export const trustedClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${WALDO_URI}/api/trpc`,
      // You can pass any HTTP headers you wish here
      headers: {
        Cookie: users.createUserCookie(users.testUserTrusted),
      },
    }),
  ],
  transformer: superjson,
});

export const modClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${WALDO_URI}/api/trpc`,
      // You can pass any HTTP headers you wish here
      headers: {
        Cookie: users.createUserCookie(users.testUserMod),
      },
    }),
  ],
  transformer: superjson,
});

export const adminClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${WALDO_URI}/api/trpc`,
      // You can pass any HTTP headers you wish here
      headers: {
        Cookie: users.createUserCookie(users.testUserAdmin),
      },
    }),
  ],
  transformer: superjson,
});
