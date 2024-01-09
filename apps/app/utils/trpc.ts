import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';

import { type AppRouter } from '../server/trpc/router/_app';
import { getBaseUrl } from './baseurl';
import axios from 'axios';
const retrieveAccessToken = async () => {
  const req = await axios.get('https://app.foo.bar/api/logto/accesstoken', {
    withCredentials: true,
  });
  const res = await req.data;
  if (!res.accessToken) return undefined;
  return res.accessToken;
};

/**
 * Trpc client for the frontend
 */
export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers: async () => {
            return {
              Authorization:
                (await retrieveAccessToken()) == undefined
                  ? undefined
                  : `Bearer ${await retrieveAccessToken()}`,
            };
          },
        }),
      ],
    };
  },
  ssr: false,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
