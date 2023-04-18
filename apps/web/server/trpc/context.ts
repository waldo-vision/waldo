import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { type Session } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { prisma } from '@server/db/client';
import { IncomingHttpHeaders } from 'http';

type CreateContextOptions = {
  session: Session | null;
  headers?: IncomingHttpHeaders;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    headers: opts.headers,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const headers = req.headers;
  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerSession(req, res, authOptions);

  return await createContextInner({
    session,
    headers,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
