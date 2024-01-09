import { logtoClient } from '@server/logto/client';

// this api route is only used to recieve a user's access token for the following
// api resources.
export default logtoClient.handleUser({
  fetchUserInfo: true,
  getAccessToken: true,
  resource: process.env.NEXT_PUBLIC_RESOURCE_AUDIENCE,
});
