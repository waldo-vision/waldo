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
<<<<<<< HEAD
      // add user id to session object,
      session.user.id = token.sub;
=======
      // add user id & profile to session object,
      session.user.id = token.sub;
      session.user.avatarUrl = token.picture;
>>>>>>> edad9c5e3e342737ee3b0bcb0d18dbf323729f7b
      return session;
    },
  },
};

export default NextAuth(authOptions);
