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
    async session({ session, user, account }) {
      // query for discordId
      if (session) {
      const email = session.user.email;

      const req = await prisma.user.findUnique({
        where: {
          email: email
        },
        include: {
          accounts: true
        }
      })
      const discordId = req.accounts[0].providerAccountId
      session.user.id = discordId
      session.user.avatarUrl = user.image;  
    }
      return session;
    },
  },
};

export default NextAuth(authOptions);