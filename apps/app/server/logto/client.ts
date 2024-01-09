import LogtoClient from '@logto/next';

export const logtoClient = new LogtoClient({
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  endpoint: process.env.NEXT_PUBLIC_ENDPOINT, // E.g. http://localhost:3001
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL, // E.g. http://localhost:3000
  cookieSecret: process.env.COOKIE_SECRET,
  cookieSecure: process.env.NODE_ENV === 'production',
  resources: ['https://api.foo.bar/api'],
  scopes: ['email', 'identities', 'read:all'],
});
