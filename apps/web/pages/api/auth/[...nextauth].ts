import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { Awaitable, Session, User } from 'next-auth';
import { Adapter, AdapterAccount } from 'next-auth/adapters';
import { prisma } from '@server/db/client';
import OryHydraProvider from '@auth-providers/ory-hydra';
import { Roles } from 'database';
import GitHubProvider from 'next-auth/providers/github';
//TODO: readd sentry stuff

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(Buffer.from(base64, 'base64').toString());
}

interface SessionCallback {
  session: Session;
  user: User;
}

interface HydraIdentToken {
  email: string;
  image: string;
  name: string;
  provider: string;
  provider_id: string;
}

interface RedirectCallback {
  baseUrl: string;
}

const adapter = {
  ...PrismaAdapter(prisma),
  linkAccount: ({
    _sub,
    ...data
  }: any): Promise<void> | Awaitable<AdapterAccount | null | undefined> => {
    if (data.provider === 'hydra') {
      const userinfo = parseJwt(data.id_token) as HydraIdentToken;
      //Check if user already has account
      return prisma.account
        .findFirstOrThrow({
          where: {
            AND: {
              provider: {
                equals: userinfo.provider,
              },
              providerAccountId: {
                equals: userinfo.provider_id,
              },
            },
          },
        })
        .then(user => {
          //we found our matching user. We'll update the values so that hydra takes over login
          return prisma.account.update({
            where: {
              provider_providerAccountId: {
                provider: user.provider,
                providerAccountId: user.providerAccountId,
              },
            },
            data: {
              provider: 'hydra',
              providerAccountId: data.providerAccountId,
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              scope: data.scope,
              id_token: data.id_token,
              expires_at: data.expires_at,
              token_type: data.token_type,
            },
          });
        })
        .then(() => {
          //return modified acc to nextauth
          return prisma.account.findFirst({
            where: {
              AND: {
                provider: {
                  equals: userinfo.provider,
                },
                providerAccountId: {
                  equals: userinfo.provider_id,
                },
              },
            },
          }) as Awaitable<AdapterAccount>;
        })
        .catch(() => {
          //means no user found -> we need to create our own
          //but check if user with email exists, since then you should be denied
          return prisma.user
            .findUnique({
              where: {
                email: userinfo.email,
              },
              include: {
                accounts: {},
              },
            })
            .then(user => {
              console.log(JSON.stringify(user));
              if (user === null || user.accounts.length === 0) {
                //user.accounts.length is fix for case, where the system created the user first, without creating acc, so if no accounts found, user should be linked
                //no accounts linked to user
                return prisma.account.create({
                  data,
                }) as Awaitable<AdapterAccount>;
              }
              //user already exists with wrong provider
              return Promise.reject('REJECTED'); //this may throw errors somewhere, that should be catched
            })
            .catch(
              () =>
                Promise.reject(
                  'User email already exists: Migration cannot continue', //this propagates error from above
                ) as Awaitable<AdapterAccount>,
            );
        });
    }
    //here not hydra
    return prisma.account.create({ data }) as Awaitable<AdapterAccount>;
  },
} as Adapter;

export const authOptions = {
  adapter,
  providers: [
    OryHydraProvider({
      clientId: process.env.HYDRA_CLIENT_ID,
      clientSecret: process.env.HYDRA_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      //TODO remove for testing only
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session(sessionCallback: SessionCallback) {
      const session = sessionCallback.session;
      const user = sessionCallback.user;
      if (session.user) {
        session.user.id = user.id;
        if (user) {
          const userAccount = await prisma.account.findFirst({
            where: {
              userId: user.id,
            },
            include: {
              user: true,
            },
          });

          session.user.provider = userAccount?.provider as string;
          session.user.role = userAccount?.user.role as Roles;
          session.user.blacklisted = userAccount?.user.blacklisted as boolean;
        }
      }
      return session;
    },
  },
  async redirect(redirectCallback: RedirectCallback) {
    // redirects to home page instead of auth page on signup/in/ or logout.
    return redirectCallback.baseUrl;
  },
};

export default NextAuth(authOptions);
