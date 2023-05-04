import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { Session, User } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import { prisma } from '@server/db/client';
import OryHydraProvider from '@auth-providers/ory-hydra';
import { Roles } from 'database';

//TODO: readd sentry stuff

interface SessionCallback {
  session: Session;
  user: User;
}

interface RedirectCallback {
  baseUrl: string;
}

const adapter = {
  ...PrismaAdapter(prisma),
  linkAccount: ({ _sub, ...data }: any) => prisma.account.create({ data }),
} as Adapter;

export const authOptions = {
  adapter,
  providers: [
    OryHydraProvider({
      clientId: process.env.HYDRA_CLIENT_ID,
      clientSecret: process.env.HYDRA_CLIENT_SECRET,
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
    async redirect(redirectCallback: RedirectCallback) {
      // redirects to home page instead of auth page on signup/in/ or logout.
      return redirectCallback.baseUrl;
    },
  },
};

export default NextAuth(authOptions);
