import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        }),
      ],
      callbacks: {
        // custom callback
        async session({ session, token, user }) { 
            // add user id to session object,
            session.user.id = token.sub;
            return session
        },
      },
}

export default NextAuth(authOptions);