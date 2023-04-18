import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { type Session } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { prisma } from '@server/db/client';
import { IncomingHttpHeaders } from 'http';

interface ExtendedIncomingHttpHeaders extends IncomingHttpHeaders {
  authorization_id: string;
}
import { NextApiRequest } from 'next';
import { Roles } from 'database';

/**
 * For testing purposes, we need the ability to disable cookie verification.
 *
 * This method will read a list of "dumby" variable that we will use to configure the
 * session object. This lets the user set in their request their `id` and `role`.
 *
 * E.g. A user can set their cookie as `role=ADMIN; userId=adminUser` if they wish
 * to identify as an admin for this request.
 */
const createDumbySession = (req: NextApiRequest): Session | undefined => {
  // Parse cookies from string to map
  const cookies = (req.headers.cookie || '')
    .split(';')
    .map(s => s.trim().split('='))
    .reduce((obj, cur) => obj.set(cur[0], cur[1]), new Map<string, string>());

  // Parse role from cookie
  let role: Roles = Roles.USER;
  switch (cookies.get('role')) {
    case 'ADMIN':
      role = Roles.ADMIN;
    case 'MOD':
      role = Roles.MOD;
    case 'TRUSTED':
      role = Roles.TRUSTED;
  }

  const session: Session = {
    user: {
      id: cookies.get('userId') || '',
      provider: cookies.get('provider') || '',
      blacklisted: false,
      role,
    },
    expires: '',
  };

  return session;
};

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

  // See if authentication has been disabled for this environment.
  // If so, create a dumby session.
  if (['1', 'true'].includes(process.env.DISABLE_VERIFY_AUTH || '')) {
    const session = createDumbySession(req);

    // If a the dumby variables have not been set, continue with auth as usual.
    if (session?.user?.id && session.user.role)
      return await createContextInner({
        session,
      });
  }

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerSession(req, res, authOptions);

  return await createContextInner({
    session,
    headers,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
