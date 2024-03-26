import LogtoClient from '@logto/next/edge';
import * as Scope from '../rbac/scopes';

export const logtoClient = new LogtoClient({
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  endpoint: process.env.ENDPOINT, // E.g. http://localhost:3001
  baseUrl: process.env.BASE_URL, // E.g. http://localhost:3000
  cookieSecret: process.env.COOKIE_SECRET,
  cookieSecure: false,
  resources: [process.env.NEXT_PUBLIC_RESOURCE_AUDIENCE],
  scopes: [...Scope.MasterScopeArray, 'email', 'identities'],
});
