import LogtoClient from '@logto/next';

export const logtoClient = new LogtoClient({
  appId: 'ix0dpddnn8t5o641ibe1j',
  appSecret: 'tQ7XDCxi4FWo97CZBek0K4AuvfKWxP3H',
  endpoint: 'https://id.foo.bar', // E.g. http://localhost:3001
  baseUrl: 'https://app.foo.bar', // E.g. http://localhost:3000
  cookieSecret: 'complex_password_at_least_32_characters_long',
  cookieSecure: process.env.NODE_ENV === 'production',
  scopes: ['email', 'identities'],
});
