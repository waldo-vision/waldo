import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import {
  experimental_createActionHook,
  experimental_createTRPCNextAppDirClient,
  experimental_serverActionLink,
} from '@trpc/next/app-dir/client';
import { experimental_nextHttpLink } from '@trpc/next/app-dir/links/nextHttp';
import { type AppRouter } from '@server/trpc/router/_app';
import axios from 'axios';
import { cookies } from 'next/headers';

const retrieveAccessToken = async () => {
  const req = await axios.get(
    process.env.NEXT_PUBLIC_BASE_URL + '/api/logto/accesstoken',
    {
      withCredentials: true,
      headers: {
        Cookie: cookies().toString(),
      },
    },
  );
  const res = await req.data;
  if (!res.accessToken) return undefined;
  return res.accessToken;
  // gets returned and piped into TRPC headers
};

/**
 * Trpc client for the frontend
 */
export const trpc = experimental_createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        experimental_nextHttpLink({
          batch: false,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc`,
          headers: async () => {
            return {
              Authorization:
                (await retrieveAccessToken()) == undefined
                  ? undefined
                  : `Bearer ${await retrieveAccessToken()}`,
              cookie: cookies().toString(),
            };
          },
        }),
      ],
    };
  },
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
