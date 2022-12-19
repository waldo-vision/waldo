import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  enum Roles {
    USER,
    MOD,
    ADMIN,
  }
  interface Session {
    user?: {
      id: string;
      avatarUrl: string;
      provider: string;
      role: Roles;
      blacklisted: boolean;
    } & DefaultSession['user']?;
  }
}
