/* eslint-disable turbo/no-undeclared-env-vars */
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { prisma } from '@utils/client';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // custom callback
    async session({ session, token }) {
      // add user id to session object,
      session.user.id = token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);
