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
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async session({ session, user, token }) {
      // add user id & profile to session object
      session.user.avatarUrl = user.image;
      return session;
    },
    async jwt({ sessiontoken, account, user }) {
        console.log(account)
      
      if (account?.access_token) {
        console.log("ok")
        token.token = account.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);