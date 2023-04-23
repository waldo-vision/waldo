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

// const adapter = {
//   ...PrismaAdapter(prisma),
//   linkAccount: ({ sub, ...data }: any) => prisma.account.create({ data }),
// } as Adapter;

const authConfig = NextAuth({
  providers: [
    {
      id: 'hydra',
      name: 'Hydra',
      type: 'oauth',
      version: '2.0',
      idToken: true,
      checks: ['pkce', 'state'],
      authorization: {
        url: 'http://127.0.0.1:4444/oauth2/auth',
        params: {
          grant_type: 'authorization_code',
          scope: 'openid offline',
          redirect_uri: 'http://127.0.0.1:3001/api/auth/callback/hydra',
        },
      },
      wellKnown: 'http://127.0.0.1:4444/.well-known/openid-configuration',

      token: {
        url: `http://127.0.0.1:4444/oauth2/token`,
      },
      userinfo: {
        url: `http://127.0.0.1:4444/userinfo`,
      },
      clientId: '1fcc6dc4-8a37-4875-a2a5-a20612117bf3',
      clientSecret: 'uhIFZql2e7OJLkD_x8Ld737p4j',
      async profile(profile, tokens) {
        console.log(tokens);
        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;
        const expires = tokens.expires;

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          accessToken,
          refreshToken,
          expires,
        };
      },
    },
  ],
});
export default authConfig;
// async redirect(redirectCallback: RedirectCallback) {
//   // redirects to home page instead of auth page on signup/in/ or logout.
//   return redirectCallback.baseUrl;
// },
// async signIn(signInCallback: signInCallback) {
//   if (signInCallback.account?.provider === 'github') {
//     if (
//       signInCallback.account.providerAccountId == RicanGHId ||
//       signInCallback.account.providerAccountId == HomelessGHId
//     ) {
//       try {
//         const account = await prisma.account.findFirst({
//           where: {
//             providerAccountId: signInCallback.account.providerAccountId,
//           },
//           include: {
//             user: true,
//           },
//         });
//         console.log(account);
//         const userDocId = account?.user.id as string;
//         console.log(userDocId);
//         // update doc.
//         await prisma.user.update({
//           where: {
//             id: userDocId,
//           },
//           data: {
//             role: Roles.ADMIN,
//           },
//         });
//       } catch {
//         // return true here even if error because account does not exist...
//         // but still allow user otherwise they would never be able to sign in
//         return true;
//       }
//       return true;
//     }
//   }
//   return true;
// },
