/* eslint-disable turbo/no-undeclared-env-vars */
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // custom callback
    async session({ session, token }) {
      // add user id & profile to session object,
      session.user.id = token.sub;
      session.user.avatarUrl = token.picture;
      return session;
    },
  },
};

export default NextAuth(authOptions);
