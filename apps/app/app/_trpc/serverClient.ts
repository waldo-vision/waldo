import { experimental_nextHttpLink } from '@trpc/next/app-dir/links/nextHttp';
import { experimental_createTRPCNextAppDirServer } from '@trpc/next/app-dir/server';
import type { AppRouter } from '@server/trpc/router/_app';
import { cookies } from 'next/headers';
import superjson from 'superjson';
import axios from 'axios';
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

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        experimental_nextHttpLink({
          revalidate: false,
          batch: true,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc`,
          headers: async () => {
            
            return {
              Authorization: `Bearer ${await retrieveAccessToken()}`,
              cookie: cookies().toString(),
            };
          },
        }),
      ],
    };
  },
});

// export const createAction =
