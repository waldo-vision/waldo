import { prisma } from '@server/db/client';
import { JWTPayload, createRemoteJWKSet, jwtVerify } from 'jose';
import { retrieveRawUserInfoServer } from 'identity';
import { V2Session, Api } from 'identity';
import { userHasScope } from './rbac';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

// interface ExtendedIncomingHttpHeaders extends IncomingHttpHeaders {
//   authorization_id: string;
// }

const extractBearerTokenFromHeaders = (authorization: string | null) => {
  const bearerTokenIdentifier = 'Bearer';

  if (!authorization) {
    return undefined;
  }

  if (!authorization.startsWith(bearerTokenIdentifier)) {
    return undefined;
  }

  return authorization.slice(bearerTokenIdentifier.length + 1);
};

type CreateContextOptions = {
  session: V2Session | null;
  headers?: { [k: string]: string };
};

interface Payload extends JWTPayload {
  scope: string;
}

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

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const { req } = opts;
  const headers = req.headers;
  const token = extractBearerTokenFromHeaders(headers.get('Authorization'));
  if (token == 'undefined' || token == undefined) {
    return {
      session: null,
      prisma,
      headers: opts && Object.fromEntries(opts.req.headers),
    };
  }
  const { payload } = await jwtVerify<Payload>(
    token,
    createRemoteJWKSet(new URL(process.env.NEXT_PUBLIC_JWKS_ENDPOINT)),
    {
      issuer: process.env.NEXT_PUBLIC_ID_ISSUER,
      audience: process.env.NEXT_PUBLIC_RESOURCE_AUDIENCE,
    },
  );
  // Create the server session object from varius data endpoints.
  // grabs the logto user data.
  const user_data = await retrieveRawUserInfoServer(req.headers.get('cookie'));
  const identityData =
    user_data.userInfo.identities[
      Object.keys(user_data.userInfo.identities)[0]
    ];
  // get waldo user;

  const waldo_user_data = await prisma.v2Account.findFirst({
    where: {
      providerAccountId: identityData.userId,
    },
    include: {
      user: true,
    },
  });
  if (waldo_user_data === null || !payload || !payload.sub) {
    return {
      session: null,
      prisma,
      headers: opts && Object.fromEntries(opts.req.headers),
    };
  }

  // get user's roles from mapi
  const MAPI_at = await Api.getApiAccessToken();
  const userRoles = await Api.getUserRoles(MAPI_at, payload.sub);

  // created the server session object.
  const session: V2Session | null =
    !payload || !payload.sub
      ? null
      : {
          logto_id: payload.sub,
          id: waldo_user_data.user.id,
          provider: Object.keys(user_data.userInfo.identities)[0],
          providerId: identityData.userId,
          name: identityData.details.name,
          image: user_data.userInfo.picture,
          logto_username: user_data.userInfo.username,
          blacklisted: waldo_user_data
            ? waldo_user_data.user.blacklisted
            : false,
          scope: payload.scope.split(' '),
          hasScope: (requiredScope: Array<string>) => {
            const scope = payload.scope.split(' ');
            return userHasScope(scope, requiredScope);
          },
          roles: userRoles,
        };

  return {
    session,
    prisma,
    headers: opts && Object.fromEntries(opts.req.headers),
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
