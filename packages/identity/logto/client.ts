import LogtoClient from '@logto/next';

export const logtoClient = new LogtoClient({
  appId: 'fwj5sn1aqlar0y331aeti',
  appSecret: 'ELSMaxZsjSfjWshB2G8WeW79z5N8jCUg',
  endpoint: 'https://id.foo.bar', // E.g. http://localhost:3001
  baseUrl: 'https://app.foo.bar', // E.g. http://localhost:3000
  cookieSecret: 'complex_password_at_least_32_characters_long',
  cookieSecure: false,
  resources: ['https://api.foo.bar/api'],
  scopes: ['email', 'identities', 'read:all'],
});
