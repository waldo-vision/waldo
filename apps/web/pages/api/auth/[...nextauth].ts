import { PrismaAdapter } from '@next-auth/prisma-adapter';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import BattleNetProvider from '@auth-providers/battlenet';
import FaceBookProvider from 'next-auth/providers/facebook';
import TwitchProvider from 'next-auth/providers/twitch';
import { prisma } from '@server/db/client';
import NextAuth from 'next-auth/next';
import { Profile, Session, User } from 'next-auth';
import { Roles } from 'database';
import { Account } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import DebugLoginProvider from '@auth-providers/debug_login';

const RicanGHId = '59850372';
const HomelessGHId = '30394883';

interface SessionCallback {
  session: Session;
  user: User;
}

interface signInCallback {
  account: Account | null;
  profile?: Profile | undefined;
}

interface RedirectCallback {
  baseUrl: string;
}

const adapter = {
  ...PrismaAdapter(prisma),
  linkAccount: ({ sub, ...data }: any) => prisma.account.create({ data }),
} as Adapter;

export const authOptions = {
  adapter,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify email guilds' } },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    BattleNetProvider({
      clientId: process.env.BTLNET_CLIENT_ID,
      clientSecret: process.env.BTLNET_CLIENT_SECRET,
    }),
    FaceBookProvider({
      clientId: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      issuer: 'https://id.twitch.tv/oauth2/authorize',
    }),
    DebugLoginProvider({
      //debug login provider connecting to emulated oauth
      clientId: 'DEBUGCLIENTID', //these here are only needed for typescript
      clientSecret: 'DEBUGCLIENTSECRET',
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
    async signIn(signInCallback: signInCallback) {
      if (signInCallback.account?.provider === 'github') {
        if (
          signInCallback.account.providerAccountId == RicanGHId ||
          signInCallback.account.providerAccountId == HomelessGHId
        ) {
          try {
            const account = await prisma.account.findFirst({
              where: {
                providerAccountId: signInCallback.account.providerAccountId,
              },
              include: {
                user: true,
              },
            });
            console.log(account);
            const userDocId = account?.user.id as string;
            console.log(userDocId);
            // update doc.
            await prisma.user.update({
              where: {
                id: userDocId,
              },
              data: {
                role: Roles.ADMIN,
              },
            });
          } catch {
            // return true here even if error because account does not exist...
            // but still allow user otherwise they would never be able to sign in
            return true;
          }
          return true;
        }
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
