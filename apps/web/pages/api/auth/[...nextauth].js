/* eslint-disable turbo/no-undeclared-env-vars */
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify email guilds' } },
    }),
  ],
  callbacks: {
    // custom callback
    async session({ session, token }) {
      // add user id & profile to session object
      if (session) {
        session.user.id = token.sub;
        session.user.access_token = token.token;
        session.user.avatarUrl = token.picture;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account?.access_token) {
        token.token = account.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
