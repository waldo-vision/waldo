import { PrismaAdapter } from '@next-auth/prisma-adapter';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import BattleNetProvider from 'next-auth/providers/battlenet';
import FaceBookProvider from 'next-auth/providers/facebook';
import TwitchProvider from 'next-auth/providers/twitch';
import { prisma } from '@server/db/client';
import NextAuth from 'next-auth/next';
export const authOptions = {
  adapter: PrismaAdapter(prisma),
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
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.avatarUrl = user.image;
        if (user) {
          const userAccount = await prisma.account.findFirst({
            where: {
              userId: user.id,
            },
          });
          session.user.provider = userAccount.provider;
        }
      }
      return session;
    },
    async redirect({ baseUrl }) {
      // redirects to home page instead of auth page on signup/in/ or logout.
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);
