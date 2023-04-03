import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface DebugLoginProfile extends Record<string, any> {
  sub: string;
  battle_tag: string;
}

export default function DebugLoginProvider<P extends DebugLoginProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: 'debuglogin',
    name: 'Debug Login',
    type: 'oauth',
    version: '2.0',
    authorization: {
      url: 'http://localhost:3000/api/debug_oauth_emulator',
      params: {
        grant_type: 'authorization_code',
        scope: 'openid',
      },
    },
    token: {
      url: 'http://localhost:3000/api/debug_oauth_emulator',
    },
    userinfo: {
      url: 'http://localhost:3000/api/debug_oauth_emulator?userinfo=yes',
    },
    idToken: false,
    async profile() {
      return {
        id: '2',
        name: 'TestUser',
        email: null,
        image:
          'https://waldo.vision/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fandroid-chrome-256x256.47d544ec.png&w=256&h=256&q=100',
      };
    },
    options,
  };
}
