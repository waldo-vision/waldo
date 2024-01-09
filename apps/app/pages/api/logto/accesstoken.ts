import { logtoClient } from '@server/logto/client';

export default logtoClient.handleUser({
  fetchUserInfo: true,
  getAccessToken: true,
  resource: 'https://api.foo.bar/api',
});
