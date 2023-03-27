import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'

export interface BattleNetProfile extends Record<string, any> {
    sub: string
    battle_tag: string
}

export default function BattleNetProvider<P extends BattleNetProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "battlenet",
    name: "Battle.NET",
    type: "oauth",
    version: "2.0",
    authorization: {
      url: "https://oauth.battle.net/authorize",
      params: { 
        grant_type: "authorization_code",
        scope: "openid"
      },
    },
    token : {
      url: "https://oauth.battle.net/token"
    },
    userinfo: {
      url: "https://oauth.battle.net/userinfo ",
    },
    issuer: "https://oauth.battle.net",
    wellKnown: "https://oauth.battle.net/.well-known/openid-configuration",
    idToken: true,
    async profile(profile) {
      const image = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/battle_net.png` : "https://waldo.vision/battle_net.png"
      return {
        id: profile.sub,
        name: profile.battle_tag,
        email: null,
        image
      }
    },
    options
  }
}