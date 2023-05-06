import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface OryHydraProfile extends Record<string, string> {
  id: string;
  name: string;
  email: string;
  image: string;
}

export default function OryHydraProvider<P extends OryHydraProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: 'hydra',
    name: 'Hydra',
    type: 'oauth',
    version: '2.0',
    idToken: true,
    checks: ['pkce', 'state'],
    authorization: {
      url: `${process.env.HYDRA_SERVER_ADDRESS}/oauth2/auth`,
      params: {
        grant_type: 'authorization_code',
        scope: 'openid offline',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/hydra`,
      },
    },
    wellKnown: `${process.env.HYDRA_SERVER_ADDRESS}/.well-known/openid-configuration`,
    token: {
      url: `${process.env.HYDRA_SERVER_ADDRESS}/oauth2/token`,
    },
    userinfo: {
      url: `${process.env.HYDRA_SERVER_ADDRESS}/userinfo`,
    },
    async profile(profile): Promise<OryHydraProfile> {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.image,
      };
    },
    options,
  };
}
