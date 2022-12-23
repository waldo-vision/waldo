import { type DefaultSession } from 'next-auth';
enum Roles {
  USER = 0,
  MOD = 1,
  ADMIN = 2,
}
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      provider: string;
      role: Roles;
      blacklisted: boolean;
    } & DefaultSession['user'];
  }
}
