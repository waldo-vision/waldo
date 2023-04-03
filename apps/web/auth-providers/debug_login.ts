import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

/*
 * This here is the Authenticator provider for OAuth emulation, to use Login functionality
 * without neerding to register your own app at github & others. It is still experimental though
 * so use at your onw risk.
 * And do not forget to set your NEXTAUTH_URL to the url the site is hosted at: for example local dev:
 * NEXTAUTH_URL="http://localhost:3000"
 */
export default function DebugLoginProvider<P>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: 'experimental_debug_login',
    name: 'Debug Login',
    type: 'oauth',
    version: '2.0',
    authorization: {
      url: process.env.NEXTAUTH_URL + '/api/auth/debug_oauth_emulator',
      params: {
        grant_type: 'authorization_code',
        scope: 'openid',
      },
    },
    token: {
      url: process.env.NEXTAUTH_URL + '/api/auth/debug_oauth_emulator',
    },
    userinfo: {
      url:
        process.env.NEXTAUTH_URL +
        '/api/auth/debug_oauth_emulator?userinfo=yes',
    },
    idToken: false,
    async profile() {
      //Edit here, if you want other profile details
      return {
        id: '1',
        name: 'DebugLoginUser',
        email: null,
        image: 'noimage',
      };
    },
    options,
  };
}
